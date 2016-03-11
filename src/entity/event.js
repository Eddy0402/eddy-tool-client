//
//    /* Map Event Object */
//    function Event(data){
//        this.x = data.x;
//        this.y = data.y;
//        this.type = data.type;
//        this.origin = data.origin;
//        this.data = data.data;
//        this.time = Date.now();
//    }
//
//    Event.TYPE_NORMAL    = 0;
//    Event.TYPE_FEED      = 1;
//    Event.TYPE_VIRUS     = 2;
//    Event.TYPE_RUN       = 3;
//    Event.TYPE_HELP      = 4;
//    Event.TYPE_ENEMY     = 5;
//    Event.TYPE_ARROW     = 6;
//
//    /* static functions */
//    Event.renderMapEventPress = function(ctx, time, maxsize, position, positionScale){
//        if(!positionScale)positionScale = {x: 1, y: 1};
//        if(time < 200)return;
//
//        time = Math.min(5000, time);
//        var size = ((1 + time / 350) * maxsize);
//        ctx.save();
//        ctx.strokeStyle = "#55FF55";
//        ctx.lineCap = "round";
//        ctx.lineJoin = "round";
//        ctx.globalAlpha = Math.min(1, (time - 200) / 600);
//        ctx.lineWidth = size * 0.05;
//        ctx.beginPath();
//        ctx.arc(
//            position.x * positionScale.x,
//            position.y * positionScale.y,
//            size,
//            0,
//            2 * Math.PI,
//            false
//        );
//        ctx.closePath();
//        ctx.stroke();
//        ctx.restore();
//    };
//    Event.renderMapEventArrowPress = function(ctx, startPoint, endPoint){
//
//    };
//
//    Event.prototype = {
//        CreateNotyMessage : function(){
//            if(this.type >= Event.TYPE_FEED && this.type <= Event.TYPE_ENEMY){
//                var textTemplate = [
//                    π.translate('FeedMe'),
//                    π.translate('VirusHere'),
//                    π.translate('NeedToRun'),
//                    π.translate('NeedHelp'),
//                    π.translate('Enemy'),
//                ];
//
//                var type = ['feed', 'virus', 'run', 'help', 'enemy'][this.type - Event.TYPE_FEED];
//
//                var text = textTemplate[this.type - Event.TYPE_FEED];
//                text = text.replace('PLAYER', players.find(function(e){return e.id == this.origin}, this).account.name);
//                text = text.replace('POSITION', getPositionString({x: this.x, y:this.y}));
//
//                this.notyobj = π.ui.notyContainer.noty({
//                    text: text,
//                    theme: 'chatBoxTheme',
//                    layout: 'bottomLeft',
//                    type: type,
//                    dismissQueue: true,
//                    maxVisible: 10,
//                    timeout: 2500,
//                });
//            }
//        },
//        toSendObject: function(){
//            return {
//                x: this.x,
//                y: this.y,
//                type: this.type,
//                message: this.message,
//                data: this.data,
//            };
//        },
//        isTimeout : function(){
//            return Date.now() - this.time > 1200;
//        },
//        render: function(ctx, maxsize, positionScale){
//            if(!positionScale) positionScale = {x: 1, y: 1};
//            if(this.type == Event.TYPE_ARROW){
//                this.renderArrow(ctx, maxsize, positionScale);
//            }else{
//                this.renderRound(ctx, maxsize, positionScale);
//            }
//        },
//        renderArrow: function(ctx, maxsize, positionScale){
//        },
//        renderRound: function(ctx, maxsize, positionScale){
//            var elapsedTime = Date.now() - this.time;
//            if(this.isTimeout())return;
//
//            if(this.data){
//                maxsize = (1 + this.data.time / 350) * maxsize;
//            }
//
//            var size1 = (maxsize / 2) * (300 - elapsedTime) / 300;
//            var size2 = maxsize * (elapsedTime - 200)/ 600;
//            var size3 = maxsize * (elapsedTime - 400)/ 600;
//            var size4 = maxsize * (elapsedTime - 600)/ 600;
//            var x = this.x * positionScale.x, y = this.y * positionScale.y;
//
//            var color;
//
//            switch(this.type){
//                case Event.TYPE_NORMAL:    color = "#55FF55"; break;
//                case Event.TYPE_FEED:      color = "#CCCCFF"; break;
//                case Event.TYPE_VIRUS:     color = "#FFFFFF"; break;
//                case Event.TYPE_RUN:       color = "#FF0000"; break;
//                case Event.TYPE_HELP:      color = "#FFFF00"; break;
//                case Event.TYPE_ENEMY:     color = "#FF0000"; break;
//            }
//
//            ctx.save();
//            ctx.strokeStyle = color;
//            ctx.lineCap = "round";
//            ctx.lineJoin = "round";
//
//            function stroke(size, alpha){
//                ctx.globalAlpha = alpha;
//                ctx.lineWidth = size* 0.05;
//                ctx.beginPath();
//                ctx.arc(x,
//                        y,
//                        size,
//                        0,
//                        2 * Math.PI,
//                        false);
//                        ctx.closePath();
//                        ctx.stroke();
//            }
//            if(elapsedTime < 300) stroke(size1, (150 - Math.abs(elapsedTime - 150)) / 150);
//            if(elapsedTime > 200 && elapsedTime < 800) stroke(size2, (800 - elapsedTime) / 200);
//            if(elapsedTime > 400 && elapsedTime < 1000) stroke(size3, (1000 - elapsedTime) / 400);
//            if(elapsedTime > 600 && elapsedTime < 1200) stroke(size4, (1200 - elapsedTime) / 600);
//
//            ctx.restore();
//        },
//    };
//
