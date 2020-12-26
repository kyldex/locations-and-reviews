import React from 'react';
import * as data from '../data/restaurants.json';
import reverseGeocoding from '../helpers/reverseGeocoding';

import Map from './Map/Map.jsx';
import Filter from './Filter/Filter.jsx';
import SingleLocation from './SingleLocation/SingleLocation.jsx';
import RatingForm from './RatingForm/RatingForm.jsx';
import LocationForm from './LocationForm/LocationForm.jsx';

import './App.scss';

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
            lastRatingId: null,
            // On location card click or on map marker click
            selectedLocation: null,
            // Double click on map
            geocodingLocation : null,
            // Change sidebar display
            displayFilterInSidebar: true,
            displaySingleLocationInSidebar: false,
            displayRatingFormInSidebar: false,
            displayLocationFormInSidebar: false,
            // On location card hover
            hoveredLocation: null
        };
        this.handleReturnToLocationsList = this.handleReturnToLocationsList.bind(this);
        this.handleDisplayRatingForm = this.handleDisplayRatingForm.bind(this);
        this.handleCloseRatingForm = this.handleCloseRatingForm.bind(this);
        this.handleDisplayLocationForm = this.handleDisplayLocationForm.bind(this);
        this.handleCloseLocationForm = this.handleCloseLocationForm.bind(this);
    }

    // Init
    initLocations() {
        // Fetch data
        const allLocations = data.features;

        // Get last rating id
        const lastLocationIndex = allLocations.length - 1;
        const lastRatingIndex = allLocations[lastLocationIndex].properties.ratings.length - 1;
        const lastRatingId = parseInt(allLocations[lastLocationIndex].properties.ratings[lastRatingIndex].rating_id);

        this.setState({
            allLocations: allLocations,
            displayedLocations: allLocations,
            ratingsAverage: this.getRatingsAverage(allLocations),
            lastRatingId: lastRatingId
        });
    }

    // Init
    getRatingsAverage(allLocations) {
        const locationsRatingsAverage = {};

        allLocations.forEach((location) => {
            const locationId = location.properties.store_id;
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
                    if (location1.properties.store_id === location2.properties.store_id) {
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
        // Infowindow has been closed
        if (location === null) {
            if (this.state.displaySingleLocationInSidebar) {
                this.setState({
                    displayFilterInSidebar: true,
                    displaySingleLocationInSidebar: false,
                    selectedLocation: null
                });
            } else if (this.state.displayRatingFormInSidebar) {
                this.setState({
                    displayFilterInSidebar: true,
                    displayRatingFormInSidebar: false,
                    selectedLocation: null
                });
            } else {
                this.setState({ selectedLocation: null });
            }

        // Marker has been clicked
        } else if (this.state.selectedLocation === null) {
            if (this.state.displayFilterInSidebar) {
                this.setState({
                    displayFilterInSidebar: false,
                    displaySingleLocationInSidebar: true,
                    selectedLocation: location
                });
            } else if (this.state.displayLocationFormInSidebar) {
                this.setState({
                    displayLocationFormInSidebar: false,
                    displaySingleLocationInSidebar: true,
                    geocodingLocation : null,
                    selectedLocation: location
                });
            } else {
                this.setState({ selectedLocation: location });
            }

        // A marker was selected before selecting a new one
        } else if (location.properties.store_id !== this.state.selectedLocation.properties.store_id) {
            this.setState({ selectedLocation: location });
        
        // Same marker has been clicked again
        } else {
            if (this.state.displaySingleLocationInSidebar) {
                this.setState({
                    displayFilterInSidebar: true,
                    displaySingleLocationInSidebar: false,
                    selectedLocation: null
                });
            } else if (this.state.displayRatingFormInSidebar) {
                this.setState({
                    displayFilterInSidebar: true,
                    displayRatingFormInSidebar: false,
                    selectedLocation: null
                });
            } else {
                this.setState({ selectedLocation: null });
            }
        }
    }

    // Map
    handleMapDoubleClick(reverseGeocodingData) {
        const newLocation = reverseGeocoding(reverseGeocodingData);

        // New location marker has been double-clicked or infowindow has been closed
        if (reverseGeocodingData === null) {
            this.handleDisplayLocationForm(null);

        } else {
            const geocodingLocationStreet = reverseGeocodingData.address_components[0].long_name + ' ' + reverseGeocodingData.address_components[1].long_name;
            const geocodingLocationCity = reverseGeocodingData.address_components[6].long_name + ' ' + reverseGeocodingData.address_components[2].long_name;
            const geocodingLocationCoords = reverseGeocodingData.geometry.location;
            const geocodingLocation = {
                street: geocodingLocationStreet,
                city: geocodingLocationCity,
                coords: geocodingLocationCoords
            };

            this.handleDisplayLocationForm(geocodingLocation);
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
                        if (parseInt(location.properties.store_id) === storeId) {
                            filteredLocations.push(location);
                        }
                    });
                });
            }

            if (locationsInMapBounds !== null) {
                filteredLocations.forEach((location1) => {
                    locationsInMapBounds.forEach((location2) => {
                        if (location1.properties.store_id === location2.properties.store_id) {
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
        const newRatingId = this.state.lastRatingId + 1;
        newRating.rating_id = newRatingId.toString();

        let correspondingLocationIndex;
        this.state.allLocations.forEach((location, index) => {
            if (location.properties.store_id === newRating.store_id) {
                correspondingLocationIndex = index;
            }
        });

        const allLocations = [...this.state.allLocations];
        allLocations[correspondingLocationIndex].properties.ratings.push(
            {
                rating_id: newRating.rating_id,
                stars: newRating.rating_stars,
                comment: newRating.rating_comment
            }
        );

        this.setState({
            allLocations: allLocations,
            lastRatingId: parseInt(newRatingId)
        });
    }

    // RatingForm: after closing new rating thank you message
    handleCloseRatingForm() {
        this.setState({
            displaySingleLocationInSidebar: true,
            displayRatingFormInSidebar: false
        });
    }

    // LocationForm
    handleSubmitNewLocation(newLocation) {
        // console.log(newLocation);
    }

    // LocationForm
    handleDisplayLocationForm(geocodingLocation) {
        if (geocodingLocation === null) {
            this.setState({
                geocodingLocation: null,
                displayFilterInSidebar: true,
                displayLocationFormInSidebar: false,
            });

        } else {
            this.setState({
                geocodingLocation: geocodingLocation,
                displayFilterInSidebar: false,
                displaySingleLocationInSidebar: false,
                displayRatingFormInSidebar: false,
                displayLocationFormInSidebar: true,
            });
        }
    }

    // LocationForm: after closing new location thank you message
    handleCloseLocationForm() {
        this.setState({
            displaySingleLocationInSidebar: true,
            displayLocationFormInSidebar: false
        });
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
                        <LocationForm
                            geocodingLocation={this.state.geocodingLocation}
                            handleSubmitNewLocation={(newLocation) => this.handleSubmitNewLocation(newLocation)}
                            handleCloseLocationForm={this.handleCloseLocationForm}
                        />
                    )}
                </div>

                <div id="map">
                    <Map
                        allLocations={this.state.allLocations}
                        displayedLocations={this.state.displayedLocations}
                        geocodingLocation={this.state.geocodingLocation}
                        handleLocationsInMapBounds={(locations) => this.handleLocationsInMapBounds(locations)}
                        handleMapMarkerClick={(location) => this.handleMapMarkerClick(location)}
                        handleMapDoubleClick ={(reverseGeocodingData) => this.handleMapDoubleClick(reverseGeocodingData)}
                        hoveredLocation={this.state.hoveredLocation}
                        selectedLocation={this.state.selectedLocation}
                    />
                </div>
            </div>
        );
    }
}