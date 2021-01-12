import React from 'react';
import PropTypes from 'prop-types';

import FilterControls from './FilterControls.jsx';
import LocationCard from './LocationCard.jsx';

import './Filter.scss';

const Filter = ({
    currentMinRatingAverage,
    currentMaxRatingAverage,
    displayedLocations,
    handleChangeFilterInputs,
    handleGooglePlacesRefresh,
    handleLocationCardClick,
    handleLocationCardHover,
    minRatingAverage,
    maxRatingAverage,
}) => {
    return (
        <>
            <FilterControls
                minRatingAverage={minRatingAverage}
                maxRatingAverage={maxRatingAverage}
                currentMinRatingAverage={currentMinRatingAverage}
                currentMaxRatingAverage={currentMaxRatingAverage}
                handleChangeFilterInputs={(newMinValue, newMaxValue) => handleChangeFilterInputs(newMinValue, newMaxValue)}
            />

            <div className="google-places">
                <div>Recharger Google Places :</div>
                <button
                    type="button"
                    className="google-places-button"
                    onClick={handleGooglePlacesRefresh}
                >
                    <img src="/src/assets/img/restaurant-4.svg" className="google-places-button-img" alt="Google Places button image"/>
                </button>
            </div>

            <div className="location-cards">
                {displayedLocations ? displayedLocations.map((location) => (
                    <LocationCard
                        key={location.properties.store_id}
                        location={location}
                        handleLocationCardClick={(location) => handleLocationCardClick(location)}
                        handleLocationCardHover={(location) => handleLocationCardHover(location)}
                    />
                )) : (
                    <div>Waiting for locations</div>
                )}
            </div>
        </>
    );
}

Filter.propTypes = {
    // String type when filter input is empty
    currentMinRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    currentMaxRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    displayedLocations: PropTypes.array,
    handleChangeFilterInputs: PropTypes.func.isRequired,
    handleGooglePlacesRefresh: PropTypes.func.isRequired,
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    minRatingAverage: PropTypes.number.isRequired,
    maxRatingAverage: PropTypes.number.isRequired
}

export default Filter;
