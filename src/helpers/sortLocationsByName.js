/**
 * Returns a new array with locations sorted by name
 * @param {Array} unsortedLocations
 * @returns {Array}
 */
export default function sortLocationsByName(unsortedLocations) {
  const sortedLocations = unsortedLocations.sort((locationA, locationB) => {
    if (locationA.properties.name < locationB.properties.name) {
      return -1;
    }
    if (locationA.properties.name > locationB.properties.name) {
      return 1;
    }
    return 0;
  });

  return sortedLocations;
}
