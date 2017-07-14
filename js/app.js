/*jshint loopfunc:true */

// Temporarily moved here
var data = [
  [
    {"icon": '<a href="#"><i class="icon-camera"></i></a>', "type": "recommend", "currentType": true},
    {"icon": '<a href="#"><i class="icon-tree"></i></a>', "type": "outdoor", "currentType": false},
    {"icon": '<a href="#"><i class="icon-bar"></i></a>', "type": "bar", "currentType": false},
    {"icon": '<a href="#"><i class="icon-bed"></i></a>', "type": "hotel", "currentType": false}

  ],
  [
    {"name":"Oriental Pearl Tower", "location": {"lat":31.239689, "lng":121.499755}, "visibility": true, "type": "recommend"},
    {"name":"Shanghai Ocean Aquarium", "location":{"lat":31.240696, "lng":121.501759}, "visibility": true, "type": "recommend"},
    {"name":"Shanghai Disneyland", "location":{"lat":31.145279, "lng":121.657289}, "visibility": true, "type": "recommend"},
    {"name":"The Bund, Shanghai", "location":{"lat":31.240261, "lng":121.490577}, "visibility": true, "type": "recommend"},
    {"name":"Yu Garden", "location":{"lat":31.227236, "lng":121.492094}, "visibility": true, "type": "recommend"},
    {"name":"Shanghai Tower", "location":{"lat":31.233502, "lng":121.505763}, "visibility": true, "type": "recommend"},
    {"name":"Jade Buddha Temple", "location":{"lat":31.241347, "lng":121.445121}, "visibility":true, "type": "recommend"},
    {"name":"Nanjing Road", "location":{"lat":31.234774, "lng":121.474798}, "visibility":true, "type": "recommend"},
    {"name":"Shanghai Museum", "location":{"lat":31.228331, "lng":121.475528}, "visibility":true, "type": "recommend"},
    {"name":"Shanghai French Concession", "location":{"lat":31.207897, "lng":121.468997}, "visibility":true, "type": "recommend"}
  ]
];

// Error handling if google map doesn't load
var googleMapLoadError = function(){
  alert("Error when loading google maps");
};

/* The callback init function
 *
 */
function initMap() {

  //Fetch the JSON data
  // $.ajax({
  //   url: "js/data.json",
  //   dataType: "json"
  // }).done(function(data) {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: {lat:31.239689, lng:121.499755},
      zoom: 15,
      styles: styles
      //mapTypeControl: false
    });

    // Make the markers
    var markers = [];
    for (var i=0; i<data[1].length; i++){
      var marker = new google.maps.Marker({
        position: data[1][i].location,
        title: data[1][i].name,
        animation: google.maps.Animation.DROP,
        map: map,
        id: i
      });
      markers.push(marker);
      marker.addListener("click", function(){
        populateInfoWindow(this, infoWindow);
        toggleBounce(this);
        zoomToArea(this);
      });
    }

    // Declare an infoWindow variable
    var infoWindow = new google.maps.InfoWindow();

    // Make the InfoWindow. This code below is based on the Udacity Course regarding google maps and google.maps.streetview website: https://developers.google.com/maps/documentation/javascript/streetview
    function populateInfoWindow(marker, infowindow) {
      // Define the processSVData function outside of the if block
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      var processSVData=function(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
        //  infowindow.setContent('<div id="pano"></div><div class="infowindow--title">'+ marker.title + '</div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          // Error handling if no street view found
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      };

      // Check to make sure the infowindow is not already opened on this marker. If the below code is not present, the infowindow will refresh every time you click the marker
      if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
          toggleBounce(marker);
          fitBounds();
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        // Ajax request for wikipedia information
        // Note when you test this, wikipedia actually won't recognize Oriental Pearl Tower, Shanghai, or Shanghai Museum, Shanghai, but recognizes The Bund, Shanghai. Therefore always be careful what 3rd party API require you put in your request.
        var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json';

        $.ajax({
          url: wikiURL,
          dataType: 'jsonp'
          }
        ).done(function(data){
          // console.log(data);
          var linkTitles = data[1];
          var linkURL = data[3];
          for (var i=0; i < linkTitles.length; i++){
            // Add attribution to Wikipedia
            infowindow.setContent('<div id="pano"></div><div class="infowindow--title">'+ marker.title + '</div><li><a href="'+linkURL[i]+'">'+linkURL[i]+'</a></li><img src="img/Wikipedia_wordmark@2x.png">');
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanorama({location: marker.position, radius: radius}, processSVData);
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
          }
        }).fail(function(jqXHR, textStatus){
          //$("<p>Failed to get wikipedia resources</p>").insertAfter(".infowindow--title");
            infowindow.setContent('<div id="pano"></div><div class="infowindow--title">'+ marker.title + '</div><p>Failed to get wikipedia resources</p>');
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanorama({location: marker.position, radius: radius}, processSVData);
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        });
      }
    }

    // Bounce the marker when clicked. Stop the bouncing when clicked again.
    function toggleBounce(marker){
      for (var i=0; i < markers.length; i++){
        markers[i].setAnimation(null);
      }
      if(marker.getAnimation()!==null){
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    // Zoom to the Area of the selected marker
    function zoomToArea(marker){
      map.setCenter(marker.position);
      map.setZoom(16);
    }

    // fit bounds
    function fitBounds(){
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < data[1].length; i++){
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
    }

    // Code below cause browser to respond really slow
    // google.maps.event.addDomListener(window, 'resize', function() {
    //   var bounds = new google.maps.LatLngBounds();
    //   for (var i = 0; i < data.length; i++){
    //     bounds.extend(markers[i].position);
    //   }
    //   map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    // });

    /* The model
     *
     */
    var Place = function(place) {
      this.name = ko.observable(place.name);
      this.location = ko.observable(place.location);
      this.visibility = ko.observable(place.visibility);
    };

    var PlaceType = function(placeType) {
      this.icon = ko.observable(placeType.icon);
      this.type = ko.observable(placeType.type);
      this.currentType = ko.observable(placeType.currentType);
    };

    /* The view model
     *
     */
    var ViewModel = function() {
      var self = this;

      this.placeList = ko.observableArray([]);

      for (var i=0; i<data[1].length; i++){
        self.placeList.push(new Place(data[1][i]));
      }

      // Create a ko object for data-bind: filter
      this.filter = ko.observable("");
      // Computed observables are functions that are dependent on one or more other observables, and will automatically update whenever any of these dependencies change.
      this.filterPlaces = ko.computed(function(){
        for (var i=0; i<data[1].length; i++){
          // javascript indexof() function is case sensitive
          var filterValue = self.filter().toLowerCase();
          var toBeMatched = self.placeList()[i].name().toLowerCase();
          // Filter for the list element
          self.placeList()[i].visibility(toBeMatched.indexOf(filterValue)>=0);
          //Filter for the marker
          if(toBeMatched.indexOf(filterValue)>=0){
            markers[i].setMap(map);
          } else {
            markers[i].setMap(null);
          }
        }
      }, this);
      // Click on one of the placeList elements
      this.setMarker= function(selectedPlace){
        //console.log(selectedPlace.location());
        // console.log(data[0].location);
        for (var i=0; i < markers.length; i++){
          // since selectedPlace is a ko object, to return its location, you have to use .location()
          if(selectedPlace.location()===data[1][i].location){
            populateInfoWindow(markers[i], infoWindow);
            toggleBounce(markers[i]);
            zoomToArea(markers[i]);
          }
        }
      };

      // filter place types
      this.placeType = ko.observableArray([]);

      for (var j=0; j<data[0].length; j++){
        self.placeType.push(new PlaceType(data[0][j]));
      }

      // Click on one of the placeType elements
      this.setType = function(selectedType){
        for (var i=0; i < data[0].length; i++) {
          self.placeType()[i].currentType(false);
        }
        selectedType.currentType(true);
        for (var j=0; j < data[1].length; j++) {
          if (selectedType.type()===data[1][j].type){
            self.placeList()[j].visibility(true);
          } else {
            self.placeList()[j].visibility(false);
          }
        }
      }
    };

    ko.applyBindings(new ViewModel());

  }
// ).fail(function(jqXHR, textStatus, errorThrown){
//     alert("Place data cannot be retrieved due to "+errorThrown);
//   });
// }
