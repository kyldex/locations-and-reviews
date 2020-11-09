import React from 'react';
import PropTypes from 'prop-types';

import '../styles/LocationCard.css';

const LocationCard = ({ location, ratingsAverage }) => {
    const storeId = location.properties.storeid;
    const average = ratingsAverage[storeId];

    return (
        <div className="location-card">
            <h2>{location.properties.name}</h2>
            <p>{`Moyenne : ${average}`}</p>
        </div>
    )
}

LocationCard.propTypes = {
    location: PropTypes.object,
    ratingsAverage: PropTypes.object
}

export default LocationCard;
