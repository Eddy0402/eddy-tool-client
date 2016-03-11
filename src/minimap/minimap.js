'use strict';

var EventEmitter = require('events').EventEmitter;
var Canvas = require('./canvas');
var settings = require('../settings');

/*
 * Minimap
 * #events:
 *  - loginPrompt(token)
 *  - loggedin
 *  - close
 *  - error(reason)
 */

var GameManager;
var minimapProfile = {
    isMe: true,
    name: '',
    id: '',
    cells: [],
    account: {
        provider: 'none',
        name: '',
        color: {
            get cell(){},
            get indicator() {},
        }
    }
};
var nameMap = {};
var ws= null;
var discord= null;


var Minimap = {
    init: function(GM){
        GameManager = GM;
        settings.on('change', function(key){
            // moniter profile changes:
            // SkinURL, IndicatorColor, CellColor
        });
    },
    connect: function(){
        var _this = this;
        try{
            ws = new WebSocket(settings.mapServerAddress);
            ws.binaryType = "arraybuffer";
            ws.onopen    = function() { _this.onopen();     };
            ws.onmessage = function(e){ _this.onmessage(e); };
            ws.onclose   = function() { _this.onclose();    };
            ws.onerror   = function() { _this.onerror();    };
        }catch(ex){
            this.emit('error', ex);
        }
    },
    sendMapEvent: function(pos, message){
        
    },
    channel: { GLOBAL: 0, ROOM: 1, PRIVATE: 2 },
    sendMessage: function(message, channel, to){
        
    },
    login: function(){

    },
    addPlayer: function(player){

    },

    onopen: function(){

    },
    onmessage: function(e){
        switch(e){

        }
    },
    onclose: function(){
        this.emit('close');
    },
    onerror: function(){
        this.emit('error','socket error');
    },
    updateMyCells: function(){

    },
    updatePelletForPosition: function(){
        
    },
};
$.extend(Minimap, new EventEmitter());
module.exports = Minimap;


//var minimap = function(GM, Resource, π){
//
//    /* DOM */
//    var canvas;
//    var server_list;
//    var server_listl;
//    var server_listr;
//    var addressInput;
//    var connectBtn;
//
//    var mapEvent = [];
//
//    /* MapEvent */
//    var rightMouseDown = false;
//    var leftMouseDown = false;
//    var rightMouseDownTime;
//    var mouseX;
//    var mouseY;
//    var mouseMapY;
//    var mouseMapY;
//    var eventTime = []; /* Store 5 times, treat as spam if send 5 events in 1 second */
//
//    /* Map Server */
//    function getAgarServerInfo(){
//        return {
//            address : agarServerAddress,
//            region: $(fieldName.region).val(),
//            gamemode: $(fieldName.gamemode).val() === '' ? ':ffa' : $(fieldName.gamemode).val(),
//            party: $(fieldName.room).val(),
//        };
//    }
//
//    function updateServerList(data){
//        server_listl.empty();
//        server_listr.empty();
//        for(var i = 0;i < data.length;++i){
//            var server = data[i];
//            var uid = server.uid;
//            var info = server.info;
//            var playerCount = server.playerCount;
//
//            var div = $('<div>')
//            .addClass('well well-sm');
//
//            if(i % 2 == 0){
//                div.appendTo(server_listl);
//            }else{
//                div.appendTo(server_listr);
//            }
//
//            var text = $('<div>')
//            .text('#' + uid + ': ' + playerCount + 'P')
//            .addClass('pull-left');
//            text.appendTo(div);
//
//            var joinChat = $('<a>')
//            .addClass('btn pull-right')
//            .text('Chat')
//            .click({ token: info.party, uid: uid },function(e){
//                e.preventDefault();
//                var target = $(e.currentTarget);
//                setTimeout(function(){
//                    miniMapSendRawData(msgpack.encode({
//                        type: 102,
//                        data: e.data.uid
//                    }));
//                }, 1000);
//            });
//            joinChat.appendTo(div);
//
//            var joinParty = $('<a>')
//            .addClass('btn pull-right');
//            if(info.gamemode == ':party'){
//                joinParty.text((info.party.length) == 5 ? info.party : 'private')
//                .click({ token: info.party, uid: uid },function(e){
//                    e.preventDefault();
//                    var target = $(e.currentTarget);
//                    if(e.data.token !== ''){
//                        GM.unsafeWindow.joinParty(e.data.token);
//                        $(fieldName.room).val(e.data.token);
//                    }
//                    setTimeout(function(){
//                        miniMapSendRawData(msgpack.encode({
//                            type: 102,
//                            data: e.data.uid
//                        }));
//                    }, 1000);
//                });
//            }else{
//                joinParty.text(info.gamemode);
//            }
//            joinParty.appendTo(div);
//            $('<br clear="both">').appendTo(div);
//        }
//    }
//
//    /* ws event */
//    function onOpen() {
//        reconnectTimeout = 1000;
//
//        /* This packet has to be sent first */
//        miniMapSendRawDataUnLoggedin(msgpack.encode({
//            type: 1,
//            data: 'v4',
//        }));
//        onMapServerConnected();
//    }
//
//    function onLoggedIn(){
//        $('#mapServerloginPanelOverlapScreen').addClass('hide');
//        $('#discordMapServerLogin').text('DiscordLogin');
//        isLoggedin = true;
//        miniMapSendRawData(msgpack.encode({
//            type: 100,
//            data: getAgarServerInfo(),
//        }));
//        miniMapSendRawData(msgpack.encode({
//            type: 101,
//            data: me.name
//        }));
//    }
//
//    function onMapServerConnected(){
//        addressInput.prop( "disabled", true );
//        connectBtn.text('Disconnect');
//        setTimeout(function(){connectBtn.blur()}, 0);
//    }
//
//    function onMapServerDisconnected(){
//        addressInput.prop( "disabled", false );
//        connectBtn.text('Connect');
//        setTimeout(function(){connectBtn.blur()}, 0);
//    }
//
//    function onLoginRequest(){
//        $('#mapServerloginPanelOverlapScreen').removeClass('hide');
//        if(settings.autoLogin){
//            window.mapServerLoginDiscord(π.profile.mapServerAccount.email,π.profile.mapServerAccount.password);
//        }
//    }
//
//    window.mapServerLoginDiscord = function(email, password){
//        discord = new Discord.Client();
//        discord.once('ready', function(){
//            console.log('Searching for disvord servers...');
//            for(var sid in discord.servers){
//                var server = discord.servers[sid];
//                console.log('Server: ', server.name, server.id);
//                if(server.id == discordServer){
//                    for(var channel in server.channels){
//                        var channel = server.channels[channel]
//                        console.log('    Channel: ',channel.name, channel.id);
//                        if(channel.id === discordServerLoginChannel){
//                            discord.sendMessage(channel, loginToken, {tts:false});
//                            $('#discordMapServerLogin').text('Sending login token');
//                            return;
//                        }
//                    }
//                }
//            }
//            console.log('Search end, target server is not accessiable');
//            $('#discordMapServerLogin').text('Error: no channel permission');
//        });
//        discord.login(email, password, function(error, token){
//            if(error){
//                $('#discordMapServerLogin').text('Error: wrong email or password');
//                setTimeout(function(){
//                    $('#discordMapServerLogin').text('DiscordLogin');
//                }, 1000);
//            }
//            if(token){
//                if(settings.rememberAccount)window.mapServerSavePassword(email, password);
//                $('#discordMapServerLogin').text('please wait...')
//            }
//        });
//        $('#discordMapServerLogin').text('Login...');
//    }
//
//    window.mapServerCancelLogin = function(){
//        autoReconnect = false;
//        $('#mapServerloginPanelOverlapScreen').addClass('hide');
//        connectBtn.trigger('click'); /* Disconnect from map server, or will just been kicked */
//    }
//
//    function onClose() {
//        $('#mapServerloginPanelOverlapScreen').addClass('hide');
//        ws = null;
//        players = [me];
//        if(discord)discord.logout();
//        isLoggedin = false;
//        updateServerList([]);
//        onMapServerDisconnected();
//        if(autoReconnect){
//            var address = addressInput.val();
//            setTimeout(function(){
//                miniMapConnectToServer(address);
//            }, reconnectTimeout += 10000);
//        }
//    }
//
//    function onMessage(e){
//        var buffer = new Uint8Array(e.data);
//        var packet = msgpack.decode(buffer);
//        switch(packet.type) {
//            case 0: /* Login request */
//                loginToken = packet.data.token;
//                discordServer = packet.data.server.sid;
//                discordServerLoginChannel = packet.data.server.login;
//                onLoginRequest();
//                break;
//            case 1: /* Login success */
//                console.log('test');
//                onLoggedIn();
//                break;
//            case 128: /* Update map */
//                players = packet.data;
//
//                me.account.providor = players[0].account.provider;
//                me.account.name = players[0].account.name;
//                me.id = players[0].id;
//                players[0] = me;
//
//                nameMap = _.object(players.map(function(player){
//                    return [player.name, player];
//                }))
//                π.ui.updatePlayerList(players);
//                break;
//            case 131: /* Update server list */
//                updateServerList(packet.data);
//                break;
//            case 33: /* Add event */
//                var event = new Event(packet.data);
//                mapEvent.push(event);
//                event.CreateNotyMessage();
//                break;
//            case 34: /* Add event */
//                π.ui.notyContainer.noty({
//                    text: players.find(function(e){return e.id == packet.data.origin}).account.name + ' : ' + packet.data.text,
//                    theme: 'chatBoxTheme',
//                    layout: 'bottomLeft',
//                    type: 'information',
//                    dismissQueue: true,
//                    maxVisible: 10,
//                    timeout: (~~(packet.data.text.length/10) + 1) * 2000,
//                });
//                π.ui.addChatMessage(
//                    players.find(function(e){return e.id == packet.data.origin}),
//                    packet.data.text
//                )
//                break;
//        }
//    }
//
//    function miniMapSendRawData(data) {
//        if (ws !== null && ws.readyState === window._WebSocket.OPEN && isLoggedin) {
//            var array = new Uint8Array(data);
//            ws.send(array.buffer);
//        }
//    }
//    function miniMapSendRawDataUnLoggedin(data) {
//        if (ws !== null && ws.readyState === window._WebSocket.OPEN) {
//            var array = new Uint8Array(data);
//            ws.send(array.buffer);
//        }
//    }
//
//    function miniMapConnectToServer(address) {
//        if(ws !== null)return;
//        ws = null;
//        try {
//            ws = new WebSocket(address);
//        } catch (ex) {
//            onClose();
//            console.error(ex);
//            return false;
//        }
//        ws.binaryType = "arraybuffer";
//        ws.onopen = onOpen;
//        ws.onmessage = onMessage;
//        ws.onclose = onClose;
//        ws.onerror = function() {
//            onClose();
//            console.error('failed to connect to map server');
//        };
//    }
//
//    var miniMapRenderWrapper = function() {
//        var lastTime = Date.now();
//        var targetRenderInterval = settings.minimapMaxFPS;
//        return function() {
//            /* Request next frame first, so a single render function fail
//            * wont break whole render loop. */
//            window.requestAnimationFrame(miniMapRenderWrapper);
//
//            var now = Date.now();
//            var timeSinceLastRender = now - lastTime;
//            if (timeSinceLastRender > targetRenderInterval) {
//                lastTime = now - timeSinceLastRender % targetRenderInterval;
//                miniMapRender();
//            }
//        };
//    }();
//
//    function updateRenderScale(cell){
//        cell.dx = cell.x * scaleX;
//        cell.dy = cell.y * scaleY;
//        cell.dsize = cell.size * Math.min(scaleX, scaleY);
//    }
//
//    function miniMapRender() {
//        var ctx = canvas.getContext('2d');
//
//        ctx.clearRect(0, 0, canvas.width, canvas.height);
//        ctx.save();
//        ctx.translate(canvas.width / 2, canvas.height / 2);
//        scaleX = canvas.width / mapWidth;
//        scaleY = canvas.height / mapHeight;
//
//        for(i = 0;i < players.length;++i){
//            player = players[i];
//            for(c = 0;c < player.cells.length;++c){
//                cell = player.cells[c];
//                cell.player = player;
//                updateRenderScale(cell);
//                renderCell(ctx, cell);
//                if(c == 0){
//                    if((π.settings.enableCross && player.isMe) || π.settings.enableTeammateCross)
//                        miniMapDrawCross(ctx, cell);
//                    renderCellText(ctx, cell);
//                }
//            }
//        }
//
//        if(rightMouseDown){
//            Event.renderMapEventPress(
//                ctx,
//                Date.now() - rightMouseDownTime,
//                50,
//                {x: mouseMapX, y: mouseMapY},
//                {x: scaleX, y: scaleY}
//            );
//        }
//
//        for(var e = 0;e < mapEvent.length; ++e){
//            if(mapEvent[e]){
//                mapEvent[e].render( ctx, 50, {x:scaleX, y: scaleY});
//                if(mapEvent[e].isTimeout()){
//                    mapEvent.splice(e, 1);
//                }
//            }
//        }
//        ctx.restore();
//    }
//
//    function miniMapDrawCross(ctx, cell) {
//        ctx.lineWidth = 1;
//        ctx.beginPath();
//        ctx.moveTo(-canvas.width / 2, cell.dy);
//        ctx.lineTo( canvas.width / 2, cell.dy);
//        ctx.moveTo(cell.dx, -canvas.height / 2);
//        ctx.lineTo(cell.dx,  canvas.height / 2);
//        ctx.closePath();
//        ctx.strokeStyle = cell.color || '#FFFFFF';
//        ctx.stroke();
//    }
//
//    function renderCell(ctx, cell){
//        if(cell.dsize < 7){ /* add an translucent, bigger cell to make it clear*/
//            ctx.globalAlpha = 0.5;
//            ctx.beginPath();
//            ctx.arc( cell.dx, cell.dy, 7, 0, 2 * Math.PI, false);
//            ctx.closePath();
//            ctx.fillStyle = cell.color;
//            ctx.fill();
//            ctx.globalAlpha = 1.0;
//        }
//        ctx.beginPath();
//        ctx.arc( cell.dx, cell.dy, cell.dsize, 0, 2 * Math.PI, false );
//        ctx.closePath();
//        ctx.fillStyle = cell.color;
//        ctx.fill();
//    }
//
//    function renderCellText(ctx, cell){
//        ctx.textAlign = 'center';
//        ctx.textBaseline = 'middle';
//        ctx.fillStyle = 'white';
//        var text = "";
//        if(π.settings.playerNameInsteadOfId){
//            if(π.settings.inGameName){
//                text = cell.player.name;
//                ctx.font = '14px Arial';
//            }else{
//                text = cell.player.account.name;
//                ctx.font = '14px Arial';
//            }
//        }else{
//            text = '' + cell.player.id;
//            ctx.font = cell.dsize * 2 + 'px Arial';
//        }
//        ctx.save();
//        ctx.fillText(text.replace(/[\u180E\uFEFF\u200B\u0085\u2028\u2029\u200D\u200C\u2060]/gi, function(){return '';}),
//                     cell.dx, cell.dy - ((cell.dsize < 10) ? 10 : cell.dsize * 1.3));
//        ctx.restore();
//    }
//
//    function miniMapInit(){
//        server_list = $("#serverList");
//        server_listl = $("#serverList1");
//        server_listr = $("#serverList2");
//
//        // Minimap
//        var wrapper = $('<div>').attr('id', 'mini-map-wrapper').css({
//            position: 'fixed',
//            bottom: 5,
//            right: 5,
//            width: minimapOuterWidth,
//            height: minimapOuterHeight,
//            'background-image': 'url("' + Resource.base + 'res/minimap.png")',
//            'background-size': '100%',
//            "z-index": '1001',
//            'transform': 'scale(' + π.settings.minimapScale+ ',' + π.settings.minimapScale + ')',
//            'transform-origin': 'bottom right'
//        });
//        GM.unsafeWindow.adjustMinimapSize = function(val){
//            π.settings.minimapScale = val;
//            wrapper.css( 'transform', 'scale(' + val + ',' + val + ')');
//            wrapper.css( 'transform-origin','bottom right');
//        }
//
//        var mini_map = $('<canvas>').attr({
//            id: 'mini-map',
//            width: minimapWidth,
//            height: minimapHeight,
//        }).css({
//            marginTop : (minimapOuterHeight - minimapHeight) * 0.8484,
//            marginLeft : (minimapOuterWidth - minimapWidth) / 2,
//            width: minimapWidth,
//            height: minimapHeight,
//            position: 'relative',
//            cursor: 'cell',
//        }).on("mousedown",function(e){
//            if(e.preventDefault) e.preventDefault();
//            if(e.button === 0){
//                leftMouseDown = true;
//                leftMouseDownPosition = {
//                    x: mouseX,
//                    y: mouseY,
//                    mapX: mouseMapX,
//                    mapY: mouseMapY,
//                };
//            }else if(e.button === 2){
//                rightMouseDown = true;
//                rightMouseDownTime = Date.now();
//            }
//            return false;
//        }).on('mouseup',function(e){
//            if(e.button === 0 && leftMouseDown){
//                leftMouseDown = false;
//
//                var endPointPosition = {
//                    x: mouseMapX,
//                    y: mouseMapY,
//                };
//                window.Minimap.SendMapEvent(leftMouseDownPosition.mapX,
//                                            leftMouseDownPosition.mapY,
//                                            Event.TYPE_ARROW,
//                                            {pos: endPointPosition});
//            }else if(e.button === 2){
//                rightMouseDown = false;
//                window.Minimap.SendMapEvent(mouseMapX,
//                                            mouseMapY,
//                                            Event.TYPE_NORMAL,
//                                            {time: Math.min(5000, Date.now() - rightMouseDownTime)});
//            }
//        }).on('mousemove',function(e){
//            /* Rescaled to match minimapWidth/minimapHeight */
//            mouseX = (e.pageX - $(this).offset().left) / π.settings.minimapScale;
//            mouseY = (e.pageY - $(this).offset().top) / π.settings.minimapScale;
//            mouseMapX = mouseX / minimapWidth * mapWidth + mapLeft;
//            mouseMapY = mouseY / minimapHeight * mapHeight + mapTop;
//        }).on('contextmenu',function(e){
//            return false;
//        });
//        wrapper.append(mini_map).appendTo(document.body);
//        canvas = mini_map[0];
//
//        // RAF
//        window.requestAnimationFrame(miniMapRenderWrapper);
//
//        /* Address and connect */
//        addressInput = $('#minimapServerAddress')
//        .attr('placeholder', defaultServer)
//        .val(defaultServer);
//
//        connectBtn = $('#minimapConnectBtn')
//        .on("click", function(){
//            if (ws){
//                ws.close();
//                autoReconnect = false;
//            }else{
//                var address = addressInput.val();
//                if(address !== ''){
//                    miniMapConnectToServer(address);
//                    autoReconnect = true;
//                }
//            }
//        });
//        connectBtn.trigger('click');
//
//        miniMapReset();
//    }
//
//    function miniMapReset() {
//        me.cells = [];
//        mapLeft = -7000;
//        mapTop = -7000;
//        mapRight = 7000;
//        mapBottom = 7000;
//        mapWidth = 14000;
//        mapHeight = 14000;
//    }
//
//    window.Minimap = {
//        /* Agar server operation */
//        onOpen : function(url){
//            miniMapReset();
//            agarServerAddress = url;
//            miniMapSendRawData(msgpack.encode({
//                type: 100,
//                data: getAgarServerInfo(),
//            }));
//        },
//        SetSkin: function(addr){
//            me.account.skin = addr;
//            miniMapSendRawData(msgpack.encode({
//                type: 104,
//                data: addr
//            }));
//        },
//        onSetNick: function(nick){
//            if ( !(ws !== null && ws.readyState === window._WebSocket.OPEN && isLoggedin) ){
//                nameMap = {};
//                nameMap[nick] = me;
//            }
//            me.name = nick;
//            me.account.name = nick;
//            miniMapSendRawData(msgpack.encode({
//                type: 101,
//                data: me.name
//            }));
//        },
//        SetColor: function(cell, indicator){
//            miniMapSendRawData(msgpack.encode({
//                type: 103,
//                data: {
//                    cell: cell,
//                    indicator: indicator,
//                }
//            }));
//        },
//        updateMyCells: function(m){
//            if(!(me.cells.length == 0 && m.length == 0)){
//                miniMapSendRawData(msgpack.encode({
//                    type : 16,
//                    data: me.cells = m.map(function(cell){
//                        return {
//                            id: cell.id,
//                            x: cell.x,
//                            y: cell.y,
//                            size: cell.size,
//                            color: cell.color,
//                        };
//                    })
//                }));
//            }
//        },
//        SetGameAreaSize : function(l, t, r, b){
//            mapLeft = l; mapTop = t; mapRight = r; mapBottom = b;
//            mapWidth = Math.abs(mapLeft - mapRight);
//            mapHeight = Math.abs(mapTop - mapBottom);
//        },
//
//        /* Event and chat */
//        SendMapEvent : function(PosX, PosY, type, data){
//            if(eventTime.length < 5 || Date.now() - eventTime[0] > 1000){
//                eventTime.push(Date.now());
//                if(eventTime.length > 5){
//                    eventTime.splice(0, 1);
//                }
//
//                var event = new Event({
//                    x : PosX,
//                    y : PosY,
//                    type : type,
//                    data: data,
//                    origin : -1,
//                });
//                miniMapSendRawData(msgpack.encode({
//                    type : 33,
//                    data: event.toSendObject()
//                }));
//            }else{
//                eventTime[0] = Math.min(eventTime[0] + 2000, Date.now() + 4000);
//                var timeout = eventTime[0] - Date.now();
//                this.notyobj = π.ui.notyContainer.noty({
//                    text: π.translate('spam').replace("%n",timeout/1000),
//                    theme: 'chatBoxTheme',
//                    layout: 'bottomLeft',
//                    type: 'warning',
//                    dismissQueue: true,
//                    maxVisible: 10,
//                    timeout: timeout,
//                });
//            }
//        },
//        sendChatMessage : function(message, isGlobal){
//            if(message !== ''){
//                miniMapSendRawData(msgpack.encode({
//                    type : 34,
//                    data: {
//                        text: message,
//                        isGlobal: !!isGlobal,
//                    },
//                }));
//            }
//        },
//        Event : Event, /* export for type */
//
//        /* Data Object */
//        get MapEvent(){
//            return mapEvent;
//        },
//        get Players(){
//            return players;
//        },
//        get nameMap(){
//            return nameMap;
//        },
//    };
//
//    π.minimap = {
//        init: miniMapInit,
//        config: {
//            maxSendCell: 16,
//        }
//    };
//};

