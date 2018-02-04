let geocode_api='https://api.mapbox.com/geocoding/v5/mapbox.places/';
let token='.json?access_token=pk.eyJ1IjoidXRrMTgwMSIsImEiOiJjamFrMDgydjEyZnc0MzNsZG5xNzBmYTYyIn0.sJkuA0-6ziCfA_ILoMMiNQ';

var mapImg;
var clat=0;
var clon=0;
var longi;
var lati;

// 20.5937° N, 78.9629° E
//var lat=20.5937;
//var lon=78.9629;

var zoom=1;


function preload(){
	mapImg=loadImage("https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1,0,0/1024x512?access_token=pk.eyJ1IjoidXRrMTgwMSIsImEiOiJjamFrMDgydjEyZnc0MzNsZG5xNzBmYTYyIn0.sJkuA0-6ziCfA_ILoMMiNQ");
}

function mercX(lon) {
	console.log("mercX Invoked");
	lon=radians(lon);
	var a= (256/PI)*pow(2,zoom);
	var b= lon + PI;
	return a*b;
}

function mercY(lat){
	lat=radians(lat);
	var a= (256/PI)*pow(2,zoom);
	var b=tan(PI/4 + lat/2);
	var c=PI-log(b);
	return a*c;
}


function setup() {


	
	var source=select('#src');
	//var dest=select('#des');
	
	source.changed(startSearch);
	//dest.changed(startSearch);

	  function startSearch() {
	    goWiki(source.value());
	    //goWiki(dest.value());
	  }

	  function goWiki(term) {
	   
		  let api=geocode_api+term+token;
	      loadJSON(api, gotSearch);
	    }
	  

	  function gotSearch(data) {
	    console.log(data);
	    let lat = data.features[0].geometry.coordinates[1];
	    let lon = data.features[0].geometry.coordinates[0];

		var cx=mercX(clon);
		var cy=mercY(clat);

		var x=mercX(lon)-cx;
		var y=mercY(lat)-cy;
		console.log(x);console.log(y);

		createCanvas(1024,512);
		translate(width/2,height/2);
		imageMode(CENTER);
		image(mapImg,0,0);
		fill(100,200,155,150);
		ellipse(x,y,10,10);
	}
}

