'use strict';

var cellColorMap = require('./entity/cellcolormap');

function extend (target) {
  for(var i=1; i<arguments.length; ++i) {
    var from = arguments[i];
    if(typeof from !== 'object') continue;
    for(var j in from) {
      if(from.hasOwnProperty(j)) {
        target[j] = typeof from[j]==='object' ?
          extend({}, target[j], from[j]) :
          from[j];
      }
    }
  }
  return target;
}

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
                asset: {
                    base: base + 'assets/',
                    number: {
                        darkbold : ['NumberDarkBoldL.png', 'NumberDarkBoldS.png'],
                        dark : ['NumberDarkL.png', 'NumberDarkS.png'],
                        light : ['NumberLightL.png', 'NumberLightS.png'],
                    },
                }
            },
            cellColorMap: cellColorMap,
        };
        extend(this, defaultConfig, newConfig);
    },
    getCellColor: function(color){
        return this.cellColorMap[color] || color;
    },
};

module.exports = Config;
