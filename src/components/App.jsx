import React from 'react';
import Map from './Map.jsx';
import Sidebar from './Sidebar.jsx';
import * as data from '../data/restaurants.json';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locations: data.features,
            // filteredLocations: restaurants du filre
            userCurrentLocation: {
                lat: 48.8534,
                lng: 2.3488
            },
            isMarkerShown: false,
            selectedLocation: null,
            ratingsAverage: {}
        };
        // console.log('app') : placer des console.log dans les composants permet de vérifier quand il y a re-render
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

    // fonction filtre 

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
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCYWPcJCr24V8YBv8Bhlf4UbV7uGQC7U_8`}
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