import React from 'react';
import * as data from '../data/restaurants.json';
const { REACT_APP_GMAP_API_KEY } = process.env;

import Map from './Map.jsx';
import Sidebar from './Sidebar.jsx';

import '../styles/App.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locations: null,
            filteredLocations: null,
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
        const locationsRatingsAverage = {};

        data.features.forEach((location) => {

            const locationId = location.properties.storeid;
            let ratingsTotal = 0;

            location.properties.ratings.forEach((rating) => {
                ratingsTotal += rating.stars;
            })

            locationsRatingsAverage[locationId] = ratingsTotal / 2;
        })

        this.setState({ ratingsAverage: locationsRatingsAverage })
    }

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

    handleFilterLocations(minRating, maxRating) {

        // Récupérer le rating minimum de moyenne et le rating maximum de moyenne
        // Récupérer les id dans le ratingsAverage objet des locations qui ont au moins le minRating et max le maxRating
        // Récupérer dans this.state.locations les location.properties.storeid correspondantes
        // Mettre à jour this.state.filteredLocations avec ces locations correspondantes
        // Re-render des composants
    }
    
    handleMarkerClick(location) {
        this.setState({ selectedLocation: location });
    }

    componentDidMount() {
        // Fetch data
        this.setState({
            locations: data.features,
            filteredLocations: data.features
        });
        this.getRatingsAverage();

        // Try HTML5 geolocation
        this.showCurrentLocation();
    }

    render() {
        return (
            <div className="container">
                <Sidebar
                    locations={this.state.filteredLocations}
                    ratingsAverage={this.state.ratingsAverage}
                    selectedLocation={this.state.selectedLocation}
                />
                <div id="map">
                    <Map
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${REACT_APP_GMAP_API_KEY}`}
                        loadingElement={<div style={{ height: "100%" }} />}
                        containerElement={<div style={{ height: "100%" }} />}
                        mapElement={<div style={{ height: "100%" }} />}
                        currentLocation={this.state.userCurrentLocation}
                        isMarkerShown={this.state.isMarkerShown}
                        locations={this.state.filteredLocations}
                        onClick={(location) => this.handleMarkerClick(location)}
                        selectedLocation={this.state.selectedLocation}
                    />
                </div>
            </div>
        );
    }
}