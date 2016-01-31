'use strict';

var storage = {
    /* Simple object */
    get: function(key, defaultValue){
        var storage = window.localStorage.getItem('_' + key);
        if(storage){
            try{
                return JSON.parse(storage).data;
            }catch(e){
                return defaultValue;
            }
        }else{
            return defaultValue;
        }
    },
    set: function(key ,value){
        window.localStorage.setItem('_' + key,
                                    JSON.stringify({data:value}));
    }
};

module.exports = storage;
