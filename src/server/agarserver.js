'use strict';

var ui = require('../ui');
var EventEmitter = require('events').EventEmitter;

function newArrayBufferDataView(a) {
    return new DataView(new ArrayBuffer(a));
}

/*
 * AgarServer: communicate to agar.io server and provide `server`
 *             interface(see README)
 * #event:
 *  - open(ws)
 *  - message(DataView)
 *  - close
 *  - error(reason)
 */
var Agarserver = function(GM){
    this.GameManager = GM;
    EventEmitter.call(this);
};
Agarserver.prototype = {
    refresh: function(region, gameMode){
        if(!this.reqID) this.reqID = 0;
        var curReqID = ++this.reqID;
        var _this = this;

        console.log("Find " + region + gameMode);

        $.ajax("https://m.agar.io/", {
            error : function(){
                _this.emit('error','Cannot get data from m.agar.io');
            },
            success : function(c) {
                if (curReqID === _this.reqID) { /* if refresh multiple times, only last one counts */
                    c = c.split("\n");
                    if (c[2]) {
                        console.log("Server message",c[2]);
                    }
                    _this.connect("ws://" + c[0], c[1]);
                }
            },
            dataType : "text",
            method : "POST",
            cache : false,
            crossDomain : true,
            data : (region + gameMode || "?") + "\n2200049715"
        });
    },
    joinParty: function(token){
        var _this = this;
        $.ajax(window.location.protocol + "//m.agar.io/getToken", {
            error : function(qXHR, textStatus, errorThrown) {
                _this.emit('error', 'Party code expired');
            },
            success : function(res) {
                res = res.split("\n");
                _this.connect("ws://" + res[0], token);
                ui.gameTab.setConnectToken(token);
            },
            dataType : "text",
            method : "POST",
            cache : false,
            crossDomain : true,
            data : token,
        });
    },
    connect: function(address, connectToken){
        if ("https:" === window.location.protocol) {
            var l = address.split(":");
            address = l[0] + "s://ip-" + l[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+l[2] + 2E3);
        }
        this.address = address;
        if(connectToken !== ''){
            ui.gameTab.setConnectToken(connectToken);
            this.connectToken = connectToken;
        }
        console.log("Connecting to " + address);

        try{
            var _this = this;
            var newWs = new WebSocket(address);
            if (this.ws) {
                try {
                    this.ws.close();
                } catch (error) {
                }
            }
            this.ws = newWs;
            this.ws.binaryType = "arraybuffer";

            this.ws.onopen = function(){
                console.log("socket open");

                var a;
                a = newArrayBufferDataView(5);
                a.setUint8(0, 254);
                a.setUint32(1, 5, true);
                _this.sendRawBuffer(a);
                a = newArrayBufferDataView(5);
                a.setUint8(0, 255);
                a.setUint32(1, 2200049715, true);
                _this.sendRawBuffer(a);

                a = newArrayBufferDataView(1 + connectToken.length);
                a.setUint8(0, 80);
                for (var b = 0;b < connectToken.length;++b) {
                    a.setUint8(b + 1, connectToken.charCodeAt(b));
                }
                _this.sendRawBuffer(a);
                _this.emit('open', _this.ws.url, connectToken);
            };
            this.ws.onmessage = function(a){
                _this.emit('message', new DataView(a.data));
            };
            this.ws.onclose = function(){
                _this.emit('close');
            };
            this.ws.onerror= function(){
                _this.emit('error', 'Socket error');
            };
        }catch(error){
            console.log('Cannot connect to',address,', ',error);
        }
    },
    connected: function() {
        return this.ws && this.ws.readyState === this.ws.OPEN;
    },
    setNickAndSpawn: function(nick){
        if (this.connected()) {
            var a = newArrayBufferDataView(1 + 2 * nick.length);
            a.setUint8(0, 0);
            var c = 0;
            for (;c < nick.length;++c) {
                a.setUint16(1 + 2 * c, nick.charCodeAt(c), true);
            }
            this.sendRawBuffer(a);
            this.nick = nick;
        }
    },
    sendCmd: function(a){
        if (this.connected()) {
            var c = newArrayBufferDataView(1);
            c.setUint8(0, a);
            this.sendRawBuffer(c);
        }
    },
    sendRawBuffer: function(d){
        this.ws.send(d.buffer);
    },

    /* player action */
    mouseUpdate: function(pos){
        if (this.connected()) {
            var buf = newArrayBufferDataView(13);
            buf.setUint8(0, 16);
            buf.setInt32(1, pos[0], true);
            buf.setInt32(5, pos[1], true);
            buf.setUint32(9, 0, true);
            this.sendRawBuffer(buf);
        }
    },
    spectate: function(){
        this.sendCmd(1);
    },
    Q: function(){
        this.sendCmd(18);
    },
    W: function(){
        this.sendCmd(21);
    },
    space: function(){
        this.sendCmd(17);
    },
    afk: function(){
        this.sendCmd(19);
    },
    sendLoginIdentifier: function(context, token) {
        if (this.connected()) {
            var buf = newArrayBufferDataView(2 + token.length);
            buf.setUint8(0, 82);
            buf.setUint8(1, context);
            for (var c = 0;c < token.length;++c) {
                buf.setUint8(c + 2, token.charCodeAt(c));
            }
            this.sendRawBuffer(buf);
        }
    },

    ws: null,
    x: 0, y: 0,
    nick: '',
    connectToken: '',
    client: null,
};
$.extend(Agarserver.prototype, EventEmitter.prototype);

module.exports = Agarserver;
