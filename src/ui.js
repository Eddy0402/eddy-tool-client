'use strict';

var keybind = require('./keybind');
var settings = require('./settings');
var GameManager = require('./gamemanager');
var i18n = require('./i18n');
var gameutil = require('./gameutil');
var SplitIndicator = require('./entity/splitindicator');

var OverlayElement = null;
var chatBoxElement = null;
var indicatorColorChooserElement = null;
var cellColorChooserElement = null;
var nameColorChooserElement = null;

var indicatorColorChooser = null;
var cellColorChooser = null;
var nameColorChooser = null;

function getRandomHiddenCharacters(){
    return '\u200A\u200B\u200C\u200D\u200E\u200F'.charAt(~~(Math.random() * 6));
}

function redrawSplitIndicator(){
    var ctx = cellColorChooserElement.getContext("2d");
    ctx.clearRect(0,0,cellColorChooserElement.width, cellColorChooserElement.height);
    var colorRGB = gameutil.hexToRgb(settings.getCurrentProfile().IndicatorColor);
    SplitIndicator.render( ctx, 0, 0, 47.05882352941176470588, colorRGB.r, colorRGB.g, colorRGB.b);
}

function displayDaChongSkin(){
    var profile = settings.getCurrentProfile();
    if(profile.YinCode.length !== 0){
        var code = profile.YinCode[profile.YinCodeSelected];
        $('#yinUnicode').text(String.fromCharCode(code > 65535 ? code - 65534 : code));
        $("#avatar").attr("src", "http://upload.happyfor.me/getimg.php?id=" + code);
    }else{
        $('#yinUnicode').text('X');
        $("#avatar").attr("src", $('#avatar').attr('data-default'));
    }
}

function fillProfile(){
    var profile = settings.getCurrentProfile();
    $('#ProfileName').val(profile.ProfileName);
    $('#nick').val(profile.Nick);
    $('#email').val(profile.Yin.email);
    $('#password').val(profile.Yin.password);
    cellColorChooser.fromString(profile.CellColor);
    indicatorColorChooser.fromString(profile.IndicatorColor);
    window.GameTab.changeCellColor(cellColorChooser);
    window.GameTab.changeIndicatorColor(indicatorColorChooser);
    displayDaChongSkin();
}

var Overlay = module.exports.overlay = {
    isVisible: function(){
        return OverlayElement.is(':visible');
    },
    toggle: function(){
        if(OverlayElement.is(':visible')){
            OverlayElement.addClass('hide');
        }else{
            OverlayElement.removeClass('hide');
        }
    },
    menuSwitchScroll: function(up){
        if(up){
            var target = $('#OverlayMenu > .active').prev('li').find('a');
            if(target.attr('id') !== 'keybind')
                target.trigger('click');
        }else{
            $('#OverlayMenu > .active').next('li').find('a').trigger('click');
        }
    },
};

var ChatBox = module.exports.chatBox = {
    focus: function(){
        setTimeout(function(){ chatBoxElement.focus(); }, 0);
    },
    blur: function(){
        setTimeout(function(){ chatBoxElement.blur(); }, 0);
    },
    isActive: false,
};

module.exports.keyBindSetting = {
    isVisible: function(){
        return $('#inputSettingPanelOverlapScreen').hasClass('hide');
    },
    show: function(){
        $('#inputSettingPanelOverlapScreen').removeClass('hide');
    },
    hide: function(){
        $('#inputSettingPanelOverlapScreen').addClass('hide');
    },
    changeOverlap: function(name){
        $('#currentKeySequence').text(name);
    },
    changeSetting: function(action, keyname){
        $('#changebutton-' + action).text(keyname);
    },
};

module.exports.loadAnimation = {
    end: function(){
        setTimeout(function(){$('#loadOverlay').addClass('loadComplete');}, 0);
        setTimeout(function(){$('#loadOverlay').remove();}, 1000);
    },
    progress: function(){

    },
};

var GameTab = module.exports.gameTab = {
    setConnectToken: function(token){
        $('#roomIdOrIp').val(token);
    },
    setSkinImg: function(url){

    },
};

window.GameTab = {
    setNickAndSpawn: function(a) {
        settings.setProfile("Nick", a);
        var suffix = 0;
        var code = settings.getCurrentProfile().YinCode[settings.getCurrentProfile().YinCodeSelected];
        if(code){
            if(code> 65535){
                a = a.substring(0, 12) + '\u0001' + String.fromCharCode(code- 65534)+ '\uffff';
                suffix = 3;
            }else{
                a = a.substring(0, 13) + '\u0001' + String.fromCharCode(code);
                suffix = 2;
            }
        }
        /* Randomly insert some invisible characters to avoid fake */
        while(a.length < 15){
            var position = ~~(Math.random() * (a.length - suffix));
            a = a.substr(0, position) + getRandomHiddenCharacters() + a.substr(position);
        }
        GameManager.currentPlayer.server.setNickAndSpawn(a);
        if(Overlay.isVisible())Overlay.toggle();
    },
    setDaChong: function(email, password){
        gameutil.getDaChong(email, password, function(res){
            settings.setProfile('Yin', {email: email, password: password});
            settings.setProfile('YinCode', res);
            settings.setProfile('YinCodeSelected', 0);
            displayDaChongSkin();
        });
    },
    switchDaChongID: function(){
        var id = settings.getCurrentProfile().YinCodeSelected;
        if(++id === settings.getCurrentProfile().YinCode.length){
            id = 0;
        }
        settings.setProfile('YinCodeSelected', id);
        displayDaChongSkin();
    },
    refreshRoom: function(){
        GameManager.currentPlayer.newServer(settings.region, settings.gameMode);
    },
    joinRoom: function(code){
        GameManager.joinServer($.trim(code));
    },
    setRegion: function(region){
        settings.region = region;
        this.refreshRoom();
    },
    setGameMode: function(gameMode){
        settings.gameMode = gameMode;
        this.refreshRoom();
    },
    changeCellColor: function(picker){
        settings.getCurrentProfile().CellColor = picker.toHEXString();
    },
    changeIndicatorColor: function(picker){
        settings.getCurrentProfile().IndicatorColor = picker.toHEXString();
        redrawSplitIndicator();
    },
    changeProfileName: function(name){
        settings.setProfile('ProfileName', name);
    },
    nextProfile: function(){
        settings.nextProfile();
        fillProfile();
    },
    previousProfile: function(){
        settings.previousProfile();
        fillProfile();
    },
    duplicateProfile: function(){
        settings.duplicateProfile();
        fillProfile();
    },
    deleteProfile: function(){
        settings.deleteProfile();
        fillProfile();
    },
};


module.exports.init = function(){
    OverlayElement = $("#Overlay");
    chatBoxElement = $("#sendMessage");
    indicatorColorChooserElement = document.getElementById('indicatorColorChooser');
    cellColorChooserElement = document.getElementById('indicator');
    nameColorChooserElement = document.getElementById('nameColorChooser');

    chatBoxElement.on('focus',function(){ ChatBox.isActive = true; });
    chatBoxElement.on('blur',function(){ ChatBox.isActive = false; });

    indicatorColorChooser = new window.jscolor( indicatorColorChooserElement, {
        valueElement:null,
        position:'bottom',
        onFineChange: 'GameTab.changeIndicatorColor(this)',
        width:120, height:120, borderWidth:0 , insetColor:'#222', backgroundColor: '#666',
    });
    cellColorChooser = new window.jscolor( cellColorChooserElement, {
        valueElement:null,
        position: 'bottom',
        styleElement:'avatar',
        onFineChange: 'GameTab.changeCellColor(this)',
        width:120, height:120, borderWidth:0 , insetColor:'#222', backgroundColor: '#666',
    });
    nameColorChooser = new window.jscolor(nameColorChooserElement, {
        valueElement:null,
        position:'left',
        onFineChange: 'changeNameColor(this)',
        width:120, height:120, borderWidth:0 , insetColor:'#222', backgroundColor: '#666',
    }).fromString(settings.nameColor);

    $('#region').val(settings.region);
    $('#gamemode').val(settings.gameMode);
    fillProfile();

    for(var key in keybind){
        $('#page2').append(
            '<div class="row" style="margin-bottom: 10px;">' +
            '  <div class="col-sm-6" style="padding-top: 8px;">' + i18n._(key) + '</div>' +
            '  <div class="col-sm-6">' +
            '    <div class="btn btn-block" id="changebutton-' + key + '" style="width:100%" onclick="settingKeybind(\'' + key + '\');">' +
            '      ' + keybind.genKeySequenceReadable(keybind[key]) +
            '    </div>' +
            '  </div>' +
            '</div>'
        );
    }

    module.exports.mainCanvas = document.getElementById("canvas-main");
};


