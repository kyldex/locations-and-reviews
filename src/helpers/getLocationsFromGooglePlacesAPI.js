import delay from './delay';
import getRadius from './getRadius';

/**
 * Returns an object with new fetched locations (Place Details requests) and already fetched locations (no Place Details request)
 * @param {Object} map - instance of google.maps.Map class
 * @param {Object} centerRef - latitude and longitude to be used for the circle's center of the Nearby Search, could be the center of the map or the coordinates of a place
 * @param {number} mapZoom - current map zoom
 * @param {Array} googlePlacesLocations - Google Places locations already stored in memory
 * @returns {Object}
 */
export default async (map, centerRef, mapZoom, googlePlacesLocations) => {
  /* global google */
  const currentMapZoom = mapZoom;
  const radius = getRadius(currentMapZoom);
  const nearbySearchRequestParams = {
    location: centerRef,
    radius,
    type: ['restaurant']
  };
  let nearbySearchRequestAttempts = 1;
  let placeDetailsRequestAttempts = 0;

  // Nearby Search request
  // https://developers.google.com/maps/documentation/javascript/places#place_search_requests
  const getNearbySearch = async (request) => {
    return new Promise((resolve, reject) => {
      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(
            new Error(
              `Nearby Search request (Google Places API) returned an error with status code : ${status}.`
            )
          );
        }
      });
    });
  };

  // Place Details request
  // https://developers.google.com/maps/documentation/javascript/places#place_details
  const getPlacesDetails = async (nearbySearchResults) => {
    const promises = [];
    const getPlaceDetails = (placeDetailsRequest) => {
      return new Promise((resolve, reject) => {
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(placeDetailsRequest, (location, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(location);
          } else {
            reject(
              new Error(
                `Place Details request (Google Places API) returned an error with status code : ${status}.`
              )
            );
          }
        });
      });
    };

    for (let i = 0; i < nearbySearchResults.length; i++) {
      const placeDetailsRequest = {
        placeId: nearbySearchResults[i].place_id,
        language: 'fr',
        fields: [
          'geometry',
          'name',
          'place_id',
          'address_component',
          'international_phone_number',
          'photos',
          'reviews',
          'rating'
        ]
      };

      await delay(100); // eslint-disable-line no-await-in-loop
      promises.push(getPlaceDetails(placeDetailsRequest));
    }

    return Promise.all(promises);
  };

  const getLocations = (request) => {
    return getNearbySearch(request)
      .then((nearbySearchResults) => {
        // Limited number of requests per second with the Place Details API, slice response to 11 locations
        const slicedNearbySearchResults = nearbySearchResults.slice(0, 11);
        // Cache system to avoid requesting location details if they've been already fetched and stored into the application state
        const newFetchedLocationsBeforeDetails = [];
        const alreadyFetchedLocations = [];

        if (googlePlacesLocations !== null) {
          slicedNearbySearchResults.forEach((fetchedLocation) => {
            let isAlreadyCached = false;

            googlePlacesLocations.forEach((cachedLocation) => {
              if (
                fetchedLocation.place_id === cachedLocation.properties.place_id
              ) {
                isAlreadyCached = true;
                return;
              }
            });

            if (!isAlreadyCached) {
              newFetchedLocationsBeforeDetails.push(fetchedLocation);
            } else if (isAlreadyCached) {
              alreadyFetchedLocations.push(fetchedLocation);
            }
          });
          // First call to the API
        } else if (googlePlacesLocations === null) {
          newFetchedLocationsBeforeDetails.push(...slicedNearbySearchResults);
        }

        if (newFetchedLocationsBeforeDetails.length !== 0) {
          return getPlacesDetails(newFetchedLocationsBeforeDetails)
            .then((newFetchedLocations) => {
              return { newFetchedLocations, alreadyFetchedLocations };
            })
            .catch(async (error) => {
              console.log(error);
              if (placeDetailsRequestAttempts <= 2) {
                placeDetailsRequestAttempts++;
                const slicedNewFetchedLocationsBeforeDetails = newFetchedLocationsBeforeDetails.slice(0, 2);
                await delay(1000);
                return getPlacesDetails(slicedNewFetchedLocationsBeforeDetails)
                  .then((newFetchedLocations) => {
                    return { newFetchedLocations, alreadyFetchedLocations };
                  })
                  .catch((newError) => {
                    console.log(newError);
                  });
              }
            });
        }

        return {
          newFetchedLocations: newFetchedLocationsBeforeDetails,
          alreadyFetchedLocations
        };

      })
      .catch(async (error) => {
        console.log(error);
        if (nearbySearchRequestAttempts <= 3) {
          nearbySearchRequestAttempts++;
          await delay(1000);
          return getLocations(request);
        }
      });
  };

  return getLocations(nearbySearchRequestParams);
};
