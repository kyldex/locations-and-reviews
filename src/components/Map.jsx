import React from 'react';
import PropTypes from 'prop-types';

import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

import '../styles/Map.css';
import { mapStyles } from '../map-styles';

const { REACT_APP_GMAP_API_KEY } = process.env;
const libraries = ['places'];
const stylesArray = mapStyles;

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
        this.handleCenter = this.handleCenter.bind(this);
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

    handleCenter() {
        if (!this.mapRef.current) {
            return;
        }

        const newPos = this.mapRef.current.getCenter().toJSON();
        this.setState({ center: newPos});
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
        console.log('render map');
        return (
            <LoadScript
                googleMapsApiKey={REACT_APP_GMAP_API_KEY}
                libraries={libraries}
            >
                <GoogleMap
                    ref={this.mapRef}
                    onLoad={this.handleLoad}
                    onDragEnd={this.handleCenter}
                    mapContainerStyle={{
                        width: "100%",
                        height: "100%"
                    }}
                    center={{
                        lat: this.state.center.lat,
                        lng: this.state.center.lng
                    }}
                    options={{styles: stylesArray}}
                    zoom={12}
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
                    
                    {this.props.locations ? this.props.locations.map((location) => (
                        <Marker
                            icon="/src/assets/img/restaurant.svg"
                            key={location.properties.storeid}
                            position={{
                                lat: location.geometry.coordinates[1],
                                lng: location.geometry.coordinates[0]
                            }}
                            onClick={() => this.props.handleMarkerClick(location)}
                            animation={this.props.hoveredLocation && this.props.hoveredLocation.properties.storeid === location.properties.storeid ? 1 : null}
                        >
                            {this.props.selectedLocation && this.props.selectedLocation.properties.storeid === location.properties.storeid && (
                                <InfoWindow
                                    onCloseClick={() => this.props.handleMarkerClick(null)}
                                >
                                    <div>
                                        <div className="infowindow-title">{this.props.selectedLocation.properties.name}</div>
                                        <p>{this.props.selectedLocation.properties.hours}</p>
                                        <p>{this.props.selectedLocation.properties.address}</p>
                                        <p>{this.props.selectedLocation.properties.phone}</p>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    )) : (
                        <div>Waiting for map</div>
                    )}
                </GoogleMap>
            </LoadScript>
        );
    }
}

Map.propTypes = {
    locations: PropTypes.array,
    handleMarkerClick: PropTypes.func.isRequired,
    selectedLocation: PropTypes.object,
    hoveredLocation: PropTypes.object
}

export default Map;
