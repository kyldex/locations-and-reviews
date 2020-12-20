import React from 'react';
import PropTypes from 'prop-types';

import './SingleLocation.scss';

const { REACT_APP_GMAP_API_KEY } = process.env;

const SingleLocation = ({ addedRatings, handleButtonClick, handleReturnToLocationsList, maxRatingAverage, selectedLocation }) => {
    const lat = selectedLocation.geometry.coordinates[1];
    const lng = selectedLocation.geometry.coordinates[0];
    const imgURL = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&key=${REACT_APP_GMAP_API_KEY}`;

    return (
        <div className="single-location">
            <img src={imgURL} alt="Photo du restaurant" />
            <button className="back-to-filter" onClick={(handleReturnToLocationsList)}>Retour à la liste</button>
            <h2>{selectedLocation.properties.name}</h2>
            <div className="add-rating">
                <button type="button">
                    <img
                        src="/src/assets/img/add-outline.svg"
                        onClick={handleButtonClick}
                    />
                </button>
                <p>Ajoutez votre avis !</p>
            </div>

            <div className="single-location-reviews">
                {selectedLocation.properties.ratings.map((rating) => (
                    <div className="single-location-review" key={rating.ratingId}>
                        <p>{`${rating.stars}/${maxRatingAverage}`}</p>
                        <p>{rating.comment}</p>
                    </div>
                ))}
                {addedRatings && addedRatings.map((addedRating) => (
                    addedRating.storeId === selectedLocation.properties.storeid && (
                    <div className="single-location-review" key={addedRating.ratingId}>
                        <p>{`${addedRating.ratingStars}/${maxRatingAverage}`}</p>
                        <p>{addedRating.ratingComment}</p>
                    </div>
                    )
                ))}
            </div>
        </div>
    );
};

SingleLocation.propTypes = {
    addedRatings: PropTypes.array,
    handleButtonClick: PropTypes.func.isRequired,
    handleReturnToLocationsList: PropTypes.func.isRequired,
    maxRatingAverage: PropTypes.number.isRequired,
    selectedLocation: PropTypes.object.isRequired
};

export default SingleLocation;
