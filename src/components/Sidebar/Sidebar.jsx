import React from 'react';
import PropTypes from 'prop-types';

import LocationCard from './LocationCard.jsx';
import LocationSingle from './LocationSingle/LocationSingle.jsx';
import Filter from './Filter.jsx';

import './Sidebar.css';

const Sidebar = (
    {
        displayedLocations,
        handleLocationCardClick,
        handleLocationCardHover,
        handleReturnToLocationsList,
        minRatingAverage,
        maxRatingAverage,
        currentMinRatingAverage,
        currentMaxRatingAverage,
        handleChangeFilterInputs,
        ratingsAverage,
        selectedLocation
    }
    ) => (
    <div id="sidebar">
        {selectedLocation ? (
            <LocationSingle
                minRatingAverage={minRatingAverage}
                maxRatingAverage={maxRatingAverage}
                currentMinRatingAverage={currentMinRatingAverage}
                currentMaxRatingAverage={currentMaxRatingAverage}
                handleReturnToLocationsList={handleReturnToLocationsList}
                selectedLocation={selectedLocation}
            />
        ) : (
            <>
                <Filter
                minRatingAverage={minRatingAverage}
                maxRatingAverage={maxRatingAverage}
                currentMinRatingAverage={currentMinRatingAverage}
                currentMaxRatingAverage={currentMaxRatingAverage}
                handleChangeFilterInputs={(newMinValue, newMaxValue) => handleChangeFilterInputs(newMinValue, newMaxValue)}
                />
                <div className="location-cards">
                    {displayedLocations ? displayedLocations.map((location) => (
                        <LocationCard
                            key={location.properties.storeid}
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
        )}
    </div>
);

Sidebar.propTypes = {
    displayedLocations: PropTypes.array,
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    handleReturnToLocationsList: PropTypes.func.isRequired,
    // String type when filter input is empty
    minRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    maxRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    currentMinRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    currentMaxRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    handleChangeFilterInputs: PropTypes.func.isRequired,
    ratingsAverage: PropTypes.object,
    selectedLocation: PropTypes.object
}

export default Sidebar;
