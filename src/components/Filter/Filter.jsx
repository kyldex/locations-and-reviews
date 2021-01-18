import React from 'react';
import PropTypes from 'prop-types';

import FilterControls from './FilterControls.jsx';
import LocationCard from './LocationCard.jsx';

import './Filter.scss';

const Filter = ({
    currentMinRatingAverage,
    currentMaxRatingAverage,
    displayedLocations,
    displayedLocationsAreSortedBy,
    googlePlacesButtonIsDisabled,
    handleChangeFilterInputs,
    handleGooglePlacesRefresh,
    handleLocationCardClick,
    handleLocationCardHover,
    handleSortLocationsByAverage,
    minRatingAverage,
    maxRatingAverage,
}) => {
    return (
        <>
            <FilterControls
                minRatingAverage={minRatingAverage}
                maxRatingAverage={maxRatingAverage}
                currentMinRatingAverage={currentMinRatingAverage}
                currentMaxRatingAverage={currentMaxRatingAverage}
                handleChangeFilterInputs={(newMinValue, newMaxValue) => handleChangeFilterInputs(newMinValue, newMaxValue)}
            />

            <div className="filter-buttons">
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
                        // ${googlePlacesButtonIsDisabled ? 'sort-by-average-button--gray' : 'sort-by-average-button--red'}`}
                        className={`sort-by-average-button ${displayedLocationsAreSortedBy === 'name' ? 'sort-by-average-button--gray' : 'sort-by-average-button--red'}`} 
                        onClick={handleSortLocationsByAverage}
                    >
                        Trier par moyenne
                    </button>
                </div>
            </div>

            <div className="locations-cards">
                <div className="app-location-cards">
                    <h2 className="app-location-cards__title">Application</h2>
                    {displayedLocations && displayedLocations.map((location) => (
                        !location.properties.is_google_places && (
                            <LocationCard
                                key={location.properties.store_id}
                                location={location}
                                handleLocationCardClick={(location) => handleLocationCardClick(location)}
                                handleLocationCardHover={(location) => handleLocationCardHover(location)}
                            />
                        )
                    ))}
                </div>

                <div className="google-places-locations-cards">
                    <h2 className="google-places-locations-cards__title">Google Places</h2>
                    {displayedLocations && displayedLocations.map((location) => (
                        location.properties.is_google_places && (
                            <LocationCard
                                key={location.properties.store_id}
                                location={location}
                                handleLocationCardClick={(location) => handleLocationCardClick(location)}
                                handleLocationCardHover={(location) => handleLocationCardHover(location)}
                            />
                        )
                    ))}
                </div>
            </div>
        </>
    );
}

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
    displayedLocationsAreSortedBy: PropTypes.string.isRequired,
    googlePlacesButtonIsDisabled: PropTypes.bool.isRequired,
    handleChangeFilterInputs: PropTypes.func.isRequired,
    handleGooglePlacesRefresh: PropTypes.func.isRequired,
    handleLocationCardClick: PropTypes.func.isRequired,
    handleLocationCardHover: PropTypes.func.isRequired,
    handleSortLocationsByAverage: PropTypes.func.isRequired,
    minRatingAverage: PropTypes.number.isRequired,
    maxRatingAverage: PropTypes.number.isRequired
}

export default Filter;
