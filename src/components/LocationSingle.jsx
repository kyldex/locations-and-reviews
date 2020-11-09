import React from 'react';
import PropTypes from 'prop-types';

import '../styles/LocationSingle.css';

const { REACT_APP_GMAP_API_KEY } = process.env;

const LocationSingle = ({ selectedLocation }) => {
    const lat = selectedLocation.geometry.coordinates[1];
    const lng = selectedLocation.geometry.coordinates[0];
    const imgURL = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&key=${REACT_APP_GMAP_API_KEY}`;

    return (
        <div className="location-single">
            <img src={imgURL} />
            <h2>{selectedLocation.properties.name}</h2>
            <div className="location-single-reviews">
                {selectedLocation.properties.ratings.map((rating) => (
                    <div className="location-single-review" key={rating.ratingId}>
                        <p>{`${rating.stars}/5`}</p>
                        <p>{rating.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

LocationSingle.propTypes = {
    selectedLocation: PropTypes.object.isRequired
}

export default LocationSingle;
