import React from 'react';
import PropTypes from 'prop-types';

import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

import '../styles/Map.css';

const { REACT_APP_GMAP_API_KEY } = process.env;
const libraries = ['places'];

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: this.props.locations,
            center: {
                lat: this.props.currentLocation.lat,
                lng: this.props.currentLocation.lng
            },
            infoWindowUserPos: true
        }
        this.handleClickMarkerUserPos = this.handleClickMarkerUserPos.bind(this);
    }

    handleClickMarkerUserPos() {
        if (this.state.infoWindowUserPos === true) {
            this.setState({ infoWindowUserPos: false })
        } else {
            this.setState({ infoWindowUserPos: true }) 
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            locations: nextProps.locations,
            center: {
                lat: nextProps.currentLocation.lat,
                lng: nextProps.currentLocation.lng
            }
        };
    }

    render() {
        return (
            <LoadScript
                googleMapsApiKey={REACT_APP_GMAP_API_KEY}
                libraries={libraries}
            >
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "100%"
                    }}
                    center={{
                        lat: this.state.center.lat,
                        lng: this.state.center.lng
                    }}
                    zoom={12}
                >
                    {this.props.isMarkerShown && (
                        <Marker
                            position={{ lat: this.state.center.lat, lng: this.state.center.lng }}
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
                    
                    {this.state.locations ? this.state.locations.map((location) => (
                        <Marker
                            key={location.properties.storeid}
                            position={{
                                lat: location.geometry.coordinates[1],
                                lng: location.geometry.coordinates[0]
                            }}
                            onClick={() => this.props.onClick(location)}
                        >
                            {this.props.selectedLocation && this.props.selectedLocation.properties.storeid === location.properties.storeid && (
                                <InfoWindow
                                    onCloseClick={() => this.props.onClick(null)}
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
    currentLocation: PropTypes.object.isRequired,
    isMarkerShown: PropTypes.bool.isRequired,
    locations: PropTypes.array,
    onClick: PropTypes.func.isRequired,
    selectedLocation: PropTypes.object
}

export default Map;
