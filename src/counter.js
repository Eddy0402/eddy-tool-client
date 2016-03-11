'use strict';

var Counter = function () {
    var lastLoop = Date.now();
    var count = 0;
    var fps = 0;
    return function () {
        var currentLoop = Date.now();
        if (lastLoop + 1000 < currentLoop) {
            fps = Math.round(count * 1000 / (currentLoop - lastLoop));
            count = 1;
            lastLoop = currentLoop;
        } else {
            count += 1;
        }
        return fps;
    };
};

module.exports = Counter;
