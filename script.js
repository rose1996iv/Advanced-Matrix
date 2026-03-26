// ============================================================
// ADVANCED MATRIX WALLPAPER SCRIPT — FULL OVERHAUL EDITION
// Features: Matrix Vision, Intro Sequence, 3D Parallax,
//           Audio Reactive, Mouse Interaction, Cyberpunk Clock,
//           Retro CRT, Glitch Effects, Gravity Reversal Bass
// ============================================================

var root = {
    matrixColor:       { r: 0, g: 255, b: 70 },
    rainbowMode:       false,
    rainbowSpeed:      50,
    bgType:            0,           // 0=Solid Black, 1=Image (normal), 2=Matrix Vision
    bgImageStr:        "images/watermark.png",
    bgOpacity:         30,
    charSetOption:     0,           // 0=custom, 1=binary, 2=kana
    customText:        "BawipaNaThaGottistgut神は善です神是良善的",
    parallax3D:        true,
    interactiveMouse:  true,
    audioReactive:     true,
    showClock:         true,
    matrixSpeed:       50,
    playIntro:         true,
    retroCRT:          true,
    glitchMode:        true,
    gravityBass:       true
};

var charSets = [
    root.customText,
    "01",
    "日ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ"
];

// DOM references
var c          = document.getElementById("c");
var ctx        = c.getContext("2d");
var sc         = document.getElementById("sample-canvas");  // used for Matrix Vision
var sctx       = sc.getContext("2d");
var bgDiv      = document.getElementById("bg");
var clockDiv   = document.getElementById("clock");
var introDiv   = document.getElementById("intro-text");
var containerDiv = document.getElementById("container");
var crtDiv     = document.getElementById("crt-overlay");

// State
var hue          = -0.01;
var audioLevel   = 0.0;
var mouseX       = -1000, mouseY = -1000;
var layers       = [];
var font_size    = 18;
var drawInterval;
var introActive  = true;
var mainLoopActive = false;
var gravityDir   = 1;       // 1 = down, -1 = up

// ─────────────────────────────────────────────
// MATRIX VISION — pixel-driven color sampling
// ─────────────────────────────────────────────
var visionImage    = null;
var visionPixelData = null;  // cached ImageData pixels for fast sampling

function loadVisionImage(src) {
    visionImage = new Image();
    visionImage.crossOrigin = "anonymous";
    visionImage.onload = function() {
        sc.width  = c.width  || window.innerWidth;
        sc.height = c.height || window.innerHeight;
        sctx.drawImage(visionImage, 0, 0, sc.width, sc.height);
        visionPixelData = sctx.getImageData(0, 0, sc.width, sc.height).data;
    };
    visionImage.src = src;
}

// Returns brightness 0-1 at canvas position (x,y)
function sampleBrightness(x, y) {
    if (!visionPixelData) return 1.0;
    var px = Math.max(0, Math.min(Math.round(x), sc.width  - 1));
    var py = Math.max(0, Math.min(Math.round(y), sc.height - 1));
    var idx = (py * sc.width + px) * 4;
    var r = visionPixelData[idx];
    var g = visionPixelData[idx + 1];
    var b = visionPixelData[idx + 2];
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;  // standard luminance
}

// ─────────────────────────────────────────────
// MOUSE
// ─────────────────────────────────────────────
document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (root.parallax3D && root.bgType === 1) {
        var panX = (e.clientX / window.innerWidth  - 0.5) * 20;
        var panY = (e.clientY / window.innerHeight - 0.5) * 20;
        bgDiv.style.transform = "translate(" + (-panX) + "px, " + (-panY) + "px)";
    } else {
        bgDiv.style.transform = "translate(0,0)";
    }
});

// ─────────────────────────────────────────────
// LAYER INIT
// ─────────────────────────────────────────────
function initMatrix() {
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    // Refresh sample canvas too (if vision mode)
    if (root.bgType === 2 && visionImage && visionImage.complete) {
        sc.width  = c.width;
        sc.height = c.height;
        sctx.drawImage(visionImage, 0, 0, sc.width, sc.height);
        visionPixelData = sctx.getImageData(0, 0, sc.width, sc.height).data;
    }
    layers = [];
    var layerCount = root.parallax3D ? 3 : 1;
    for (var i = 0; i < layerCount; i++) {
        var z    = root.parallax3D ? (0.6 + i * 0.4) : 1.0;
        var size = Math.floor(font_size * z);
        var cols = Math.ceil(c.width / size);
        var drops = [];
        for (var x = 0; x < cols; x++) drops[x] = Math.random() * -100;
        layers.push({ z: z, size: size, speedMultiplier: z, drops: drops });
    }
}

window.onresize = initMatrix;

// ─────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────
function updateClock() {
    if (!root.showClock || introActive) { clockDiv.style.display = 'none'; return; }
    clockDiv.style.display = 'block';
    var now = new Date();
    var h = String(now.getHours()).padStart(2,'0');
    var m = String(now.getMinutes()).padStart(2,'0');
    var s = String(now.getSeconds()).padStart(2,'0');
    clockDiv.innerText = h + ':' + m + ':' + s;
    var rc = root.matrixColor;
    clockDiv.style.textShadow = root.rainbowMode
        ? "0 0 20px #FFF"
        : "0 0 25px rgb(" + rc.r + "," + rc.g + "," + rc.b + ")";
}
setInterval(updateClock, 1000);

// ─────────────────────────────────────────────
// INTRO SEQUENCE — "Wake up, Joseph..."
// ─────────────────────────────────────────────
function startIntro() {
    mainLoopActive = false;
    ctx.clearRect(0, 0, c.width, c.height);
    introDiv.innerHTML = "";

    if (!root.playIntro) { introActive = false; startMatrix(); return; }

    introActive = true;
    clockDiv.style.display = 'none';

    var lines = [
        "Wake up, Joseph...",
        "",
        "The Matrix has you...",
        "",
        "Follow the white rabbit."
    ];
    var fullMsg   = lines.join("\n");
    var i         = 0;

    function typeChar() {
        if (!introActive) return;
        if (i < fullMsg.length) {
            var ch = fullMsg.charAt(i);
            introDiv.innerHTML += (ch === "\n") ? "<br>" : ch;
            i++;
            setTimeout(typeChar, Math.random() * 55 + 45);
        } else {
            setTimeout(function() {
                introDiv.innerHTML = "";
                introActive = false;
                startMatrix();
            }, 2800);
        }
    }
    typeChar();
}

function startMatrix() {
    initMatrix();
    mainLoopActive = true;
}

// ─────────────────────────────────────────────
// GLITCH
// ─────────────────────────────────────────────
setInterval(function() {
    if (!root.glitchMode || introActive) return;
    if (Math.random() > 0.88) {
        containerDiv.classList.add("glitched");
        setTimeout(function() { containerDiv.classList.remove("glitched"); },
            120 + Math.random() * 200);
    }
}, 2500);

// ─────────────────────────────────────────────
// AUDIO
// ─────────────────────────────────────────────
function livelyAudioListener(audioArray) {
    if (!root.audioReactive) return;
    var sum = 0;
    for (var i = 0; i < audioArray.length; i++) sum += audioArray[i];
    audioLevel = Math.min(1.0, sum / (audioArray.length * 0.5));
    if (root.gravityBass && audioLevel > 0.85) {
        gravityDir = -1;
    } else if (audioLevel < 0.3) {
        gravityDir = 1;
    }
}

// ─────────────────────────────────────────────
// DRAW
// ─────────────────────────────────────────────
function draw() {
    if (!mainLoopActive) return;

    // Fade the existing canvas content (transparent fade — no black boxes)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalCompositeOperation = 'source-over';

    var currentBass = root.audioReactive ? 1.0 + audioLevel * 3.0 : 1.0;
    if (root.rainbowMode) hue += 0.0001;

    var chars = charSets[root.charSetOption] || "01";
    var rc    = root.matrixColor;

    for (var l = 0; l < layers.length; l++) {
        var layer = layers[l];
        ctx.font      = "bold " + layer.size + "px 'Courier New', monospace";
        ctx.textAlign = "center";
        var mouseR = 150 * layer.z;

        for (var i = 0; i < layer.drops.length; i++) {
            var text     = chars.charAt(Math.floor(Math.random() * chars.length));
            var textPrev = chars.charAt(Math.floor(Math.random() * chars.length));

            var px    = i * layer.size + layer.size / 2;
            var py    = Math.floor(layer.drops[i])            * layer.size;
            var pyPrev= Math.floor(layer.drops[i] - gravityDir) * layer.size;

            ctx.shadowBlur = 0;

            // ── MATRIX VISION color: sample brightness from the image
            var alpha = 1.0;
            if (root.bgType === 2) {
                var bright = sampleBrightness(px, py);
                // bright areas → full color, dark areas → dimmer/hidden
                // Use brightness to modulate opacity so the image "shows through" the rain
                alpha = 0.15 + bright * 0.85;
            }

            // Compute base color
            if (root.rainbowMode) {
                var rr = Math.floor(127 * Math.sin(root.rainbowSpeed / 100 * hue + 0) + 128);
                var rg = Math.floor(127 * Math.sin(root.rainbowSpeed / 100 * hue + 2) + 128);
                var rb = Math.floor(127 * Math.sin(root.rainbowSpeed / 100 * hue + 4) + 128);
                ctx.fillStyle = "rgba(" + rr + "," + rg + "," + rb + "," + alpha + ")";
            } else {
                var br = Math.min(255, Math.floor(rc.r * currentBass));
                var bg = Math.min(255, Math.floor(rc.g * currentBass));
                var bb = Math.min(255, Math.floor(rc.b * currentBass));
                ctx.fillStyle = "rgba(" + br + "," + bg + "," + bb + "," + alpha + ")";
            }

            // Mouse dodge + glow
            if (root.interactiveMouse) {
                var dx   = px - mouseX, dy = py - mouseY;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseR) {
                    var push = (mouseR - dist) * 0.2;
                    px += (dx / dist) * push;
                    ctx.shadowBlur  = 18;
                    ctx.shadowColor = "#FFF";
                }
            } else if (root.audioReactive && currentBass > 1.2) {
                ctx.shadowBlur  = 10 * currentBass;
                ctx.shadowColor = ctx.fillStyle;
            }

            // Trail character
            ctx.fillText(textPrev, px, pyPrev);
            ctx.shadowBlur = 0;

            // Shimmering white head
            ctx.fillStyle   = "rgba(255,255,255," + alpha + ")";
            ctx.shadowBlur  = 10 + (root.audioReactive ? audioLevel * 15 : 0);
            ctx.shadowColor = "#FFF";
            ctx.fillText(text, px, py);
            ctx.shadowBlur  = 0;

            // Advance drop
            var step = layer.speedMultiplier * gravityDir;
            if (root.audioReactive) step += audioLevel * 2.0 * gravityDir;
            layer.drops[i] += step;

            // Recycle
            if (gravityDir > 0) {
                if (py > c.height && Math.random() > 0.95) layer.drops[i] = 0;
            } else {
                if (py < 0          && Math.random() > 0.95) layer.drops[i] = c.height / layer.size;
            }
        }
    }
}

// ─────────────────────────────────────────────
// BACKGROUND UPDATE
// ─────────────────────────────────────────────
function updateBg() {
    if (root.bgType === 1 && root.bgImageStr) {
        // Normal background image
        bgDiv.style.backgroundImage = "url('" + root.bgImageStr.replace(/\\/g, "/") + "')";
        bgDiv.style.opacity         = root.bgOpacity / 100;
        document.body.style.background = "#000";
    } else if (root.bgType === 2 && root.bgImageStr) {
        // Matrix Vision — load into hidden sample canvas; background stays black
        bgDiv.style.backgroundImage = "none";
        bgDiv.style.opacity = 0;
        document.body.style.background = "#000";
        loadVisionImage(root.bgImageStr.replace(/\\/g, "/"));
    } else {
        // Solid black
        bgDiv.style.backgroundImage = "none";
        bgDiv.style.opacity = 0;
        document.body.style.background = "#000";
    }
}

// ─────────────────────────────────────────────
// LIVELY CALLBACKS
// ─────────────────────────────────────────────
function livelyPropertyListener(name, val) {
    switch (name) {
        case "matrixColor":
            var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
            if (res) root.matrixColor = { r: parseInt(res[1],16), g: parseInt(res[2],16), b: parseInt(res[3],16) };
            break;
        case "rainbowMode":       root.rainbowMode      = val; break;
        case "rainbowSpeed":      root.rainbowSpeed     = val; break;
        case "bgType":            root.bgType           = val; updateBg(); break;
        case "bgImageStr":        root.bgImageStr       = val; updateBg(); break;
        case "bgOpacity":         root.bgOpacity        = val; updateBg(); break;
        case "charSet":           root.charSetOption    = val; charSets[0] = root.customText; break;
        case "customText":        root.customText       = val; charSets[0] = val; break;
        case "parallax3D":        root.parallax3D       = val; if (mainLoopActive) initMatrix(); break;
        case "interactiveMouse":  root.interactiveMouse = val; break;
        case "audioReactive":     root.audioReactive    = val; break;
        case "showClock":         root.showClock        = val; updateClock(); break;
        case "matrixSpeed":
            root.matrixSpeed = val;
            if (drawInterval) clearInterval(drawInterval);
            drawInterval = setInterval(draw, root.matrixSpeed);
            break;
        case "retroCRT":
            root.retroCRT = val;
            crtDiv.style.display = val ? 'block' : 'none';
            break;
        case "playIntro":
            root.playIntro = val;
            if (!val && introActive) { introActive = false; introDiv.innerHTML = ""; startMatrix(); }
            break;
        case "glitchMode":  root.glitchMode  = val; break;
        case "gravityBass": root.gravityBass = val; break;
    }
}

// ─────────────────────────────────────────────
// IGNITION 🚀
// ─────────────────────────────────────────────
updateBg();
crtDiv.style.display = root.retroCRT ? 'block' : 'none';
startIntro();   // plays intro → then startMatrix() automatically
drawInterval = setInterval(draw, root.matrixSpeed);
