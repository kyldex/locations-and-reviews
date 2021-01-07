import React from 'react';
import PropTypes from 'prop-types';
import delay from '../../helpers/delay';

import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

import './Map.scss';
import { mapStyles } from '../../map-styles';

const { REACT_APP_GMAP_API_KEY } = process.env;
const LIBRARIES = ['places'];
const STYLES_ARRAY = mapStyles;

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: {
                lat: 48.8534,
                lng: 2.3488
            },
            userMarkerPos: {
                lat: null,
                lng: null
            },
            isUserMarkerShown: false,
            infoWindowUserPos: true
        }
        this.mapRef = React.createRef();
        this.handleLoad = this.handleLoad.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleDragEndAndZoomChanged = this.handleDragEndAndZoomChanged.bind(this);
        this.handleClickMarkerUserPos = this.handleClickMarkerUserPos.bind(this);
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
                        userMarkerPos: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude   
                        },
                        isUserMarkerShown: true
                    }));
                }
            );
        } else {
          (error) => console.log(error);
        }
    }

    handleLoad(map) {
        this.mapRef.current = map;

        // Wait until the map is fully initialized
        google.maps.event.addListenerOnce(this.mapRef.current, 'idle', () => {
            this.getLocationsFromGooglePlacesAPI().then((googlePlacesLocations) => {
                this.props.handleGooglePlacesLocations(googlePlacesLocations);
            });
        });
    }

    async getLocationsFromGooglePlacesAPI() {
        // Nearby Search request
        // https://developers.google.com/maps/documentation/javascript/places#place_search_requests
        const getNearbySearch = async (nearbySearchRequest) => {
            return new Promise((resolve, reject) => {
                const service = new google.maps.places.PlacesService(this.mapRef.current);
                service.nearbySearch(nearbySearchRequest, (results, status) => {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results);
                    } else {
                        reject('Error during Nearby Search request (Google Places API). Status : ' + status);
                    }
                });
            });
        }

        // Place Details request
        // https://developers.google.com/maps/documentation/javascript/places#place_details
        const getPlacesDetails = async (nearbySearchResults) => {
            const getPlaceDetails = (placeDetailsRequest) => {
                return new Promise((resolve, reject) => {
                    const service = new google.maps.places.PlacesService(this.mapRef.current);
                    service.getDetails(placeDetailsRequest, (location, status) => {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            resolve(location);
                        } else {
                            reject('Error during Place Details request (Google Places API). Status : ' + status);
                        }
                    });
                });
            }

            const promises = [];

            for (let i = 0; i < nearbySearchResults.length; i++) {
                const placeDetailsRequest = {
                    placeId: nearbySearchResults[i].place_id,
                    fields: [
                        'geometry',
                        'name',
                        'place_id',
                        'address_component',
                        'international_phone_number',
                        'reviews',
                        'rating'
                    ]
                };
                
                await delay(100);
                promises.push(getPlaceDetails(placeDetailsRequest));
            }

            return Promise.all(promises);
        }

        const bounds = this.mapRef.current.getBounds();
        const nearbySearchRequest = {
            bounds: bounds,
            type: ['restaurant']
        };

        return getNearbySearch(nearbySearchRequest).then((nearbySearchResults) => {
            // Limited number of requests per second with the Place Details API, slice response to 8 locations
            const slicedNearbySearchResults = nearbySearchResults.slice(0, 7);

            // Cache system to avoid requesting location details if they've been already fetched and stored into the application state
            const remainingLocations = [];

            if (this.props.googlePlacesLocations !== null) {
                slicedNearbySearchResults.forEach((fetchedLocation) => {
                    let isAlreadyCached = false;

                    this.props.googlePlacesLocations.forEach((cachedLocation) => {
                        if (fetchedLocation.place_id === cachedLocation.properties.place_id) {
                            isAlreadyCached = true;
                        }
                    })

                    if (!isAlreadyCached) {
                        remainingLocations.push(fetchedLocation);
                    }
                })
            // First call to the API
            } else if (this.props.googlePlacesLocations === null) {
                remainingLocations.push(...slicedNearbySearchResults);
            }

            if (remainingLocations.length !== 0) {
                return getPlacesDetails(remainingLocations).then((placeDetailsResults) => {
                    return placeDetailsResults;
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                return remainingLocations;
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    handleDoubleClick(e) {
        const thisMapComponent = this;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        let reverseGeocodingData;

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                const response = JSON.parse(this.responseText);
                reverseGeocodingData = response.results[0];
                thisMapComponent.props.handleMapDoubleClick(reverseGeocodingData);
            }
        };
        request.open('GET', `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&location_type=ROOFTOP&result_type=street_address&key=${REACT_APP_GMAP_API_KEY}`);
        request.send();
    }

    getMapCenter() {
       return this.mapRef.current.getCenter().toJSON();
    }

    getLocationsInMapBounds() {
        const locationsInMapBounds = [];
        
        this.props.databaseLocations.forEach((location) => {
            if (this.mapRef.current.getBounds().contains({lat: location.geometry.coordinates[1], lng: location.geometry.coordinates[0]})) {
                locationsInMapBounds.push(location);
            }
        });

        return locationsInMapBounds;
    }

    handleDragEndAndZoomChanged() {
        if (!this.mapRef.current) {
            return;
        }

        const newPos = this.getMapCenter();
        this.setState({
            center: newPos,
        });

        const locationsInMapBounds = this.getLocationsInMapBounds();
        this.props.handleLocationsInMapBounds(locationsInMapBounds);

        this.getLocationsFromGooglePlacesAPI().then((fetchedGooglePlacesLocations) => {
            this.props.handleGooglePlacesLocations(fetchedGooglePlacesLocations);
        });
    }

    handleClickMarkerUserPos() {
        if (this.state.infoWindowUserPos === true) {
            this.setState({ infoWindowUserPos: false })
        } else {
            this.setState({ infoWindowUserPos: true }) 
        }
    }

    componentDidMount() {
        // Try HTML5 geolocation
        this.showCurrentLocation();
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
                        width: "100%",
                        height: "100%"
                    }}
                    onDblClick={this.handleDoubleClick}
                    onDragEnd={this.handleDragEndAndZoomChanged}
                    onLoad={this.handleLoad}
                    onZoomChanged={this.handleDragEndAndZoomChanged}
                    options={{
                        disableDoubleClickZoom: true,
                        fullscreenControl: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        styles: STYLES_ARRAY
                    }}
                    ref={this.mapRef}
                    zoom={this.state.isUserMarkerShown ? 14 : 7}
                >
                    {this.state.isUserMarkerShown && (
                        <Marker
                            icon="/src/assets/img/user-location.svg"
                            position={{ lat: this.state.userMarkerPos.lat, lng: this.state.userMarkerPos.lng }}
                            onClick={this.handleClickMarkerUserPos}
                        >
                            {this.state.infoWindowUserPos && (
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
                    
                    {this.props.databaseLocations && this.props.databaseLocations.map((location) => (
                        <Marker
                            icon="/src/assets/img/restaurant-2.svg"
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
                                        <p>{this.props.selectedLocation.properties.address.street_number} {this.props.selectedLocation.properties.address.street}, {this.props.selectedLocation.properties.address.postal_code} {this.props.selectedLocation.properties.address.city}</p>
                                        <p>{this.props.selectedLocation.properties.phone}</p>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    ))}

                    {this.props.googlePlacesLocations && this.props.googlePlacesLocations.map((location) => (
                        <Marker
                            icon="/src/assets/img/restaurant-3.svg"
                            key={location.properties.place_id}
                            position={{
                                lat: location.geometry.coordinates[1],
                                lng: location.geometry.coordinates[0]
                            }}
                        >
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
    databaseLocations: PropTypes.array,
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
