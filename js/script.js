$(function(){
	ViewModel.init();
});

/*model*/
var MapModel = {
	defaultValues:{
		center: {lat: 48.549429090642946, lng: 19.65522705078128},
    	zoom: 8
	},
	map:{},

	init:function(){

	}



};

var TitleViewModel = function(){
	this.projectTitle = "Beuaty of Slovakia!";
}

/*view model*/
var ViewModel = {

	init: function(){
		MapModel.init();
		ko.applyBindings(new TitleViewModel());
		MapModel.map = new google.maps.Map(document.getElementById('map'), MapModel.defaultValues);
	}
};

