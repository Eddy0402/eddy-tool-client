'user strict';

var ui = require('./ui');
var settings = require('./settings');
var keybind = require('./keybind');
var i18n = require('./i18n');
var config = require('./config');
var gameutil = require('./gameutil');
var GameManager = require('./gamemanager');
var Cell = require('./entity/cell');
var Numberic = require('./entity/numberic');
var text = require('./entity/text');

function LoadPlugin(Config){
    $(document).ready(function(){
        config.init(Config);
        console.log('Config:', config);

        settings.init();
        keybind.init();

        ui.init();
        i18n.init();
        Numberic.init();
        text.init();
        Cell.init(GameManager);

        GameManager.init();

        ui.loadAnimation.end();
    });
}
window.LoadPlugin = LoadPlugin;
