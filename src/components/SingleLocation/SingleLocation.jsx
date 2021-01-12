import React from 'react';
import PropTypes from 'prop-types';

import './SingleLocation.scss';

const { REACT_APP_GMAP_API_KEY } = process.env;

const SingleLocation = ({ handleButtonClick, handleReturnToLocationsList, maxRatingAverage, selectedLocation }) => {
    const streetNumber = selectedLocation.properties.address.street_number;
    const street = selectedLocation.properties.address.street.toLowerCase().replace(/\s/g, '%20').replace(/'/g, '%27');
    const postalCode = selectedLocation.properties.address.postal_code;
    const city = selectedLocation.properties.address.city.toLowerCase().replace(/\s/g, '%20').replace(/'/g, '%27');
    const imgURL = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${streetNumber},%20${street},%20${postalCode},%20${city}&key=${REACT_APP_GMAP_API_KEY}`;

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
                {selectedLocation.properties.ratings.length === 0 ? (
                    <p className="no-ratings">Ce restaurant n'a aucun avis pour l'instant</p>
                ) : (
                    selectedLocation.properties.ratings.map((rating) => (
                        <div className="single-location-review" key={rating.rating_id}>
                            <p>{`${rating.stars}/${maxRatingAverage}`}</p>
                            <p>{rating.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

SingleLocation.propTypes = {
    handleButtonClick: PropTypes.func.isRequired,
    handleReturnToLocationsList: PropTypes.func.isRequired,
    maxRatingAverage: PropTypes.number.isRequired,
    selectedLocation: PropTypes.object.isRequired
};

export default SingleLocation;
