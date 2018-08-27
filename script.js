var audio, canvas, context, audioctx, analyser, oscillator, freqArr, barHeight, source, colorSelect, canvasC, contextC, grd1, grd2;
var windowWidth, windowHeight;
var bigBars = 0;
var colorStyle = 0;
var pastIndex = 900;
var WIDTH = 1024;
var HEIGHT = 350;
var INTERVAL = 128;//256;
var SAMPLES = 2048;//4096;//1024;//512;//2048; //this is the main thing to change right now
var r = 0;
var g = 0;
var b = 255;
var x = 0;

//1. NEED TO FIX ISSUE OF ONLY BEING ABLE TO PLAY ONE SONG BEFORE THE PROGRAM CRASHES>> FIXED
//2. RESOLVE ISSUE OF SCALING THE BARS BASED ON MAX FREQUENCY>> BECOMES NON-ISSUE IF FFT SIZE IS SAME AS INTERVAL
//3. NEED TO ADD OPTION TO CHOOSE COLOR PALETTE>> DONE
//4. NEED TO ADD VOLUME SLIDER
//5. NEED TO ORGANIZE LAYOUT AND CSS
//6. NEED TO MAKE BACKGROUND EFFECTS
//7. MAYBE ADD SONGS TO QUEUE? SHUFFLE FROM FOLDER?

function initialize(){
    canvas = document.getElementById("cnv1"); //drawing the canvas
    context = canvas.getContext("2d");
    audio = document.getElementById("audio");
    colorSelect = document.getElementById("colorSelect");
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
    source = audioctx.createMediaElementSource(audio);    
    source.connect(analyser);
    source.connect(audioctx.destination); //from online help

    freqArr = new Uint8Array(analyser.frequencyBinCount);
    //analyser.getByteFrequencyData(freqArr);

    barHeight = HEIGHT;
    /////////////////////////////////////////////////////////////////////
    canvasC = document.getElementById("circlecnv"); 
    contextC = canvasC.getContext("2d");

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    canvasC.width = windowWidth;
    canvasC.height = windowHeight;
    
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
        /*source = audioctx.createMediaElementSource(audio);    
        source.connect(analyser);
        source.connect(audioctx.destination); //from online help*/
        //colorStyle = Math.round(Math.random() * 6); //random color palete if you switch songs
        //
        audio.play();
    }
    reader.readAsDataURL(this.files[0]);
    window.requestAnimationFrame(draw);
    //initialize();
    //draw();
}

function changeColor(){
    //var selection = colorSelect.value();
    if(colorSelect.selectedIndex == 0){
        colorStyle = 0;
    }
    else if(colorSelect.selectedIndex == 1){
        colorStyle = 1;
    }
    else if(colorSelect.selectedIndex == 2){
        colorStyle = 2;
    }
    else if(colorSelect.selectedIndex == 3){
        colorStyle = 3;
    }
    else if(colorSelect.selectedIndex == 4){
        colorStyle = 4;
    }
    else if(colorSelect.selectedIndex == 5){
        colorStyle = 5;
    }
    else{
        colorStyle = 6;
    }
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

function drawSides(){
    //grd1 = contextC.createLinearGradient(0,0,250 * (bigBars/16),0);
    //grd1 = contextC.createRadialGradient(windowWidth/2, windowHeight/2, windowWidth * (bigBars/1), windowWidth, windowHeight, windowWidth);
    grd1 = contextC.createRadialGradient(windowWidth/2, windowHeight/2, 800 - (bigBars*40), windowWidth/2, windowHeight/2, 2400);
    if(colorStyle == 0){
        grd1.addColorStop(1,"fuchsia");
        grd1.addColorStop(0,"black"); //ORIGINAL rgb color cycle 
    }
    else if(colorStyle == 1){
        grd1.addColorStop(1,"red");
        grd1.addColorStop(0,"black"); //red color gradient depending on height of bar
    }
    else if(colorStyle == 2){
        grd1.addColorStop(1,"orange");
        grd1.addColorStop(0,"black"); //orange color gradient depending on height of bar
    }
    else if(colorStyle == 3){
        grd1.addColorStop(1,"yellow");
        grd1.addColorStop(0,"black"); //yellow color gradient depending on height of bar
    }
    else if(colorStyle == 4){
        grd1.addColorStop(1,"LightGreen");
        grd1.addColorStop(0,"black"); //green color gradient depending on height of bar
    }
    else if(colorStyle == 5){
        grd1.addColorStop(1,"DodgerBlue");
        grd1.addColorStop(0,"black"); //blue color gradient depending on height of bar
    }
    else{
        grd1.addColorStop(1,"fuchsia");
        grd1.addColorStop(0,"black"); //purple color gradient depending on height of bar
    }

    contextC.fillStyle = grd1;

    //contextC.fillStyle = "rgb(" + 255 + "," + 255 + "," + 0 + ")";
    contextC.fillRect(0,0,windowWidth,windowHeight);
}

function draw(){
    if(!audio.paused){
        bigBars = 0;
        r = 0;
        g = 0;
        b = 255;
        x = 0;
        context.clearRect(0,0,WIDTH, HEIGHT);
        analyser.getByteFrequencyData(freqArr);
        //analyser.getByteTimeDomainData(freqArr);
        //console.log(freqArr);
        for(var i = 0; i < INTERVAL; i++){
            if(/*i <= 50 &&*/ barHeight >= 240){
                bigBars++;
            }
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
            //var num = (max - INTERVAL*Math.floor(max/INTERVAL)) + (Math.floor(max/INTERVAL)*i);
            var num = i;
            /*if(i >= INTERVAL/4){ //SKIPS MIDDLE FREQUENCIES
                num = i + (INTERVAL/2);
            }*/
            barHeight = ((freqArr[num] - 128) * 2) + 2;
            //barHeight = (freqArr[num] * 1) + 2; //original one used
            //barHeight = (Math.abs(freqArr[i*(WIDTH/INTERVAL)]) - 120) * 2 + 1; //for time 
            if(barHeight <= 1){
                barHeight = 2;
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

            //I SHOULD MAKE AN OPTION TO TOGGLE BETWEEN DIFFERENT COLOR PALETTES
            if(colorStyle == 0){
                context.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; //ORIGINAL rgb color cycle 
            }
            else if(colorStyle == 1){
                context.fillStyle = "rgb(" + ((2/3)*(barHeight)) + "," + (0*(barHeight)) + "," + (0*(barHeight)) + ")"; //red color gradient depending on height of bar
            }
            else if(colorStyle == 2){
                context.fillStyle = "rgb(" + (1*(barHeight)) + "," + (.6*(barHeight)) + "," + (0*(barHeight)) + ")"; //orange color gradient depending on height of bar
            }
            else if(colorStyle == 3){
                context.fillStyle = "rgb(" + (.95*(barHeight)) + "," + (.85*(barHeight)) + "," + (0*(barHeight)) + ")"; //yellow color gradient depending on height of bar
            }
            else if(colorStyle == 4){
                context.fillStyle = "rgb(" + (0*(barHeight)) + "," + ((2/3)*(barHeight)) + "," + (0*(barHeight)) + ")"; //green color gradient depending on height of bar
            }
            else if(colorStyle == 5){
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

    if(bigBars >= 1){
        drawSides();
    }
    else{
        contextC.clearRect(0,0,windowWidth,windowHeight);
    }
    window.requestAnimationFrame(draw); //OLD WAY
    //var fps = 30;
    //setTimeout(draw, 1000 / fps);
}