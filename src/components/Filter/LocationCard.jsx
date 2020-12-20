import React from 'react';
import PropTypes from 'prop-types';

import './LocationCard.scss';

const LocationCard = ({ handleLocationCardClick, handleLocationCardHover, location, ratingsAverage }) => {
    const storeId = location.properties.storeid;
    const average = ratingsAverage[storeId];

    return (
        <div
            className="location-card"
            onClick={() => handleLocationCardClick(location)}
            onMouseOver={() => handleLocationCardHover(location)}
            onMouseLeave={() => handleLocationCardHover(null)}
        >
            <h2>{location.properties.name}</h2>
            <p>{`Moyenne : ${average}`}</p>
        </div>
    )
}

LocationCard.propTypes = {
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    location: PropTypes.object,
    ratingsAverage: PropTypes.object
}

export default LocationCard;
