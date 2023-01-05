//color function
function colorShow(depth){
  if (depth > 90) return "Red";
  else if (depth > 70) return "Orange";
  else if (depth > 50) return "Yellow";
  else if (depth > 30) return "GreenYellow";
  else if (depth > 10) return  "LawnGreen";
  else return "LimeGreen";
  };

  function createFeatures(earthquakeData) {
    var depth = feature.geometry.coordinates[2]
    var mag = feature.properties.mag
    var geojsonMarkerOptions =    {
      color: "white", // the color of each circle
      // Show the fill color based on the depth 
      fillColor: colorShow(depth),
      fillOpacity: .5, 
      radius: mag * 100,
      weight: 1,
    }
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h2>Location:</h2> " + feature.properties.place + "<br><h3>Magnitude:</h3> " + mag +
      "<br><h3>Depth:</h3> " + depth );
    }
  
  
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Create the base layer.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
  
    // Create a baseMap object.
    var baseMap = {
      "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMap and overlayMaps.
    // Add the layer control to the map.
  
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend'),
          depth = [-10, 10, 30, 50, 70, 90],
          color = ["LimeGreen", "LawnGreen", "GreenYellow", "Yellow", "Orange", "Red"];
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < depth.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colorShow(depth[i] ) + '"></i>' +
              depth[i] +(depth[i+1]?'&ndash;' + depth[i + 1] + '<br>' : '+');
      }
      return div;
    };
  
    legend.addTo(myMap);
  }
// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      // Circle marker applied for each feature
      return L.circleMarker(latlng, geojsonMarkerOptions)
    }
  });
});


