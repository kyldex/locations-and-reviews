export default function reverseGeocoding(reverseGeocodingData, storeId) {
    const parsedData = {
        geometry: {
            type: 'Point',
            coordinates: [reverseGeocodingData.geometry.location.lng, reverseGeocodingData.geometry.location.lat]
        },
        type: 'Feature',
        properties: {
            name: reverseGeocodingData.name,
            store_id: storeId,
            address: {
                street_number: reverseGeocodingData.address_components[0].long_name,
                street: reverseGeocodingData.address_components[1].long_name,
                postal_code: reverseGeocodingData.address_components[6].long_name,
                city: reverseGeocodingData.address_components[2].long_name
            },
            phone: reverseGeocodingData.phone,
            category: 'restaurant',
            hours: reverseGeocodingData.hours,
            ratings: []
        }
    };

    return parsedData;
}
