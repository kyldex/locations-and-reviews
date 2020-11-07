import React from 'react';

import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

import '../styles/Map.css';

const Map = withScriptjs(withGoogleMap((props) => {

    // const InfoWindowPosition = (
    //     <InfoWindow>
    //         <div>Vous êtes ici</div>
    //     </InfoWindow>
    // );

    return (
        <GoogleMap
            defaultZoom={12}
            defaultCenter= {{ lat: 48.8534, lng: 2.3488 }}
            center={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
        >
            {props.isMarkerShown && (
                <Marker
                    position={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
                    // onClick={func}
                />
            )}

            {props.locations ? props.locations.map((location) => (
                <Marker
                    key={location.properties.storeid}
                    position={{
                        lat: location.geometry.coordinates[1],
                        lng: location.geometry.coordinates[0]
                    }}
                    onClick={() => props.onClick(location)}
                >
                    {props.selectedLocation && props.selectedLocation.properties.storeid === location.properties.storeid && (
                        <InfoWindow
                            onCloseClick={() => props.onClick(null)}
                        >
                            <div>
                                <div className="infowindow-title">{props.selectedLocation.properties.name}</div>
                                <p>{props.selectedLocation.properties.hours}</p>
                                <p>{props.selectedLocation.properties.address}</p>
                                <p>{props.selectedLocation.properties.phone}</p>
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            )) : (
                <div>Waiting for map</div>
            )}
        </GoogleMap>
    );
}));

export default Map;
