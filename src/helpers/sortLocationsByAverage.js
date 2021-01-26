/**
 * Returns a new array with locations sorted by average
 * @param {Array} unsortedLocations
 * @returns {Array}
 */
export default function sortLocationsByAverage(unsortedLocations) {
  const sortedLocations = unsortedLocations.sort((locationA, locationB) => {
    return (locationA.properties.ratings_average - locationB.properties.ratings_average) * -1;
  });

  return sortedLocations;
}
