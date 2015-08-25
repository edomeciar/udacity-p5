$(function(){
	var mapModel = new MapModel();
});

/*model*/
var MapModel = function(){
	"use strict";
	var defaultValues={
			center: {lat: 48.549429090642946, lng: 19.65522705078128},
    		zoom: 8
		},
		map,
		panorama,
		labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		labelIndex = 0

	function initialize(){
		map = new google.maps.Map(document.getElementById('map-canvas'), defaultValues);
		ko.applyBindings(new PoisViewModel());

		/*
		panorama = new google.maps.StreetViewPanorama(
      		document.getElementById('street-view'),
      		{
        		position: {lat: 37.869260, lng: -122.254811},
        		pov: {heading: 165, pitch: 0},
        		zoom: 1
      		});
      	*/

	}

	function poi(pName,pLocation){
		var self = this;
		self.label = labels[labelIndex++ % labels.length]
		self.name = pName;
		self.location = pLocation;
		self.mapMarker = new google.maps.Marker({
			position: new google.maps.LatLng(self.location.lat,self.location.lng),
			label: self.label,
			map: map
		})
	}

	function PoisViewModel(){
		var self = this;

		self.selected = ko.observable();

		self.defPois=[
			{
				name:"Lomnický peak",
				location:{
					lat:49.195272,
					lng:20.213147
				}
			},
			{
				name:"Bojnice Castle",
				location:{
					lat:48.780281,
					lng:18.577452
				}
			}
		];

		var mappedPois = $.map(self.defPois, function(obj){ return new poi(obj.name, obj.location);});

		self.pois = ko.observableArray(mappedPois);
	}

	google.maps.event.addDomListener(window, 'load', initialize);

};





