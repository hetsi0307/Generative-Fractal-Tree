let handX = 0, handY = 0, angle = 0, treeHeight = 150;
let isVideoStarted = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    const startBtn = document.getElementById('start-btn');
    const statusText = document.getElementById('status');
    const uiContainer = document.getElementById('ui-container');

    // Setup MediaPipe
    const videoElement = document.getElementById('input_video');
    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 640,
        height: 480
    });

    // Ask for permission ONLY when button is clicked
    startBtn.addEventListener('click', () => {
        statusText.innerText = "Requesting Camera...";
        camera.start()
            .then(() => {
                isVideoStarted = true;
                uiContainer.style.display = "none"; // Hide UI once started
            })
            .catch(err => {
                statusText.innerText = "Error: Camera denied or not found.";
                console.error(err);
            });
    });
}

function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const indexTip = results.multiHandLandmarks[0][8];
        // Smoothly interpolate hand movement
        handX = lerp(handX, indexTip.x * width, 0.1);
        handY = lerp(handY, indexTip.y * height, 0.1);
        
        angle = map(handX, 0, width, 0, PI / 2);
        treeHeight = map(handY, height, 0, 50, 250);
    }
}

function draw() {
    background(10, 10, 10);
    
    if (!isVideoStarted) return; // Don't draw until camera is on

    stroke(0, 255, 150);
    strokeWeight(2);
    translate(width / 2, height - 50);
    branch(treeHeight);
}

function branch(len) {
    line(0, 0, 0, -len);
    translate(0, -len);
    if (len > 5) {
        push();
        rotate(angle);
        branch(len * 0.7);
        pop();
        push();
        rotate(-angle);
        branch(len * 0.7);
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
