/*
 * Cache rendered text
 */

'use strict';

var TextRenderObject = window.gamecore.Pooled('TextRenderObject',
{
    create: function(size, color, hasStroke, strokeColor){
        var newObj = this._super();
        newObj.size = size;
        newObj.color = color || '#FFFFFF';
        newObj.hasStroke = !!hasStroke;
        newObj.strokeColor = strokeColor || '#000000';
        newObj.cachedCanvas = document.createElement("canvas");
        newObj.ctx = newObj.cachedCanvas.getContext("2d");
        return newObj;
    },
},
{
    init : function(size, color, hasStroke, strokeColor){
        this.size = size;
        this.color = color;
        this.hasStroke = !!hasStroke;
        this.strokeColor = strokeColor;
    },
    onRelease : function(){
        this.textToDraw = "";
        this.needRedraw = true;
        this.scale = 1;
    },
    size : 16,
    color : "#000000",
    hasStroke : false,
    strokeColor : "#000000",
    textToDraw : "",
    needRedraw : true,
    scale : 1,
    cachedCanvas : null,
    ctx : null,

    setSize : function(size) {
        if (this.size !== size) {
            this.size = size;
            var targetSize = this.getSize();
            if(this.cachedCanvas.width / targetSize.width < 0.6 ||
               this.cachedCanvas.width / targetSize.width > 4.0){
                this.needRedraw = true;
            }
        }
    },
    setScale : function(scale) {
        if (this.scale !== scale) {
            this.scale = scale;
            var targetSize = this.getSize();
            if(this.cachedCanvas.width / targetSize.width < 0.5 ||
               this.cachedCanvas.width / targetSize.width > 2.0){
                this.needRedraw = true;
            }
        }
    },
    setStrokeColor : function(color) {
        if (this.strokeColor !== color) {
            this.strokeColor = color;
            this.needRedraw = true;
        }
    },
    setColor : function(color) {
        if (this.Color !== color) {
            this.Color = color;
            this.needRedraw = true;
        }
    },
    setValue : function(text) {
        if (text !== this.textToDraw) {
            this.textToDraw = text;
            this.needRedraw = true;
        }
    },
    getSize: function(){
        return {
            /* Estimated, since measureText is super slow */
            width: this.textToDraw.length * this.size * this.scale,
            height: this.size * 1.15 * this.scale
        };
    },
    render : function() {
        if (this.needRedraw) {
            this.needRedraw = false;

            var ctx = this.ctx;
            var size = this.size;
            var text = this.textToDraw;
            var scale = this.scale;

            ctx.font = "bolder " + size + "px cwTeXHei";

            var targetSize = this.getSize();
            this.cachedCanvas.width = targetSize.width;
            this.cachedCanvas.height = targetSize.height;

            ctx.textBaseline = "top";
            ctx.textAlign="center";
            ctx.font = "bolder " + size + "px cwTeXHei";
            ctx.scale(scale, scale);
            ctx.globalAlpha = 1;
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = this.strokeColor;
            ctx.fillStyle = this.color;

            ctx.textAlign="center";
            ctx.fillText(text, this.cachedCanvas.width / scale / 2, 0);

            if (this.hasStroke) {
                ctx.strokeText(text, this.cachedCanvas.width / scale / 2, 0);
            }
        }
        return this.cachedCanvas;
    }
});

module.exports = {
    init: function(){},
    create: function(args){
        return TextRenderObject.create.apply(TextRenderObject, arguments);
    },
};
