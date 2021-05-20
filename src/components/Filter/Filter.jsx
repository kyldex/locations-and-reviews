import React from 'react';
import PropTypes from 'prop-types';

import FilterControls from './FilterControls.jsx';
import LocationCard from './LocationCard.jsx';

import './Filter.scss';

const Filter = ({
  currentMinRatingAverage,
  currentMaxRatingAverage,
  displayedLocations,
  displayedLocationsHaveGooglePlaces,
  displayedLocationsAreSortedBy,
  googlePlacesButtonIsDisabled,
  handleChangeFilterInputs,
  handleGooglePlacesRefresh,
  handleLocationCardClick,
  handleLocationCardHover,
  handleSortLocationsByAverage
}) => {
  return (
    <>
      <FilterControls
        currentMinRatingAverage={currentMinRatingAverage}
        currentMaxRatingAverage={currentMaxRatingAverage}
        handleChangeFilterInputs={(newMinValue, newMaxValue) => handleChangeFilterInputs(newMinValue, newMaxValue)}
      />

      <div className="filter-buttons">
        <div className="filter-buttons-inner">
          <div className="google-places-refresh">
            <button
              type="button"
              className={`google-places-button ${googlePlacesButtonIsDisabled ? 'google-places-button--gray' : 'google-places-button--red'}`}
              onClick={handleGooglePlacesRefresh}
              disabled={googlePlacesButtonIsDisabled}
            >
              Recharger Google Places
            </button>
            <img
              className={`google-places-loading ${googlePlacesButtonIsDisabled ? 'google-places-loading--show' : ''}`}
              src="/src/assets/img/loading.svg"
              alt="Loading"
            />
          </div>

          <div className="dislayed-locations-sorting">
            <button
              type="button"
              className={`sort-by-average-button ${displayedLocationsAreSortedBy === 'name' ? 'sort-by-average-button--gray' : 'sort-by-average-button--red'}`}
              onClick={handleSortLocationsByAverage}
            >
              Trier par moyenne
            </button>
          </div>
        </div>
      </div>

      <div className="locations-cards">
        <h2 className="app-location-cards__title">Restaurants ajoutés par la communauté</h2>
        <div className="app-location-cards">
          {displayedLocations !== null && displayedLocations.length !== 0 ? displayedLocations.map((location) => (
            !location.properties.is_google_places && (
              <LocationCard
                key={location.properties.store_id}
                location={location}
                handleLocationCardClick={() => handleLocationCardClick(location)}
                handleLocationCardHover={(locationOrNull) => handleLocationCardHover(locationOrNull)}
              />
            )
          )) : (
            <p className="no-displayed-restaurants">Aucun restaurant dans la zone affichée.</p>
          )}
        </div>

        <h2 className="google-places-locations-cards__title">Restaurants Google Places</h2>
        <div className="google-places-locations-cards">
          {displayedLocations !== null && displayedLocations.length !== 0 && displayedLocationsHaveGooglePlaces ? displayedLocations.map((location) => (
            location.properties.is_google_places && (
              <LocationCard
                key={location.properties.store_id}
                location={location}
                handleLocationCardClick={() => handleLocationCardClick(location)}
                handleLocationCardHover={(locationOrNull) => handleLocationCardHover(locationOrNull)}
              />
            )
          )) : (
            <p className="no-displayed-restaurants">Aucun restaurant dans la zone affichée.</p>
          )}
        </div>
      </div>
    </>
  );
};

Filter.propTypes = {
  // String type when filter input is empty
  currentMinRatingAverage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  currentMaxRatingAverage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  displayedLocations: PropTypes.array,
  displayedLocationsHaveGooglePlaces: PropTypes.bool.isRequired,
  displayedLocationsAreSortedBy: PropTypes.string.isRequired,
  googlePlacesButtonIsDisabled: PropTypes.bool.isRequired,
  handleChangeFilterInputs: PropTypes.func.isRequired,
  handleGooglePlacesRefresh: PropTypes.func.isRequired,
  handleLocationCardClick: PropTypes.func.isRequired,
  handleLocationCardHover: PropTypes.func.isRequired,
  handleSortLocationsByAverage: PropTypes.func.isRequired
};

export default Filter;
