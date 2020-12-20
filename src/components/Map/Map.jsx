import React from 'react';
import PropTypes from 'prop-types';

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

        this.props.allLocations.forEach((location) => {
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
        const locationsInMapBounds = this.getLocationsInMapBounds();

        this.setState({
            center: newPos
        });

        this.props.handleLocationsInMapBounds(locationsInMapBounds);
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
                    zoom={this.state.isUserMarkerShown ? 14 : 12}
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
                    
                    {this.props.displayedLocations && this.props.displayedLocations.map((location) => (
                        <Marker
                            icon="/src/assets/img/restaurant.svg"
                            key={location.properties.storeid}
                            position={{
                                lat: location.geometry.coordinates[1],
                                lng: location.geometry.coordinates[0]
                            }}
                            onClick={() => this.props.handleMapMarkerClick(location)}
                            animation={this.props.hoveredLocation && this.props.hoveredLocation.properties.storeid === location.properties.storeid ? 1 : null}
                        >
                            {this.props.selectedLocation && this.props.selectedLocation.properties.storeid === location.properties.storeid && (
                                <InfoWindow
                                    onCloseClick={() => this.props.handleMapMarkerClick(null)}
                                >
                                    <div className="infowindow-displayed-locations">
                                        <div className="title">{this.props.selectedLocation.properties.name}</div>
                                        <p>{this.props.selectedLocation.properties.hours}</p>
                                        <p>{this.props.selectedLocation.properties.address}</p>
                                        <p>{this.props.selectedLocation.properties.phone}</p>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    ))}

                    {this.props.geocodingLocation && (
                        <Marker
                            icon="/src/assets/img/restaurant.svg"
                            position={{ lat: this.props.geocodingLocation.coords.lat, lng: this.props.geocodingLocation.coords.lng }}
                            onDblClick={() => this.props.handleMapDoubleClick(null)}
                        >
                            <InfoWindow
                                onCloseClick={() => this.props.handleMapDoubleClick(null)}
                            >
                                <div className="infowindow-geocoding-location">
                                    <div className="title">Ajouter un restaurant ?</div>
                                    <p>
                                        Adresse : {this.props.geocodingLocation.street} {this.props.geocodingLocation.city}<br />
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
    geocodingLocation: PropTypes.object,
    handleLocationsInMapBounds: PropTypes.func.isRequired,
    handleMapMarkerClick: PropTypes.func.isRequired,
    handleMapDoubleClick: PropTypes.func.isRequired,
    hoveredLocation: PropTypes.object,
    selectedLocation: PropTypes.object
};

export default Map;
