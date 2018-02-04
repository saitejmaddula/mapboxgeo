var mapImg;

var clat=0;
var clon=0;

// 20.5937° N, 78.9629° E

var lat=22.199166;
var lon=78.476681;

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

function setup() {
	createCanvas(1024,512);
	translate(width/2,height/2);
	imageMode(CENTER);
	image(mapImg,0,0);
	longi=mercX(lon);lati=mercY(lat);
	console.log(longi);console.log(lati);

	var cx=mercX(clon);
	var cy=mercY(clat);
	console.log(cx);console.log(cy);

	var x=longi-cx;
	var y=lati-cy;
	console.log(x);console.log(y);
	fill(100,200,155,150);
	ellipse(x,y,10,10);
}



// 223.22255928888887, -64.78613025039738
