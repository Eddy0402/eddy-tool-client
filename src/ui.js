'use strict';

var ui = {
    initBlank: function(base,head){
        $('head').html(head.replace('BASEURL', base));
        $('body').html('');
    },
    init: function(html_ui){
        $('body').append(html_ui);
    },
    loadAnimation: {
        start: function(html_load){
            $('body').append(html_load);
        },
        end: function(){
            setTimeout(function(){$('#loadOverlay').addClass('loadComplete')}, 0);
            setTimeout(function(){$('#loadOverlay').remove()}, 1000);
        },
        progress: function(){

        },
    },
};

module.exports = ui;
