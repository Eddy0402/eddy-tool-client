'use strict';

var yAxis = ['A', 'B', 'C', 'D', 'E'];
var xAxis = ['1', '2', '3', '4', '5'];

module.exports = {
    getMass: function(x){
        return ~~(x * x / 100);
    },
    lineDistance: function( c1, c2 ){
        var xs = c2.nx - c1.nx;
        var ys = c2.ny - c1.ny;
        return Math.sqrt( xs * xs + ys * ys );
    },
    getVirusShotsNeeded: function(cellSize){
        return ~~( (149 - cellSize) / 7 );
    },
    getShotsAvailable: function(cell) {
        return ~~Math.max(0, (cell.nSize * cell.nSize - 1700) / 1800);
    },
    getPositionString: function(position, origin, mapsize){
        var x = Math.floor((position.x - origin.x) / mapsize * 5);
        var y = Math.floor((position.y - origin.y) / mapsize * 5);
        return xAxis[Math.max(Math.min(4, x), 0)] + yAxis[Math.max(Math.min(4, y), 0)];
    },
    compareCellBySize: function(a, c) {
        return a.size === c.size ? a.id - c.id : a.size - c.size;
    },
    compareSplitOrder: function(a, c) {
        return ~~(a.nSize * a.nSize / 100) < 35 ? 1 : a.id - c.id;
    },
    getDaChongRealURL: function (url, callback){
        window.GM.xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                referer:'http://cells.happyfor.me/dachong.php',
            },
            onload: function(response) {
                callback(response.finalUrl);
            }
        });
    },
    getDaChong: function(mail, password, callback){
        $.get("http://upload.happyfor.me/getimg.php?mail=" + mail + "&password="+password+ "&_t=" + Math.random(),
            function(response) {
                try{
                    var d = JSON.parse(response);
                    if(Array.isArray(d.code)){
                        callback(d.code);
                    }else{
                        callback([]);
                    }
                }catch(e){
                    callback([]);
                }
            }
        );
    },
    rgbToHex: function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
};
