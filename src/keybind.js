'use strict';

var _ = require('lodash');
var storage = require('./storage');

function genKeySequenceIndex(keySequence){
    var res = 0;
    for(var i = 0;i < keySequence.length;++i){
        res = res * 512 + keySequence[i];
    }
    return res;
}
function genKeySequenceReadable(keySequence){
    return keySequence.length === 0 ? 'none'
        : keySequence.map(function(val){ return window.keyCodeName[val] || val; }).join(' + ');
}

function InitKeyBindObject(keybind, name ,optionsAndDefaults){
    keybind.genKeySequenceIndex = genKeySequenceIndex;
    keybind.genKeySequenceReadable = genKeySequenceReadable;
    keybind.action = {
        add: function(key, action){
            if(!this[key]) this[key] = [];
            if(this[key].oindexOf(action) === -1){
                this[key].push(action);
            }
        },
        remove: function(key, action){
            var index = this[key].oindexOf(action);
            if(index !== -1){
                this[key].spliceOne(index);
            }
        },
    };
    Object.defineProperty(keybind, 'action',{enumerable: false});
    Object.defineProperty(keybind, 'init',{enumerable: false});
    Object.defineProperty(keybind, 'genKeySequenceIndex',{enumerable: false});
    Object.defineProperty(keybind, 'genKeySequenceReadable',{enumerable: false});

    _.forEach(optionsAndDefaults, function(defaultValue, settingName){
        var backingVar = '_' + settingName;
        keybind[backingVar] = storage.get(name + '_' + settingName, defaultValue);

        Object.defineProperty(keybind, backingVar, {enumerable: false,});
        Object.defineProperty(keybind, settingName, {
            get: function(){
                return this[backingVar];
            },
            set: function(val){
                this.action.remove([genKeySequenceIndex(this[backingVar])], settingName);
                this.action.add(genKeySequenceIndex(val), settingName);

                this[backingVar] = val;
                storage.set(name + '_' + settingName, val);
            },
            enumerable: true,
        });

        keybind.action.add(genKeySequenceIndex(keybind[settingName]), settingName);

    });
}

var keybindDefault = {
    "ToggleOverlay"                   : [257],
    "ToggleAdvanceInfomation"         : [],
    "ToggleAdvanceInfomationPersist"  : [16],  // Shift
    "Chat"                            : [13],  // Enter
    "SwitchCell"                      : [9],   // Tab
    "Split"                           : [32],  // Space

    "SpectateAndToggleFreeSpectate"   : [81],  // Q
    "MacroFeed"                       : [81],  // Q
    "Feed"                            : [87],  // W
    "ToggleVirusProtecter"            : [69],  // E
    "MacroSplit"                      : [82],  // R
    "MacroSplit50"                    : [],
    "MacroSplitTwice"                 : [84],  // T

    "StopMove"                        : [83],  // S
    "ZoomLock"                        : [76],  // L

    "MapEvent_Feed"                   : [90],  // Z
    "MapEvent_Virus"                  : [88],  // X
    "MapEvent_Run"                    : [67],  // C
    "MapEvent_Help"                   : [86],  // V
    "MapEvent_ENEMY"                  : [66],  // B
    "ToggleNickName"                  : [78],  // N

    "1"                               : [49],
    "2"                               : [50],
    "3"                               : [51],
    "4"                               : [52],
    "5"                               : [53],
    "6"                               : [54],
    "7"                               : [55],

    "ArrowSignal"                     : [], /* left */
    "RoundSignal"                     : [258], /* right */

    "SelectFocusTarget1"              : [49, 256], /* 1 + left */
    "SelectFocusTarget2"              : [50, 256], /* 2 + left */
    "ClearFocusTarget1"               : [16, 49],
    "ClearFocusTarget2"               : [16, 50],
};

var keybind = {
    init: function(){
        InitKeyBindObject(keybind, 'keybind', keybindDefault);
    },
};

module.exports = keybind;
