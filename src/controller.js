'use strict';

var ui = require('./ui');
var settings = require('./settings');
var keybind = require('./keybind');
var _ = require('lodash');

var GameManager, MainCanvas;

var isFastSpace = false;
var isFastSpace50 = false;
var isFastFire= false;
var isSuspendMouse = false;
var fastSpaceCounter = 0;
var fastSpaceCounter50 = 0;

var pressedKey = {};
var pressedKeyStack = [];
var modifier = { 16: false, 17: false, 18: false, 91: false };
var settingKeyName = '';
var settingKeySequence = [];

function updateMouse() {
    if(!isSuspendMouse){
        GameManager.currentPlayer.server.mouseUpdate(MainCanvas.getGameMousePos());
    }
}

function onmousewheelScale(e) {
    MainCanvas.scale(e.wheelDelta);
}

function onmousewheelStopPropagation(e) {
    e.stopPropagation();
}

function onmousewheelMenuSwitch(e) {
    e.stopPropagation();
    ui.overlay.menuSwitchScroll(e.wheelDelta > 0);
}

function onmousemove(e){
    MainCanvas.setWindowMousePos(e.clientX, e.clientY);
}

function onresize() {
    MainCanvas.resize([window.innerWidth, window.innerHeight]);
}

function oncontextmenu(e){
    return false;
}

var KeyDownActions = {
    "Chat" : function(){
        ui.chatBox.focus();
    },
    "Split": function(){
        updateMouse();
        GameManager.currentPlayer.server.space();
    },
    "Feed" :function(){
        updateMouse();
        GameManager.currentPlayer.server.W();
    },
    "ToggleOverlay" :function(){
        ui.overlay.toggle();
    },
    "SwitchCell" :function(){
        GameManager.currentPlayer.client.switchSelectedCell();
    },
    "ToggleAdvanceInfomation" :function(){
        settings.advancedCellInfo = true;
    },
    "ToggleAdvanceInfomationPersist" :function(){
        settings.advancedCellInfo = !settings.advancedCellInfo;
    },
    "SpectateAndToggleFreeSpectate" :function(){
        if(!GameManager.currentPlayer.client.isPlayerAlive()){
            GameManager.currentPlayer.server.spectate();
            GameManager.currentPlayer.server.Q();
        }else{
            isFastFire = true;
        }
    },
    "MacroFeed" :function(){
        isFastFire = true;
    },
    "MacroSplit" :function(){
        if(GameManager.currentPlayer.client.isPlayerAlive()){
            isFastSpace = true;
            /* At least 4 times */
            fastSpaceCounter = 4;
        }
    },
    "MacroSplit50" : function(){
        if(GameManager.currentPlayer.client.isPlayerAlive()){
            isFastSpace50 = true;
            /* At least 4 times */
            fastSpaceCounter50 = 4;
        }
    },
    "ToggleVirusProtecter" :function(){
        // TODO
    },
    "StopMove" :function(){
        isSuspendMouse = !isSuspendMouse;
    },
    "MacroSplitTwice" :function(){
        if(GameManager.currentPlayer.client.isPlayerAlive()){
            var pos = MainCanvas.getGameMousePos();

            isSuspendMouse = true;
            GameManager.currentPlayer.server.mouseUpdate(pos);
            GameManager.currentPlayer.server.space();
            setTimeout(function(){
                GameManager.currentPlayer.server.mouseUpdate(pos);
                GameManager.currentPlayer.server.space();
                isSuspendMouse = false;
            },30);
        }
    },
    "ZoomLock" :function(){
        settings.zoomLocked = !settings.zoomLocked;
    },
    "ToggleNickName" :function(){
        settings.globalNickNameToggle = !settings.globalNickNameToggle;
    },
    "ClearFocusTarget1": function(){
    },
    "ClearFocusTarget2": function(){
    },
    "1" :function(){
        GameManager.currentPlayer.client.switchSelectedCell(0);
    },
    "2" :function(){
        GameManager.currentPlayer.client.switchSelectedCell(1);
    },
    "3" :function(){
        GameManager.currentPlayer.client.switchSelectedCell(2);
    },
    "4" :function(){
        GameManager.currentPlayer.client.switchSelectedCell(3);
    },
    "5" :function(){
        GameManager.currentPlayer.client.switchSelectedCell(4);
    },
    "6" :function(){
        GameManager.currentPlayer.client.switchSelectedCell(5);
    },
    "7" :function(){
        GameManager.currentPlayer.client.switchSelectedCell(6);
    },
    "8" :function(){
        GameManager.currentPlayer.client.switchSelectedCell(7);
    },
    "MapEvent_Feed" :function(){
        //sendRoundMapEvent(window.Minimap.Event.TYPE_FEED, 0);
    },
    "MapEvent_Virus" :function(){
        //sendRoundMapEvent(window.Minimap.Event.TYPE_VIRUS, 0);
    },
    "MapEvent_Run" :function(){
        //sendRoundMapEvent(window.Minimap.Event.TYPE_RUN, 0);
    },
    "MapEvent_Help" :function(){
        //sendRoundMapEvent(window.Minimap.Event.TYPE_HELP, 0);
    },
    "MapEvent_ENEMY" :function(){
        //sendRoundMapEvent(window.Minimap.Event.TYPE_ENEMY, 0);
    },
    "SelectFocusTarget1": function(){
    },
    "SelectFocusTarget2": function(){
    },
    "RoundSignal": function(){
        //rightMouseDown = true;
        //rightMouseDownTime = currentTime;
    },
};

var KeyUpActions = {
    "ToggleAdvanceInfomation" :function(){
        settings.advancedCellInfo = false;
    },
    "MacroFeedAndSpectate": function(){
        isFastFire = false;
    },
    "MacroFeed": function(){
        isFastFire = false;
    },
    "MacroSplit" : function(){
        isFastSpace = false;
    },
    "MacroSplit50" : function(){
        isFastSpace50 = false;
    },
    "RoundSignal": function(){
        //rightMouseDown = false;
        //sendRoundMapEvent(
        //                  window.Minimap.Event.TYPE_NORMAL,
        //                  Math.min(5000, currentTime - rightMouseDownTime)
        //                 );
    },
};

function genKeySequence(code){
    var keySequence = [];
    for(var key in modifier){
        if(modifier[key]) keySequence.push(key);
    }
    if(code > 255 && pressedKeyStack.length !== 0){
        keySequence.push(pressedKeyStack[pressedKeyStack.length - 1]);
    }
    if(!modifier[code]){
        keySequence.push(code);
    }
    return keySequence;
}

function GameKeyInput(code, isDown){
    /*
     * 0-255: keycode
     * 256  : left mouse
     * 257  : middle mouse
     * 258  : right mouse
     * */
    if(modifier.hasOwnProperty(code)){
        modifier[code] = isDown;
    }
    var action = keybind.action[keybind.genKeySequenceIndex(genKeySequence(code))];
    if(action){
        for(var i = 0;i < action.length;++i){
            var ac = action[i];
            if(isDown){
                if(KeyDownActions[ac])
                    KeyDownActions[ac]();
            }else{
                if(KeyUpActions[ac])
                    KeyUpActions[ac]();
            }
        }
    }
}

function SettingKeyInput(code, isDown){
    if(code === 27){
        settingKeySequence = [];
        ui.keyBindSetting.changeOverlap('none');
        return;
    }
    if(modifier.hasOwnProperty(code)){
        modifier[code] = isDown;
    }
    if(isDown){
        settingKeySequence = genKeySequence(code);
        ui.keyBindSetting.changeOverlap(keybind.genKeySequenceReadable(genKeySequence(code)));
    }
}

window.settingKeybind = function(actionName){
    ui.keyBindSetting.show();
    ui.keyBindSetting.changeOverlap(keybind.genKeySequenceReadable(keybind[actionName]));
    settingKeyName = actionName;
};

window.doneSettingKeybind = function(){
    ui.keyBindSetting.hide();
    if(settingKeySequence !== []){
        keybind[settingKeyName] = settingKeySequence;
        ui.keyBindSetting.changeSetting(settingKeyName, keybind.genKeySequenceReadable(settingKeySequence));
    }else{
        ui.keyBindSetting.changeSetting(settingKeyName, 'none');
        keybind[settingKeyName] = [];
    }
};

function onmousedown(e) {
    var code = e.button + 256;
    if(e.target.id === 'canvas-main'){
        if(e.preventDefault)e.preventDefault();
        ui.chatBox.blur();
        GameKeyInput(code, true);
    }else if(!ui.keyBindSetting.isVisible() && e.target.id !== 'doneInputSetting'){
        SettingKeyInput(code, true);
        e.stopPropagation();
        return false;
    }
}

function onmouseup (e) {
    var code = e.button + 256;
    if(e.target.id === 'canvas-main'){
        if(e.preventDefault)e.preventDefault();
        GameKeyInput(code, false);
    }else if(!ui.keyBindSetting.isVisible() && e.target.id !== 'doneInputSetting'){
        SettingKeyInput(code, false);
        e.stopPropagation();
        return false;
    }
}

function onkeydown(e) {
    if(ui.chatBox.isActive){
        if(e.keyCode === 27){
            ui.chatBox.blur();
        }
        return true;
    }
    if(e.keyCode === 27 && ui.keyBindSetting.isVisible()){
        ui.overlay.toggle();
    }

    if(!pressedKey[e.keyCode]){
        pressedKey[e.keyCode] = true;
        if(!modifier.hasOwnProperty(e.keyCode)) pressedKeyStack.push(e.keyCode);
        if( !ui.overlay.isVisible() ){
            GameKeyInput(e.keyCode, true);
        }else if(!ui.keyBindSetting.isVisible()){
            SettingKeyInput(e.keyCode, true);
        }
    }
}

function onkeyup(e) {
    pressedKey[e.keyCode] = false;
    if(pressedKeyStack.length !== 0)pressedKeyStack.pop();
    if( !ui.overlay.isVisible() ){
        GameKeyInput(e.keyCode, false);
    }else if( !ui.keyBindSetting.isVisible() ){
        SettingKeyInput(e.keyCode, false);
    }
}

function onblur(e){
    GameManager.currentPlayer.server.afk();
    var key;
    for(key in modifier){
        modifier[key] = false;
    }
    for(key in pressedKey){
        pressedKey[key] = false;
    }
    pressedKeyStack.length = 0;
}


var fastSpaceFunc = _.throttle(function(){
    GameManager.currentPlayer.server.space();
}, 70);
var fastSpaceCountFunc = _.throttle(function(){
    --fastSpaceCounter;
    GameManager.currentPlayer.server.space();
}, 70);
var fastSpaceFunc50 = _.throttle(function(){
    GameManager.currentPlayer.server.space();
}, 50);
var fastSpaceCountFunc50 = _.throttle(function(){
    --fastSpaceCounter50;
    GameManager.currentPlayer.server.space();
}, 50);
var updateMovement = _.throttle(function(){
    updateMouse();
    if(isFastFire){
        GameManager.currentPlayer.server.W();
    }
    if(fastSpaceCounter > 0){
        fastSpaceCountFunc();
    }else if(isFastSpace){
        fastSpaceFunc();
    }
    if(fastSpaceCounter50 > 0){
        fastSpaceCountFunc50();
    }else if(isFastSpace50){
        fastSpaceFunc50();
    }
}, 1000 / 40);


module.exports = {
    init: function(GM){
        GameManager = GM;
        MainCanvas = GM.MainCanvas;

        ui.mainCanvas.oncontextmenu = oncontextmenu;

        window.addWheelListener(ui.mainCanvas, onmousewheelScale);
        window.addWheelListener(document.getElementById("page1"), onmousewheelStopPropagation);
        window.addWheelListener(document.getElementById("page2"), onmousewheelStopPropagation);
        window.addWheelListener(document.getElementById("Overlay"), onmousewheelMenuSwitch);

        window.onmousedown = onmousedown;
        window.onmouseup = onmouseup;
        window.onmousemove = onmousemove;
        window.onresize = onresize;
        window.onkeydown = onkeydown;
        window.onkeyup = onkeyup;
        window.onblur = onblur;

        onresize();
        MainCanvas.on('postRender', updateMovement);
        setInterval(updateMovement, 40);
    },
};
