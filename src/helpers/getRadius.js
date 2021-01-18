/**
 * Get radius for a given map zoom
 * Needed to create the Nearby Search request
 * @param {number} currentMapZoom
 */
export default function getRadius(currentMapZoom) {
    let radius;

    if (currentMapZoom <= 15) {
        radius = '1000';
    } else if (currentMapZoom === 16) {
        radius = '700';
    } else if (currentMapZoom === 17) {
        radius = '300';
    } else if (currentMapZoom === 18) {
        radius = '150';
    } else if (currentMapZoom === 19) {
        radius = '75';
    } else if (currentMapZoom >= 20) {
        radius = '40';
    }

    return radius;
}