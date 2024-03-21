var imgs = [];
var avgImg;
var finalImg;
var numOfImages = 30;
var imageIndex = 0;
var loadCounter;
var mouseXValue = 1;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    //step 1
    loadCounter = 0;
    for (var i = 0; i < numOfImages; i++) {
        var fileName = "assets/" + i + ".jpg";
        img = loadImage(fileName, imageloadSuccess);    
        imgs.push(img)
  }
}
function imageloadSuccess(){
    //step 1a
    loadCounter++
}
//////////////////////////////////////////////////////////
function setup() {
    //step 2  create a canvas twice the width of the first image in the array, and equal to the first image’s height.
    let c = createCanvas(2*imgs[0].width, imgs[0].height);
    pixelDensity(1);
    //step 3  initialise the avgImg variable
    avgImg = createGraphics(imgs[0].width, imgs[0].height);
    
    
     varText = createDiv("LEFT ARROW - previous image<br/>\  RIGHT ARROW - next image<br>\
                     PRESS R - RANDOM image<br/>\
                      ");
    varText.style('font-size', '16px');
    
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    
    //step 1b - using console log to check if the image files is loaded correctly
    if(loadCounter != numOfImages){
        console.log('Not Ready!');
    }
    console.log('All images loaded, ready for average faces');
    
    // left image
    image(imgs[imageIndex], 0, 0);

        //Step 4 -  use a for loop to call the loadPixels() command on all images within imgs. Also call loadPixels() on the avgImg variable.
        for(var i = 0; i < imgs.length; ++i) {
            imgs[i].loadPixels();
        }
        avgImg.loadPixels();
    
        mouseXvalue = map(mouseX, 0 , width, 0, 1);
        
         //Step 5a -  Create a nested for-loop looping over all pixels on the first image in the array
        for(var x = 0; x < avgImg.width; ++x) {
            for(var y = 0; y < avgImg.height; ++y){
                var pixelIndex = ((avgImg.width * y) + x) * 4;
                
                //Step 6a - init the variable sumR, sumG, sumB to 0
                var sumR = 0;
                var sumG = 0;
                var sumB = 0;
                
                //step 6b - looping through all the images in the imgs array and for each channel add its value to the corresponding sum variable.
                for(var j = 0; j < imgs.length; ++j){
                    var img = imgs[j];
                    sumR += img.pixels[pixelIndex + 0];
                    sumG += img.pixels[pixelIndex + 1];
                    sumB += img.pixels[pixelIndex + 2];
                }
                
                var leftR = imgs[imageIndex].pixels[pixelIndex];
                var leftG = imgs[imageIndex].pixels[pixelIndex + 1];
                var leftB = imgs[imageIndex].pixels[pixelIndex + 2];
                
                var lerpR = lerp(sumR / imgs.length, leftR, mouseXValue);
                var lerpG = lerp(sumG / imgs.length, leftG, mouseXValue);
                var lerpB = lerp(sumB / imgs.length, leftB, mouseXValue);

                avgImg.pixels[pixelIndex + 0] = lerpR;
                avgImg.pixels[pixelIndex + 1] = lerpG;
                avgImg.pixels[pixelIndex + 2] = lerpB;
                avgImg.pixels[pixelIndex + 3] = 255;

            }
        }
        //step 5b - update the pixels of the avgImg 
        avgImg.updatePixels();
    
    // right image
    image(avgImg, imgs[0].width, 0);
    

    
    //step 5c -  add a noLoop() at the end of the draw() function
    noLoop(); 
    
    fill(0,0,0);
    textSize(20);
    text("Original Image", 10, 50);
    
    fill(0,0,0);
    textSize(20);
    text("Average Image", 515, 50);
}

//further development - change the left image 
function keyPressed() {
    // press left arrow key to go to previous image
    if (keyCode === LEFT_ARROW) {
        imageIndex--;
        if(imageIndex < 0){
            imageIndex = 29;
        }
        redraw();
    } 
    // press right arrow key to go to next image
    if (keyCode === RIGHT_ARROW) {
        imageIndex++;
        if(imageIndex > 29){
            imageIndex = 0;
        }
        redraw();
    }
       // press r key for a random image
    if (key === 'r'){
        imageIndex = int(random(0, 29));
        redraw();
    }
    
    return false; 
}

//further development - pixel values of the second image transition between the randomly selected image and the average image based on the mouseX value
function mouseMoved() {
    //redraw based on mouseX value
    if(mouseX >= width/2 && mouseX <= width && mouseY < avgImg.height){
        mouseXValue = map(mouseX, 0, width, 1, 0);
        redraw();
    }
    loop();
}