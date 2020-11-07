import React from 'react';
import PropTypes from 'prop-types';

import LocationCard from './LocationCard.jsx';
import LocationSingle from './LocationSingle.jsx';
import Filter from './Filter.jsx';

import '../styles/Sidebar.css';

const Sidebar = ({ locations, ratingsAverage, selectedLocation }) => (

    <div id="sidebar">

        {selectedLocation ? (
            <LocationSingle selectedLocation={selectedLocation}/>
        ) : (
            <div className="location-cards">
                <Filter />
                {locations ? locations.map((location) => (
                    <LocationCard
                        key={location.properties.storeid}
                        location={location}
                        ratingsAverage={ratingsAverage}
                    />
                )) : (
                    <div>Waiting for locations</div>
                )}
            </div>
        )}
    </div>
);

Sidebar.propTypes = {
    locations: PropTypes.array,
    ratingsAverage: PropTypes.object,
    selectedLocation: PropTypes.object
}

export default Sidebar;
