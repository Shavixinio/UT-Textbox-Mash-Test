const keysPerSecond = document.getElementById("key-counter");
const textBoxesPerSecond = document.getElementById("textbox-counter");

let keyCount = 0;
let textboxCount = 0;
let lastSecond = Date.now();
let lastKeyPress = Date.now();
let lastTextboxTime = Date.now();
let waitingForX = false;
const UPDATE_INTERVAL = 0.2;

// Track total textboxes over a 1-second window
let textboxWindow = [];

function updateCounter() {
    const currentTime = Date.now();
    const timeSinceLastKey = (currentTime - lastKeyPress) / 1000;
    const timeSinceLastTextbox = (currentTime - lastTextboxTime) / 1000;
    
    // Clean up textbox window (remove entries older than 1 second)
    const oneSecondAgo = currentTime - 1000;
    textboxWindow = textboxWindow.filter(time => time > oneSecondAgo);
    
    if (timeSinceLastKey >= 1) {
        keysPerSecond.textContent = `Keys/s: 0.00`;
    }
    if (timeSinceLastTextbox >= 1) {
        textBoxesPerSecond.textContent = `Textboxes/s: 0.00`;
    }

    const deltaTime = (currentTime - lastSecond) / 1000;
    if (deltaTime >= UPDATE_INTERVAL) {
        const keyRate = keyCount / deltaTime;
        const textboxRate = textboxWindow.length; // Use actual count over last second
        
        keysPerSecond.textContent = `Keys/s: ${keyRate.toFixed(2)}`;
        textBoxesPerSecond.textContent = `Textboxes/s: ${textboxRate.toFixed(2)}`;
        
        keyCount = 0;
        lastSecond = currentTime;
    }
}

document.addEventListener('keydown', (event) => {
    keyCount++;
    lastKeyPress = Date.now();

    if (event.key.toLowerCase() === 'z' || event.key === 'Enter') {
        waitingForX = true;
    } else if ((event.key.toLowerCase() === 'x' || event.key === 'Shift') && waitingForX) {
        textboxWindow.push(Date.now());
        lastTextboxTime = Date.now();
        waitingForX = false;
    } else {
        waitingForX = false;
    }
});

setInterval(updateCounter, 100);