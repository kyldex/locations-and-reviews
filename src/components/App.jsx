import React from 'react';
import * as data from '../data/restaurants.json';

import Map from './Map/Map.jsx';
import Filter from './Filter/Filter.jsx';
import SingleLocation from './SingleLocation/SingleLocation.jsx';
import RatingForm from './RatingForm/RatingForm.jsx';
import LocationForm from './LocationForm/LocationForm.jsx';

import './App.css';

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
            currentMinRatingAverage: 0,
            currentMaxRatingAverage: 5,
            // On location card click or on map marker click
            selectedLocation: null,
            // Change sidebar display
            displayFilterInSidebar: true,
            displaySingleLocationInSidebar: false,
            displayRatingFormInSidebar: false,
            displayLocationFormInSidebar: false,
            // On location card hover
            hoveredLocation: null,
            // Data added by user
            addedRatings: null,
            addedLocations: null
        };
        this.handleReturnToLocationsList = this.handleReturnToLocationsList.bind(this);
        this.handleDisplayRatingForm = this.handleDisplayRatingForm.bind(this);
        this.handleCloseRatingForm = this.handleCloseRatingForm.bind(this)
    }

    // Init
    initLocations() {
        // Fetch data
        const allLocations = data.features;

        this.setState({
            allLocations: allLocations,
            displayedLocations: allLocations,
            ratingsAverage: this.getRatingsAverage(allLocations)
        });
    }

    // Init
    getRatingsAverage(allLocations) {
        const locationsRatingsAverage = {};

        allLocations.forEach((location) => {
            const locationId = location.properties.storeid;
            let ratingsTotal = 0;

            location.properties.ratings.forEach((rating) => {
                ratingsTotal += rating.stars;
            })

            locationsRatingsAverage[locationId] = ratingsTotal / 2;
        })

        return locationsRatingsAverage;
    }

    // Map
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

    // Map
    handleMapMarkerClick(location) {
        if (location === null) {
            if (this.state.displaySingleLocationInSidebar) {
                this.setState({
                    displayFilterInSidebar: true,
                    displaySingleLocationInSidebar: false,
                    selectedLocation: null
                });
            } else {
                this.setState({ selectedLocation: null });
            }

        } else if (this.state.selectedLocation === null) {
            if (this.state.displayFilterInSidebar) {
                this.setState({
                    displayFilterInSidebar: false,
                    displaySingleLocationInSidebar: true,
                    selectedLocation: location
                });
            } else {
                this.setState({ selectedLocation: location });
            }

        } else if (location.properties.storeid !== this.state.selectedLocation.properties.storeid) {
            this.setState({ selectedLocation: location });
        
        // Same marker has been clicked again
        } else {
            if (this.state.displaySingleLocationInSidebar) {
                this.setState({
                    displayFilterInSidebar: true,
                    displaySingleLocationInSidebar: false,
                    selectedLocation: null
                });
            } else {
                this.setState({ selectedLocation: null });
            }
        }
    }

    // Filter
    handleChangeFilterInputs(newMinRating, newMaxRating) {
        const { allLocations, locationsInMapBounds, ratingsAverage } = this.state;

        const filteredIds = [];
        const filteredLocations = [];
        const newDisplayedLocations = [];

        if (newMinRating === '' || newMaxRating === '') {
            this.setState({
                currentMinRatingAverage: newMinRating,
                currentMaxRatingAverage: newMaxRating,
            });

        } else {
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
                currentMinRatingAverage: newMinRating,
                currentMaxRatingAverage: newMaxRating,
            });
        }
    }

    // Filter
    handleLocationCardClick(location) {
        this.setState({
            displayFilterInSidebar: false,
            displaySingleLocationInSidebar: true,
            hoveredLocation: null,
            selectedLocation: location
        });
    }

    // Filter
    handleLocationCardHover(location) {
        this.setState({ hoveredLocation: location });
    }

    // SingleLocation : back to filter display
    handleReturnToLocationsList() {
        this.setState({
            displayFilterInSidebar: true,
            displaySingleLocationInSidebar: false,
            selectedLocation: null
        });
    }

    // SingleLocation
    handleDisplayRatingForm() {
        this.setState({
            displaySingleLocationInSidebar: false,
            displayRatingFormInSidebar: true
        })
    }

    // RatingForm
    handleSubmitNewRating(newRating) {
        if (this.state.addedRatings === null) {
            const lastLocationIndex = this.state.allLocations.length - 1;
            const lastRatingIndex = this.state.allLocations[lastLocationIndex].properties.ratings.length - 1;
            const lastRatingId = this.state.allLocations[lastLocationIndex].properties.ratings[lastRatingIndex].ratingId
            const newRatingId = parseInt(lastRatingId) + 1;
            newRating['ratingId'] = newRatingId.toString();
            const addedRatings = [newRating];

            this.setState({ addedRatings: addedRatings });

        } else {
            const addedRatings = this.state.addedRatings;
            const lastRatingIndex = addedRatings.length - 1;
            const lastRatingId = addedRatings[lastRatingIndex].ratingId;
            const newRatingId = parseInt(lastRatingId) + 1;
            newRating['ratingId'] = newRatingId.toString();
            const newAddedRatings = [...addedRatings, newRating]
    
            this.setState({ addedRatings: newAddedRatings });
        }
    }

    // RatingForm: after closing new rating thank you message
    handleCloseRatingForm() {
        this.setState({
            displaySingleLocationInSidebar: true,
            displayRatingFormInSidebar: false
        })
    }

    componentDidMount() {
        this.initLocations();
    }

    render() {
        return (
            <div className="container">
                <div id="sidebar">
                    {this.state.displayFilterInSidebar && (
                        <Filter
                            currentMinRatingAverage={this.state.currentMinRatingAverage}
                            currentMaxRatingAverage={this.state.currentMaxRatingAverage}
                            displayedLocations={this.state.displayedLocations}
                            handleChangeFilterInputs={(newMinValue, newMaxValue) => this.handleChangeFilterInputs(newMinValue, newMaxValue)}
                            handleLocationCardClick={(location) => this.handleLocationCardClick(location)}
                            handleLocationCardHover={(location) => this.handleLocationCardHover(location)}
                            minRatingAverage={this.state.minRatingAverage}
                            maxRatingAverage={this.state.maxRatingAverage}
                            ratingsAverage={this.state.ratingsAverage}
                        />
                    )}

                    {this.state.displaySingleLocationInSidebar && (
                        <SingleLocation
                            addedRatings={this.state.addedRatings}
                            handleButtonClick={this.handleDisplayRatingForm}
                            handleReturnToLocationsList={this.handleReturnToLocationsList}
                            maxRatingAverage={this.state.maxRatingAverage}
                            currentMinRatingAverage={this.state.currentMinRatingAverage}
                            currentMaxRatingAverage={this.state.currentMaxRatingAverage}
                            selectedLocation={this.state.selectedLocation}
                        />
                    )}

                    {this.state.displayRatingFormInSidebar && (
                        <RatingForm
                            handleSubmitNewRating={(newRating) => this.handleSubmitNewRating(newRating)}
                            handleCloseRatingForm={this.handleCloseRatingForm}
                            minRatingAverage={this.state.minRatingAverage}
                            maxRatingAverage={this.state.maxRatingAverage}
                            selectedLocation={this.state.selectedLocation}
                        />
                    )}

                    {this.state.displayLocationFormInSidebar && (
                        <LocationForm />
                    )}

                </div>

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