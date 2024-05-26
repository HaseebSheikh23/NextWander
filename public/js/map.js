// Avoid redeclaring mapToken since it is already declared in the EJS template
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  projection: 'globe',
  zoom: 9,
  center: coordinates, // Use coordinates directly from EJS script
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates) // set position [lng, lat]
  .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();

map.on('style.load', () => {
  map.setFog({});
});

const secondsPerRevolution = 240;
const maxSpinZoom = 5;
const slowSpinZoom = 3;

let userInteracting = false;
const spinEnabled = true;

function spinGlobe() {
  const zoom = map.getZoom();
  if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
    let distancePerSecond = 360 / secondsPerRevolution;
    if (zoom > slowSpinZoom) {
      const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
      distancePerSecond *= zoomDif;
    }
    const center = map.getCenter();
    center.lng -= distancePerSecond;
    map.easeTo({ center, duration: 1000, easing: (n) => n });
  }
}

map.on('mousedown', () => {
  userInteracting = true;
});
map.on('dragstart', () => {
  userInteracting = true;
});

map.on('moveend', () => {
  spinGlobe();
});

spinGlobe();
