var model = [{
    name: 'Empire state Building',
    category: 'Building',
    location: {
      lat: 40.748441,
      lng: -73.985664
    }

  },
  {
    name: 'frying pan',
    category: 'Restaurant',
    location: {
      lat: 40.752172,
      lng: -74.009020
    }

  },
  {
    name: 'Union Square Open Floor Plan',
    category: 'Building',
    location: {
      lat: 40.7347062,
      lng: -73.9895759
    }

  },
  {
    name: 'Central park',
    category: 'Park',
    location: {
      lat: 40.782865,
      lng: -73.965355
    }

  }, {
    name: 'carnegine hall',
    category: 'Hall',
    location: {
      lat: 40.765126,
      lng: -73.979924
    }
  }
];
var infowindow;
var map;
var marker;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.712784,
      lng: -74.005941
    },
    zoom: 11
  });
  //################Markers######################
  for (var i = 0; i < model.length; i++) {
    var Position = model[i].location;
    var name = model[i].name;
    var category = model[i].category;


    marker = new google.maps.Marker({
      position: Position,
      map: map,
      title: name

    });

  }

  //###############InfoWindows################
  infowindow = new google.maps.InfoWindow({
    maxwidth: 250
  });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

  /*
     Foursquare API
   
     var foursquareUrl = "https://api.foursquare.com/v2/venues/" + marker.venue + "/photos?&client_id=VGWNICIOTVQ1AKK3RTBCQDM3O5RUMQENR10VAD22EOOS0PMK&client_secret=TEJESOLSIYWA0FAPUKNK251LUOGKRAXB5TV2UYPSP12DK4PV&v=20170602&m=foursquare";
     var photo = [];

     function foursquarePhotos () {

       $.ajax({
           url: foursquareUrl,
           dataType: "jsonp",

           success: function( response ) {
           console.log(response);
           var photo_data = response.response.photos.items[0] || response.photos.items[0];
           var photoUrl = photo_data.prefix + photo_data.width + 'x' + photo_data.height + photo_data.suffix;
           var photo = ('<img class="venueimg" src="' + photoUrl + '">');
           console.log(response.response);
           },
           async: true,

         });

           infowindow.setContent('<div>' + marker.name + '</div>' + '<div>' + photo + '</div>');
           infowindow.open(map, marker);
       }  */

  function populateInfoWindow(marker, infowindow) {

    var foursqUrl = "https://api.foursquare.com" + marker.name + "&client_id=O2FE1XFO5CAM4XYKM5GJUSTSRWYN23BJRNWNWW1WJIJO5NIF&client_secret=C50BSKTOAO01WIHN40KSV5IATL032TPSCMOQGKJQVOHI3ZA1&v=20170602";

    $.ajax({
      url: foursqUrl,
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {
      console.log(data);

      var informationUrl = data[3][0];
      var Description = data[2][0];

      // Error handling..
      if (infoUrl === undefined) {
        infowindow.setContent('<div>' + '<h4>' + marker.title + '</h4>' + '<p>' + 'Sorry not found.' + '</p>' + '</div>');
        infowindow.open(map, marker);

      } else {

        infowindow.marker = marker;
        infowindow.setContent('<div>' + '<h4>' + marker.name + '</h4>' + Description + '<a href="' + informationUrl + '</div>');
        infowindow.open(map, marker);
      }

      // Error handling.. 
    }).fail(function() {
      infowindow.setContent('<div>' + '<h4>' + marker.name + '</h4>' + '<p>' + 'Sorry couldnot found.' + '</p>' + '</div>');
      infowindow.open(map, marker);

    });
  }

}

function mapAPTError() {
  alert("Could not load Google Maps!");
}

//*****************my view model*****************
var MyViewModel = function() {
  var self = this;
  //constracter

  var models = function(data) {

    self.name = ko.observable(data.name);
    self.location = ko.observable(data.location);
    self.isVisible = ko.observable(true);

  };
  this.locationList = ko.observableArray(model);

  this.locationList().forEach(function(location) {
    location.isVisible = ko.observable(true);

  });




  self.OptionsForCatg = ['All', 'Park', 'Restaurant', 'Building', 'Hall'];
  self.selectedCategory = ko.observable(self.OptionsForCatg[0]);


  self.filtering = ko.computed(function() {
    var selectedCategory = self.selectedCategory();
    console.log(selectedCategory);
    for (var i = 0; i < self.locationList().length; i++) {
        var category = self.locationList()[i].category;
      if (selectedCategory === category || selectedCategory === "All") {
        self.locationList()[i].isVisible(true);
        if (marker) {
          //  listItem[i].marker.setVisible(true);
        }
      } else if (selectedCategory !== category) {
        self.locationList()[i].isVisible(false);
        //listItem[i].marker.setVisible(false);
      } else {
        // listItem[i].isVisible(true);
        // listItem[i].marker.setVisible(true);
      }
    }
  });

  //self.openWindow = function(place) {
  //   google.maps.event.trigger(place.marker, 'click');
  //};
};
var vm = new MyViewModel();

ko.applyBindings(vm);
