// create map
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
});
//Create title layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

 // Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//Assign color based on the depth of the earthquake
function makeColor(d){
    return d > 50 ? '#800026' :
         d > 40  ? '#EA2C2C' :
         d > 30  ? '#EA822C' :
         d > 20  ? '#EE9C00' :
         d > 10   ? '#EECC00' :
         d > -10   ? '#D4EE00' :
                    '#98EE00';
}

//create markers and change marker size and color absed on data
function createCircle(feature, coords){
  var options ={
    radius: feature.properties.mag*3,
    fillColor: makeColor(feature['geometry']['coordinates'][2]),
    color:"black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.95
  }
  return L.circleMarker(coords, options)
};

// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

//use data to plot circles
d3.json(queryUrl, function(data){
  // console.log(data.features[17]['geometry']['coordinates'][2]);
  L.geoJSON(data, {
    pointToLayer: createCircle,
    onEachFeature: onEachFeature
  }).addTo(myMap)
})



//Legend 

var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend'),
  levels = [-10, 10, 20, 30, 40, 50];
  //loop through levels and create  legend 
  for (var i = 0; i < levels.length; i++) {
    div.innerHTML +=
      "<li style=\"background-color: " + makeColor(levels[i]) + "\"></li>" +
      " " + levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<ul>' : '+')
  }
return div
}
legend.addTo(myMap);
