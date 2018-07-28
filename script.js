var audio;
var WIDTH = 1024;
var HEIGHT = 100;

audioFile.onchange = function(){ //plays the user's uploaded audio file when it is uploaded
    audio = document.getElementById("audio");
    var reader = new FileReader();
    reader.onload = function(e){
        audio.src = this.result;
        audio.controls = true;
        audio.play();
    }
    reader.readAsDataURL(this.files[0]);
}


var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioContext.createAnalyser();
//source = audioContext.createMediaStreamSource(stream);
//source.connect(analyser);


var canvas1 = document.getElementById("cnv1"); //drawing the canvas
var context1 = canvas1.getContext("2d");

analyser.fftSize = 256; //setting up analyser
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
context1.clearRect(0,0, WIDTH, HEIGHT);

function draw(){
    //drawVisual = requestAnimationFrame(draw);
    //analyser.getByteFrequencyData(dataArray);





    var r = 0;
    var g = 0;
    var b = 255;

    var x = 0;
    var barHeight;
    for(var i = 0; i < 128; i++){
        console.log(dataArray[i]);
        //barHeight = dataArray[i]/2;
        var rand = (Math.random() * 99);

        r = r + 10;
        if(r > 255){
            r = 255;
        }
        g = g + 1;
        if(g > 255){
            g = 255;
        }
        b = b - 2;
        if(b < 0){
        b = 0;
        }
        context1.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; //rgb color cycle 
        //context1.fillStyle = "rgb(" + 50 + "," + 50 + "," + (100 + (100 - rand)) + ")"; //blue color gradient depending on height of bar
        context1.fillRect(x,0 + rand, 6, 100 - rand); //random bar height
        //context1.fillRect(x,HEIGHT - barHeight/2, 6, barHeight);
        x = x + 8;
    }
};

/*analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);
context1.clearRect(0, 0, WIDTH, HEIGHT);

function draw() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    context1.fillStyle = 'rgb(0, 0, 0)';
    context1.fillRect(0, 0, WIDTH, HEIGHT);


    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]/2;
        console.log(barHeight);

        context1.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        context1.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

        x += barWidth + 1;
    }
};*/


draw();