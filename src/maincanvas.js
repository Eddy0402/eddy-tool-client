'use strict';

var ui = require('./ui');
var Counter = require('./counter');
var drawBackground = require('./entity/background');
var settings = require('./settings');
var EventEmitter = require('events').EventEmitter;

var GameManager;
var eventEmitter = new EventEmitter();

var ctx = null;
var player = null;
var client = null;
var isRendering= false;
var countFPS = new Counter();
var fps = 0;

var windowView = 1;
var windowScale = 1;
var targetView = 1;
var zoomFactor = 1;
var targetZoomFactor = 1;
var windowMouseX = 0;
var windowMouseY = 0;
var windowWidth = 1920;
var windowHeight = 1080;
var viewCenterX = 0;
var viewCenterY = 0;
var targetViewCenterX = 0;
var targetViewCenterY = 0;
var lastMouseCoords = { x: 0, y: 0 };

function init(GM){
    GameManager = GM;
    ctx = ui.mainCanvas.getContext('2d');
}

function shouldRender(cell){
    return 0 >= cell.id ? true :
        cell.x + cell.size + 40 < viewCenterX - windowWidth / 2 / windowScale ||
        (cell.y + cell.size + 40 < viewCenterY - windowHeight / 2 / windowScale ||
         (cell.x - cell.size - 40 > viewCenterX + windowWidth / 2 / windowScale ||
          cell.y - cell.size - 40 > viewCenterY + windowHeight / 2 / windowScale)) ? false : true;
}

function renderScaledItem(){
    var allCells = client.allCells;
    if(player.mapDimensionsKnown){
        ctx.save();
        ctx.translate(player.mapMinX, player.mapMinY);
        drawBackground(ctx, player.mapSize);
        ctx.restore();
    }

    /* cells */
    for (var i = 0;i < allCells.length;i++) {
        if(shouldRender(allCells[i]))
            allCells[i].render(ctx);
    }
}

function render(){
    eventEmitter.emit('preRender');

    /* Calculate area to show depends on player live or not */
    var viewCenterMoveRate, scaleRate, myCells = client.myCells;
    if (0 < myCells.length) {
        targetViewCenterX = 0;
        targetViewCenterY = 0;
        var totalSize = 0;
        for (var i = 0;i < myCells.length;i++) {
            targetViewCenterX += Math.pow(myCells[i].x, 1);
            targetViewCenterY += Math.pow(myCells[i].y, 1);
            totalSize += myCells[i].size;
        }
        targetViewCenterX /= myCells.length;
        targetViewCenterY /= myCells.length;
        if(!settings.zoomLocked){
            targetView =  Math.min(
                                   Math.pow(Math.min(64 / totalSize, 0.8), 0.4),
                                   windowView * 1.1
                                  );
        }
        viewCenterMoveRate = 0.5;
        scaleRate = settings.scaleSpeed;
    } else {
        targetViewCenterX = client.viewCenterX;
        targetViewCenterY = client.viewCenterY;
        targetView = client.view;
        viewCenterMoveRate = 0.03;
        scaleRate = 0.03;
    }

    /* Smooth scale and move */
    zoomFactor = 0.1 * targetZoomFactor + 0.9 * zoomFactor;
    viewCenterX = (1 - viewCenterMoveRate) * viewCenterX + viewCenterMoveRate * targetViewCenterX;
    viewCenterY = (1 - viewCenterMoveRate) * viewCenterY + viewCenterMoveRate * targetViewCenterY;
    windowView = (1 - scaleRate) * windowView + scaleRate * targetView;
    windowScale = windowView / zoomFactor;

    /* Clear canvas */
    ctx.clearRect(0, 0, windowWidth, windowHeight);

    /* Trasform to map coordinate */
    ctx.save();

    ctx.translate(windowWidth / 2, windowHeight / 2);
    ctx.scale(windowScale, windowScale);
    ctx.translate(-viewCenterX, -viewCenterY);
    renderScaledItem();

    ctx.restore();
}

function renderWrapper(){
    if(isRendering) window.requestAnimationFrame(renderWrapper);

    fps = countFPS();
    render();
}

function startRender(p){
    player = p;
    client = p.client;
    if(!isRendering){
        isRendering = true;
        window.requestAnimationFrame(renderWrapper);
    }
}

function stopRender(){
    isRendering = false;
}

function setWindowMousePos(X, Y){
    windowMouseX = X;
    windowMouseY = Y;
}

function getGameMousePos(){
    var gameMouseX = (windowMouseX - windowWidth / 2) / windowScale + viewCenterX;
    var gameMouseY = (windowMouseY - windowHeight / 2) / windowScale + viewCenterY;
    return [gameMouseX, gameMouseY];
}


function scale(delta){
    if((windowScale <= 0.035 && delta < 0) ||
       (windowScale >= 1.0 && delta > 0))return;
    targetZoomFactor = targetZoomFactor - settings.scrollSpeed * delta / 1200;
    targetZoomFactor = Math.max(0.1,targetZoomFactor);
}

function resize(size){
    windowWidth = ui.mainCanvas.width = size[0];
    windowHeight = ui.mainCanvas.height = size[1];
}

module.exports = $.extend({
    get fps(){return fps;},
    init: init,
    startRender: startRender,
    stopRender: stopRender,
    scale: scale,
    getScale: function(){ return windowScale; },
    resize: resize,
    setWindowMousePos: setWindowMousePos,
    getGameMousePos: getGameMousePos,
}, eventEmitter);
