'user strict';

var ui = require('./ui');
var settings = require('./settings');
var keybind = require('./keybind');
var i18n = require('./i18n');
var config = require('./config');

function LoadPlugin(GM, Config){
    config.override(Config);
    console.log('Config:', config);

    function loadHTML(url, callback, isCached){
        if(!isCached){
            url = url + '?ts=' + new Date().getTime();
        }
        GM.xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response){
                callback(response.responseText);
            }
        });
    }

    function loadScript(url, callback, isCached) {
        if(!isCached){
            url = url + '?ts=' + new Date().getTime();
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        head.appendChild(script);
    }

    function Init(){
        loadHTML(config.resource.html.base + config.resource.html.ui, function(uiHtml){
            settings.init();
            keybind.init();

            ui.init(uiHtml);
            i18n.init();

            ui.loadAnimation.end();
        });
    }

    loadHTML(config.resource.html.base + config.resource.html.initHead,function(initHead){
        ui.initBlank(config.resource_base, initHead);
        console.log('Initialized blank page');

        loadHTML(config.resource.html.base + config.resource.html.load,function(load){
            ui.loadAnimation.start(load);

            /* Load third-party libraries */
            var pending = config.resource.thirdParty.list.length;
            for(var i = 0,l = pending;i < l;++i){
                loadScript(config.resource.thirdParty.base+ config.resource.thirdParty.list[i], function(){
                    if(--pending == 0){
                        /* all library loaded, start main process */
                        Init();
                    }
                });
            }
        });
    });
}
window.LoadPlugin = LoadPlugin;
