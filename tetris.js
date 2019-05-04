/* Copyright (C) 2018 Kleinlercher Michael - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the FaKe license, which unfortunately won't be
 * written for another century.
 *
 * You should have received a copy of the FaKe license with
 * this file. If not, please write to: kleinlercher.michael@gmail.com,
 * or visit : riptosscreencorn.bplaced.net/iamafaggot
 * I know my scoreboard is unsafe but pls don't manipulate it thx <3
 */

Array.prototype.remByVal = function(val) {
	var removed = false;
    for (var i = 0; i < this.length && !removed; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
            removed = true;
        }
    }
    return this;
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var gameOver = false;

var map = [[]];

var blockSize = 30;

var mapHeight = 22;
var mapWidth = 10;

var holdedBlock;
var holdedBlockColorIndex;
var holdedInCurrentMove = false;

var player;
var playerX = 4;
var playerY = 0;

var externalTimeIterator = 0;
var DUIimplementvar = 0;

var playerGhost;
var playerGhostX = playerX;
var playerGhostY = playerY;

var currentBlockIndex;

var blockColors = [];

var lastTimeMoved = new Date().getTime();
var moveTime = 750;

var lastTimeSideway = new Date().getTime();
var moveSidewayTime = 150;

var lastTimeMovedDown = new Date().getTime();
var moveDownTime = 50;

var timeBeforeSet;
var delayBeforeFinalSet = 200;

var firstNextMovesRandom = [];
var secondNextMovesRandom = [];

var isPaused = false;

var pauseStartTime;
var startTime = new Date().getTime();
var stopTime;
var durationPaused = 0;
var timePlayed = 0;

var score = 0;
var clearedLines = 0;
var level = 0;
var levelUpPoint = 25;

var blocks = {
	0: [
	[
	[0,1,0],
	[1,1,0],
	[1,0,0]
	],

	[
	[1,1,0],
	[0,1,1],
	[0,0,0]
	],

	[
	[0,0,1],
	[0,1,1],
	[0,1,0]
	],

	[
	[0,0,0],
	[1,1,0],
	[0,1,1]
	]
	],

	1: [
	[
	[1,1],
	[1,1]
	]
	],

	2: [
	[
	[1,0,0],
	[1,1,0],
	[0,1,0]
	],
	[
	[0,0,0],
	[0,1,1],
	[1,1,0]
	],
	[
	[0,1,0],
	[0,1,1],
	[0,0,1]
	],
	[
	[0,1,1],
	[1,1,0],
	[0,0,0]
	]
	],

	3: [
	[
	[0,0,0],
	[0,1,0],
	[1,1,1]
	],
	[
	[1,0,0],
	[1,1,0],
	[1,0,0]
	],
	[
	[1,1,1],
	[0,1,0],
	[0,0,0]
	],
	[
	[0,0,1],
	[0,1,1],
	[0,0,1]
	]
	],

	4: [
	[
	[1,0,0],
	[1,0,0],
	[1,1,0]
	],
	[
	[1,1,1],
	[1,0,0],
	[0,0,0]
	],
	[
	[0,1,1],
	[0,0,1],
	[0,0,1]
	],
	[
	[0,0,0],
	[0,0,1],
	[1,1,1]
	]
	],

	5: [
	[
	[0,0,1],
	[0,0,1],
	[0,1,1]
	],
	[
	[0,0,0],
	[1,0,0],
	[1,1,1]
	],
	[
	[1,1,0],
	[1,0,0],
	[1,0,0]
	],
	[
	[1,1,1],
	[0,0,1],
	[0,0,0]
	]
	],

	6: [
	[
	[0,0,0,0],
	[0,0,0,0],
	[1,1,1,1],
	[0,0,0,0]
	],
	[
	[0,1,0,0],
	[0,1,0,0],
	[0,1,0,0],
	[0,1,0,0]
	],
	[
	[0,0,0,0],
	[1,1,1,1],
	[0,0,0,0],
	[0,0,0,0]
	],
	[
	[0,0,1,0],
	[0,0,1,0],
	[0,0,1,0],
	[0,0,1,0]
	]
	]
}

function setup() {
	fillArrayRandomBlocks(firstNextMovesRandom);
	fillArrayRandomBlocks(secondNextMovesRandom);
	setPlayer();
	blockColors.push(new blockColor(255,0,0));
	blockColors.push(new blockColor(255,255,0));
	blockColors.push(new blockColor(0,255,0));
	blockColors.push(new blockColor(153,50,204));
	blockColors.push(new blockColor(255,140,0));
	blockColors.push(new blockColor(0,0,255));
	blockColors.push(new blockColor(0,240,240));
	for(var y = 0; y < mapHeight; y++) {
		map[y] = [];
		for(var x = 0; x < mapWidth; x++) {
			map[y][x] = 0;
		}
	}
	frameRate(60);
	createCanvas(blockSize*mapWidth+blockSize*10+250, blockSize*mapHeight+1);
}

function draw() { // Mainloop
	if(!gameOver && !isPaused) {
		drawMap();
		checkKeyboard();
		if(new Date().getTime() - lastTimeMoved > moveTime) {
			lastTimeMoved = new Date().getTime();
			moveDown();
		}
	}else if(!gameOver && isPaused) {
		fill(255);
		noStroke();
		rect(0,0,width, height);
		fill(0);
		text("Press Escape to continue", width/4, height/2);
	}else if(gameOver){
		fill(255);
		stroke(255);
		rect(0,0,width,height);
		textSize(50);
		fill(0);
		text("Game Over", width/4, height/2);
	}
}

function moveDown() {
	if(!colliding(playerX, playerY+1, player)) {
		playerY++;
		timeBeforeSet = undefined;
	}else{
		if(typeof(timeBeforeSet) === 'undefined')
			timeBeforeSet = new Date().getTime();
		if(new Date().getTime() - timeBeforeSet > delayBeforeFinalSet) {
			setPlayerOnMap();
			timeBeforeSet = undefined;
		}
	}
}

function setPlayerOnMap() {
	for(var y = 0; y < player.length; y++) {
		for(var x = 0; x < player[0].length; x++) {
			if(player[y][x] != 0)
				map[y+playerY][x+playerX] = currentBlockIndex+1;
		}
	}
	setPlayer();
	playerX = 4;
	playerY = 0;
	if(colliding(playerX, playerY, player)) {
		gameOver = true;
		stopTime = new Date().getTime();
		sendToScoreboard(getName(), score);
	}
	resetLines();
	holdedInCurrentMove = false;
}

// DON'T SCROLL DOWN ANY LONGER, or do it i'm a comment not a cop

function sendToScoreboard(nname, sscore) {
	timePlayed = stopTime - startTime - durationPaused;
	post('addtotable.php', {score: sscore, name: nname, levell: level, playtime: timePlayed});
}

function post(path, params, method) {
    method = method || "post";
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
	params.hash = (score+level)*13;
    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function resetLines() {
	var rowsToDelete = checkFullRow();
	if(rowsToDelete.length == 1) {
		score += 40 * (level + 1);
	}else if(rowsToDelete.length == 2) {
		score += 100 * (level + 1);
	}else if(rowsToDelete.length == 3) {
		score += 300 * (level + 1);
	}else if(rowsToDelete.length == 4) {
		score += 1200 * (level + 1);
	}
	clearedLines += rowsToDelete.length;
	level = Math.floor(clearedLines / levelUpPoint);
	moveTime = 750 * Math.pow(0.85, level+level);
	externalTimeIterator = score;
	deleteRows(rowsToDelete);
	if(areEmptyRow() > 0) {
		pullDownRows();
	}
}

function pullDownRows() {
	var count;
	var empty;
	for(var y = mapHeight-1; y > 1; y--) {
		count = y;
		while(isEmptyRow(y) && count > 0) {
			count--;
			if(!isEmptyRow(count)) {
				for(var x = 0; x < mapWidth; x++) {
					map[y][x] = map[count][x];
				}
				deleteRows([count]);
			}
		}
	}
}

function isEmptyRow(rowNumber) {
	var empty = true;
	for(var x = 0; x < mapWidth; x++) {
		if(map[rowNumber][x] != 0) {
			empty = false;
		}
	}
	return empty;
}

function deleteRows(rows) {
	for(var i = 0; i < rows.length; i++) {
		for(var j = 0; j < mapWidth; j++) {
			map[rows[i]][j] = 0;
		}
	}
}

function checkFullRow() {
	var fullLines = [];
	var fullLine;
	for(var i = 0; i < mapHeight; i++) {
		fullLine = true;
		for(var j = 0; j < mapWidth && fullLine; j++) {
			if(map[i][j] == 0)
				fullLine = false;
		}
		if(fullLine)
			fullLines.push(i);
	}
	return fullLines;
}

function areEmptyRow() {
	var adder = 0;
	var emptyLines = 0;
	for(var i = mapHeight-1; i > 0; i--) {
		var empty = true;		
		for(var x = 0; x < mapWidth; x++) {
			if(map[i][x] != 0) {
				empty = false;
			}
		}
		if(empty)
			adder++;
		else {
			emptyLines+=adder;
			adder = 0;
		}
	}
	return emptyLines;
}

function colliding(px, py, block) {
	var isColliding = false;
	for(var y = 0; y < block.length && !isColliding; y++) {
		for(var x = 0; x < block[0].length && !isColliding; x++) {
			if(block[y][x] != 0) {
				if(y+py > mapHeight-1)
					return true;
				if(map[y+py][x+px] != 0)
					return true;
				if(map[y+py][x+px] != 0)
					return true;
			}
		}
	}
	return false;
}

function drawMap() {
	fill(255);
	stroke(255);
	rect(0,0,width,height);

	translate(blockSize*5, 0);

	if(score != externalTimeIterator)
		score = DUIimplementvar;
	externalTimeIterator = score;

	stroke(50,50,50);
	for(var y = 0; y < mapHeight; y++) {
		for(var x = 0; x < mapWidth; x++) {
			if(map[y][x] == 0) {
				fill(0);
			}
			else if(map[y][x] > 0) {
				setColor(blockColors[map[y][x]-1]);
			}
			rect(x*blockSize, y*blockSize, blockSize, blockSize);
			fill(0);
		}
	}

	calculateGhostPosition();
	for(var y = 0; y < playerGhost.length; y++) {
		for(var x = 0; x < playerGhost[0].length; x++) {
			if(playerGhost[y][x] != 0) {
				fill(0);
				stroke(255);
				rect((x+playerGhostX)*blockSize, (y+playerGhostY)*blockSize, blockSize, blockSize); 
			}
		}
	}

	for(var y = 0; y < player.length; y++) {
		for(var x = 0; x < player[0].length; x++) {
			if(player[y][x] != 0) {
				stroke(50,50,50);
				setColor(blockColors[currentBlockIndex]);
				rect((x+playerX)*blockSize, (y+playerY)*blockSize, blockSize, blockSize); 
			}
		}
	}

	fill(0);
	textSize(20);
	text("Score: " + score, mapWidth*blockSize+5, 20);
	text("Level: " + level, mapWidth*blockSize+5, 40);
	for(var i = 0; i < 4; i++) {
		var nextBlockDraw = blocks[firstNextMovesRandom[i]][0]
		for(var y = 0; y < nextBlockDraw.length; y++) {
			for(var x = 0; x < nextBlockDraw[0].length; x++) {
				setColor(blockColors[firstNextMovesRandom[i]]);
				if(nextBlockDraw[y][x] != 0) {
					rect(mapWidth*blockSize+5 + (x*(blockSize/2)), 100 + (y*(blockSize/2))+(i*2)*blockSize, blockSize/2, blockSize/2);
				}
			}
		}
	}
	translate(blockSize*-5, 0);
	
	if(typeof(holdedBlock) !== 'undefined') {
		setColor(blockColors[holdedBlockColorIndex]);
		for(var y = 0; y < holdedBlock.length; y++) {
			for(var x = 0; x < holdedBlock[y].length; x++) {
				if(holdedBlock[y][x] != 0) {
					rect(10+x*blockSize, 10+y*blockSize, blockSize, blockSize);
				}
			}
		}
	}
}

function calculateGhostPosition() {
	playerGhost = player;
	playerGhostX = playerX;
	playerGhostY = playerY;
	while(!colliding(playerGhostX, playerGhostY, playerGhost)) {
		playerGhostY++;
	}
	playerGhostY--;
}

// Semml gemma fetzn

function checkKeyboard() {
	if(keyIsDown(RIGHT_ARROW)) {
		if(new Date().getTime() - lastTimeSideway > moveSidewayTime) {
			lastTimeSideway = new Date().getTime();
			moveSideway(+1);
		}
	}
	if(keyIsDown(LEFT_ARROW)) {
		if(new Date().getTime() - lastTimeSideway > moveSidewayTime) {
			lastTimeSideway = new Date().getTime();
			moveSideway(-1);
		}
	}
	if(keyIsDown(DOWN_ARROW)) {
		if(new Date().getTime() - lastTimeMovedDown > moveDownTime) {
			lastTimeMovedDown = new Date().getTime(),
			moveDown();
		}
	}
}

function keyPressed() {
	if(keyCode === 16 && !holdedInCurrentMove) {
		var temp;
		if(typeof(holdedBlock) === 'undefined') {
			holdedBlock = player;
			holdedBlockColorIndex = currentBlockIndex;
			setPlayer();
			playerX = 4;
			playerY = 0;
		}else{
			temp = player;
			player = holdedBlock;
			holdedBlock = temp;
			temp = currentBlockIndex;
			currentBlockIndex = holdedBlockColorIndex;
			holdedBlockColorIndex = temp;
			playerX = 4;
			playerY = 0;
		}
		holdedInCurrentMove = true;
	}
	if(keyCode === UP_ARROW)
		spinPlayer();
	if(keyCode === 32) {
		while(!colliding(playerX, playerY+1, player)) {
			playerY++;
		}
		setPlayerOnMap();
	}
	if(keyCode === 27) {
		isPaused = !isPaused;
		if(isPaused) {
			pauseStartTime = new Date().getTime();
		}else {
			durationPaused += new Date().getTime() - pauseStartTime;
		}
	}
}

// You spin me right round baby right round like a record baby right round round round...

function spinPlayer() {
	var oldPlayer = player;
	var turned = false;
	var amountTurningBlocks = blocks[currentBlockIndex].length;
	for(var i = 0; i < amountTurningBlocks && !turned; i++) {
		if(player == blocks[currentBlockIndex][i]) {
			if(i == amountTurningBlocks-1) {
				player = blocks[currentBlockIndex][0];
			}else{
				player = blocks[currentBlockIndex][i+1];
			}
			turned = true;
		}
	}
	if(colliding(playerX, playerY, player))
		player = oldPlayer;
}

function moveSideway(xDirection) {
	if(!colliding(playerX + xDirection, playerY, player))
		playerX += xDirection;
}

function blockColor(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
}

function setColor(blockColor) {
	if(typeof(blockColor) !== 'undefined')
		fill(blockColor.r, blockColor.g, blockColor.b);
}

// PS: modify this for unlimited gold
// | | | |
// V V V V

function fillArrayRandomBlocks(array) {
	var choices = [0,1,2,3,4,5,6];
	var choice;
	for(var i = 0; i < 7; i++) {
		choice = random(choices);
		array.push(choice);
		choices.remByVal(choice);
	}
}

function setPlayer() {
	var secondIndex = secondNextMovesRandom[0];
	currentBlockIndex = firstNextMovesRandom[0];
	player = blocks[currentBlockIndex][0];
	firstNextMovesRandom.remByVal(currentBlockIndex);
	firstNextMovesRandom.push(secondIndex);
	secondNextMovesRandom.remByVal(secondIndex);
	if(secondNextMovesRandom.length == 0) {
		fillArrayRandomBlocks(secondNextMovesRandom);
	}
}

function getName(){
	var retVal;
	do{
		retVal = prompt("Enter your name for the scoreboard: ", "");
	}while(retVal == "null" || retVal == "" || retVal.length > 20 || retVal.indexOf(" ") != -1); // retVal.includes(" ") IE not supported
    return retVal;
}