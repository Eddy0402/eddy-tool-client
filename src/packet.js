'use strict';

/* Raw byte extract helper */
function Packet(dataView, offset){
    if(offset === undefined) offset = 0;

    this.offset = offset;
    this.dataView = dataView;

    this.getStringU8 = function(){
        var c = "";
        for (;;) {
            var e = this.dataView.getUint8(this.offset, true);
            this.offset += 1;
            if (0 === e) {
                break;
            }
            c += String.fromCharCode(e);
        }
        return c;
    };
    this.getStringU16 = function(){
        var c = "";
        for (;;) {
            var e = this.dataView.getUint16(this.offset, true);
            this.offset += 2;
            if (0 === e) {
                break;
            }
            c += String.fromCharCode(e);
        }
        return c;
    };
    this.getFloat32 = function(){
        this.offset += 4;
        return this.dataView.getFloat32(this.offset - 4, true);
    };
    this.getFloat64 = function(){
        this.offset += 8;
        return this.dataView.getFloat64(this.offset - 8, true);
    };
    this.getInt32 = function(){
        this.offset += 4;
        return this.dataView.getInt32(this.offset - 4, true);
    };
    this.getInt16= function(){
        this.offset += 2;
        return this.dataView.getInt16(this.offset - 2, true);
    };
    this.getUint32 = function(){
        this.offset += 4;
        return this.dataView.getUint32(this.offset - 4, true);
    };
    this.getUint16= function(){
        this.offset += 2;
        return this.dataView.getUint16(this.offset - 2, true);
    };
    this.getUint8 = function(){
        this.offset += 1;
        return this.dataView.getUint8(this.offset - 1, true);
    };
    this.seek = function(offset){
        this.offset += offset;
    };
    this.dataRemains = function(){
        return this.dataView.byteLength > offset;
    };
}

module.exports = Packet;
