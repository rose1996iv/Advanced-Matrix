// ============================================================
// ADVANCED MATRIX WALLPAPER — ULTIMATE EDITION
// Features: Matrix Vision, Webcam Vision, Click Ripple,
//           Hacker Terminal Console, Intro Sequence,
//           3D Parallax, Audio Reactive, Mouse Interaction,
//           Cyberpunk Clock, Retro CRT, Glitch, Gravity Bass
// ============================================================

var root = {
    matrixColor:      { r: 0, g: 255, b: 70 },
    rainbowMode:      false,
    rainbowSpeed:     50,
    bgType:           0,        // 0=Black, 1=Image, 2=MatrixVision, 3=WebcamVision
    bgImageStr:       "images/watermark.png",
    bgOpacity:        30,
    charSetOption:    0,        // 0=custom, 1=binary, 2=kana
    customText:       "BawipaNaThaGottistgut神は善です神是良善的",
    parallax3D:       true,
    interactiveMouse: true,
    audioReactive:    true,
    showClock:        true,
    matrixSpeed:      50,
    playIntro:        true,
    retroCRT:         true,
    glitchMode:       true,
    gravityBass:      true,
    hackerTerminal:   true,     // NEW
    clickRipple:      true,     // NEW
    webcamVision:     false     // NEW (enabled via setting)
};

var charSets = [
    root.customText,
    "01",
    "日ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ"
];

// ── DOM references ──────────────────────────────────────────
var c           = document.getElementById("c");
var ctx         = c.getContext("2d");
var rc          = document.getElementById("ripple-canvas");
var rctx        = rc.getContext("2d");
var sc          = document.getElementById("sample-canvas");
var sctx        = sc.getContext("2d");
var webcamVid   = document.getElementById("webcam-feed");
var bgDiv       = document.getElementById("bg");
var clockDiv    = document.getElementById("clock");
var introDiv    = document.getElementById("intro-text");
var containerDiv= document.getElementById("container");
var crtDiv      = document.getElementById("crt-overlay");
var termDiv     = document.getElementById("terminal");
var termLog     = document.getElementById("terminal-log");

// ── State ────────────────────────────────────────────────────
var hue           = -0.01;
var audioLevel    = 0.0;
var mouseX        = -1000, mouseY = -1000;
var layers        = [];
var font_size     = 18;
var drawInterval;
var introActive   = true;
var mainLoopActive= false;
var gravityDir    = 1;
var visionPixelData = null;
var webcamActive  = false;
var ripples       = [];     // active ripple objects

// ═══════════════════════════════════════════════════════════
// 1. CLICK RIPPLE
// ═══════════════════════════════════════════════════════════
document.addEventListener("click", function(e) {
    if (!root.clickRipple || introActive) return;
    var col = root.rainbowMode
        ? "#FFF"
        : "rgb(" + root.matrixColor.r + "," + root.matrixColor.g + "," + root.matrixColor.b + ")";
    ripples.push({ x: e.clientX, y: e.clientY, r: 0, maxR: 220, alpha: 0.9, color: col });
});

function drawRipples() {
    rctx.clearRect(0, 0, rc.width, rc.height);
    for (var i = ripples.length - 1; i >= 0; i--) {
        var rp = ripples[i];
        rp.r     += 8;
        rp.alpha -= 0.022;

        if (rp.alpha <= 0 || rp.r >= rp.maxR) { ripples.splice(i, 1); continue; }

        // Outer ring
        rctx.beginPath();
        rctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        rctx.strokeStyle = rp.color.replace("rgb", "rgba").replace(")", "," + rp.alpha + ")");
        rctx.lineWidth   = 2.5;
        rctx.shadowBlur  = 18;
        rctx.shadowColor = rp.color;
        rctx.stroke();
        rctx.shadowBlur  = 0;

        // Inner fill pulse
        rctx.beginPath();
        rctx.arc(rp.x, rp.y, rp.r * 0.35, 0, Math.PI * 2);
        rctx.fillStyle = rp.color.replace("rgb", "rgba").replace(")", "," + (rp.alpha * 0.18) + ")");
        rctx.fill();

        // Matrix characters exploding outward from click
        var charCount = 10;
        var chars = charSets[root.charSetOption] || "01";
        rctx.font = "bold 14px 'Courier New', monospace";
        rctx.textAlign = "center";
        for (var j = 0; j < charCount; j++) {
            var angle = (j / charCount) * Math.PI * 2;
            var cx2   = rp.x + Math.cos(angle) * rp.r;
            var cy2   = rp.y + Math.sin(angle) * rp.r;
            rctx.fillStyle   = rp.color.replace("rgb", "rgba").replace(")", "," + rp.alpha + ")");
            rctx.shadowBlur  = 10;
            rctx.shadowColor = rp.color;
            rctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), cx2, cy2);
            rctx.shadowBlur  = 0;
        }
    }
}

// ═══════════════════════════════════════════════════════════
// 2. HACKER TERMINAL
// ═══════════════════════════════════════════════════════════
var termLines = [
    { t: "ok",   m: "Establishing encrypted tunnel..." },
    { t: "ok",   m: "SSH handshake complete [AES-256-GCM]" },
    { t: "warn", m: "Anomaly detected in sector 0x4F3A" },
    { t: "ok",   m: "Bypassing firewall layer 1/3..." },
    { t: "ok",   m: "Bypassing firewall layer 2/3..." },
    { t: "ok",   m: "Bypassing firewall layer 3/3... DONE" },
    { t: "ok",   m: "Injecting payload to mainframe node" },
    { t: "warn", m: "ICE counter-intrusion detected — evading" },
    { t: "err",  m: "ERR: Trace attempt from 192.168.0.1" },
    { t: "ok",   m: "Trace neutralized. Ghost routing enabled." },
    { t: "ok",   m: "Root access granted to CORE_SYSTEM" },
    { t: "ok",   m: "Downloading encrypted archive [████████ 100%]" },
    { t: "warn", m: "WARNING: Sentinel patrol nearby" },
    { t: "ok",   m: "Uplink stable. Bandwidth: 9.4 Gbps" },
    { t: "ok",   m: "All systems nominal. Matrix synchronised." },
    { t: "err",  m: "ERR: Reality.dll has stopped responding" },
    { t: "ok",   m: "Patching consciousness_bridge.sys..." },
    { t: "ok",   m: "Kernel recompile complete. Iteration #4096" },
    { t: "warn", m: "There is no spoon." },
    { t: "ok",   m: "Wake up, Joseph. The Matrix has you..." }
];
var termIdx = 0;

function addTermLine() {
    if (!root.hackerTerminal || introActive) return;
    var entry = termLines[termIdx % termLines.length];
    termIdx++;

    var d = document.createElement("div");
    d.className = "t-line " + entry.t;
    d.innerText  = "[" + new Date().toLocaleTimeString() + "] " + entry.m;
    termLog.appendChild(d);

    // Keep max 7 lines visible
    while (termLog.children.length > 7) termLog.removeChild(termLog.firstChild);
}

function startTerminal() {
    termDiv.style.display = root.hackerTerminal ? 'block' : 'none';
    if (!root.hackerTerminal) return;
    addTermLine();
    setInterval(addTermLine, 1800 + Math.random() * 1200);
}

// ═══════════════════════════════════════════════════════════
// 3. MATRIX VISION — image pixel sampling
// ═══════════════════════════════════════════════════════════
var visionImage = null;

function loadVisionImage(src) {
    visionImage = new Image();
    visionImage.crossOrigin = "anonymous";
    visionImage.onload = function() {
        sc.width = c.width || window.innerWidth;
        sc.height= c.height|| window.innerHeight;
        sctx.drawImage(visionImage, 0, 0, sc.width, sc.height);
        visionPixelData = sctx.getImageData(0, 0, sc.width, sc.height).data;
    };
    visionImage.src = src;
}

function sampleBrightness(x, y, pixelArr, w, h) {
    if (!pixelArr) return 1.0;
    var px  = Math.max(0, Math.min(Math.round(x), w - 1));
    var py  = Math.max(0, Math.min(Math.round(y), h - 1));
    var idx = (py * w + px) * 4;
    return (0.299 * pixelArr[idx] + 0.587 * pixelArr[idx+1] + 0.114 * pixelArr[idx+2]) / 255;
}

// ═══════════════════════════════════════════════════════════
// 4. WEBCAM VISION
// ═══════════════════════════════════════════════════════════
function startWebcam() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            webcamVid.srcObject = stream;
            webcamActive = true;
        })
        .catch(function() {
            webcamActive = false;
        });
}

function stopWebcam() {
    if (webcamVid.srcObject) {
        webcamVid.srcObject.getTracks().forEach(function(t) { t.stop(); });
        webcamVid.srcObject = null;
    }
    webcamActive = false;
}

// Sample from webcam frame into sc (re-use hidden canvas)
function refreshWebcamSample() {
    if (!webcamActive || !webcamVid.videoWidth) return;
    sc.width  = c.width;
    sc.height = c.height;
    // Mirror horizontally for natural webcam feel
    sctx.save();
    sctx.translate(sc.width, 0);
    sctx.scale(-1, 1);
    sctx.drawImage(webcamVid, 0, 0, sc.width, sc.height);
    sctx.restore();
    visionPixelData = sctx.getImageData(0, 0, sc.width, sc.height).data;
}

// ═══════════════════════════════════════════════════════════
// MOUSE
// ═══════════════════════════════════════════════════════════
document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX; mouseY = e.clientY;
    if (root.parallax3D && root.bgType === 1) {
        var panX = (e.clientX / window.innerWidth  - 0.5) * 20;
        var panY = (e.clientY / window.innerHeight - 0.5) * 20;
        bgDiv.style.transform = "translate(" + (-panX) + "px," + (-panY) + "px)";
    } else bgDiv.style.transform = "";
});

// ═══════════════════════════════════════════════════════════
// LAYER INIT
// ═══════════════════════════════════════════════════════════
function initMatrix() {
    c.width  = rc.width  = window.innerWidth;
    c.height = rc.height = window.innerHeight;
    layers = [];
    var lc = root.parallax3D ? 3 : 1;
    for (var i = 0; i < lc; i++) {
        var z    = root.parallax3D ? (0.6 + i * 0.4) : 1.0;
        var sz   = Math.floor(font_size * z);
        var cols = Math.ceil(c.width / sz);
        var drops= [];
        for (var x = 0; x < cols; x++) drops[x] = Math.random() * -100;
        layers.push({ z: z, size: sz, speedMultiplier: z, drops: drops });
    }
    // Re-draw vision image at new size
    if (root.bgType === 2 && visionImage && visionImage.complete) loadVisionImage(visionImage.src);
}
window.onresize = initMatrix;

// ═══════════════════════════════════════════════════════════
// CLOCK
// ═══════════════════════════════════════════════════════════
function updateClock() {
    if (!root.showClock || introActive) { clockDiv.style.display = 'none'; return; }
    clockDiv.style.display = 'block';
    var now = new Date();
    clockDiv.innerText = String(now.getHours()).padStart(2,'0') + ':' +
                         String(now.getMinutes()).padStart(2,'0') + ':' +
                         String(now.getSeconds()).padStart(2,'0');
    var mc = root.matrixColor;
    clockDiv.style.textShadow = root.rainbowMode
        ? "0 0 20px #FFF"
        : "0 0 25px rgb("+mc.r+","+mc.g+","+mc.b+")";
}
setInterval(updateClock, 1000);

// ═══════════════════════════════════════════════════════════
// INTRO SEQUENCE
// ═══════════════════════════════════════════════════════════
function startIntro() {
    mainLoopActive = false;
    ctx.clearRect(0,0,c.width,c.height);
    introDiv.innerHTML = "";
    if (!root.playIntro) { introActive = false; startMatrix(); return; }

    introActive = true; clockDiv.style.display = 'none';
    var fullMsg = "Wake up, Joseph...\n\nThe Matrix has you...\n\nFollow the white rabbit.";
    var i = 0;
    function typeChar() {
        if (!introActive) return;
        if (i < fullMsg.length) {
            var ch = fullMsg.charAt(i);
            introDiv.innerHTML += ch === "\n" ? "<br>" : ch;
            i++; setTimeout(typeChar, Math.random() * 55 + 45);
        } else {
            setTimeout(function() {
                introDiv.innerHTML = ""; introActive = false; startMatrix();
            }, 2800);
        }
    }
    typeChar();
}

function startMatrix() { initMatrix(); mainLoopActive = true; }

// ═══════════════════════════════════════════════════════════
// GLITCH
// ═══════════════════════════════════════════════════════════
setInterval(function() {
    if (!root.glitchMode || introActive) return;
    if (Math.random() > 0.88) {
        containerDiv.classList.add("glitched");
        setTimeout(function() { containerDiv.classList.remove("glitched"); }, 120 + Math.random() * 200);
    }
}, 2500);

// ═══════════════════════════════════════════════════════════
// AUDIO
// ═══════════════════════════════════════════════════════════
function livelyAudioListener(audioArray) {
    if (!root.audioReactive) return;
    var sum = 0;
    for (var i = 0; i < audioArray.length; i++) sum += audioArray[i];
    audioLevel = Math.min(1.0, sum / (audioArray.length * 0.5));
    if (root.gravityBass && audioLevel > 0.85) gravityDir = -1;
    else if (audioLevel < 0.3) gravityDir = 1;
}

// ═══════════════════════════════════════════════════════════
// DRAW
// ═══════════════════════════════════════════════════════════
var webcamRefreshTick = 0;

function draw() {
    if (!mainLoopActive) return;

    // Webcam: refresh pixel sample every 3 frames
    if (root.bgType === 3) {
        webcamRefreshTick++;
        if (webcamRefreshTick % 3 === 0) refreshWebcamSample();
    }

    // Fade canvas (transparent fade — no black boxes)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalCompositeOperation = 'source-over';

    var currentBass = root.audioReactive ? 1.0 + audioLevel * 3.0 : 1.0;
    if (root.rainbowMode) hue += 0.0001;

    var chars   = charSets[root.charSetOption] || "01";
    var mc      = root.matrixColor;
    var useVision = (root.bgType === 2 || root.bgType === 3);

    for (var l = 0; l < layers.length; l++) {
        var layer = layers[l];
        ctx.font      = "bold " + layer.size + "px 'Courier New', monospace";
        ctx.textAlign = "center";
        var mouseR = 150 * layer.z;

        for (var i = 0; i < layer.drops.length; i++) {
            var text     = chars.charAt(Math.floor(Math.random() * chars.length));
            var textPrev = chars.charAt(Math.floor(Math.random() * chars.length));

            var px    = i * layer.size + layer.size / 2;
            var py    = Math.floor(layer.drops[i])             * layer.size;
            var pyP   = Math.floor(layer.drops[i] - gravityDir)* layer.size;

            ctx.shadowBlur = 0;

            // Alpha from vision sampling (image or webcam)
            var alpha = 1.0;
            if (useVision && visionPixelData) {
                var bright = sampleBrightness(px, py, visionPixelData, sc.width, sc.height);
                alpha = 0.12 + bright * 0.88;
            }

            // Color
            if (root.rainbowMode) {
                var rr = Math.floor(127 * Math.sin(root.rainbowSpeed/100 * hue + 0) + 128);
                var rg = Math.floor(127 * Math.sin(root.rainbowSpeed/100 * hue + 2) + 128);
                var rb = Math.floor(127 * Math.sin(root.rainbowSpeed/100 * hue + 4) + 128);
                ctx.fillStyle = "rgba("+rr+","+rg+","+rb+","+alpha+")";
            } else {
                var br = Math.min(255, Math.floor(mc.r * currentBass));
                var bg = Math.min(255, Math.floor(mc.g * currentBass));
                var bb = Math.min(255, Math.floor(mc.b * currentBass));
                ctx.fillStyle = "rgba("+br+","+bg+","+bb+","+alpha+")";
            }

            // Mouse dodge
            if (root.interactiveMouse) {
                var dx = px - mouseX, dy = py - mouseY;
                var dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < mouseR) {
                    px += (dx/dist) * (mouseR - dist) * 0.2;
                    ctx.shadowBlur = 18; ctx.shadowColor = "#FFF";
                }
            } else if (root.audioReactive && currentBass > 1.2) {
                ctx.shadowBlur  = 10 * currentBass;
                ctx.shadowColor = ctx.fillStyle;
            }

            // Trail
            ctx.fillText(textPrev, px, pyP);
            ctx.shadowBlur = 0;

            // White glowing head
            ctx.fillStyle   = "rgba(255,255,255," + alpha + ")";
            ctx.shadowBlur  = 10 + (root.audioReactive ? audioLevel * 15 : 0);
            ctx.shadowColor = "#FFF";
            ctx.fillText(text, px, py);
            ctx.shadowBlur  = 0;

            // Advance
            var step = layer.speedMultiplier * gravityDir;
            if (root.audioReactive) step += audioLevel * 2.0 * gravityDir;
            layer.drops[i] += step;

            if (gravityDir > 0) { if (py > c.height  && Math.random()>0.95) layer.drops[i] = 0; }
            else                { if (py < 0          && Math.random()>0.95) layer.drops[i] = c.height/layer.size; }
        }
    }

    // Draw ripples on top
    drawRipples();
}

// ═══════════════════════════════════════════════════════════
// BACKGROUND UPDATE
// ═══════════════════════════════════════════════════════════
function updateBg() {
    stopWebcam();
    webcamActive = false;
    visionPixelData = null;
    bgDiv.style.backgroundImage = "none";
    bgDiv.style.opacity = 0;

    if (root.bgType === 1 && root.bgImageStr) {
        bgDiv.style.backgroundImage = "url('" + root.bgImageStr.replace(/\\/g,"/") + "')";
        bgDiv.style.opacity = root.bgOpacity / 100;
    } else if (root.bgType === 2 && root.bgImageStr) {
        loadVisionImage(root.bgImageStr.replace(/\\/g,"/"));
    } else if (root.bgType === 3) {
        startWebcam();
    }
    document.body.style.background = "#000";
}

// ═══════════════════════════════════════════════════════════
// LIVELY CALLBACKS
// ═══════════════════════════════════════════════════════════
function livelyPropertyListener(name, val) {
    switch (name) {
        case "matrixColor":
            var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
            if(res) root.matrixColor={r:parseInt(res[1],16),g:parseInt(res[2],16),b:parseInt(res[3],16)};
            break;
        case "rainbowMode":       root.rainbowMode      = val; break;
        case "rainbowSpeed":      root.rainbowSpeed     = val; break;
        case "bgType":            root.bgType           = val; updateBg(); break;
        case "bgImageStr":        root.bgImageStr       = val; updateBg(); break;
        case "bgOpacity":         root.bgOpacity        = val; updateBg(); break;
        case "charSet":           root.charSetOption    = val; charSets[0]=root.customText; break;
        case "customText":        root.customText       = val; charSets[0]=val; break;
        case "parallax3D":        root.parallax3D       = val; if(mainLoopActive) initMatrix(); break;
        case "interactiveMouse":  root.interactiveMouse = val; break;
        case "audioReactive":     root.audioReactive    = val; break;
        case "showClock":         root.showClock        = val; updateClock(); break;
        case "matrixSpeed":
            root.matrixSpeed = val;
            if(drawInterval) clearInterval(drawInterval);
            drawInterval = setInterval(draw, root.matrixSpeed); break;
        case "retroCRT":
            root.retroCRT = val;
            crtDiv.style.display = val ? 'block' : 'none'; break;
        case "playIntro":
            root.playIntro = val;
            if(!val && introActive){introActive=false;introDiv.innerHTML="";startMatrix();} break;
        case "glitchMode":       root.glitchMode       = val; break;
        case "gravityBass":      root.gravityBass       = val; break;
        case "hackerTerminal":
            root.hackerTerminal = val;
            termDiv.style.display = val ? 'block' : 'none'; break;
        case "clickRipple":      root.clickRipple       = val; break;
        case "webcamVision":
            root.webcamVision = val;
            // Switching to webcam vision
            if (val) { root.bgType = 3; updateBg(); }
            else      { root.bgType = 0; updateBg(); } break;
    }
}

// ═══════════════════════════════════════════════════════════
// IGNITION 🚀
// ═══════════════════════════════════════════════════════════
updateBg();
crtDiv.style.display = root.retroCRT ? 'block' : 'none';
startIntro();
drawInterval = setInterval(draw, root.matrixSpeed);

// Start terminal AFTER intro ends (poll for it)
var termWait = setInterval(function() {
    if (!introActive) { clearInterval(termWait); startTerminal(); }
}, 500);
