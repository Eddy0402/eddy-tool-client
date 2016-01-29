'use strict';

var ui = {
    initBlank: function(base,head){
        $('head').html(head.replace('BASEURL', base));
        $('body').html('');
    },
    init: function(html_ui){

    },
    loadAnimation: {
        start: function(html_load){
            $('body').append(html_load);
        },
        end: function(){

        },
        progress: function(){

        },
    },
};

module.exports = ui;
