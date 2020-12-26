/**
 * Parse geocoding data to create a new location object
 * @param {Object} reverseGeocodingData
 * @returns {Object}
 */
export default function parseGeocodingData(reverseGeocodingData) {
    const parsedData = {
        geometry: {
            type: 'Point',
            coordinates: [reverseGeocodingData.geometry.location.lng, reverseGeocodingData.geometry.location.lat]
        },
        type: 'Feature',
        properties: {
            name: '',
            store_id: '',
            address: {
                street_number: reverseGeocodingData.address_components[0].long_name,
                street: reverseGeocodingData.address_components[1].long_name,
                postal_code: reverseGeocodingData.address_components[6].long_name,
                city: reverseGeocodingData.address_components[2].long_name
            },
            phone: '',
            category: 'restaurant',
            hours: '',
            ratings: []
        }
    };

    return parsedData;
}
