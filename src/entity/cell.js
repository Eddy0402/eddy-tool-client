'use strict';

var _ = require('lodash');

var GameManager;

//var config = require('../config');
var settings = require('../settings');
var gameutil = require('../gameutil');
var text = require('./text');
var Numberic = require('./numberic');

var virusNameCache = [];
var imgCache = {};
var DachongImgCache = {};
var miniclipImgCache = {};
var teammateImgCache = {};

var type = {
    ME       : 1,
    TEAMMATE : 2,
    WITHSKIN : 3,
    VIRUS    : 4,
    NORMAL   : 5,
    SMALL    : 6,
    PELLET   : 7,
};

var Huge = 2.65,
    Large = 1.24,
    Small = 0.73,
    Tiny = 0.370,
    Tiny_Twice = 0.1860;

var skinfunc = [
    function teamSkin(cell){
        if(!settings.skin.team) return null;
        return null;
    },
    function imgurSkin(cell){
        if(!settings.skin.imgur) return null;
        if(imgCache.hasOwnProperty(cell.name)) return imgCache[cell.name];
        if(_.startsWith(cell.name, "i/")){
            imgCache[cell.name] = new Image();
            imgCache[cell.name].src = "http://i.imgur.com/"+ cell.name.slice(2) +".png";
            return imgCache[cell.name];
        }else{
            return null;
        }
    },
    function yinSkin(cell){
        if(!settings.skin.yin) return null;
        if(!cell.yinImg) return null;
        var imgCode = cell.yinImg;
        if(!DachongImgCache.hasOwnProperty(imgCode)){
            DachongImgCache[imgCode] = new Image();
            DachongImgCache[imgCode].src = "http://upload.happyfor.me/getimg.php?id=" + imgCode;
        }
        return DachongImgCache[imgCode];
    },
    function miniclipSkin(cell){
        if(!settings.skin.miniclip) return null;
        if(miniclipImgCache.hasOwnProperty(cell.miniclip)) return miniclipImgCache[cell.miniclip];
        if(window.miniclipSkins.hasOwnProperty(cell.miniclip)){
            miniclipImgCache[cell.miniclip] = new Image();
            miniclipImgCache[cell.miniclip].src = window.miniclipSkins[cell.miniclip];
        }else{
            if(cell.miniclip){
                if(!window.logminiclip)window.logminiclip = [];
                window.logminiclip.push(cell.miniclip);
            }
            return null;
        }
    },
    function vanillaSkin(cell){
        if(!settings.skin.vanilla) return null;
        if(!cell.name) return null;
        var cellNameLowerCase = cell.name.toLowerCase();
        if(imgCache.hasOwnProperty(cellNameLowerCase)) return imgCache[cellNameLowerCase];
        if(window.defaultSkins.indexOf(cellNameLowerCase) !== -1){
            imgCache[cellNameLowerCase] = new Image();
            imgCache[cellNameLowerCase].src = "http://agar.io/skins/" + cellNameLowerCase + ".png";
            return imgCache[cellNameLowerCase];
        }else{
            return null;
        }
    },
];

/* Cell object */
var Cell = window.gamecore.Pooled('Cell',
{
    create: function(id, x, y, size, color, name, currentTime, miniclip)
    {
        var newCell = this._super();
        newCell.massTextCache = Numberic.create(1, Numberic.TYPE_DARKBOLD, true);
        newCell.id = id;
        newCell.setName(name);
        newCell.x = newCell.ox = newCell.nx = x;
        newCell.y = newCell.oy = newCell.ny = y;
        newCell.size = newCell.oSize = newCell.nSize = size;
        newCell.color = color;
        newCell.lastUpdate = currentTime;
        newCell.isVirus = false;
        newCell.teammate = null;
        newCell.miniclip = miniclip;
        return newCell;
    }
},
{
    init : function(id, x, y, size, color, name, currentTime, miniclip){
        this.id = id;
        this.setName(name);
        this.x = this.ox = this.nx = x;
        this.y = this.oy = this.ny = y;
        this.size = this.oSize = this.nSize = size;
        this.color = color;
        this.lastUpdate = currentTime;
        this.isVirus = false;
        this.miniclip = miniclip;
        this.teammate = null;
    },
    onRelease : function(){
        if(this.nameCache){
            if(!this.isVirus){ /* Special case: virus cache is preserved */
                this.nameCache.release();
            }
            this.nameCache = null;
        }
        this.yinImg = null;
    },
    id : 0,
    nameCache : null,
    massTextCache : null,
    yinImg : null,
    name : null,
    displayName: null,
    miniclip: null,
    x : 0,
    y : 0,
    ox : 0,
    oy : 0,
    nx : 0,
    ny : 0,
    size : 0,
    oSize : 0,
    nSize : 0,
    color: '#FFFFFF',
    lastUpdate : 0,
    isVirus : false,
    massText: '',
    getNameSize : function() {
        return Math.max(~~(0.3 * this.size), 24);
    },
    setName : function(name) {
        this.name= name;
        if (name) {
            var temp = name.match(/\u0001([\u0002-\uffff]|[\u0002-\uffff]\uffff)$/g);
            if(temp){
                var code = temp[0].split("\u0001")[1];
                if(code.length > 1){
                    this.yinImg = code.charCodeAt(0) + 65534;
                }else if(code.length === 1){
                    this.yinImg = code.charCodeAt(0);
                }
                this.displayName = name.replace(temp[0], '');
            }else{
                this.displayName = name;
            }
        }else{
            this.displayName = '';
        }
    },
    updatePos : function(currentTime) {
        var a;
        a = (currentTime - this.lastUpdate) / 120;
        a = 0 > a ? 0 : 1 < a ? 1 : a;
        this.x = a * (this.nx - this.ox) + this.ox;
        this.y = a * (this.ny - this.oy) + this.oy;
        this.size = a * (this.nSize - this.oSize) + this.oSize;
        return a;
    },
    drawAdditionalStroke : function(ctx){
        var color = '#FFFFFF';
        if(settings.drawAdditionalStroke){
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5 * this.size * settings.cellBorderWidth;
            ctx.beginPath();
            ctx.arc(this.x,
                    this.y,
                    1.15 * this.size,
                    0,
                    2 * Math.PI,
                    false);
            ctx.stroke();
        }
    },
    polyPath: function(ctx){
        ctx.beginPath();
        ctx.moveTo (this.x +  this.size * Math.cos(0), this.y +  this.size *  Math.sin(0));
        var side = Math.max(~~(this.size * this.size)/100, 6);
        for (var i = 1,angle = 2 * Math.PI / side; i <= side;i += 1) {
            ctx.lineTo (this.x + this.size * Math.cos(i * angle), this.y + this.size * Math.sin(i * angle));
        }
    },
    circlePath: function(ctx, stroke){
        ctx.beginPath();
        ctx.arc(~~this.x,
                ~~this.y,
                stroke ?
                    this.size - 0.5 * this.size * settings.cellBorderWidth :
                    this.size,
                0,
                2 * Math.PI,
                false);
    },
    stroke: function(ctx){
        ctx.lineWidth = this.size * settings.cellBorderWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    },
    getHintColor: function(){
        return '#FFFFFF';
    },
    renderSkin: function(ctx){
        ctx.save();
        ctx.clip();
        ctx.drawImage(this.skin, ~~this.x - ~~this.size, ~~this.y - ~~this.size, 2 * ~~this.size, 2 * ~~this.size);
        ctx.restore();
    },
    updateSkin: function() {
        for(var i = 0, l = settings.skinOrder.length;i < l;++i){
            var skin = skinfunc[settings.skinOrder[i]](this);
            if(skin && 0 !== skin.width && skin.complete){
                this.skin = skin;
                return;
            }
        }
        this.skin = null;
    },
    renderTeam: function(ctx, s){
        this.renderNormal(ctx, s);
    },
    renderVirus: function(ctx){
        var s = settings.cellDisplay.virus;
        ctx.fillStyle = settings.color.Virus;
        ctx.strokeStyle = settings.color.VirusStroke;
        this.circlePath(ctx, s.stroke);
        if(s.transparent) ctx.globalAlpha = 0.85;
        ctx.fill();
        if(s.transparent) ctx.globalAlpha = 1;

        var scale = Math.ceil(GameManager.MainCanvas.getScale() * 10) / 10;
        var yPos = this.y;
        if(s.name) yPos += this.drawName(ctx, scale);
        if(s.mass)this.drawMass(ctx, yPos, this.getNameSize() * 1, false, Numberic.TYPE_DARKBOLD, scale);
    },
    renderNormal: function(ctx, s){
        ctx.fillStyle = settings.hintColor ? this.getHintColor() : this.color;
        ctx.strokeStyle = settings.hintColor ? this.getHintColor() : this.color;
        this.circlePath(ctx, s.stroke);
        if(s.transparent) ctx.globalAlpha = 0.5;
        ctx.fill();
        if(this.skin)this.renderSkin(ctx);
        if(s.stroke)this.stroke();
        if(s.transparent) ctx.globalAlpha = 1;

        var scale = Math.ceil(GameManager.MainCanvas.getScale() * 10) / 10;
        var yPos = this.y;
        if(s.name) yPos += this.drawName(ctx, scale);
        if(s.mass)this.drawMass(ctx, yPos, this.getNameSize() * 1.5, true, Numberic.TYPE_LIGHT, scale);
    },
    renderSmall: function(ctx, s){
        ctx.fillStyle = settings.hintColor ? this.getHintColor() : this.color;
        this.polyPath(ctx);
        ctx.fill();

        var scale = Math.ceil(GameManager.MainCanvas.getScale() * 10) / 10;
        var yPos = this.y;
        if(s.name) yPos += this.drawName(ctx, scale);
        if(s.mass)this.drawMass(ctx, yPos, this.getNameSize() * 1.5, true, Numberic.TYPE_LIGHT, scale);
    },
    renderPellet: function(ctx){
        ctx.fillStyle = settings.cellDisplay.pellet.color ?
             this.color : settings.color.Pellet;
        this.polyPath(ctx);
        ctx.fill();
    },
    render: function(ctx){ /* draw cell */
        switch(this.type){
            case type.ME:
                this.renderTeam(ctx,settings.cellDisplay.me);
                break;
            case type.TEAMMATE:
                this.renderTeam(ctx,settings.cellDisplay.teammate);
                break;
            case type.VIRUS:
                this.renderVirus(ctx);
                break;
            case type.WITHSKIN:
                this.renderNormal(ctx, settings.cellDisplay.withSkin);
                break;
            case type.NORMAL:
                this.renderNormal(ctx, settings.cellDisplay.normal);
                break;
            case type.SMALL:
                this.renderSmall(ctx, settings.cellDisplay.small);
                break;
            case type.PELLET:
                this.renderPellet(ctx);
                break;
        }
    },
    drawName : function(ctx, scale){
        // Give virus a name of the # of shots needed to split it.
        if (this.isVirus) {
            var shotsNeeded = gameutil.getVirusShotsNeeded(this.nSize);
            if(shotsNeeded >= 1 && shotsNeeded <= 7){
                this.nameCache = virusNameCache[shotsNeeded-1];
            }else{
                return 0;
            }
        }else if(true || settings.globalNickNameToggle && this.displayName){
            if (!this.nameCache) {
                this.nameCache = text.create(this.getNameSize(), settings.nameColor, true, "#000000");
            }
            this.nameCache.setValue(this.displayName);
            this.nameCache.setSize(this.getNameSize());
        }else{
            return 0;
        }
        var nameCache = this.nameCache;
        nameCache.setScale(scale);
        var xLength= ~~(nameCache.getSize().width / scale);
        var yLength= ~~(nameCache.getSize().height / scale);
        /* Prevent drawing text that is too large */
        if(this.nSize * scale < 800){
            var nameCacheImg = nameCache.render();
            ctx.drawImage(nameCacheImg, ~~this.x - ~~(xLength/ 2), ~~this.y - ~~(yLength / 2), xLength, yLength);
        }
        return this.isVirus ? yLength / 1.8 : yLength / 2;
    },
    drawMass : function(ctx, yPos, size, back, type, scale){
        var massTextCache = this.massTextCache;
        massTextCache.setSize(size);
        massTextCache.setBack(back);
        massTextCache.setType(type);
        massTextCache.setScale(scale);
        massTextCache.setValue(this.massText);
        var img = massTextCache.render();
        var xLength = ~~(img.width / scale);
        var yLength = ~~(img.height / scale);
        ctx.drawImage(img, ~~this.x - ~~(xLength / 2), yPos, xLength, yLength);
    },
});

module.exports = {
    type: type,
    init: function(GM){
        GameManager = GM;
        for(var i = 0;i < 7;++i){
            virusNameCache[i] = Numberic.create(160 - 8 * i, Numberic.TYPE_DARKBOLD, false);
            virusNameCache[i].setValue( (i + 1).toString());
        }
    },
    create: function(args){
        return Cell.create.apply(Cell, arguments);
    },
};
