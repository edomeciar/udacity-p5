$(function(){
	var mapModel = new MapModel();
});

/*
main cladd with all logic
*/
var MapModel = function(){
	"use strict";
	/*
	default values for map
	*/
	var defaultValues={
			center: {lat: 49.12969734863698, lng: 19.87220703125003},
    		zoom: 9
		},
		map,
		panorama,
		/*
		init variables for generating markers for pois on the map
		*/
		labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		labelIndex = 0

	/*
	create map and apply binding for list of POIs
	*/
	function initialize(){
		map = new google.maps.Map(document.getElementById('map-canvas'), defaultValues);
		ko.applyBindings(new PoisViewModel());


	}

	/*
	function/object which is holding information about poi
	*/
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
		/*
		variable for selected poi and search text from input field
		*/
		self.selected = ko.observable();
		self.searchText = ko.observable();
		/*
		list of avalaible pois
		*/
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
		/*
		create obsevableArray.
		I used $.map function to create a array of poi objects.
		*/
		self.pois = ko.observableArray($.map(self.defPois, function(obj){ return new poi(obj.name, obj.location);}));
		/*
		function called, when search button is clicked.
		*/
		self.searchPois = function(){
			/*
			reset map to default view
			*/
			map.setCenter(new google.maps.LatLng(defaultValues.center.lat,defaultValues.center.lng));
			map.setZoom(defaultValues.zoom);
			/*
			set text from input field to variable and check if someting is in the field.
			If not, set "" into variable. This code was written, because when input field was empty, code sText.toUpperCase(); was producing error.
			*/
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
		/*
		function is called from GUI, when user click on the poi in the list.
		*/
		self.selectPoi = function(pPoi){
			/*
			set selected POI
			*/
			self.selected(pPoi);
			/*
			zoom map to the selecte POI
			*/
			map.setCenter(new google.maps.LatLng(pPoi.location.lat,pPoi.location.lng));
			map.setZoom(12);
			/*
			remove article list of selected POI. Can be populated from previovse action.
			*/
			self.selected().articleList.removeAll()
			/*
			build search url fro wikipedia and call ajax request.
			*/
			var remoteUrlWithOrigin = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+pPoi.name+"&format=json&callback=wikiCallback"
			$.ajax({
		        url: remoteUrlWithOrigin,
		        dataType: 'jsonp',
		        type: 'POST',
		        headers: { 'Api-User-Agent': 'Example/1.0' },
		        success: function(data) {
		        	/*
					populate articleList with results from ajax call
		        	*/
		            var wikiArticleTitles = data[1];
		            $.each(wikiArticleTitles, function( key, val ) {
		                self.selected().articleList.push({
		                	title: val,
		                	article: data[2][key],
		                	link: data[3][key]
		                });
		            });
		            /*
					if nothing was found, create dummy article.
		        	*/
		            if(wikiArticleTitles.length == 0){
		            	self.selected().articleList.push({
		                	title: "No articles found about: "+pPoi.name,
		                	article: "You can try custom search on Wikipedia",
		                	link: "https://en.wikipedia.org/wiki/Main_Page"
		                });
		            }
		        },
		        /*
				catch error
	        	*/
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





