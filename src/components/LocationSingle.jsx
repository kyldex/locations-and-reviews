import React from 'react';
import '../styles/LocationSingle.css'

const LocationSingle = (props) => (
    <div className="location-single">
        <img src="/src/assets/img/placeholder.jpg" />
        <div className="location-single-reviews">
            {props.selectedLocation.properties.ratings.map((rating) => (
                <div className="location-single-review">
                    <p>{`${rating.stars}/5`}</p>
                    <p>{rating.comment}</p>
                </div>
            ))}
        </div>
    </div>
);

export default LocationSingle;
