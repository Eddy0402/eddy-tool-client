'use strict';

var AgarServer = require('./server/agarserver');
var Client = require('./client');
var MainCanvas = require('./maincanvas');
var Controller = require('./controller');
var settings = require('./settings');
var Minimap = require('./minimap/minimap');

/*
 * Player:
 * #events:
 *  - spawn
 *  - death
 *  - mapSizeChanged
 *  - logoutPrompt
 */
var Player = function(){
    this.client = new Client();
    this.mapMinX = 0;
    this.mapMinY = 0;
    this.mapMaxX = 0;
    this.mapMaxY = 0;
    var _this = this;
    this.client.on('mapSizeChanged', function(){ _this.mapSizeChanged(); });

    this.agarServer = new AgarServer();
    this.client.init(this.agarServer);
};

Player.prototype = {
    get server(){ return this.agarServer; },
    mapSizeChanged: function(){
        if(this.client.mapWidth === this.client.mapHeight){
            this.mapDimensionsKnown = true;
            this.mapMinX = this.client.mapMinX;
            this.mapMinY = this.client.mapMinY;
            this.mapMaxX = this.client.mapMaxX;
            this.mapMaxY = this.client.mapMaxY;
            this.mapSize = this.client.mapWidth;
        }else{
            this.mapDimensionsKnown = false;
        }
    },
    newServer: function(region, gameMode){
        this.agarServer.refresh(region, gameMode, function(){
            console.log('error');
        });
    },
    joinServer: function(code){
        if(code.length === 5){
            this.agarServer.joinParty(code);
        }else if(code.startsWith('ws://')){
            this.agarServer.connect(code);
        }else{
            this.agarServer.connect('ws://' + code);
        }
    },
};

var GameManager = {
    player: [],
    currentPlayerID: -1,
    get MainCanvas() { return MainCanvas; },
    get currentPlayer(){ return this.player[this.currentPlayerID]; },

    init: function(){
        var _this = this;

        Controller.init(this);
        MainCanvas.init(this);
        MainCanvas.on('preRender', function(){ _this.preRender(); });
        Minimap.init(this);

        var player = new Player();
        player.newServer(settings.region, settings.gameMode);
        this.player.push(player);

        var spectator = new Player();
        /* follow player 1's server */
        player.server.on('open', function(url, token){
            if(token.length === 5){
                spectator.agarServer.joinParty(token);
            }else if(!token){
                spectator.agarServer.connect(url); /* only works on private server */
            }
        });
        this.player.push(spectator);

        this.switchPlayer(0);
        setTimeout(function(){_this.switchPlayer(1);}, 5000);
    },
    /* Switch controller and render target to specific Player */
    switchPlayer: function(id){
        if(id >= this.player.length)id = 0;
        this.currentPlayerID = id;
        MainCanvas.startRender(this.currentPlayer);
    },
    preRender: function(){
        this.currentPlayer.client.calculateStatistics();
    },
};
module.exports = window.GameManager = GameManager;
