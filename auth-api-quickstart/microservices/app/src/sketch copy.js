let directions_api='https://api.mapbox.com/directions/v5/mapbox/driving/';
let geocode_api='https://api.mapbox.com/geocoding/v5/mapbox.places/';
let token='.json?access_token=pk.eyJ1IjoidXRrMTgwMSIsImEiOiJjamFrMDgydjEyZnc0MzNsZG5xNzBmYTYyIn0.sJkuA0-6ziCfA_ILoMMiNQ';
let geometry='&geometries=geojson';

var mapImg;
var clat=0;
var clon=0;
var coord=[];
var mercC=[];

var zoom=1;


function preload(){
	mapImg=loadImage("https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1,0,0/1024x512?access_token=pk.eyJ1IjoidXRrMTgwMSIsImEiOiJjamFrMDgydjEyZnc0MzNsZG5xNzBmYTYyIn0.sJkuA0-6ziCfA_ILoMMiNQ");
}

function mercX(lon) {
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

function getPoints(points){
	let dirApi=directions_api+points[0]+','+points[1]+';'+points[2]+','+points[3]+token+geometry;
	console.log(dirApi);
	loadJSON(dirApi,gotCoordinates);
	coord=[];mercC=[];
}

function gotCoordinates(res){
	console.log(res);

	let distance=res.routes[0].distance;
	let duration=res.routes[0].duration;
	createP('The Distance between 2 places is approx. '+Math.round(distance/1000)+' KM\'s and the expected duration (by driving) is '+Math.round(duration/60/60)+' hours');

}

function setup() {
	
	var source=select('#src');
	var dest=select('#des');
	var button = select('#search');
  	button.mousePressed(startSearch);
	
		// source.changed(startSearch);
		// dest.changed(startSearch);

		  function startSearch() {
		   
		   
			  let api1=geocode_api+source.value()+token;
			  let api2=geocode_api+dest.value()+token;
		      loadJSON(api1, gotSearch);
		      loadJSON(api2, gotSearch);

		    }
		  

		  function gotSearch(data) {
		    let lat = data.features[0].geometry.coordinates[1];
		    let lon = data.features[0].geometry.coordinates[0];

			var cx=mercX(clon);
			var cy=mercY(clat);

			var x1=mercX(lon)-cx;
			var y1=mercY(lat)-cy;
			mercC.push(x1,y1);
			coord.push(lon,lat);
		
			createCanvas(1024,512);
			translate(width/2,height/2);
			imageMode(CENTER);
			image(mapImg,0,0);
			// let slider=createSlider(0,1,0,zoom,0);
			// 			zoom=slider.value();
			fill(100,200,155,150);
			ellipse(mercC[0],mercC[1],10,10);
			ellipse(mercC[2],mercC[3],10,10);
			if(coord.length==4){
				getPoints(coord);
			}
		}
}