import React from 'react';
import PropTypes from 'prop-types';

import './SingleLocation.scss';

import { MAX_RATING_AVERAGE } from '../../config';

const { REACT_APP_GMAP_API_KEY } = process.env;

const SingleLocation = ({
  handleAddRatingButtonClick,
  handleReturnToLocationsList,
  selectedLocation
}) => {
  const streetNumber = selectedLocation.properties.address.street_number;
  const street = selectedLocation.properties.address.street
    .toLowerCase()
    .replace(/\s/g, '%20')
    .replace(/'/g, '%27');
  const postalCode = selectedLocation.properties.address.postal_code;
  const city = selectedLocation.properties.address.city
    .toLowerCase()
    .replace(/\s/g, '%20')
    .replace(/'/g, '%27');
  const imgURL = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${streetNumber},%20${street},%20${postalCode},%20${city}&key=${REACT_APP_GMAP_API_KEY}`;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddRatingButtonClick();
    }
  };

  return (
    <div className="single-location">
      <img
        src={imgURL}
        className="single-location__photo"
        alt={`Restaurant ${selectedLocation.properties.name}`}
      />

      {/* Test */}
      {/* <img className="single-location__photo" src={selectedLocation.properties.photo[0]} alt="" />
      <img src={selectedLocation.properties.photo[1]} alt="" />
      <img src={selectedLocation.properties.photo[2]} alt="" /> */}

      <button
        type="button"
        className="back-to-filter"
        onClick={handleReturnToLocationsList}
      >
        Retour à la liste
      </button>
      <h2>{selectedLocation.properties.name}</h2>

      {!selectedLocation.properties.is_google_places && (
        <div className="add-rating">
          <button type="button">
            <img
              src="/src/assets/img/add-outline.svg"
              onClick={handleAddRatingButtonClick}
              onKeyDown={(e) => handleKeyDown(e)}
              role="button"
              tabIndex={0}
              alt="Ajouter un avis"
            />
          </button>
          <p>Ajoutez votre avis !</p>
        </div>
      )}

      <div className="single-location-reviews">
        {selectedLocation.properties.ratings.length === 0 && (
          !selectedLocation.properties.is_google_places && (
            <p className="no-ratings">
              Ce restaurant n&#39;a aucun avis pour l&#39;instant.
            </p>
          )
        )}
        {selectedLocation.properties.ratings.length === 0 && (
          selectedLocation.properties.is_google_places && (
            <p className="no-ratings">
              Nous n&#39;avons pas pu récupérer les avis fournis par Google.
            </p>
          )
        )}
        {/* Google places rating ids are empty string, so array's indexes are used as key to map */}
        {selectedLocation.properties.ratings.length !== 0 && (
          selectedLocation.properties.ratings.map((rating, index) => (
            <div className="single-location-review" key={index}>
              <p>{`${rating.stars}/${MAX_RATING_AVERAGE}`}</p>
              <p>{rating.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

SingleLocation.propTypes = {
  handleAddRatingButtonClick: PropTypes.func.isRequired,
  handleReturnToLocationsList: PropTypes.func.isRequired,
  selectedLocation: PropTypes.object.isRequired
};

export default SingleLocation;
