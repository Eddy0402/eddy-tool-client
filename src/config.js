'use strict';

var Config = {
    init: function(newConfig){
        var base = newConfig.resource_base || 'http://127.0.0.1:8080/';
        var defaultConfig = {
            resource_base : base,
            server_url    : '127.0.0.1:8000',
            resource : {
                html: {
                    base: base + 'html/',
                    initHead: 'inithead.html',
                    load: 'load.html',
                    ui: 'ui.html',
                },
                thirdParty: {
                    base: base + 'third_party/',
                    list: [
                        'discord.min.3.10.2.js',
                        'jquery.noty.packaged.min.js',
                        'jscolor.js',
                        'mcagario.js',
                        'misc.js',
                        'notytheme.js',
                        'lodash.core.js',
                    ],
                },
                asset: {
                    base: base + 'assets/',
                    number: {
                        darkbold : ['DarkBoldL.png', 'DarkBoldS.png'],
                        dark : ['DarkL.png', 'DarkS.png'],
                        light : ['LightL.png', 'LightS.png'],
                    },
                }
            },
        }
        this = $.extend(true, defaultConfig, newConfig);
    },
};

module.export = Config;
