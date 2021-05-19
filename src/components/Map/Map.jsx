import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

import delay from '../../helpers/delay';
import getRadius from '../../helpers/getRadius';

import './Map.scss';
import mapStyles from '../../map-styles';

const { REACT_APP_GMAP_API_KEY } = process.env;
const LIBRARIES = ['places'];
const STYLES_ARRAY = mapStyles;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 47.180087,
        lng: 2.299790
      },
      zoom: 6,
      // User location
      userLocationMarker: false,
      userLocationMarkerCoords: {
        lat: null,
        lng: null
      },
      userLocationInfowindow: true,
      userLocationInfowindowError: null,
      // Autocomplete
      autocompleteLocationMarker: false,
      autocompleteLocationMarkerCoords: {
        lat: null,
        lng: null
      },
      autocompleteAddress: null
    };
    this.mapRef = React.createRef();
    this.autocompleteRef = React.createRef();
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleAutocompleteLoad = this.handleAutocompleteLoad.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleDragEndAndZoomChanged = this.handleDragEndAndZoomChanged.bind(this);
    this.handleClickMarkerUserPos = this.handleClickMarkerUserPos.bind(this);
    this.handleAutocompleteOnPlaceChanged = this.handleAutocompleteOnPlaceChanged.bind(this);
  }

  componentDidMount() {
    // Try HTML5 geolocation
    this.showCurrentLocation();
  }

  handleMapLoad(mapLibraryInstance) {
    this.mapRef.current = mapLibraryInstance;
  }

  handleAutocompleteLoad(autocompleteInstance) {
    this.autocompleteRef.current = autocompleteInstance;
  }

  handleDoubleClick(e) {
    const handleMapDoubleClick = this.props.handleMapDoubleClick;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    let reverseGeocodingData;

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&location_type=ROOFTOP&result_type=street_address&key=${REACT_APP_GMAP_API_KEY}`)
      .then((response) => {
        if (response.status >= 400) {
          console.log(`Error while fetching reverse geocoding data, status : ${response.status}.`);
        }
        response.json().then((jsonResponse) => {
          reverseGeocodingData = jsonResponse.results[0];
          handleMapDoubleClick(reverseGeocodingData);
        });
      });
  }

  async handleDragEndAndZoomChanged() {
    if (!this.mapRef.current) {
      return;
    }

    // Monitors map center and zoom to update state accordingly
    const mapCenter = this.mapRef.current.getCenter().toJSON();
    const mapZoom = this.mapRef.current.getZoom();

    // If present, makes infowindow user location error disappear
    if (this.state.userLocationInfowindowError) {
      this.setState({
        center: mapCenter,
        zoom: mapZoom,
        userLocationInfowindowError: null
      });
    } else {
      this.setState({
        center: mapCenter,
        zoom: mapZoom
      });
    }

    const locationsInMapBounds = this.getLocationsInMapBounds();
    this.props.handleLocationsInMapBounds(locationsInMapBounds);
  }

  handleClickMarkerUserPos() {
    if (this.state.userLocationInfowindow === true) {
      this.setState({ userLocationInfowindow: false });
    } else {
      this.setState({ userLocationInfowindow: true });
    }
  }

  async handleAutocompleteOnPlaceChanged() {
    if (this.autocompleteRef.current !== null) {
      const place = await this.autocompleteRef.current.getPlace();

      if (place.geometry !== undefined && place.formatted_address !== undefined) {
        const placeLocationLat = place.geometry.location.lat();
        const placeLocationLng = place.geometry.location.lng();

        this.setState({
          center: {
            lat: placeLocationLat,
            lng: placeLocationLng
          },
          zoom: 15,
          autocompleteLocationMarker: true,
          autocompleteLocationMarkerCoords: {
            lat: placeLocationLat,
            lng: placeLocationLng
          },
          autocompleteAddress: place.formatted_address
        });

        const centerRef = {
          lat: placeLocationLat,
          lng: placeLocationLng
        };
        this.getLocationsFromGooglePlacesAPI(centerRef).then((locations) => {
          this.props.handleGooglePlacesLocations(locations);
        });
      }
    } else {
      console.log('Autocomplete n\'est pas encore chargé');
    }
  }

  getLocationsInMapBounds() {
    const locationsInMapBounds = [];

    this.props.allLocations.forEach((location) => {
      const locationCoords = {
        lat: location.geometry.coordinates[1],
        lng: location.geometry.coordinates[0]
      };
      if (this.mapRef.current.getBounds().contains(locationCoords)) {
        locationsInMapBounds.push(location);
      }
    });

    return locationsInMapBounds;
  }

  /**
     * Returns an object with new fetched locations (Place Details requests) and already fetched locations (no Place Details request)
     * @param {Object} centerRef - latitude and longitude to be used for the circle's center of the Nearby Search
     * @returns {Object}
     */
  async getLocationsFromGooglePlacesAPI(centerRef) {
    /* global google */
    const currentMapZoom = this.state.zoom;
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
        const service = new google.maps.places.PlacesService(this.mapRef.current);
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else {
            reject('Error during Nearby Search request (Google Places API). Status : ' + status);
          }
        });
      });
    };

    // Place Details request
    // https://developers.google.com/maps/documentation/javascript/places#place_details
    const getPlacesDetails = async (nearbySearchResults) => {
      const getPlaceDetails = (placeDetailsRequest) => {
        return new Promise((resolve, reject) => {
          const service = new google.maps.places.PlacesService(this.mapRef.current);
          service.getDetails(placeDetailsRequest, (location, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(location);
            } else {
              reject('Error during Place Details request (Google Places API). Status : ' + status);
            }
          });
        });
      };

      const promises = [];

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
      return getNearbySearch(request).then((nearbySearchResults) => {
        // Limited number of requests per second with the Place Details API, slice response to 11 locations
        const slicedNearbySearchResults = nearbySearchResults.slice(0, 11);

        // Cache system to avoid requesting location details if they've been already fetched and stored into the application state
        const newFetchedLocationsBeforeDetails = [];
        const alreadyFetchedLocations = [];

        if (this.props.googlePlacesLocations !== null) {
          slicedNearbySearchResults.forEach((fetchedLocation) => {
            let isAlreadyCached = false;

            this.props.googlePlacesLocations.forEach((cachedLocation) => {
              if (fetchedLocation.place_id === cachedLocation.properties.place_id) {
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
        } else if (this.props.googlePlacesLocations === null) {
          newFetchedLocationsBeforeDetails.push(...slicedNearbySearchResults);
        }

        if (newFetchedLocationsBeforeDetails.length !== 0) {
          return getPlacesDetails(newFetchedLocationsBeforeDetails).then((newFetchedLocations) => {
            return { newFetchedLocations, alreadyFetchedLocations };
          }).catch(async (error) => {
            console.log(error);
            if (placeDetailsRequestAttempts <= 2) {
              placeDetailsRequestAttempts++;
              const slicedNewFetchedLocationsBeforeDetails = newFetchedLocationsBeforeDetails.slice(0, 2);
              await delay(1000);
              return getPlacesDetails(slicedNewFetchedLocationsBeforeDetails).then((newFetchedLocations) => {
                return { newFetchedLocations, alreadyFetchedLocations };
              }).catch((newError) => {
                console.log(newError);
              });
            }
          });
        }

        return { newFetchedLocations: newFetchedLocationsBeforeDetails, alreadyFetchedLocations };
      }).catch(async (error) => {
        console.log(error);
        if (nearbySearchRequestAttempts <= 3) {
          nearbySearchRequestAttempts++;
          await delay(1000);
          return getLocations(request);
        }
      });
    };

    return getLocations(nearbySearchRequestParams);
  }

  showCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState(() => ({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            zoom: 15,
            userLocationMarkerCoords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            userLocationMarker: true
          }));
        },
        // Browser supports geolocation, but user has denied permission
        () => {
          this.setState({ userLocationInfowindowError: 'permission denied' });
        }
      );
    } else {
      this.setState({ userLocationInfowindowError: 'browser doesn\'t support geolocation' });
    }
  }

  render() {
    return (
      <LoadScript
        googleMapsApiKey={REACT_APP_GMAP_API_KEY}
        libraries={LIBRARIES}
      >
        <GoogleMap
          center={{
            lat: this.state.center.lat,
            lng: this.state.center.lng
          }}
          mapContainerStyle={{
            width: '100%',
            height: '100%'
          }}
          onDblClick={this.handleDoubleClick}
          onDragEnd={this.handleDragEndAndZoomChanged}
          onLoad={this.handleMapLoad}
          onZoomChanged={this.handleDragEndAndZoomChanged}
          options={{
            disableDoubleClickZoom: true,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            styles: STYLES_ARRAY
          }}
          zoom={this.state.zoom}
        >
          <Autocomplete
            fields={['formatted_address', 'geometry']}
            onLoad={this.handleAutocompleteLoad}
            onPlaceChanged={this.handleAutocompleteOnPlaceChanged}
            restrictions={{ country: 'fr' }}
          >
            <input
              type="text"
              placeholder="Recherchez et sélectionnez une adresse ou un lieu"
            />
          </Autocomplete>

          {this.state.userLocationMarker && (
          <Marker
            icon="/src/assets/img/user-location.svg"
            position={{
              lat: this.state.userLocationMarkerCoords.lat,
              lng: this.state.userLocationMarkerCoords.lng
            }}
            onClick={this.handleClickMarkerUserPos}
          >
            {this.state.userLocationInfowindow && (
            <InfoWindow
              onCloseClick={this.handleClickMarkerUserPos}
            >
              <div>
                <p>Vous êtes ici</p>
              </div>
            </InfoWindow>
            )}
          </Marker>
          )}

          {this.state.userLocationInfowindowError && (
          <InfoWindow
            position={{
              lat: this.state.center.lat,
              lng: this.state.center.lng
            }}
          >
            <>
              {this.state.userLocationInfowindowError === 'permission denied' && (
              <p>
                Géolocalisation refusée.<br />
                Nous utilisons la localisation par défaut.
              </p>
              )}
              {this.state.userLocationInfowindowError === "browser doesn't support geolocation" && (
              <p>
                Votre navigateur ne semble pas supporter la géolocalisation.<br />
                Nous utilisons la localisation par défaut.
              </p>
              )}
            </>
          </InfoWindow>
          )}

          {this.state.autocompleteLocationMarker && (
          <Marker
            icon="/src/assets/img/autocomplete.svg"
            position={{
              lat: this.state.autocompleteLocationMarkerCoords.lat,
              lng: this.state.autocompleteLocationMarkerCoords.lng
            }}
          >
            <InfoWindow>
              <p>{this.state.autocompleteAddress}</p>
            </InfoWindow>
          </Marker>
          )}

          {this.props.displayedLocations && this.props.displayedLocations.map((location) => (
            <Marker
              icon={location.properties.is_google_places ? '/src/assets/img/restaurant-3.svg' : '/src/assets/img/restaurant-2.svg'}
              key={location.properties.store_id}
              position={{
                lat: location.geometry.coordinates[1],
                lng: location.geometry.coordinates[0]
              }}
              onClick={() => this.props.handleMapMarkerClick(location)}
              animation={this.props.hoveredLocation && this.props.hoveredLocation.properties.store_id === location.properties.store_id ? 1 : null}
            >
              {this.props.selectedLocation && this.props.selectedLocation.properties.store_id === location.properties.store_id && (
              <InfoWindow
                onCloseClick={() => this.props.handleMapMarkerClick(null)}
              >
                <div className="infowindow-displayed-locations">
                  <div className="title">{this.props.selectedLocation.properties.name}</div>
                  <p>{this.props.selectedLocation.properties.hours}</p>
                  {location.properties.address.street !== '' ? (
                    <p>{this.props.selectedLocation.properties.address.street_number} {this.props.selectedLocation.properties.address.street}, {this.props.selectedLocation.properties.address.postal_code} {this.props.selectedLocation.properties.address.city}</p>
                  ) : (
                    <p>Adresse non obtenue</p>
                  )}
                  <p>{this.props.selectedLocation.properties.phone}</p>
                </div>
              </InfoWindow>
              )}
            </Marker>
          ))}

          {this.props.geocodedLocation && (
          <Marker
            icon="/src/assets/img/restaurant-2.svg"
            position={{ lat: this.props.geocodedLocation.geometry.coordinates[1], lng: this.props.geocodedLocation.geometry.coordinates[0] }}
            onDblClick={() => this.props.handleMapDoubleClick(null)}
          >
            <InfoWindow
              onCloseClick={() => this.props.handleMapDoubleClick(null)}
            >
              <div className="infowindow-geocoding-location">
                <div className="title">Ajouter un restaurant ?</div>
                <p>
                  Adresse : {this.props.geocodedLocation.properties.address.street_number} {this.props.geocodedLocation.properties.address.street}, {this.props.geocodedLocation.properties.address.postal_code} {this.props.geocodedLocation.properties.address.city}<br />
                  Remplissez le formulaire !
                </p>
              </div>
            </InfoWindow>
          </Marker>
          )}
        </GoogleMap>
      </LoadScript>
    );
  }
}

Map.propTypes = {
  allLocations: PropTypes.array,
  displayedLocations: PropTypes.array,
  geocodedLocation: PropTypes.object,
  googlePlacesLocations: PropTypes.array,
  handleLocationsInMapBounds: PropTypes.func.isRequired,
  handleGooglePlacesLocations: PropTypes.func.isRequired,
  handleMapMarkerClick: PropTypes.func.isRequired,
  handleMapDoubleClick: PropTypes.func.isRequired,
  hoveredLocation: PropTypes.object,
  selectedLocation: PropTypes.object
};

export default Map;
