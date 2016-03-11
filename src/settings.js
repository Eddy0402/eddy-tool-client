'use strict';

var _ = require('lodash');
var storage = require('./storage');
var AgarServer = require('./server/agarserver');
var EventEmitter = require('events').EventEmitter;

var settingsDefaults = {
    language               : 'en',
    currentProfile         : 0,
    region                 : 'SG-Singapore',
    gameMode               : ':party',

    zoomLocked             : false,
    advancedCellInfo       : false,
    globalNickNameToggle   : true,

    /* canvas */
    scrollSpeed            : 0.60,
    scaleSpeed             : 0.60,

    /* render parameter */
    hintColor              : false,
    cellBorderWidth        : 0.13,
    nameColor              : '#FFFFFF',
    cellDisplay            : {
        me       : { mass: true, name: true , stroke: false, transparent: false, indicator: true, shadow: true  },
        teammate : { mass: true, name: true , stroke: false, transparent: false, indicator: true, shadow: true  },
        withSkin : { mass: true, name: true , stroke: false, transparent: false, shadow: true },
        virus    : { mass: true, name: true , stroke: false, transparent: false },
        normal   : { mass: true, name: true , stroke: false, transparent: false, shadow: true },
        small    : { mass: false, name: false, transparent: false, shadow: false },
        pellet   : { color: false, },
    },
    color: {
        Huge : "#FF0000",
        Large : "#F9F900",
        Same : "#00FFFF",
        Small  : "#59FF00",
        Tiny : "#009100",
        TinyTwice : "#CCCCFF",
        Pellet : "#CCCCFF",
        Virus : "#CFCFCF",
        VirusStroke : "#EEEEEE",
        VirusText : "#6D6D6D",
        Stroke1 : "#FFFF00",
        Stroke2 : "#FFFFFF",
    },
    skin : {
        team     : true,
        imgur    : true,
        yin      : true,
        miniclip : true,
        vanilla  : true,
    },
    skinOrder: [0, 1, 2, 3, 4],

    /* Minimap */
    mapServerAccount       : {type: 'discord', email: '', password: ''},
    mapServerAddress   : '',
    drawCross              : 'me', // me, all, none
    showName               : 'account', // account, ingame, none
    autoReconnect          : true,
    reconnectInterval      : 3000,
    teammateCheckTimeout   : 5000, /* The delay time of cell id check on teammate */
    maxSendCell            : 16, /* max cell update from a player, may be more on private servers */
};


var profileDefaults = [
    {
        ProfileName          : 'Profile 1',
        Nick                 : '',
        Yin                  : { email: '', password: ''},
        YinCode              : [],
        YinCodeSelected      : 0,
        SkinURL              : '',
        CellColor            : '#5555FF',
        IndicatorColor       : '#330033',
    },
];

/* Settings
 * #event:
 *  - change(key):
 *      for profile changes, key = 'profile.[key or profile]'
 */
var settings = {
    init: function(){
        window.settings = this;

        var _this = this;
        _.forEach(settingsDefaults, function(val, key){
            var backingVar = '_' + key;
            _this[backingVar] = storage.get(name + '_' + key, val);

            Object.defineProperty(_this, backingVar, {enumerable: false,});
            Object.defineProperty(_this, key, {
                get: function()     { return this[backingVar];},
                set: function(val)  {
                    this[backingVar] = val;
                    this.emit('change', key);
                    storage.set(name + '_' + key, val); }
            });
        });
        this.profileList = storage.get('profileList', $.extend([], true, profileDefaults));
    },
    getCurrentProfile: function(){
        return this.profileList[this.currentProfile];
    },
    setProfile: function(key, value){
        this.getCurrentProfile()[key] = value;
        this.emit('change', 'profile.' + key);
        storage.set('profileList', this.profileList);
    },
    notifyProfileChange: function(){
        var _this = this;
        _.forEach(this.getCurrentProfile(), function(val, key){
            _this.emit('change', 'profile.' + key);
        });
    },
    nextProfile: function(){
        if(++this.currentProfile >= this.profileList.length){
            this.currentProfile = 0;
        }
        this.notifyProfileChange();
    },
    previousProfile: function(){
        if(--this.currentProfile < 0){
            this.currentProfile = this.profileList.length - 1;
        }
        this.notifyProfileChange();
    },
    duplicateProfile: function(){
        this.profileList.splice(this.currentProfile, 0, $.extend(true, {},this.getCurrentProfile()));
        this.setProfile('ProfileName', 'Duplicate of ' + this.getCurrentProfile().ProfileName);
        this.emit('change', 'profile.ProfileName');
        storage.set('profileList', this.profileList);
    },
    deleteProfile: function(){
        this.profileList.splice(this.currentProfile, 1);
        if(this.profileList.length === 0){
            this.profileList =  $.extend([], true, profileDefaults);
        }
        this.previousProfile();
        storage.set('profileList', this.profileList);
        this.notifyProfileChange();
    },
};
$.extend(settings, new EventEmitter());

module.exports = settings;
