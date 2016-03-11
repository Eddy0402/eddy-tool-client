/* addWheelListener */
(function(window,document) {
    var prefix = "", _addEventListener, support;

    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
        document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
        "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );

        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };

    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                deltaZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback( event );

        }, useCapture || false );
    }

})(window,document);

if(!Array.prototype.equals){
    Array.prototype.equals = function (array) {
        if (!array || this.length != array.length) return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i])) return false;
            } else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    }
}
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
      if (predicate.call(thisArg, list[i], i, list)) {
        return i;
      }
    }
    return -1;
  };
}
// faster indexOf
Array.prototype.oindexOf = function(item) {
    for (var i=0, len=this.length; i!=len ; i++) {
        if (this[i] === item) { return i  }
    }
    return -1;
};
Array.prototype.spliceOne = function(index) {
    var len=this.length;
    if (!len) { return; }
    while (index<len) {
        this[index] = this[index+1]; index++;
    }
    this.length--;
};

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
Object.defineProperty(Array.prototype, "findIndex", {enumerable: false});
Object.defineProperty(Array.prototype, "oindexOf", {enumerable: false});
Object.defineProperty(Array.prototype, "spliceOne", {enumerable: false});

window.keyCodeName = { 3 : "break", 8 : "backspace / delete", 9 : "tab", 12 : 'clear', 13 : "enter", 16 : "shift", 17 : "ctrl ", 18 : "alt", 19 : "pause/break", 20 : "caps lock", 27 : "escape", 32 : "spacebar", 33 : "page up", 34 : "page down", 35 : "end", 36 : "home ", 37 : "left arrow ", 38 : "up arrow ", 39 : "right arrow", 40 : "down arrow ", 41 : "select", 42 : "print", 43 : "execute", 44 : "Print Screen", 45 : "insert ", 46 : "delete", 48 : "0", 49 : "1", 50 : "2", 51 : "3", 52 : "4", 53 : "5", 54 : "6", 55 : "7", 56 : "8", 57 : "9", 59 : "semicolon (firefox), equals", 60 : "<", 61 : "equals (firefox)", 65 : "a", 66 : "b", 67 : "c", 68 : "d", 69 : "e", 70 : "f", 71 : "g", 72 : "h", 73 : "i", 74 : "j", 75 : "k", 76 : "l", 77 : "m", 78 : "n", 79 : "o", 80 : "p", 81 : "q", 82 : "r", 83 : "s", 84 : "t", 85 : "u", 86 : "v", 87 : "w", 88 : "x", 89 : "y", 90 : "z", 91 : "Windows Key / Left ⌘", 92 : "right window key ", 93 : "Windows Menu / Right ⌘", 96 : "numpad 0 ", 97 : "numpad 1 ", 98 : "numpad 2 ", 99 : "numpad 3 ", 100 : "numpad 4 ", 101 : "numpad 5 ", 102 : "numpad 6 ", 103 : "numpad 7 ", 104 : "numpad 8 ", 105 : "numpad 9 ", 106 : "multiply ", 107 : "add", 108 : "numpad period (firefox)", 109 : "subtract ", 110 : "decimal point", 111 : "divide ", 112 : "f1 ", 113 : "f2 ", 114 : "f3 ", 115 : "f4 ", 116 : "f5 ", 117 : "f6 ", 118 : "f7 ", 119 : "f8 ", 120 : "f9 ", 121 : "f10", 122 : "f11", 123 : "f12", 124 : "f13", 125 : "f14", 126 : "f15", 127 : "f16", 128 : "f17", 129 : "f18", 130 : "f19", 144 : "num lock ", 145 : "scroll lock", 163 : "#", 173 : "minus (firefox), mute/unmute", 174 : "decrease volume level", 175 : "increase volume level", 176 : "next", 177 : "previous", 178 : "stop", 179 : "play/pause", 181 : "mute/unmute (firefox)", 182 : "decrease volume level (firefox)", 183 : "increase volume level (firefox)", 186 : "semi-colon ", 187 : "equal sign ", 188 : "comma", 189 : "dash ", 190 : "period ", 191 : "forward slash", 192 : "grave accent ", 194 : "numpad period (chrome)", 219 : "open bracket ", 220 : "back slash ", 221 : "close bracket ", 222 : "single quote ", 224 : "left or right ⌘ key (firefox)", 225 : "altgr", 226 : "< /git >", 255 : "toggle touchpad", 256: 'left mouse click', 257: 'middle mouse click', '258': 'right mouse click'};
window.defaultSkins = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook;putin;merkel;tsipras;obama;kim jong-un;dilma;hollande;berlusconi;cameron;clinton;hillary;venezuela;blatter;chavez;cuba;fidel;merkel;palin;queen;boris;bush;trump".split(";");
window.miniclipSkins = {
    '%apple': "http://agar.io/skins/premium/Apple.png",
    '%army': "http://agar.io/skins/premium/Army.png",
    '%banana': "http://agar.io/skins/premium/Banana.png",
    '%bat': "http://agar.io/skins/premium/Bat.png",
    '%bear': "http://agar.io/skins/premium/Bear.png",
    '%blackhole': "http://agar.io/skins/premium/Blackhole.png",
    '%breakfast': "http://agar.io/skins/premium/Breakfast.png",
    '%brofist': "http://agar.io/skins/premium/Brofist.png",
    '%birdie': "http://agar.io/skins/premium/Birdie.png",
    '%blueberry': "http://agar.io/skins/premium/Blueberry.png",
    '%bomb': "http://agar.io/skins/premium/Bomb.png",
    '%cookie': "http://agar.io/skins/premium/Cookie.png",
    '%cougar': "http://agar.io/skins/premium/Cougar.png",
    '%cupid': "http://agar.io/skins/premium/Cupid.png",
    '%coyote': "http://agar.io/skins/premium/Coyote.png",
    '%crocodile': "http://agar.io/skins/premium/Crocodile.png",
    '%cupcake': "http://agar.io/skins/premium/CupCake.png",
    '%evileye': "http://agar.io/skins/premium/Evileye.png",
    '%evil': "http://agar.io/skins/premium/Evil.png",
    '%eye': "http://agar.io/skins/premium/Eye.png",
    '%fly': "http://agar.io/skins/premium/Fly.png",
    '%frog': "http://agar.io/skins/premium/Frog.png",
    '%fox': "http://agar.io/skins/premium/Fox.png",
    '%galaxy': "http://agar.io/skins/premium/Galaxy.png",
    '%gingerbread': "http://agar.io/skins/premium/GingerBread.png",
    '%good': "http://agar.io/skins/premium/Good.png",
    '%goldfish': "http://agar.io/skins/premium/Goldfish.png",
    '%hamburguer': "http://agar.io/skins/premium/Hamburguer.png",
    '%hotdog': "http://agar.io/skins/premium/HotDog.png",
    '%heart': "http://agar.io/skins/premium/Heart.png",
    '%hunter': "http://agar.io/skins/premium/Hunter.png",
    '%kraken': "http://agar.io/skins/premium/Kraken.png",
    '%jupiter': "http://agar.io/skins/premium/Jupiter.png",
    '%lion': "http://agar.io/skins/premium/Lion.png",
    '%lizard': "http://agar.io/skins/premium/Lizard.png",
    '%luchador': "http://agar.io/skins/premium/Luchador.png",
    '%mammoth': "http://agar.io/skins/premium/Mammoth.png",
    '%mercury': "http://agar.io/skins/premium/Mercury.png",
    '%muu': "http://agar.io/skins/premium/Muu.png",
    '%mouse': "http://agar.io/skins/premium/Mouse.png",
    '%monster': "http://agar.io/skins/premium/Monster.png",
    '%nuclear': "http://agar.io/skins/premium/Nuclear.png",
    '%neptune': "http://agar.io/skins/premium/Neptune.png",
    '%owl': "http://agar.io/skins/premium/Owl.png",
    '%panda': "http://agar.io/skins/premium/Panda.png",
    '%pig': "http://agar.io/skins/premium/Pig.png",
    '%panther': "http://agar.io/skins/premium/Panther.png",
    '%pirate': "http://agar.io/skins/premium/Pirate.png",
    '%raptor': "http://agar.io/skins/premium/Raptor.png",
    '%scarecrow': "http://agar.io/skins/premium/Scarecrow.png",
    '%seal': "http://agar.io/skins/premium/Seal.png",
    '%sun': "http://agar.io/skins/premium/Sun.png",
    '%shark': "http://agar.io/skins/premium/Shark.png",
    '%smile': "http://agar.io/skins/premium/Smile.png",
    '%snake': "http://agar.io/skins/premium/Snake.png"  ,
    '%spider': "http://agar.io/skins/premium/Spider.png",
    '%spy': "http://agar.io/skins/premium/Spy.png",
    '%starball': "http://agar.io/skins/premium/Starball.png",
    '%sumo': "http://agar.io/skins/premium/Sumo.png",
    '%t_rex': "http://agar.io/skins/premium/T_Rex.png",
    '%target': "http://agar.io/skins/premium/Target.png",
    '%terrible': "http://agar.io/skins/premium/Terrible.png",
    '%tigerpattern': "http://agar.io/skins/premium/Tigerpattern.png",
    '%toon': "http://agar.io/skins/premium/Toon.png",
    '%toxic': "http://agar.io/skins/premium/Toxic.png",
    '%turtle': "http://agar.io/skins/premium/Turtle.png",
    '%venus': "http://agar.io/skins/premium/Venus.png",
    '%wasp': "http://agar.io/skins/premium/Wasp.png",
    '%wolf': "http://agar.io/skins/premium/Wolf.png",
};

// Add Date.now if not exist
if (!Date.now) { Date.now = function() { return(new Date()).getTime(); }; }
