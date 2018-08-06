var audio, canvas, context, audioctx, analyser, source, freqArr, barHeight;
var songLoaded = 0;
var WIDTH = 1024;
var HEIGHT = 255;
var r = 0;
var g = 0;
var b = 255;
var x = 0;

function initialize(){
    canvas = document.getElementById("cnv1"); //drawing the canvas
    context = canvas.getContext("2d");
    audio = document.getElementById("audio");
    audio.src = document.getElementById("audioFile");

    audioctx = new AudioContext(); //setting up audio analyzer to get frequency info
    analyser = audioctx.createAnalyser();
    analyser.fftSize = 256;
    
    source = audioctx.createOscillator();
    source.connect(audioctx.destination);
    //analyser.connect(audioctx.destination); //THIS IS MAKING MY MUSIC NOT PLAY

    freqArr = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqArr);

    barHeight = 100;
    
    //draw();
    window.requestAnimationFrame(draw);
}

audioFile.onchange = function(){ //plays the user's uploaded audio file when it is uploaded
    audio = document.getElementById("audio");
    var reader = new FileReader();
    reader.onload = function(e){
        songLoaded = 1;
        audio.src = this.result;
        audio.controls = true;
        //
        //analyser.disconnect();
        //
        audio.play();
    }
    reader.readAsDataURL(this.files[0]);
    initialize();
    //draw();
}



function draw(){
    r = 0;
    g = 0;
    b = 255;
    x = 0;
    context.clearRect(0,0,WIDTH, HEIGHT);
    /////////////////analyser.getByteFrequencyData(freqArr);
    analyser.getByteFrequencyData(freqArr);
    console.log(freqArr);

    for(var i = 0; i < 128; i++){
        //console.log(freqArr[i]);
        //console.log("draw loop " + i);
        //console.log(barHeight);
        if(songLoaded == 0){
            barHeight = HEIGHT;
        }
        else{
        barHeight = (Math.random() * HEIGHT);
        //barHeight = freqArr[i] % HEIGHT; //I NEED TO WRITE CODE TO UPDATE THE AUDIO VARIABLE AND FREQ ARR EVERY TIME A NEW SONG IS LOADED
        //barHeight = (barHeight + 1) % HEIGHT;
        }
        

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

        context.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; //rgb color cycle 
        //context.save();

        //context.fillStyle = "rgb(" + 50 + "," + 50 + "," + (100 + (100 - barHeight)) + ")"; //blue color gradient depending on height of bar

        //context.restore();
        context.fillRect(x, HEIGHT - barHeight, 6, barHeight);
        //context.fillRect(x,HEIGHT - barHeight/2, 6, barHeight);
        x = x + 8;
    }

    window.requestAnimationFrame(draw);
}