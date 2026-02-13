let handX = 0;
let handY = 0;
let angle = 0;
let treeHeight = 150;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Setup MediaPipe Hands
    const videoElement = document.getElementById('input_video');
    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 640,
        height: 480
    });
    camera.start();
}

function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Track the tip of the Index Finger (Landmark 8)
        const indexTip = results.multiHandLandmarks[0][8];
        handX = indexTip.x * width;
        handY = indexTip.y * height;
        
        // Map hand movement to Tree variables
        angle = map(handX, 0, width, 0, PI / 2); // Branch angle
        treeHeight = map(handY, height, 0, 50, 250); // Tree height
    }
}

function draw() {
    background(15, 15, 15);
    stroke(0, 255, 150);
    strokeWeight(2);
    
    // Start drawing from the bottom-center
    translate(width / 2, height);
    branch(treeHeight);
}

// Recursive function to draw the tree
function branch(len) {
    line(0, 0, 0, -len);
    translate(0, -len);
    
    if (len > 4) {
        push();
        rotate(angle);
        branch(len * 0.67);
        pop();
        
        push();
        rotate(-angle);
        branch(len * 0.67);
        pop();
    }
}
