'use strict';

var storage = require('./storage');

function InitSettingObject(settingObject, name ,optionsAndDefaults){
    _.forEach(optionsAndDefaults, function(defaultValue, settingName){
        var backingVar = '_' + settingName;
        settingObject[backingVar] = storage.get(name + '_' + settingName, defaultValue);

        Object.defineProperty(settingObject, backingVar, {enumerable: false,});
        Object.defineProperty(settingObject, settingName, {
            get: function()     { return this[backingVar];},
            set: function(val)  { this[backingVar] = val; storage.set(name + '_' + settingName, val); }
        });
    });
}

var settings = {};
var settingsDefaults = {
    "language"               : "en",
};

var profile = {};
var profileDefaults = {
    'Nick'                 : [''],
    'NickID'               : 0,
    'Yin'                  : [{ email: '', password: ''}],
    'YinID'                : 0,
    'SkinURL'              : [''],
    'SkinID'               : 0,
    'CellColor'            : '#5555FF',
    'IndicatorColor'       : '#330033',
    'MapServerAccount'     : {email: '', password: ''},
};


var settings = {
    init: function(){
        InitSettingObject( this, 'settings', settingsDefaults);
        InitSettingObject( profile, 'profile', profileDefaults);
    },
    profile: profile,
};

module.exports = settings;
