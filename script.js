var audio, canvas, context, audioctx, analyser, source, freqArr, barHeight;
var WIDTH = 1024;
var HEIGHT = 100;
var r = 0;
var g = 0;
var b = 255;
var x = 0;

function initialize(){
    canvas = document.getElementById("cnv1"); //drawing the canvas
    context = canvas.getContext("2d");
    audio = document.getElementById("audio");

    audioctx = new AudioContext(); //setting up audio analyzer to get frequency info
    analyser = audioctx.createAnalyser();

    source = audioctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioctx.destination);

    freqArr = new Uint8Array(analyser.frequencyBinCount);

    //draw();
    window.requestAnimationFrame(draw);
}

audioFile.onchange = function(){ //plays the user's uploaded audio file when it is uploaded
    audio = document.getElementById("audio");
    var reader = new FileReader();
    reader.onload = function(e){
        audio.src = this.result;
        audio.controls = true;
        audio.play();
    }
    reader.readAsDataURL(this.files[0]);
    //draw();
}

function draw(){
    r = 0;
    g = 0;
    b = 255;
    x = 0;
    context.clearRect(0,0,WIDTH, HEIGHT);
    analyser.getByteFrequencyData(freqArr);
    //console.log(freqArr.length);

    for(var i = 0; i < 128; i++){
        //console.log(freqArr[i]);
        //console.log("draw loop " + i);
        barHeight = (Math.random() * 99);
        //console.log(barHeight);
        //barHeight = freqArr[i] % 99; //I NEED TO WRITE CODE TO UPDATE THE AUDIO VARIABLE AND FREQ ARR EVERY TIME A NEW SONG IS LOADED

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
        context.fillRect(x,0 + barHeight, 6, 100 - barHeight); //random bar height
        //context.fillRect(x,HEIGHT - barHeight/2, 6, barHeight);
        x = x + 8;
    }

    window.requestAnimationFrame(draw);
}