'use strict';

var i, ii, j, jj;

function drawBackground(ctx, size){
    //=============================================================================================//
    //=================================      Background      ======================================//
    //=============================================================================================//

    var grd = ctx.createLinearGradient(0, 0.25*size, size, 0.75*size);
    grd.addColorStop(0.1, "#102011");
    grd.addColorStop(0.2, "#101b09");
    grd.addColorStop(0.3, "#101a08");
    grd.addColorStop(0.4, "#101a1a");
    grd.addColorStop(0.5, "#101b1c");
    grd.addColorStop(0.6, "#101a22");
    grd.addColorStop(0.7, "#102227");
    grd.addColorStop(0.8, "#10262c");
    grd.addColorStop(0.9, "#102730");
    grd.addColorStop(  1, "#102934");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,size,size);

    //=============================================================================================//
    //=================================        Cross         ======================================//
    //=============================================================================================//
    // Relative Size
    var crossSize         = size * 0.027;
    var crossBlockSize    = crossSize * 4 / 30;
    var crossBlockGapSize = crossSize * 1.9 / 30;
    var crossBlockOffset  = crossBlockGapSize * 1.5 + crossBlockSize * 2;

    var crossBlockStyle1 = "rgba(60,60,60,1)";
    var crossBlockStyle2 = "rgba(110,110,110,1)";
    var crossBlockStyle3 = "rgba(240,240,240,1)";
    var crossBorderStyle = "rgba(180,180,180,1)";


    var lineWidth  = size * 0.0003;
    var lineLength = size / 5 - crossSize;

    var lineStyle = "rgba(180,180,180,1)";

    // Cross
    ctx.fillStyle = crossBlockStyle1;
    for(i = 1;i < 5; ++i){
        for(j = 1;j < 5;++j){
            for(ii = 0;ii < 4; ++ii){
                for(jj = 0;jj < 4;++jj){
                    if(ii+1 !== i && jj+1 !== j){
                        ctx.fillRect(
                                     size * i / 5 - crossBlockOffset + (crossBlockSize+crossBlockGapSize) * ii,
                                     size * j / 5 - crossBlockOffset + (crossBlockSize+crossBlockGapSize) * jj,
                                     crossBlockSize,
                                     crossBlockSize
                                    );
                    }
                }
            }
        }
    }
    ctx.fillStyle = crossBlockStyle2;
    for(i = 1;i < 5; ++i){
        for(j = 1;j < 5;++j){
            for(ii = 0;ii < 4; ++ii){
                for(jj = 0;jj < 4;++jj){
                    if(ii+1 === i || jj+1 === j){
                        ctx.fillRect(
                                     size * i / 5 - crossBlockOffset + (crossBlockSize+crossBlockGapSize) * ii,
                                     size * j / 5 - crossBlockOffset + (crossBlockSize+crossBlockGapSize) * jj,
                                     crossBlockSize,
                                     crossBlockSize
                                    );
                    }
                }
            }
        }
    }
    ctx.fillStyle = crossBlockStyle3;
    for(i = 1;i < 5; ++i){
        for(j = 1;j < 5;++j){
            for(ii = 0;ii < 4; ++ii){
                for(jj = 0;jj < 4;++jj){
                    if(ii+1 === i && jj+1 === j){
                        ctx.fillRect(
                                     size * i / 5 - crossBlockOffset + (crossBlockSize+crossBlockGapSize) * ii,
                                     size * j / 5 - crossBlockOffset + (crossBlockSize+crossBlockGapSize) * jj,
                                     crossBlockSize,
                                     crossBlockSize
                                    );
                    }
                }
            }
        }
    }
    ctx.fillStyle = crossBorderStyle;
    for(i = 1;i < 5; ++i){
        for(j = 1;j < 5;++j){
            // Left
            ctx.fillRect(size*i/5 - crossSize/2, size*j/5 - crossSize/2, lineWidth, crossSize / 4);
            ctx.fillRect(size*i/5 - crossSize/2, size*j/5 + crossSize/4, lineWidth, crossSize / 4);
            // Right
            ctx.fillRect(size*i/5 + crossSize/2, size*j/5 - crossSize/2, lineWidth, crossSize / 4);
            ctx.fillRect(size*i/5 + crossSize/2, size*j/5 + crossSize/4, lineWidth, crossSize / 4);
            // Up
            ctx.fillRect(size*i/5 - crossSize/2, size*j/5 - crossSize/2, crossSize / 4, lineWidth);
            ctx.fillRect(size*i/5 + crossSize/4, size*j/5 - crossSize/2, crossSize / 4, lineWidth);
            // Down
            ctx.fillRect(size*i/5 - crossSize/2, size*j/5 + crossSize/2, crossSize / 4, lineWidth);
            ctx.fillRect(size*i/5 + crossSize/4, size*j/5 + crossSize/2, crossSize / 4, lineWidth);
        }
    }

    // Vertical line and Horizontal line
    ctx.fillStyle = lineStyle;
    for(i = 1;i < 5;++i){
        for(j = 0;j < 5;++j){
            ctx.fillRect(
                         size * i / 5 - lineWidth / 2,
                         size * j / 5 + (size / 5 - lineLength) / 2,
                         lineWidth,
                         lineLength
                        );
        }
    }
    for(i = 1;i < 5;++i){
        for(j = 0;j < 5;++j){
            ctx.fillRect(
                         size * j / 5 + (size / 5 - lineLength) / 2,
                         size * i / 5 - lineWidth / 2,
                         lineLength,
                         lineWidth
                        );
        }
    }


    //=============================================================================================//
    //=================================         Text         ======================================//
    //=============================================================================================//

    // TODO: better text
    var xAxis = ['1', '2', '3', '4', '5'];
    var yAxis = ['A', 'B', 'C', 'D', 'E'];

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = (0.35 * size / 5) + 'px f1';

    ctx.save();
    for (i = 0; i < 5; ++i) {
        for (j = 0; j < 5; ++j) {
            ctx.fillText(
                         yAxis[j] + xAxis[i] ,
                         (size / 5 * i) + (size / 5 / 2),
                         ((size / 5 * j) + (size / 5 / 2))
                        );
        }
    }
    ctx.restore();

    //=============================================================================================//
}
module.exports = drawBackground;
