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


	}

	function poi(pName,pLocation){
		var self = this;
		self.label = labels[labelIndex++ % labels.length]
		self.name = pName;
		self.location = pLocation;
		self.visible = ko.observable(true);
		self.articleList = ko.observableArray();
		self.mapMarker = new google.maps.Marker({
			position: new google.maps.LatLng(self.location.lat,self.location.lng),
			label: self.label,
			map: map
		})
	}

	function PoisViewModel(){
		var self = this;

		self.selected = ko.observable();
		self.searchText = ko.observable();

		self.defPois=[
			{
				name:"Lomnický stit",
				location:{
					lat:49.195272,
					lng:20.213147
				}
			},
			{
				name:"Chopok",
				location:{
					lat:48.943402,
					lng:19.590036
				}
			},
			{
				name:"Banikov",
				location:{
					lat:49.198319,
					lng:19.711955
				}
			},
			{
				name:"Zaruby",
				location:{
					lat:48.521995,
					lng:17.384371
				}
			}

		];

		var mappedPois = $.map(self.defPois, function(obj){ return new poi(obj.name, obj.location);});

		self.pois = ko.observableArray(mappedPois);

		self.searchPois = function(){

			$.each( self.pois(), function( key, value ) {
				if(value.name.toUpperCase().search(self.searchText().toUpperCase()) > -1){
					value.visible(true);
					value.mapMarker.setVisible(true);
					console.log( key + ": " + value.name );
				}else{
					value.mapMarker.setVisible(false);
					value.visible(false);
				}

			});
		}

		self.selectPoi = function(pPoi){
			self.selected = pPoi;
			self.selected.articleList.removeAll()
			var remoteUrlWithOrigin = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+pPoi.name+"&format=json&callback=wikiCallback"
			$.ajax( {
		        url: remoteUrlWithOrigin,
		        dataType: 'jsonp',
		        type: 'POST',
		        headers: { 'Api-User-Agent': 'Example/1.0' },
		        success: function(data) {
		            var wikiArticleTitles = data[1]
		            $.each(wikiArticleTitles, function( key, val ) {
		                self.selected.articleList.push({
		                	title: val,
		                	article: data[2][key],
		                	link: data[3][key]
		                });
		                console.log(val);
		            });
		        }
		    } );
		}
	}

	google.maps.event.addDomListener(window, 'load', initialize);

};





