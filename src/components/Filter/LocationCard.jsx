import React from 'react';
import PropTypes from 'prop-types';

import './LocationCard.scss';

const LocationCard = ({ handleLocationCardClick, handleLocationCardHover, location }) => {
    return (
        <div
            className="location-card"
            onClick={() => handleLocationCardClick(location)}
            onMouseEnter={() => handleLocationCardHover(location)}
            onMouseLeave={() => handleLocationCardHover(null)}
        >
            <h2>{location.properties.name}</h2>
            <p>Moyenne : {location.properties.ratings_average}</p>
        </div>
    )
}

LocationCard.propTypes = {
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    location: PropTypes.object
}

export default LocationCard;
