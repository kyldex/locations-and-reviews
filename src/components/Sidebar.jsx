import React from 'react';
import PropTypes from 'prop-types';

import LocationCard from './LocationCard.jsx';
import LocationSingle from './LocationSingle.jsx';
import Filter from './Filter.jsx';

import '../styles/Sidebar.css';

const Sidebar = ({handleLocationCardClick, handleLocationCardHover, locations, minRatingAverage, maxRatingAverage, onChangeFilterInputs, ratingsAverage, selectedLocation }) => (

    <div id="sidebar">
        {selectedLocation ? (
            <LocationSingle selectedLocation={selectedLocation}/>
        ) : (
            <div className="location-cards">
                <Filter
                    minRatingAverage={minRatingAverage}
                    maxRatingAverage={maxRatingAverage}
                    onChangeFilterInputs={(newMinValue, newMaxValue) => onChangeFilterInputs(newMinValue, newMaxValue)}
                />
                {locations ? locations.map((location) => (
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
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    locations: PropTypes.array,
    // String type when filter input is empty
    minRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
    maxRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
    onChangeFilterInputs: PropTypes.func.isRequired,
    ratingsAverage: PropTypes.object,
    selectedLocation: PropTypes.object
}

export default Sidebar;
