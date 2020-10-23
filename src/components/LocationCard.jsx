import React from 'react';
import '../styles/LocationCard.css'

const LocationCard = (props) => {

    const storeId = props.location.properties.storeid;
    const average = props.ratingsAverage[storeId];

    return (
        <div className="location-card">
            <h2>{props.location.properties.name}</h2>
            <p>{`Moyenne : ${average}`}</p>
        </div>
    )
}

export default LocationCard;
