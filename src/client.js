'use strict';

var gameutil = require('./gameutil');
var config = require('./config');
var Cell = require('./entity/cell');
var Packet = require('./packet');
var settings = require('./settings');

var EventEmitter = require('events').EventEmitter;

/*
 * Client: process raw data from server, provide some statistics
 * #events:
 *  - spawn
 *  - death
 *  - mapSizeChanged
 *  - logoutPrompt
 */
var Client = function(GM){
    this.GameManager = GM;
    EventEmitter.call(this);
};
Client.prototype = {
    packetProcessor: {
        16: function(packet){ /* WorldUpdate */
            var beingEaten = false;
            var currentTime = this.lastWorldUpdate = Date.now();
            var eatEventCount = packet.getUint16();

            /* eat event */
            for (var l = 0;l < eatEventCount;++l) {
                var eater = this.allCellsMap[packet.getUint32()];
                var victim = this.allCellsMap[packet.getUint32()];

                if(victim && eater){
                    if(this.myCells.indexOf(victim) !== -1) beingEaten = true;
                    this.destroyCell(victim);
                }
            }

            /* new cells or cell update */
            for (;;) {
                var id= packet.getUint32();
                if (0 === id) {
                    break;
                }

                var x = packet.getInt32();
                var y = packet.getInt32();
                var size = packet.getInt16();
                var r= packet.getUint8();
                var g= packet.getUint8();
                var b= packet.getUint8();
                var color = config.getCellColor(gameutil.rgbToHex(r, g, b));
                var miniclip = '';
                var name = '';

                var flag = packet.getUint8();
                var isVirus = !!(flag & 1);
                if (flag & 2) { packet.seek(packet.getUint32()); }
                if (flag & 4) { miniclip = packet.getStringU8(); }

                name = packet.getStringU16();

                var cell = null;
                if (this.allCellsMap.hasOwnProperty(id)) {
                    cell = this.allCellsMap[id];
                    cell.lastUpdate = currentTime;
                    cell.ox = cell.x;
                    cell.oy = cell.y;
                    cell.oSize = cell.size;
                    cell.nx = x;
                    cell.ny = y;
                    cell.nSize = size;
                    cell.color = color;
                    if(miniclip)cell.miniclip = miniclip;
                    if(name)cell.setName(name);
                } else {
                    cell = Cell.create(id, x, y, size, color, name, currentTime, miniclip);
                    this.allCells.push(cell);
                    this.allCellsMap[id] = cell;
                }
                cell.isVirus = isVirus;

                if(this.myIDs.indexOf(id) !== -1){
                    if(this.myCells.indexOf(cell) === -1){
                        this.myCells.push(cell);
                        if (1 === this.myCells.length) {
                            this.highScoreThisRound = 0;
                            this.emit('spawn');
                        }
                    }
                }
            }

            /* destroy event */
            var destroyCount = packet.getUint32();
            while(destroyCount--) {
                var toDestroyID = packet.getUint32();
                var toDestroy = this.allCellsMap[toDestroyID];
                if (toDestroy) {
                    if(this.myCells.indexOf(toDestroy) !== -1) beingEaten = true;
                    this.destroyCell(toDestroy);
                }
            }

            /* detect all cell dead */
            if (0 === this.myCells.length && beingEaten) {
                this.emit('death');
            }
        },
        17: function(packet){ /* View update on spectate mode */
            this.viewCenterX = packet.getFloat32();
            this.viewCenterY = packet.getFloat32();
            this.view        = packet.getFloat32();
        },
        20: function(){ /* Reset player */
            this.myCells = [];
            this.myIDs = [];
        },
        21: function(){ /* Debug line */
            console.log('drawDebugLine');
        },
        32: function(packet){ /* Own cell */
            var newCellID = packet.getUint32();
            this.myIDs.push(newCellID);
        },
        49: function(packet){/* Normal Leaderboard */
            var count = packet.getUint32();
            var leaderboard = [];
            while(count--) {
                var p = packet.getUint32(packet);
                leaderboard.push({
                    id : p,
                    name : packet.getStringU16(),
                });
            }
        },
        50: function(packet){ /* Team Leaderboard */
            var teamcount = packet.getUint32();
            var teamLeaderBoard = [];
            while(teamcount--){
                teamLeaderBoard.push(packet.getFloat32());
            }
        },
        64: function(packet){ /* Game area size */
            this.mapMinX = packet.getFloat64();
            this.mapMinY = packet.getFloat64();
            this.mapMaxX = packet.getFloat64();
            this.mapMaxY = packet.getFloat64();
            this.viewCenterX = (this.mapMinX + this.mapMaxX) / 2;
            this.viewCenterY = (this.mapMinY + this.mapMaxY) / 2;
            this.emit('mapSizeChanged');
        },
        102: function(packet){ /* Player statistics */
            console.log(packet.dataView);
        },
        104: function(){ /* logout */
            this.emit('logoutPrompt');
        },
        240: function(packet){ /* Packet length */
            var messageLength = packet.getUint32(); // currently unused
            this.processPacket(packet);
        },
    },
    processData: function(dataView){
        this.processPacket(new Packet(dataView, 0));
    },
    processPacket: function(packet) {
        var packetID = packet.getUint8();
        var processor = this.packetProcessor[packetID];
        if(typeof processor === 'function'){
            processor.call(this, packet);
        }else{
            console.log('[Client]unknown packet id =', packetID);
        }
    },
    destroyCell: function(cell){
        /* Remove from global container */
        var i = this.allCells.oindexOf(cell);
        if(-1 !== i){
            this.allCells.spliceOne(i);
        }
        delete this.allCellsMap[cell.id];

        /* Remove from my cell container */
        i = this.myCells.oindexOf(cell);
        if (-1 !== i) {
            this.myCells.spliceOne(i);
        }
        i = this.myIDs.oindexOf(cell.id);
        if (-1 !== i) {
            this.myIDs.spliceOne(i);
        }
        cell.release();
    },
    getTotalMass: function() {
        var ret = 0;
        for (var c = 0;c < this.myCells.length;c++) {
            ret += this.myCells[c].nSize * this.myCells[c].nSize;
        }
        return ~~(ret / 100);
    },
    getRelativeSize: function(cell){
        var selected = this.getSelectedCell();
        if(selected){
            var pct = ~~(100 * gameutil.getMass(cell.nSize) / gameutil.getMass(selected.nSize)) / 100;
            if(selected.nSize <= cell.nSize){
                return pct.toString();
            }else{
                return "1/" + (1/pct).toString();
            }
        }else{
            return gameutil.getMass(cell.nSize).toString();
        }
    },
    calculateStatistics: function(){
        var currentTime = Date.now(), i;
        for (i = 0;i < this.allCells.length;i++) {
            this.allCells[i].updatePos(currentTime);
        }
        var selectedCell = this.getSelectedCell();
        var selectedCellMass = gameutil.getMass(selectedCell.nSize);
        // Get cell skin, Determine cell type
        for (i = 0;i < this.allCells.length;i++) {
            var cell = this.allCells[i];
            var massValue = gameutil.getMass(cell.nSize);

            /* Cell type and skins */
            if(massValue < 9){
                cell.type = Cell.type.PELLET;
                cell.skin = null;
            }else if(cell.isVirus){
                cell.type = Cell.type.VIRUS;
                cell.skin = null;
            }else{
                cell.updateSkin();
                if(false /* is me */){
                    cell.type = Cell.type.ME;
                }else if(false /* is teammate */){
                    cell.type = Cell.type.TEAMMATE;
                }else if(cell.skin){
                    cell.type = Cell.type.WITHSKIN;
                }else if(massValue < 18){
                    cell.type = Cell.type.SMALL;
                }else{
                    cell.type = Cell.type.NORMAL;
                }
            }

            if(cell.type === Cell.type.VIRUS){
                cell.massText = massValue +  ' / ' + ~~(1.33 * massValue);
            }else{
                if(settings.advancedCellInfo){
                    if(massValue > selectedCellMass)
                        massValue = Math.ceil(massValue * 100) / selectedCellMass / 100;
                    else
                        massValue = '1 / ' + Math.ceil(selectedCellMass * 100) / massValue / 100;
                }
                if(cell.type === Cell.type.ME || cell.type === Cell.type.teammate){
                    cell.massText = massValue + '[' + gameutil.getShotsAvailable(cell) + ']';
                }else{
                    cell.massText = massValue;
                }
            }
        }

        this.currentScore = this.getTotalMass();
        this.highScore = Math.max(this.currentScore, this.highScore);
        this.highScoreThisRound = Math.max(this.currentScore, this.highScoreThisRound);

        this.allCells.sort(gameutil.compareCellBySize);
        this.myCells = this.myCells.slice(0).sort(gameutil.compareSplitOrder);
    },
    getSelectedCell: function(){
        if(this.isPlayerAlive()){
            if(!this.allCellsMap.hasOwnProperty(this.selectedCellID)){
                this.selectedCellID = this.myCells[0].id;
            }
        }else if(this.allCells.length > 0){
            this.selectedCellID = this.allCells[this.allCells.length - 1].id;
        }else{
            return {nSize: 1, x:0, y:0};
        }
        return this.allCellsMap[this.selectedCellID];
    },
    switchSelectedCell: function(index){
        if(this.isPlayerAlive()){
            if(index === undefined){
                // TODO
            }else{
                if(index < this.myCells.length){
                    this.selectedCellID = this.myCells[index].id;
                }else{
                    this.selectedCellID = this.myCells[0].id;
                }
            }
        }
    },
    isPlayerAlive: function(){
        return this.myCells.length !== 0;
    },
    get mapWidth(){ return this.mapMaxX - this.mapMinX; },
    get mapHeight(){ return this.mapMaxY - this.mapMinY; },
    clear: function(){
        this.allCellsMap = {};
        this.allCells = [];
        this.myCells = [];
        this.myIDs = [];

        this.selectedCellID = null;

        this.currentScore = 0;
        this.highScore = 0;
        this.highScoreThisRound = 0;

        this.mapMinX = -7071.067811865476;
        this.mapMinY = -7071.067811865476;
        this.mapMaxX = 7071.067811865476;
        this.mapMaxY = 7071.067811865476;

        this.viewCenterX = 0;
        this.viewCenterY = 0;
        this.view = 1;
    },
    init: function(server){
        this.clear();

        this.server = server;
        var _this = this;
        server.on('message', function(dataView){_this.processData(dataView);});
        server.on('open', function(){_this.clear();});
    },
};
$.extend(Client.prototype, EventEmitter.prototype);

module.exports = Client;
