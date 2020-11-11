import React from 'react';
import * as data from '../data/restaurants.json';

import Map from './Map.jsx';
import Sidebar from './Sidebar.jsx';

import '../styles/App.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allLocations: null,
            displayedLocations: null,
            filteredLocationsByAverage: null,
            locationsInMapBounds: null,
            ratingsAverage: {},
            minRatingAverage: 0,
            maxRatingAverage: 5,
            // On location card click or on map marker click
            selectedLocation: null,
            // On location card hover
            hoveredLocation: null
        };
        this.handleReturnToLocationsList = this.handleReturnToLocationsList.bind(this);
    }

    initLocations() {
        // Fetch data
        const locations = data.features;

        this.setState({
            allLocations: locations,
            displayedLocations: locations,
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

    handleLocationsInMapBounds(locations) {
        const { filteredLocationsByAverage } = this.state;
        const newDisplayedLocations = [];

        if (filteredLocationsByAverage !== null) {
            locations.forEach((location1) => {
                filteredLocationsByAverage.forEach((location2) => {
                    if (location1.properties.storeid === location2.properties.storeid) {
                        newDisplayedLocations.push(location1);
                    }
                });
            });
        } else {
            newDisplayedLocations.push(...locations);
        }

        this.setState({
            displayedLocations: newDisplayedLocations,
            locationsInMapBounds: locations
        });

    }

    handleChangeFilterInputs(newMinRating, newMaxRating) {
        const { allLocations, displayedLocations, locationsInMapBounds, ratingsAverage } = this.state;

        const filteredIds = [];
        const filteredLocations = [];
        const newDisplayedLocations = [];

        for (const storeId in ratingsAverage) {
            if (ratingsAverage[storeId] >= newMinRating && ratingsAverage[storeId] <= newMaxRating) {
                filteredIds.push(parseInt(storeId));
            }
        }

        if (allLocations !== null) {
            filteredIds.forEach((storeId) => {
                allLocations.forEach((location) => {
                    if (parseInt(location.properties.storeid) === storeId) {
                        filteredLocations.push(location);
                    }
                });
            });
        }

        if (locationsInMapBounds !== null) {
            filteredLocations.forEach((location1) => {
                locationsInMapBounds.forEach((location2) => {
                    if (location1.properties.storeid === location2.properties.storeid) {
                        newDisplayedLocations.push(location1);
                    }
                });
            });
        } else {
            newDisplayedLocations.push(...filteredLocations);
        }

        this.setState({
            displayedLocations: newDisplayedLocations,
            filteredLocationsByAverage: filteredLocations,
            minRatingAverage: newMinRating,
            maxRatingAverage: newMaxRating,
        });

    }
    
    handleMapMarkerClick(location) {
        if (location === null) {
            this.setState({ selectedLocation: null });
        } else if (this.state.selectedLocation === null || location.properties.storeid !== this.state.selectedLocation.storeid) {
            this.setState({ selectedLocation: location });
        } else {
            this.setState({ selectedLocation: null });
        }
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

    handleReturnToLocationsList() {
        this.setState({ selectedLocation: null });
    }

    componentDidMount() {
        this.initLocations();
    }

    render() {
        return (
            <div className="container">
                <Sidebar
                    displayedLocations={this.state.displayedLocations}
                    ratingsAverage={this.state.ratingsAverage}
                    minRatingAverage={this.state.minRatingAverage}
                    maxRatingAverage={this.state.maxRatingAverage}
                    selectedLocation={this.state.selectedLocation}
                    handleChangeFilterInputs={(newMinValue, newMaxValue) => this.handleChangeFilterInputs(newMinValue, newMaxValue)}
                    handleLocationCardClick={(location) => this.handleLocationCardClick(location)}
                    handleLocationCardHover={(location) => this.handleLocationCardHover(location)}
                    handleReturnToLocationsList={this.handleReturnToLocationsList}
                />
                <div id="map">
                    <Map
                        allLocations={this.state.allLocations}
                        displayedLocations={this.state.displayedLocations}
                        handleLocationsInMapBounds={(locations) => this.handleLocationsInMapBounds(locations)}
                        handleMapMarkerClick={(location) => this.handleMapMarkerClick(location)}
                        selectedLocation={this.state.selectedLocation}
                        hoveredLocation={this.state.hoveredLocation}
                    />
                </div>
            </div>
        );
    }
}