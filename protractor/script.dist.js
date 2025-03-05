"use strict";
const __tsb = {
};
// src\index.ts
const canvas = document.createElement("canvas");
const video = document.createElement("video");
const ctx = canvas.getContext("2d", { alpha: false });
const { cos, sin, PI } = Math;
const TAU = PI * 2;
navigator.mediaDevices
    .getDisplayMedia({
    audio: false,
    video: {
        displaySurface: "monitor",
    },
})
    .then((display) => {
    video.srcObject = display;
    video.play();
});
const bufferingCache = [];
const buffering = [];
let lastBuffer;
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buffering.length = 0;
    bufferingCache.length = 0;
}
window.addEventListener("resize", resize);
resize();
window.addEventListener("load", () => {
    document.body.appendChild(canvas);
});
function draw(t) {
    video.requestVideoFrameCallback(draw);
    let canvas = bufferingCache.shift();
    if (canvas === undefined) {
        canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    const cwidth = canvas.width;
    const cheight = canvas.height;
    const vwidth = video.videoWidth;
    const vheight = video.videoHeight;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.clearRect(0, 0, cwidth, cheight);
    const caspect = cwidth / cheight;
    const vaspect = vwidth / vheight;
    if (caspect > vaspect) {
        const scale = cheight / vheight;
        const width = vwidth * scale;
        const x = (cwidth - vwidth * scale) / 2;
        ctx.drawImage(video, x, 0, width, cheight);
    }
    else {
        const scale = cwidth / vwidth;
        const height = vheight * scale;
        const y = (cheight - height) / 2;
        ctx.drawImage(video, 0, y, cwidth, height);
    }
    buffering.push(canvas);
}
video.requestVideoFrameCallback(draw);
let frameDelta = 0;
let prevT = Date.now();
function flush(t) {
    requestAnimationFrame(flush);
    const delta = t - prevT;
    const buffer = buffering.shift();
    if (buffer !== undefined) {
        lastBuffer = buffer;
        prevT = t;
    }
    if (lastBuffer !== undefined) {
        ctx.drawImage(lastBuffer, 0, 0);
    }
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText((Math.round(10000 / delta) / 10).toFixed(1) + " FPS", 5, 20);
    protractor.draw();
}
requestAnimationFrame(flush);
class Protractor {
    x = 0.5;
    y = 0.5;
    rotate = 0;
    target = TAU;
    draw() {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        const TEXT_POS = 1.15;
        const radius = Math.min(canvas.width, canvas.height) * 0.4;
        const x = this.x * canvas.width;
        const y = this.y * canvas.height;
        ctx.arc(x, y, radius, 0, TAU);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "20px Consolas";
        ctx.beginPath();
        const fromRadian = 180 / PI;
        for (let angle = 0; angle < this.target; angle += TAU / 36) {
            ctx.moveTo(x, y);
            const a = angle + this.rotate;
            const tx = radius * cos(a);
            const ty = radius * sin(a);
            ctx.lineTo(x + tx, y + ty);
            ctx.fillText(Math.round(angle * fromRadian) + "", x + tx * TEXT_POS, y + ty * TEXT_POS);
        }
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        const tx = radius * cos(this.target);
        const ty = radius * sin(this.target);
        ctx.moveTo(x, y);
        ctx.lineTo(x + tx, y + ty);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillText((Math.round(this.target * fromRadian * 10) / 10).toFixed(1) + "", x + tx * TEXT_POS, y + ty * TEXT_POS);
    }
    rotateTo(x, y) {
        this.rotate = Math.atan2(y - this.y * canvas.height, x - this.x * canvas.width);
    }
    updateTargetTo(x, y) {
        this.target =
            (Math.atan2(y - this.y * canvas.height, x - this.x * canvas.width) +
                TAU) %
                TAU;
    }
}
const protractor = new Protractor();
setDragListener((dx, dy) => {
    protractor.x += dx / canvas.width;
    protractor.y += dy / canvas.height;
    protractor.draw();
});
function setDragListener(cb) {
    function onMouseMove(ev) {
        cb(ev.clientX - px, ev.clientY - py);
        px = ev.clientX;
        py = ev.clientY;
    }
    function onMouseUp(ev) {
        if (ev.button !== 0)
            return;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }
    let px = 0;
    let py = 0;
    window.addEventListener("mousedown", (ev) => {
        if (ev.button !== 0)
            return;
        px = ev.clientX;
        py = ev.clientY;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    });
}
document.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
});
let rotating = false;
let targeting = false;
window.addEventListener("mousemove", (ev) => {
    if (targeting)
        protractor.updateTargetTo(ev.clientX, ev.clientY);
    if (rotating)
        protractor.rotateTo(ev.clientX, ev.clientY);
});
window.addEventListener("mousedown", (ev) => {
    if (ev.button === 1) {
        targeting = true;
        protractor.updateTargetTo(ev.clientX, ev.clientY);
    }
    if (ev.button === 2) {
        rotating = true;
        protractor.rotateTo(ev.clientX, ev.clientY);
    }
});
window.addEventListener("mouseup", (ev) => {
    if (ev.button === 1) {
        targeting = false;
    }
    if (ev.button === 2) {
        rotating = false;
    }
});

//# sourceMappingURL=script.dist.js.map