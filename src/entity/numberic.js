/*
 * Render nuberic value with pre-drawn image
 */

'use strict';

var config = require('../config');

var numbericTextImage = {};
var NumberRenderObject = gamecore.Pooled('NumberRenderObject',
{
    create: function(size, type, hasBack){
        var newObj = this._super();
        newObj.size = size;
        newObj.type = numbericTextImage[type];
        newObj.hasBack = hasBack;
        newObj.cachedCanvas = document.createElement("canvas");
        newObj.ctx = newObj.cachedCanvas.getContext("2d");
        return newObj;
    },
},
{
    text: ['1','2','3','4','5','6','7','8','9','0','/','[',']','.'],
    init : function(size, type, hasBack){
        this.size = size;
        this.type = numbericTextImage[type];
        this.hasBack = hasBack;
    },
    onRelease : function(){
        this.textToDraw = "";
        this.needRedraw = true;
        this.scale = 1;
    },
    size : 16,
    type: null,
    textToDraw : "",
    needRedraw : true,
    scale : 1,
    cachedCanvas : null,
    ctx : null,
    hasBack: false,

    setSize : function(size) {
        if (this.size != size) {
            this.size = size;
            this.needRedraw = true;
        }
    },
    setScale : function(scale) {
        if (this.scale != scale) {
            this.scale = scale;
            this.needRedraw = true;
        }
    },
    setValue : function(text) {
        if (text != this.textToDraw) {
            this.textToDraw = text;
            this.needRedraw = true;
        }
    },
    getSize: function(){
        var WIDTH = this.size * 0.53;
        var HEIGHT = this.size;

        return {
            /* Estimated, since measureText is super slow */
            width: this.textToDraw.length * WIDTH * this.scale,
            height: HEIGHT * this.scale,
        };
    },
    render : function() {
        var targetMipmap = (this.size * this.scale < 28) ? this.type[0] : this.type[1];

        if (this.needRedraw && 0 !== targetMipmap.width && targetMipmap.complete) {
            this.needRedraw = false;

            var ctx = this.ctx;
            var size = this.size;
            var textToDraw = this.textToDraw;
            var scale = this.scale;

            var WIDTH = this.size * 0.53;
            var HEIGHT = this.size;

            var width = this.cachedCanvas.width = textToDraw.length * WIDTH * scale;
            var height = this.cachedCanvas.height = HEIGHT * scale;

            if(this.hasBack){
                ctx.fillStyle='rgba(0,0,0,0.15)';
                ctx.fillRect(0,0,width,height);
            }

            for(var i = 0; i < textToDraw.length; ++i){
                var index = this.text.indexOf(textToDraw.charAt(i));
                if(index != -1){
                    ctx.drawImage(
                        targetMipmap,
                        targetMipmap.width / this.text.length * index,
                        0,
                        targetMipmap.width / this.text.length,
                        targetMipmap.height,
                        i * WIDTH * scale,
                        0,
                        WIDTH * scale,
                        HEIGHT * scale
                    );
                }
            }

        }
        return this.cachedCanvas;
    }
});

module.exports = {
    TYPE_DARKBOLD : 0,
    TYPE_DARK     : 1,
    TYPE_LIGHT    : 2,
    init: function(){
        var type = ['darkbold', 'dark', 'light'];

        for(var i = 0;i < type.length;++i){
            var t = type[i];
            numbericTextImage[i] = [new Image(), new Image()];
            numbericTextImage[i][0].src = config.resource.asset.base + config.resource.asset.number[t][0];
            numbericTextImage[i][1].src = config.resource.asset.base + config.resource.asset.number[t][1];
        }
    },
    create: function(args){
        return NumberRenderObject.create.apply(NumberRenderObject, arguments);
    },
};
