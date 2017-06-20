// The data input
var initList = [
  {title:"Oriental Pearl Tower", location: {lat:31.239689, lng:121.499755}, visibility: true},
  {title:"Shanghai Ocean Aquarium", location:{lat:31.240696, lng:121.501759}, visibility: true},
  {title:"Shanghai Disneyland", location:{lat:31.145279, lng:121.657289}, visibility: true},
  {title:"The Bund, Shanghai", location:{lat:31.240261, lng:121.490577}, visibility: true},
  {title:"Yu Garden", location:{lat:31.227236, lng:121.492094}, visibility: true},
  {title:"Shanghai Tower", location:{lat:31.233502, lng:121.505763}, visibility: true}
];

// The model
var Place = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
  this.visibility = ko.observable(data.visibility);
};

// The callback init function
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat:31.239689, lng:121.499755},
    zoom: 15,
    //styles: styles,
    //mapTypeControl: false
  });

  // Make the infoWindow
  var infoWindow = new google.maps.InfoWindow();

  // Make the markers
  var markers = [];
  for (var i=0; i<initList.length; i++){
    var marker = new google.maps.Marker({
      position: initList[i].location,
      title: initList[i].title,
      animation: google.maps.Animation.DROP,
      map: map,
      id: i
    });
    markers.push(marker);
    marker.addListener("click", function(){
      populateInfoWindow(this, infoWindow);
      toggleBounce(this);
      zoomToArea(this);
    })
  }

  // Make the InfoWindow, this code below is based on the google map streetview website: https://developers.google.com/maps/documentation/javascript/streetview
  function populateInfoWindow(marker, infowindow) {
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
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function processSVData(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div id="pano"></div><div class="infowindow--title">'+ marker.title + '</div>');
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
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanorama({location: marker.position, radius: radius}, processSVData);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);

      // Ajax request for wikipedia information
      var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json';

      // error mechanism: after 8 seconds, executes function below
      var wikiRequestTimeout = setTimeout(function(){
        $("<p>Failed to get wikipedia resources</p>").insertAfter(".infowindow--title");
      }, 8000);

      $.ajax({
        url: wikiURL,
        dataType: 'jsonp',
        success: function(data){
          console.log(data);
          var linkTitles = data[1];
          var linkSnippet = data[2];
          var linkURL = data[3];
          for (var i=0; i < linkTitles.length; i++){
            $('<li><a href="'+linkURL[i]+'">'+linkURL[i]+'</a></li>').insertAfter(".infowindow--title");
          }
          //if ajax request is successful, then we clear the timeout function
          clearTimeout(wikiRequestTimeout);
        }
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
    for (var i = 0; i < initList.length; i++){
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  // The view model
  var ViewModel = function() {
    var self = this;

    this.placeList = ko.observableArray([]);

    for (var i=0; i<initList.length; i++){
      self.placeList.push(new Place(initList[i]));
    }
    // Create a ko object for data-bind: filter
    this.filter = ko.observable("");
    // Computed observables are functions that are dependent on one or more other observables, and will automatically update whenever any of these dependencies change.
    this.filterPlaces = ko.computed(function(){
      for (var j=0; j<initList.length; j++){
        // javascript indexof() function is case sensitive
        var filterValue = self.filter().toLowerCase();
        var toBeMatched = self.placeList()[j].title().toLowerCase();
        // Filter for the list element
        self.placeList()[j].visibility(toBeMatched.indexOf(filterValue)>=0);
        //Filter for the marker
        if(toBeMatched.indexOf(filterValue)>=0){
          markers[j].setMap(map);
        } else {
          markers[j].setMap(null);
        }
      }
    }, this)
    // Click on one of the list elements
    this.setMarker= function(selectedPlace){
      //console.log(selectedPlace.location());
      // console.log(initList[0].location);
      for (var i=0; i < markers.length; i++){
        if(selectedPlace.location()===initList[i].location){
          populateInfoWindow(markers[i], infoWindow);
          toggleBounce(markers[i]);
          zoomToArea(markers[i]);
        }
      }
    }
  };

  ko.applyBindings(new ViewModel());
}
