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
            <h3>{location.properties.name}</h3>
            {location.properties.address.street !== '' ? (
                <p className="address">{location.properties.address.street_number} {location.properties.address.street}, {location.properties.address.postal_code} {location.properties.address.city}</p>
            ) : (
                <p className="address">Adresse non obtenue</p>
            )}
            <p className="average">Moyenne : {location.properties.ratings_average}</p>
        </div>
    )
}

LocationCard.propTypes = {
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    location: PropTypes.object
}

export default LocationCard;
