import React from 'react';
import * as data from '../data/restaurants.json';
import parseGeocodingData from '../helpers/parseGeocodingData';
import parseLocationRequest from '../helpers/parseLocationRequest';
import getRatingsAverage from '../helpers/getRatingsAverage';

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
            databaseLocations: null,
            googlePlacesLocations: null,
            displayedLocations: null,
            filteredLocationsByAverage: null,
            locationsInMapBounds: null,
            minRatingAverage: 0,
            maxRatingAverage: 5,
            currentMinRatingAverage: 0,
            currentMaxRatingAverage: 5,
            lastRatingId: null,
            googlePlacesButtonIsDisabled: false,
            // On location card click or on map marker click
            selectedLocation: null,
            // Double click on map
            geocodedLocation : null,
            // Change sidebar display
            displayFilterInSidebar: true,
            displaySingleLocationInSidebar: false,
            displayRatingFormInSidebar: false,
            displayLocationFormInSidebar: false,
            // On location card hover
            hoveredLocation: null
        };
        this.mapComponentRef = React.createRef();
        this.handleReturnToLocationsList = this.handleReturnToLocationsList.bind(this);
        this.handleDisplayRatingForm = this.handleDisplayRatingForm.bind(this);
        this.handleCloseRatingForm = this.handleCloseRatingForm.bind(this);
        this.handleDisplayLocationForm = this.handleDisplayLocationForm.bind(this);
        this.handleCloseLocationForm = this.handleCloseLocationForm.bind(this);
        this.handleGooglePlacesRefresh = this.handleGooglePlacesRefresh.bind(this);
    }

    // Init
    initLocations() {
        // Fetch data
        const databaseLocations = [...data.features];

        // Get last rating id
        const lastLocationIndex = databaseLocations.length - 1;
        const lastRatingIndex = databaseLocations[lastLocationIndex].properties.ratings.length - 1;
        const lastRatingId = parseInt(databaseLocations[lastLocationIndex].properties.ratings[lastRatingIndex].rating_id);

        this.setState({
            allLocations: databaseLocations,
            databaseLocations: databaseLocations,
            displayedLocations: databaseLocations,
            lastRatingId: lastRatingId
        });
    }

    // Map
    handleLocationsInMapBounds(locations) {
        const { filteredLocationsByAverage } = this.state;
        const displayedLocations = [];

        if (filteredLocationsByAverage !== null) {
            locations.forEach((location1) => {
                filteredLocationsByAverage.forEach((location2) => {
                    if (location1.properties.store_id === location2.properties.store_id) {
                        displayedLocations.push(location1);
                    }
                });
            });
        } else {
            displayedLocations.push(...locations);
        }

        this.setState({
            displayedLocations: displayedLocations,
            locationsInMapBounds: locations
        });
    }

    // Map
    handleGooglePlacesLocations(locations) {
        const parsedNewFetchedLocations = [];
        const parsedAlreadyFetchedLocations = [];

        // Successful API call (at least one new location has been fetched)
        if (locations.newFetchedLocations !== undefined && locations.newFetchedLocations.length !== 0) {

            locations.newFetchedLocations.forEach((location) => {
                parsedNewFetchedLocations.push(parseLocationRequest(location));
            });

            // Avoid unnecessary parsing operation if location is already cached
            if (locations.alreadyFetchedLocations !== undefined && locations.alreadyFetchedLocations.length !== 0) {
                locations.alreadyFetchedLocations.forEach((alreadyFetchedLocation) => {
                    this.state.googlePlacesLocations.forEach((googlePlacesLocation) => {
                        if (alreadyFetchedLocation.place_id === googlePlacesLocation.properties.place_id) {
                            parsedAlreadyFetchedLocations.push(googlePlacesLocation);
                            return;
                        }
                    });
                });
            }

            // All google places have been parsed
            const googlePlacesLocation = [...parsedAlreadyFetchedLocations, ...parsedNewFetchedLocations];
            const allLocations = [...this.state.databaseLocations, ...googlePlacesLocation];
            const mapComponentRef = this.mapComponentRef.current;
            const locationsInMapBounds = [];
            const filteredLocationsByAverage = [];
            const displayedLocations = [];
        
            // Get locations in map bounds
            allLocations.forEach((location) => {
                if (mapComponentRef.mapRef.current.getBounds().contains({lat: location.geometry.coordinates[1], lng: location.geometry.coordinates[0]})) {
                    locationsInMapBounds.push(location);
                }
            });

            // Handle locations in map bounds
            allLocations.forEach((location) => {
                const locationRatingAverage = location.properties.ratings_average;
                if (locationRatingAverage >= this.state.currentMinRatingAverage && locationRatingAverage <= this.state.currentMaxRatingAverage) {
                    filteredLocationsByAverage.push(location);
                }
            });

            // Check current filter inputs values
            if (filteredLocationsByAverage.length !== 0) {
                locationsInMapBounds.forEach((location1) => {
                    filteredLocationsByAverage.forEach((location2) => {
                        if (location1.properties.store_id === location2.properties.store_id) {
                            displayedLocations.push(location1);
                        }
                    });
                });
            } else {
                displayedLocations.push(...locationsInMapBounds);
            }

            this.setState({
                allLocations: allLocations,
                googlePlacesLocations: googlePlacesLocation,
                displayedLocations: displayedLocations,
                filteredLocationsByAverage: filteredLocationsByAverage,
                locationsInMapBounds: locationsInMapBounds
            });
        }
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
                    geocodedLocation : null,
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
        // New location marker has been double-clicked or infowindow has been closed
        if (reverseGeocodingData === null) {
            this.handleDisplayLocationForm(null);

        } else {
            const geocodedLocation = parseGeocodingData(reverseGeocodingData);
            this.handleDisplayLocationForm(geocodedLocation);
        }
    }

    // Filter
    handleChangeFilterInputs(newMinRating, newMaxRating) {
        const { allLocations, locationsInMapBounds } = this.state;
        const filteredLocationsByAverage = [];
        const displayedLocations = [];

        if (newMinRating === '' || newMaxRating === '') {
            this.setState({
                currentMinRatingAverage: newMinRating,
                currentMaxRatingAverage: newMaxRating
            });

        } else {
            if (allLocations !== null) {
                allLocations.forEach((location) => {
                    const locationRatingAverage = location.properties.ratings_average;
                    if (locationRatingAverage >= newMinRating && locationRatingAverage <= newMaxRating) {
                        filteredLocationsByAverage.push(location);
                    }
                });
            }

            if (locationsInMapBounds !== null) {
                filteredLocationsByAverage.forEach((location1) => {
                    locationsInMapBounds.forEach((location2) => {
                        if (location1.properties.store_id === location2.properties.store_id) {
                            displayedLocations.push(location1);
                            return;
                        }
                    });
                });
            } else {
                displayedLocations.push(...filteredLocationsByAverage);
            }

            this.setState({
                displayedLocations: displayedLocations,
                filteredLocationsByAverage: filteredLocationsByAverage,
                currentMinRatingAverage: newMinRating,
                currentMaxRatingAverage: newMaxRating,
            });
        }
    }

    // Filter
    handleGooglePlacesRefresh() {
        const mapComponentRef = this.mapComponentRef.current;
        const mapCenter = mapComponentRef.mapRef.current.getCenter().toJSON();
        this.setState({ googlePlacesButtonIsDisabled: true });

        mapComponentRef.getLocationsFromGooglePlacesAPI(mapCenter).then((locations) => {
            this.handleGooglePlacesLocations(locations);
            this.setState({ googlePlacesButtonIsDisabled: false });
        }).catch((error) => {
            console.log(error);
            this.setState({ googlePlacesButtonIsDisabled: false });
        });
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

    // SingleLocation - back to filter display
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

        const databaseLocations = [...this.state.databaseLocations];
        let correspondingLocationIndex;
        databaseLocations.forEach((location, index) => {
            if (location.properties.store_id === newRating.store_id) {
                correspondingLocationIndex = index;
            }
        });

        const correspondingLocation = databaseLocations[correspondingLocationIndex];
        correspondingLocation.properties.ratings.push(
            {
                rating_id: newRating.rating_id,
                stars: newRating.rating_stars,
                comment: newRating.rating_comment
            }
        );
        correspondingLocation.properties.ratings_average = getRatingsAverage(correspondingLocation);

        const allLocations = [...databaseLocations, ...this.state.googlePlacesLocations];

        this.setState({
            allLocations: allLocations,
            databaseLocations: databaseLocations,
            lastRatingId: parseInt(newRatingId)
        });
    }

    // RatingForm - after closing new rating thank you message
    handleCloseRatingForm() {
        this.setState({
            displaySingleLocationInSidebar: true,
            displayRatingFormInSidebar: false
        });
    }

    // LocationForm
    handleDisplayLocationForm(geocodedLocation) {
        if (geocodedLocation === null) {
            this.setState({
                geocodedLocation: null,
                displayFilterInSidebar: true,
                displayLocationFormInSidebar: false,
            });

        } else {
            this.setState({
                geocodedLocation: geocodedLocation,
                displayFilterInSidebar: false,
                displaySingleLocationInSidebar: false,
                displayRatingFormInSidebar: false,
                displayLocationFormInSidebar: true,
            });
        }
    }

    // LocationForm
    handleSubmitNewLocation(newLocation) {
        // Set new location id
        const lastLocationIndex = this.state.databaseLocations.length - 1;
        const lastLocationId = parseInt(this.state.databaseLocations[lastLocationIndex].properties.store_id);
        const newLocationId = lastLocationId + 1;
        newLocation.properties.store_id = newLocationId.toString();

        const allLocations = [...this.state.allLocations, newLocation];
        const databaseLocations = [...this.state.databaseLocations, newLocation];
        const displayedLocations = [...this.state.displayedLocations, newLocation];

        this.setState({
            allLocations: allLocations,
            databaseLocations: databaseLocations,
            displayedLocations: displayedLocations,
            geocodedLocation: null,
            selectedLocation: newLocation
        });
    }

    // LocationForm - after closing new location thank you message
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
                            googlePlacesButtonIsDisabled={this.state.googlePlacesButtonIsDisabled}
                            handleChangeFilterInputs={(newMinValue, newMaxValue) => this.handleChangeFilterInputs(newMinValue, newMaxValue)}
                            handleGooglePlacesRefresh={this.handleGooglePlacesRefresh}
                            handleLocationCardClick={(location) => this.handleLocationCardClick(location)}
                            handleLocationCardHover={(location) => this.handleLocationCardHover(location)}
                            minRatingAverage={this.state.minRatingAverage}
                            maxRatingAverage={this.state.maxRatingAverage}
                        />
                    )}

                    {this.state.displaySingleLocationInSidebar && (
                        <SingleLocation
                            handleAddRatingButtonClick={this.handleDisplayRatingForm}
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
                            geocodedLocation={this.state.geocodedLocation}
                            handleSubmitNewLocation={(newLocation) => this.handleSubmitNewLocation(newLocation)}
                            handleCloseLocationForm={this.handleCloseLocationForm}
                        />
                    )}
                </div>

                <div id="map">
                    <Map
                        allLocations={this.state.allLocations}
                        displayedLocations={this.state.displayedLocations}
                        geocodedLocation={this.state.geocodedLocation}
                        googlePlacesLocations={this.state.googlePlacesLocations}
                        handleLocationsInMapBounds={(locations) => this.handleLocationsInMapBounds(locations)}
                        handleGooglePlacesLocations={(googlePlacesLocations) => this.handleGooglePlacesLocations(googlePlacesLocations)}
                        handleMapMarkerClick={(location) => this.handleMapMarkerClick(location)}
                        handleMapDoubleClick ={(reverseGeocodingData) => this.handleMapDoubleClick(reverseGeocodingData)}
                        hoveredLocation={this.state.hoveredLocation}
                        ref={this.mapComponentRef}
                        selectedLocation={this.state.selectedLocation}
                    />
                </div>
            </div>
        );
    }
}