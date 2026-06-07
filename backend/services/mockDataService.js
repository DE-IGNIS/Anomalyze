function getRandomLocation() {
  let locations = [
    "Thane",
    "Jaipur",
    "Lucknow",
    "Nagpur",
    "Kolkata",
    "Ahmedabad",
    "Hyderabad",
    "Indore",
    "Bangalore",
    "Surat",
    "Kanpur",
    "Mumbai",
    "Chennai",
    "Delhi",
    "Pune",
    "Bhopal"
  ];
  if (!Array.isArray(locations) || locations.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * locations.length);
  return locations[index];
}


function generateRandomIP() {
  const getOctet = () => Math.floor(Math.random() * 256); // 0–255
  return `${getOctet()}.${getOctet()}.${getOctet()}.${getOctet()}`;
}

module.exports = { getRandomLocation, generateRandomIP };