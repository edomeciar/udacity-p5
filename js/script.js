$(function(){
	var mapModel = new MapModel();
});

/*model*/
var MapModel = function(){
	"use strict";
	var pois,
		defaultValues={
			center: {lat: 48.549429090642946, lng: 19.65522705078128},
    		zoom: 8
		},
		map;

	function init(){
		pois = [];
		map = new google.maps.Map(document.getElementById('map'), defaultValues);
		ko.applyBindings(new PoisViewModel());
	}

	function poi(){

	}

	function PoisViewModel(){
		var self = this;

		self.selected = ko.observable();

		self.allPois=[
			{
				name:"Lomnický peak",
				location:{
					lat:49.195272,
					lng:20.213147
				},
				wiki:"Lomnický peak"
			},
			{
				name:"Bojnice Castle",
				location:{
					lat:48.780281,
					lng:18.577452
				},
				wiki:"Bojnice Castle"
			}
		];

		self.pois = ko.observableArray(self.allPois);
	}

	init();

};





