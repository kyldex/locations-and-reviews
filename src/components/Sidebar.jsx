import React from 'react';
import LocationCard from './LocationCard.jsx';
import LocationSingle from './LocationSingle.jsx';
import '../styles/Sidebar.css';

const Sidebar = (props) => (

    <div id="sidebar">

        {props.selectedLocation ? (
            <LocationSingle selectedLocation={props.selectedLocation}/>
        ) : (
            <div className="location-cards">
                {props.locations.map((location) => (
                    <LocationCard
                        key={location.properties.storeid}
                        location={location}
                        ratingsAverage={props.ratingsAverage}
                    />
                ))}
            </div>
        )}
    </div>

);

export default Sidebar;
