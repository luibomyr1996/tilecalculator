var tile = document.getElementById("tile");
var tileTooltip = document.getElementById("tileTooltip");
var tileTooltip2 = document.getElementById("tileTooltip2");
var ctxTile = tile.getContext("2d");
var canvasTileOffset = $("#tile").offset();
var tileOffsetX = canvasTileOffset.left;
var tileOffsetY = canvasTileOffset.top;
ctxTile.strokeStyle = "black";
ctxTile.lineWidth = 1;
var tileWidth = 0;
var tileHeight = 0;

var tileStartPoint = new Point(0, 0);
var tileEndPoint = new Point(0, 0);

var bcgTile = new Image();
bcgTile.src = "grid.jpg";

bcgTile.onload = function () {
    ctxTile.drawImage(bcgTile, 0, 0);
}

$("#tile").mousedown(function (e) {
    handleTileMouseDown(e);
});
$("#tile").mousemove(function (e) {
    if (!isDown) {
        return;
    }
    handleTileMouseMove(e);
});
$("#tile").mouseup(function (e) {
    handleTileMouseUp(e);
});

function handleTileMouseDown(e) {
    tileStartPoint = getPointOnTile(e);
    isDown = true;
}

function handleTileMouseMove(e) {
    tileEndPoint = getPointOnTile(e);
    ctxTile.beginPath();

    tileWidth = tileEndPoint.x - tileStartPoint.x;
    tileHeight = tileEndPoint.y - tileStartPoint.y;
    ctxTile.drawImage(bcgTile, 0, 0);

    ctxTile.rect(tileStartPoint.x, tileStartPoint.y, tileWidth, tileHeight);
    ctxTile.stroke();
    showTileTooltips();
}

function handleTileMouseUp(e) {
    console.log(tileStartPoint, tileEndPoint);
    isDown = false;
}

function getPointOnTile(e) {
    var mouseX = parseInt(e.clientX - tileOffsetX);
    var mouseY = parseInt(e.clientY - tileOffsetY);
    return new Point(mouseX, mouseY);
}

function showTileTooltips() {
    tileTooltip.style.top = (tileStartPoint.y + tileOffsetY + Math.trunc(tileHeight / 2)) + 'px';
    tileTooltip.style.left = (tileStartPoint.x + tileOffsetX) + 'px';
    tileTooltip.innerHTML = Math.abs(tileHeight);

    tileTooltip2.style.top = (tileStartPoint.y + tileOffsetY) + 'px';
    tileTooltip2.style.left = (tileStartPoint.x + tileOffsetX + Math.trunc(tileWidth / 2)) + 'px';
    tileTooltip2.innerHTML = Math.abs(tileWidth);
}

