'use strict';

var g;
function render(ctx,x,y,size,R,G,B) {
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(size/256,size/256);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(544,0);
    ctx.lineTo(544,544);
    ctx.lineTo(0,544);
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = 'rgba(0,0,0,0)';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 4;
    ctx.save();
    g=ctx.createRadialGradient(272.264,240.25900000000001,0,272.264,240.25900000000001,319.454);
    g.addColorStop(0,"rgb(" + [R,G,B].join(',') + ")");
    g.addColorStop(0.594,"rgba(" + [R,G,B].join(',') + ",.598)");
    g.addColorStop(1,"rgba(" + [R,G,B].join(',') + ",0.3)");
    ctx.fillStyle = g;
    ctx.translate(0,32);
    ctx.beginPath();
    ctx.moveTo(528,240);
    ctx.bezierCurveTo(528,192.23,514.905,147.51999999999998,492.125,109.25);
    ctx.bezierCurveTo(493.549,153.594,504.585,202.07999999999998,459.522,220.725);
    ctx.bezierCurveTo(414.46,239.37,282.297,237.442,274.8,237.05);
    ctx.bezierCurveTo(274.59000000000003,228.58,277.26,110.22000000000001,296.842,59.505000000000024);
    ctx.bezierCurveTo(316.424,8.791000000000025,359.929,11.015000000000022,404.032,20.62500000000002);
    ctx.bezierCurveTo(365.48,-2.625,320.3,-16,272,-16);
    ctx.bezierCurveTo(223.7,-16,178.518,-2.625,139.97,20.625);
    ctx.bezierCurveTo(184.052,11.015,233.265,8.025,252.848,58.705);
    ctx.bezierCurveTo(272.432,109.38499999999999,269.623,228.599,269.201,237.022);
    ctx.bezierCurveTo(261.356,237.394,141.38600000000002,235.432,90.70600000000002,215.84799999999998);
    ctx.bezierCurveTo(40.02600000000002,196.265,43.01600000000002,152.052,52.62600000000002,107.96799999999999);
    ctx.bezierCurveTo(29.375,146.52,16,191.7,16,240);
    ctx.bezierCurveTo(16,288.3,29.375,333.48199999999997,52.625,372.03);
    ctx.bezierCurveTo(43.015,327.92999999999995,38.647999999999996,277.995,89.363,258.414);
    ctx.bezierCurveTo(140.077,238.832,261.33799999999997,242.29199999999997,269.226,242.97799999999998);
    ctx.bezierCurveTo(269.551,250.94799999999998,271.366,374.308,249.464,421.558);
    ctx.bezierCurveTo(226.60399999999998,470.872,185.058,468.70799999999997,141.281,460.156);
    ctx.bezierCurveTo(179.544,482.922,224.247,496,272,496);
    ctx.bezierCurveTo(319.73,496,364.408,482.932,402.656,460.187);
    ctx.bezierCurveTo(358.886,468.677,311.366,473.562,292,422.75);
    ctx.bezierCurveTo(272.634,371.938,274.227,251.195,274.774,242.95);
    ctx.bezierCurveTo(282.23,242.68699999999998,413.288,241.96499999999997,454.68600000000004,266.832);
    ctx.bezierCurveTo(498.04400000000004,292.877,500.769,325.565,492.15600000000006,370.687);
    ctx.bezierCurveTo(514.914,332.432,528,287.745,528,240);
    ctx.closePath();
    ctx.moveTo(272.203,240);
    ctx.lineTo(272.203,240.216);
    ctx.lineTo(272,240.216);
    ctx.lineTo(272,240);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}

module.exports = {
    render: render,
};
