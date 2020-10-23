import React from 'react';
import Map from './Map.jsx';
import Sidebar from './Sidebar.jsx';
import * as data from '../data/restaurants.json';
const { REACT_APP_GMAP_API_KEY } = process.env;

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locations: data.features,
            // create filteredLocations
            userCurrentLocation: {
                lat: 48.8534,
                lng: 2.3488
            },
            isMarkerShown: false,
            selectedLocation: null,
            ratingsAverage: {}
        };
    }

    getRatingsAverage() {
        const locationRatingsAverage = {};

        this.state.locations.forEach((location) => {

            const locationId = location.properties.storeid;
            let ratingsTotal = 0;

            location.properties.ratings.forEach((rating) => {
                ratingsTotal += rating.stars;
            })

            locationRatingsAverage[locationId] = ratingsTotal / 2;
        })

        this.setState({ ratingsAverage: locationRatingsAverage })
    }

    // Create filter method

    // Try HTML5 geolocation
    showCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.setState(() => ({
                        userCurrentLocation: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        isMarkerShown: true
                    }));
                }
            );
        } else {
          (error) => console.log(error);
        }
    }
    
    handleMarkerClick(location) {
        this.setState({ selectedLocation: location });
    }

    // Deprecated ?
    componentWillMount() {
        this.getRatingsAverage();
    }

    componentDidMount() {
        this.showCurrentLocation();
    }

    render() {

        return (
            <div className="container">
                <Sidebar 
                    locations={this.state.locations}
                    selectedLocation={this.state.selectedLocation}
                    ratingsAverage={this.state.ratingsAverage}
                />
                <div id="map">
                    <Map
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${REACT_APP_GMAP_API_KEY}`}
                        loadingElement={<div style={{ height: "100%" }} />}
                        containerElement={<div style={{ height: "100%" }} />}
                        mapElement={<div style={{ height: "100%" }} />}
                        locations={this.state.locations}
                        currentLocation={this.state.userCurrentLocation}
                        isMarkerShown={this.state.isMarkerShown}
                        selectedLocation={this.state.selectedLocation}
                        onClick={(location) => this.handleMarkerClick(location)}
                    />
                </div>
            </div>
        );
    }
}