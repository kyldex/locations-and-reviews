/**
 * Parse Place Details request (Google Places API) to create a new location object
 * @param {Object} locationRequest
 * @returns {Object}
 */
export default function parseLocationRequest(locationRequest) {
    const address = {
        street_number: '',
        street: '',
        postal_code: '',
        city: ''
    }
    const parsedReviews = [];
    const someAddressDataIsMissing =
        locationRequest.address_components[0] === undefined ||
        locationRequest.address_components[1] === undefined ||
        locationRequest.address_components[6] === undefined ||
        locationRequest.address_components[2] === undefined;

    if (!someAddressDataIsMissing) {
        address.street_number = locationRequest.address_components[0].long_name;
        address.street = locationRequest.address_components[1].long_name;
        address.postal_code = locationRequest.address_components[6].long_name;
        address.city = locationRequest.address_components[2].long_name;
    }

    locationRequest.reviews.forEach((review) => {
        parsedReviews.push({
            rating_id: '',
            stars: review.rating,
            comment: review.text
        });
    });

    const parsedData = {
        geometry: {
            type: 'Point',
            coordinates: [locationRequest.geometry.location.lng(), locationRequest.geometry.location.lat()]
        },
        type: 'Feature',
        properties: {
            name: locationRequest.name,
            store_id: '',
            place_id: locationRequest.place_id,
            address: address,
            phone: locationRequest.international_phone_number,
            category: 'restaurant',
            hours: '',
            ratings: parsedReviews,
            ratings_average: locationRequest.rating
        }
    };

    return parsedData;
}