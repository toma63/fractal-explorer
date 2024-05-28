
// Get the canvas element and its context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let rMin = -2;
let rMax = 2;
let rDomainSize = rMax - rMin;

let iMin = -1.2;
let iMax = 1.2;
let iRangeSize = iMax - iMin;

let displayRatio = iRangeSize / rDomainSize;

// Set the width and height of the canvas
let canvasWidth = window.innerWidth - 100;
canvas.width = canvasWidth;
let canvasHeight = canvasWidth * displayRatio;
canvas.height = canvasHeight;

let rStep = rDomainSize / canvasWidth;
let iStep = iRangeSize / canvasHeight;

// Create an ImageData object
let imageData = ctx.createImageData(canvasWidth, canvasHeight);

// Function to set a pixel's color in the ImageData object
function setPixel(imageData, x, y, r, g, b, a) {
  let index = (x + y * imageData.width) * 4;
  imageData.data[index+0] = r;
  imageData.data[index+1] = g;
  imageData.data[index+2] = b;
  imageData.data[index+3] = a;
}

// helper function sums squares of real and imag
function sumSq(cnum) {
    return cnum.re * cnum.re + cnum.im * cnum.im;
}

// the the escape count for an iteration z = z^2 + c
function escapeCount(z = math.complex(0, 0), c = math.complex(0, 0), maxIterations = 1000) {
    let iterations = 1;
    while (iterations <= maxIterations && sumSq(z) < 4) {
        iterations++
        z = math.add(math.multiply(z, z), c);
    }
    return iterations;
}

// select a color based on iteration count
function colorMap(iterations) {
    if (iterations < 10) {
        return [0, 0, 30];
    } else if (iterations < 20) {
        return [15, 0, 35];
    } else if (iterations < 30) {
        return [30, 0, 80];
    } else if (iterations < 40) {
        return [90, 0, 255];
    } else if (iterations < 50) {
        return [0, 40, 255];
    } else if (iterations < 70) {
        return [0, 140, 255];
    } else if (iterations < 100) {
        return [0, 255, 230];
    } else if (iterations < 200) {
        return [50, 255, 0];
    } else if (iterations < 500) {
        return [255, 240, 0];
    } else if (iterations < 1000) {
        return [255, 155, 0];
    } else {
        return [0, 0, 0];
    }

}

// iterate in the complex plain window and color pixels
// based on the trajectory at each location

// For the Mandelbrot set, c is assigned for each pixel
function showMandelbrot() {
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasWidth; y++) {
            rbgTuple = colorMap(escapeCount(math.complex(0, 0), math.complex(rMin + x * rStep, iMin + y * iStep)));
            setPixel(imageData, x, y, ...rbgTuple, 255);
        }
    }
    // Render the ImageData object to the canvas
    ctx.putImageData(imageData, 0, 0); 
}

// For the Julia set, z is assigned for each pixel, c determines which set
function showJulia(c = math.complex(-0.79, 0.15)) {
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasWidth; y++) {
            rbgTuple = colorMap(escapeCount(math.complex(rMin + x * rStep, iMin + y * iStep), c));
            setPixel(imageData, x, y, ...rbgTuple, 255);
        }
    }
    // Render the ImageData object to the canvas
    ctx.putImageData(imageData, 0, 0); 
}

// get event position within a canvas
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    //console.log("x: " + x + ", y: " + y);
    return [x, y];
}

// get a selected box for zooming
let downX = 0;
let downY = 0;
canvas.addEventListener('mousedown', (event) => {
    let downXY = getCursorPosition(canvas, event);
    downX = downXY[0];
    downY = downXY[1];
});

let upX = 0;
let upY = 0;
canvas.addEventListener('mouseup', (event) => {
    let upXY = getCursorPosition(canvas, event);
    upX = upXY[0];
    upY = upXY[1];
    console.log(`box: ${downX}:${downY} ${upX}:${upY}`);
});

//showMandelbrot();
showJulia();

