const geolib = require('geolib');

exports.isWithin20Km = (loc1, loc2) => {
  const [lat1, lon1] = loc1.split(',').map(Number);
  const [lat2, lon2] = loc2.split(',').map(Number);

  const distance = geolib.getDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 }
  );

  return distance / 1000 <= 20;
};
