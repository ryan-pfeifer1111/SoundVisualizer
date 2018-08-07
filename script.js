var audio, canvas, context, audioctx, analyser, oscillator, freqArr, barHeight, source;
var rand = 0;
var pastIndex = 900;
var WIDTH = 1024;
var HEIGHT = 300;
var INTERVAL = 128;
var SAMPLES = 2048;
var r = 0;
var g = 0;
var b = 255;
var x = 0;

//1. NEED TO FIX ISSUE OF ONLY BEING ABLE TO PLAY ONE SONG BEFORE THE PROGRAM CRASHES
//2. NEED TO ADD OPTION TO CHOOSE COLOR PALETTE
//3. NEED TO ADD VOLUME SLIDER
//4. NEED TO MAKE BACKGROUND EFFECTS
//5. MAYBE ADD SONGS TO QUEUE? SHUFFLE FROM FOLDER?

function initialize(){
    canvas = document.getElementById("cnv1"); //drawing the canvas
    context = canvas.getContext("2d");
    audio = document.getElementById("audio");
    //audio.src = document.getElementById("audioFile");

    audioctx = new AudioContext(); //setting up audio analyzer to get frequency info
    analyser = audioctx.createAnalyser();
    analyser.fftSize = SAMPLES;
    
    oscillator = audioctx.createOscillator();
    oscillator.connect(audioctx.destination);

    //source = audioctx.createMediaElementSource(audio);
    //source.connect(analyser);
    //source.connect(audioctx.destination);
    //analyser.connect(audioctx.destination); //THIS WAS MAKING MY MUSIC NOT PLAY

    //source = audioctx.createMediaElementSource(audio);    
    //source.connect(analyser);
    //source.connect(audioctx.destination); //from online help

    ////var buffer = audioctx.createBufferSource();

    freqArr = new Uint8Array(analyser.frequencyBinCount);
    //analyser.getByteFrequencyData(freqArr);

    barHeight = HEIGHT;
    
    //draw();
    window.requestAnimationFrame(draw);
}

audioFile.onchange = function(){ //plays the user's uploaded audio file when it is uploaded
    audio = document.getElementById("audio");
    var reader = new FileReader();
    reader.onload = function(e){
        audio.src = this.result;
        audio.controls = true;
        audio.crossOrigin = "anonymous";
        //
        source = audioctx.createMediaElementSource(audio);    
        source.connect(analyser);
        source.connect(audioctx.destination); //from online help
        rand = Math.round(Math.random() * 6); //random color palete if you switch songs
        //
        audio.play();
    }
    reader.readAsDataURL(this.files[0]);
    initialize();
    //draw();
}

function maxIndex(arr){ //finds the highest-numbered index with a nonzero value
    var maxIndex = 0;
    for(var i = 1; i < arr.length; i++){
        if(arr[i] != 0){
            maxIndex = i;
        }
    }
    return maxIndex;
}



function draw(){
    if(!audio.paused){
        r = 0;
        g = 0;
        b = 255;
        x = 0;
        context.clearRect(0,0,WIDTH, HEIGHT);
        analyser.getByteFrequencyData(freqArr);
        //analyser.getByteTimeDomainData(freqArr);
        //console.log(freqArr);
        for(var i = 0; i < INTERVAL; i++){
            //barHeight = (Math.random() * HEIGHT);
            /*
            var max = maxIndex(freqArr);
            //console.log(max);
            if(Math.abs(max - pastIndex) >= 300){
                pastIndex = max;
            }
            else{
                max = pastIndex;
            }   //not sure if this really give a great effect
            //console.log(max);
            */
            max = 900; //default placeholder
            var num = (max - INTERVAL*Math.floor(max/INTERVAL)) + (Math.floor(max/INTERVAL)*i);

            barHeight = (freqArr[num] * (4/3)) + 2; //exaggerate the bar

            //for frequency
            //barHeight = (Math.abs(freqArr[i*(WIDTH/INTERVAL)]) - 120) * 2 + 1; //for time 
            

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

            //I SHOULD MAKE AN OPTION TO TOGGLE BETWEEN DIFFERENT COLOR PALETTES
            if(rand == 0){
                context.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; //ORIGINAL rgb color cycle 
            }
            else if(rand == 1){
                context.fillStyle = "rgb(" + ((2/3)*(barHeight)) + "," + (0*(barHeight)) + "," + (0*(barHeight)) + ")"; //red color gradient depending on height of bar
            }
            else if(rand == 2){
                context.fillStyle = "rgb(" + (1*(barHeight)) + "," + (.6*(barHeight)) + "," + (0*(barHeight)) + ")"; //orange color gradient depending on height of bar
            }
            else if(rand == 3){
                context.fillStyle = "rgb(" + (.95*(barHeight)) + "," + (.85*(barHeight)) + "," + (0*(barHeight)) + ")"; //yellow color gradient depending on height of bar
            }
            else if(rand == 4){
                context.fillStyle = "rgb(" + (0*(barHeight)) + "," + ((2/3)*(barHeight)) + "," + (0*(barHeight)) + ")"; //green color gradient depending on height of bar
            }
            else if(rand == 5){
                context.fillStyle = "rgb(" + (.58*(barHeight/10)) + "," + (0*(barHeight)) + "," + (1*(barHeight)) + ")"; //blue color gradient depending on height of bar
            }
            else{
                context.fillStyle = "rgb(" + (1*(barHeight)) + "," + (0*(barHeight)) + "," + (1*(barHeight)) + ")"; //purple color gradient depending on height of bar
            }


            //context.restore();
            context.fillRect(x, HEIGHT - barHeight, (WIDTH/INTERVAL) - 1 , barHeight);
            //context.fillRect(x,HEIGHT - barHeight/2, 6, barHeight);
            x = x + (WIDTH/INTERVAL);
        }
    }

    window.requestAnimationFrame(draw); //OLD WAY
    //var fps = 30;
    //setTimeout(draw, 1000 / fps);
}