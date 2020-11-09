import React from 'react';
import * as data from '../data/restaurants.json';

import Map from './Map.jsx';
import Sidebar from './Sidebar.jsx';

import '../styles/App.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: null,
            filteredLocations: null,
            ratingsAverage: {},
            minRatingAverage: 0,
            maxRatingAverage: 5,
            selectedLocation: null,
            hoveredLocation: null
        };
    }

    initLocations() {
        // Fetch data
        const locations = data.features;

        this.setState({
            locations: locations,
            filteredLocations: locations,
            ratingsAverage: this.getRatingsAverage(locations)
        });
    }

    getRatingsAverage(locations) {
        const locationsRatingsAverage = {};

        locations.forEach((location) => {
            const locationId = location.properties.storeid;
            let ratingsTotal = 0;

            location.properties.ratings.forEach((rating) => {
                ratingsTotal += rating.stars;
            })

            locationsRatingsAverage[locationId] = ratingsTotal / 2;
        })

        return locationsRatingsAverage;
    }

    handleChangeFilterInputs(newMinRating, newMaxRating) {
        const ratingsAverage = this.state.ratingsAverage;
        const filteredIds = [];
        const locations = this.state.locations;
        const filteredLocations = [];

        for (const storeId in ratingsAverage) {
            if (ratingsAverage[storeId] >= newMinRating && ratingsAverage[storeId] <= newMaxRating) {
                filteredIds.push(parseInt(storeId));
            }
        }

        filteredIds.forEach((storeId) => {
            locations.forEach((location) => {
                if (parseInt(location.properties.storeid) === storeId) {
                    filteredLocations.push(location);
                }
            });
        });

        this.setState({
            filteredLocations: filteredLocations,
            minRatingAverage: newMinRating,
            maxRatingAverage: newMaxRating,
        });
    }
    
    handleMarkerClick(location) {
        this.setState({ selectedLocation: location });
    }

    handleLocationCardClick(location) {
        this.setState({
            selectedLocation: location,
            hoveredLocation: null
        });
    }

    handleLocationCardHover(location) {
        this.setState({ hoveredLocation: location });
    }

    componentDidMount() {
        this.initLocations();
    }

    render() {
        return (
            <div className="container">
                <Sidebar
                    locations={this.state.filteredLocations}
                    ratingsAverage={this.state.ratingsAverage}
                    minRatingAverage={this.state.minRatingAverage}
                    maxRatingAverage={this.state.maxRatingAverage}
                    onChangeFilterInputs={(newMinValue, newMaxValue) => this.handleChangeFilterInputs(newMinValue, newMaxValue)}
                    selectedLocation={this.state.selectedLocation}
                    handleLocationCardClick={(location) => this.handleLocationCardClick(location)}
                    handleLocationCardHover={(location) => this.handleLocationCardHover(location)}
                />
                <div id="map">
                    <Map
                        locations={this.state.filteredLocations}
                        handleMarkerClick={(location) => this.handleMarkerClick(location)}
                        selectedLocation={this.state.selectedLocation}
                        hoveredLocation={this.state.hoveredLocation}
                    />
                </div>
            </div>
        );
    }
}