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
    handleLocationCardClick,
    handleLocationCardHover,
    minRatingAverage,
    maxRatingAverage,
    ratingsAverage
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

            <div className="location-cards">
                {displayedLocations ? displayedLocations.map((location) => (
                    <LocationCard
                        key={location.properties.store_id}
                        location={location}
                        ratingsAverage={ratingsAverage}
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
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    minRatingAverage: PropTypes.number.isRequired,
    maxRatingAverage: PropTypes.number.isRequired,
    ratingsAverage: PropTypes.object
}

export default Filter;
