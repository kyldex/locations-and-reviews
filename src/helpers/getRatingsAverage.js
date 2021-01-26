export default function getRatingsAverage(location) {
  let ratingsTotal = 0;
  let numberOfRatings = 0;

  location.properties.ratings.forEach((rating) => {
    ratingsTotal += rating.stars;
    numberOfRatings++;
  });

  const ratingsAverage = ratingsTotal / numberOfRatings;

  return Math.round(ratingsAverage * 10) / 10;
}
