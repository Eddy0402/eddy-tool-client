'use strict';
var ui = require('./ui');

var defaultConfig = {
    resource_base : 'http://127.0.0.1:8080/',
    server_url    : '127.0.0.1:8000',
};

function Init(){
    ui.init();
}

function LoadPlugin(GM, Config){
    if(!Config){
        Config = defaultConfig;
    }

    var Resource = {
        html: {
            base: Config.resource_base + 'html/',
            initHead: 'inithead.html',
            load: 'load.html',
            ui: 'ui.html',
        },
        thirdParty: {
            base: Config.resource_base + 'third_party/',
            list: [
                'discord.min.3.10.2.js',
                'jquery.noty.packaged.min.js',
                'jscolor.js',
                'mcagario.js',
                'misc.js',
                'notytheme.js',
            ],
        },
        assets:{
            base: Config.resource_base + 'assets/',
        },
    }

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

    loadHTML(Resource.html.base + Resource.html.initHead,function(initHead){
        ui.initBlank(Resource.assets.base, initHead);

        loadHTML(Resource.html.base + Resource.html.load,function(load){
                ui.loadAnimation.start(load);
        });

        /* Load third-party libraries */
        var pending = Resource.thirdParty.list.length;
        for(var i = 0,l = pending;i < l;++i){
            loadScript(Resource.thirdParty.base+ Resource.thirdParty.list[i], function(){
                if(--pending){
                    /* all library loaded, start main process */
                    Init();
                    ui.loadAnimation.end();
                }
            });
        }
    });
}
window.LoadPlugin = LoadPlugin;
