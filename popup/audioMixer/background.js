
let lofi = document.getElementById('lofi');
let rain = document.getElementById('rain');

let myAudio1 = new Audio('lofi-music/Wild Strawberry.mp3');
let myAudio2 = new Audio('lofi-music/ES_Rain Forest Steady - SFX Producer.mp3'); 

lofi.onclick = go1();
rain.onclick = function(element) {
	go2(myAudio2);
};

function go1() {
	//myAudio = new Audio('lofi-music/Cozy Place.mp3'); 
	if (typeof myAudio1.loop == 'boolean')
	{
    	myAudio1.loop = true;
	}
	else
	{
    	myAudio1.addEventListener('ended', function() {
        	this.currentTime = 0;
        	this.play();
    	}, false);
	}
	myAudio1.play();
}

function go2() {
	//myAudio = new Audio('lofi-music/ES_Rain Forest Steady - SFX Producer.mp3'); 
	if (typeof myAudio2.loop == 'boolean')
	{
    	myAudio2.loop = true;
	}
	else
	{
    	myAudio2.addEventListener('ended', function() {
        	this.currentTime = 0;
        	this.play();
    	}, false);
	}
	myAudio2.play();
}

