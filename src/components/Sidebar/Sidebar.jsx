import React from 'react';
import PropTypes from 'prop-types';

import Filter from './Main/Filter.jsx';
import LocationCard from './Main/LocationCard.jsx';
import SingleLocation from './SingleLocation/SingleLocation.jsx';
import RatingForm from './RatingForm/RatingForm.jsx';
import ThankYou from './RatingForm/ThankYou.jsx';

import './Sidebar.css';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMain: true,
            displayLocationForm: false,
            displayRatingForm: false,
            displayThankYou: false
        };
        this.handleDisplayRatingForm = this.handleDisplayRatingForm.bind(this);
        this.handleDisplayThankYou = this.handleDisplayThankYou.bind(this);
        this.handleReturnToLocationsList = this.handleReturnToLocationsList.bind(this);
    }

    handleSubmitNewRating(newRating) {
        this.props.handleSubmitNewRating(newRating);
        this.handleDisplayRatingForm();
    }

    handleDisplayRatingForm() {
        if (this.state.displayRatingForm === false) {
            this.setState({
                displayMain: false,
                displayRatingForm: true
            })
        // After submitting new rating form
        } else if (this.state.displayRatingForm === true) {
            this.setState({
                displayRatingForm: false,
                displayThankYou: true
            })
        }
    }

    handleDisplayThankYou() {
        this.setState({ displayThankYou: false });
    }

    handleReturnToLocationsList() {
        this.setState({ displayMain: true })
        this.props.handleReturnToLocationsList();
    }

    render() {
        return (
            <div id="sidebar">
                {this.state.displayMain && !this.props.selectedLocation && (
                    <>
                        <Filter
                            minRatingAverage={this.props.minRatingAverage}
                            maxRatingAverage={this.props.maxRatingAverage}
                            currentMinRatingAverage={this.props.currentMinRatingAverage}
                            currentMaxRatingAverage={this.props.currentMaxRatingAverage}
                            handleChangeFilterInputs={(newMinValue, newMaxValue) => this.props.handleChangeFilterInputs(newMinValue, newMaxValue)}
                        />

                        <div className="location-cards">
                            {this.props.displayedLocations ? this.props.displayedLocations.map((location) => (
                                <LocationCard
                                    key={location.properties.storeid}
                                    location={location}
                                    ratingsAverage={this.props.ratingsAverage}
                                    handleLocationCardClick={(location) => this.props.handleLocationCardClick(location)}
                                    handleLocationCardHover={(location) => this.props.handleLocationCardHover(location)}
                                />
                            )) : (
                                <div>Waiting for locations</div>
                            )}
                        </div>
                    </>
                )}

                {this.props.selectedLocation && this.state.displayRatingForm === false && this.state.displayThankYou === false && (
                    <SingleLocation
                        addedRatings={this.props.addedRatings}
                        handleButtonClick={this.handleDisplayRatingForm}
                        handleReturnToLocationsList={this.handleReturnToLocationsList}
                        maxRatingAverage={this.props.maxRatingAverage}
                        currentMinRatingAverage={this.props.currentMinRatingAverage}
                        currentMaxRatingAverage={this.props.currentMaxRatingAverage}
                        selectedLocation={this.props.selectedLocation}
                    />
                )}

                {this.props.selectedLocation && this.state.displayRatingForm && this.state.displayThankYou === false && (
                    <RatingForm
                        handleSubmitNewRating={(newRating) => this.handleSubmitNewRating(newRating)}
                        minRatingAverage={this.props.minRatingAverage}
                        maxRatingAverage={this.props.maxRatingAverage}
                        selectedLocation={this.props.selectedLocation}
                    />
                )}

                {this.props.selectedLocation && this.state.displayThankYou && this.state.displayRatingForm === false && (
                    <ThankYou
                        handleButtonClick={this.handleDisplayThankYou}
                    />
                )}
            </div>
        );
    }
}

Sidebar.propTypes = {
    addedRatings: PropTypes.array,
    displayedLocations: PropTypes.array,
    handleChangeFilterInputs: PropTypes.func.isRequired,
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    handleReturnToLocationsList: PropTypes.func.isRequired,
    handleSubmitNewRating: PropTypes.func.isRequired,
    minRatingAverage: PropTypes.number.isRequired,
    maxRatingAverage: PropTypes.number.isRequired,
    // String type when filter input is empty
    currentMinRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    currentMaxRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    ratingsAverage: PropTypes.object,
    selectedLocation: PropTypes.object
}

export default Sidebar;
