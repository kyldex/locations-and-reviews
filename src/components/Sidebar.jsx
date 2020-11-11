import React from 'react';
import PropTypes from 'prop-types';

import LocationCard from './LocationCard.jsx';
import LocationSingle from './LocationSingle.jsx';
import Filter from './Filter.jsx';

import '../styles/Sidebar.css';

const Sidebar = (
    {
        displayedLocations,
        handleLocationCardClick,
        handleLocationCardHover,
        handleReturnToLocationsList,
        minRatingAverage,
        maxRatingAverage,
        handleChangeFilterInputs,
        ratingsAverage,
        selectedLocation
    }
    ) => (
    <div id="sidebar">
        {selectedLocation ? (
            <LocationSingle
                selectedLocation={selectedLocation}
                handleReturnToLocationsList={handleReturnToLocationsList}
            />
        ) : (
            <div className="location-cards">
                <Filter
                    minRatingAverage={minRatingAverage}
                    maxRatingAverage={maxRatingAverage}
                    handleChangeFilterInputs={(newMinValue, newMaxValue) => handleChangeFilterInputs(newMinValue, newMaxValue)}
                />
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
      handleChangeFilterInputs: PropTypes.func.isRequired,
    ratingsAverage: PropTypes.object,
    selectedLocation: PropTypes.object
}

export default Sidebar;
