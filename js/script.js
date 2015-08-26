$(function(){
	var mapModel = new MapModel();
});

/*main cladd with all logic*/
var MapModel = function(){
	"use strict";
	/*default values for map*/
	var defaultValues={
			center: {lat: 49.12969734863698, lng: 19.87220703125003},
    		zoom: 9
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
			mapTypeId: google.maps.MapTypeId.SATELLITE,
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
				name:"Gerlachovský štít",
				location:{
					lat:49.164293,
					lng:20.133684
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
				name:"Baranec",
				location:{
					lat:49.173488,
					lng:19.742822
				}
			},
			{
				name:"Kralova hola",
				location:{
					lat:48.882869,
					lng:20.139703
				}
			}

		];

		var mappedPois = $.map(self.defPois, function(obj){ return new poi(obj.name, obj.location);});

		self.pois = ko.observableArray(mappedPois);

		self.searchPois = function(){
			map.setCenter(new google.maps.LatLng(defaultValues.center.lat,defaultValues.center.lng));
			map.setZoom(defaultValues.zoom);
			var sText = self.searchText();
			if(sText != undefined) {
				sText = sText.toUpperCase();
			}else{
				sText = "";
			}
			$.each( self.pois(), function( key, value ) {
				if(value.name.toUpperCase().search(sText) > -1){
					value.visible(true);
					value.mapMarker.setVisible(true);
				}else{
					value.mapMarker.setVisible(false);
					value.visible(false);
				}

			});
		}

		self.selectPoi = function(pPoi){
			self.selected(pPoi);
			map.setCenter(new google.maps.LatLng(pPoi.location.lat,pPoi.location.lng));
			map.setZoom(12);
			self.selected().articleList.removeAll()
			var remoteUrlWithOrigin = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+pPoi.name+"&format=json&callback=wikiCallback"
			$.ajax({
		        url: remoteUrlWithOrigin,
		        dataType: 'jsonp',
		        type: 'POST',
		        headers: { 'Api-User-Agent': 'Example/1.0' },
		        success: function(data) {
		            var wikiArticleTitles = data[1];
		            $.each(wikiArticleTitles, function( key, val ) {
		                self.selected().articleList.push({
		                	title: val,
		                	article: data[2][key],
		                	link: data[3][key]
		                });
		            });
		            if(wikiArticleTitles.length == 0){
		            	self.selected().articleList.push({
		                	title: "No articles found about: "+pPoi.name,
		                	article: "You can try custom search on Wikipedia",
		                	link: "https://en.wikipedia.org/wiki/Main_Page"
		                });
		            }
		        },
		        fail: function(jqXHR,textStatus,errorThrown){
		        	self.selected().articleList.push({
		                	title: "Error durring search for: "+pPoi.name,
		                	article: errorThrown + ": " + textStatus,
		                	link: "https://en.wikipedia.org/wiki/Main_Page"
		                });
		        }
		    });
		}
	}

	google.maps.event.addDomListener(window, 'load', initialize);

};





