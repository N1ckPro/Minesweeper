"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var ColorType;
(function (ColorType) {
    ColorType[ColorType["Dark"] = 0] = "Dark";
    ColorType[ColorType["Light"] = 1] = "Light";
})(ColorType || (ColorType = {}));
var gameCanvas = document.getElementById('canvas');
var gameContext = gameCanvas.getContext('2d');
var flagCanvas = document.getElementById('flag_count');
var flagContext = flagCanvas.getContext('2d');
gameCanvas.width = 600;
gameCanvas.height = 600;
flagCanvas.width = 600;
flagCanvas.height = 100;
var size = 40;
var gameWidth = gameCanvas.width - size;
var gameHeight = gameCanvas.height - size;
var bombPercentage = 20;
var bombCount = Math.round((gameCanvas.width / size) * (gameCanvas.height / size) * (bombPercentage / 100));
var darkBlue = '#0000ff';
var darkGreen = '#33ff33';
var lightBlue = '#3333ff';
var lightGreen = '#99ff99';
var flag = new Image();
flag.src = 'images/flag.png';
var rectangle = function (x, y, width, length, color, context) {
    if (context === void 0) { context = gameContext; }
    context.fillStyle = color;
    context.fillRect(x, y, width, length);
};
gameCanvas.addEventListener('click', function (event) {
    if (!gameRunning)
        return;
    if (event.button == 0)
        return handleLeftClick(event);
});
gameCanvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    if (gameRunning)
        handleRightClick(event);
}, false);
window.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() == 'r')
        startGame();
});
var getRandomIndex = function (length, indexes) {
    var index = Math.round(Math.random() * length);
    if (!indexes.some(function (ind) { return ind == index; }))
        indexes.push(index);
    else
        getRandomIndex(length, indexes);
};
var checkGameLoss = function (block) { return __awaiter(void 0, void 0, void 0, function () {
    var gameIdTemp, loopBlocks_1, indexes_2, _a, indexes_1, indexes_1_1, index, block_1, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!block.bomb) return [3 /*break*/, 14];
                gameIdTemp = gameId;
                gameRunning = false;
                loopBlocks_1 = blocks.filter(function (block) { return block.bomb || block.flag; });
                indexes_2 = [];
                loopBlocks_1.forEach(function () {
                    getRandomIndex(loopBlocks_1.length - 1, indexes_2);
                });
                _e.label = 1;
            case 1:
                _e.trys.push([1, 7, 8, 13]);
                _a = true, indexes_1 = __asyncValues(indexes_2);
                _e.label = 2;
            case 2: return [4 /*yield*/, indexes_1.next()];
            case 3:
                if (!(indexes_1_1 = _e.sent(), _b = indexes_1_1.done, !_b)) return [3 /*break*/, 6];
                _d = indexes_1_1.value;
                _a = false;
                index = _d;
                if (gameId != gameIdTemp)
                    return [2 /*return*/];
                block_1 = loopBlocks_1[index];
                if (block_1.flag && block_1.bomb)
                    return [3 /*break*/, 5];
                if (block_1.flag && !block_1.bomb)
                    rectangle(block_1.x, block_1.y, size, size, getBlockColor(block_1));
                else {
                    gameContext.fillStyle = 'black';
                    gameContext.beginPath();
                    gameContext.arc(block_1.x + size / 2, block_1.y + size / 2, size / 4, 0, 2 * Math.PI);
                    gameContext.fill();
                    gameContext.stroke();
                }
                return [4 /*yield*/, new Promise(function (resolve) { return window.setTimeout(resolve, 200); })];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5:
                _a = true;
                return [3 /*break*/, 2];
            case 6: return [3 /*break*/, 13];
            case 7:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 13];
            case 8:
                _e.trys.push([8, , 11, 12]);
                if (!(!_a && !_b && (_c = indexes_1.return))) return [3 /*break*/, 10];
                return [4 /*yield*/, _c.call(indexes_1)];
            case 9:
                _e.sent();
                _e.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 12: return [7 /*endfinally*/];
            case 13:
                if (gameId != gameIdTemp)
                    return [2 /*return*/];
                gameContext.fillStyle = 'red';
                gameContext.font = '50px Arial';
                gameContext.fillText('GAME OVER', 50, 200);
                _e.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); };
var checkGameWin = function () {
    if (blocks.filter(function (block) { return !block.bomb; }).every(function (block) { return block.exposed; })) {
        gameRunning = false;
        gameContext.fillStyle = 'green';
        gameContext.font = '50px Arial';
        gameContext.fillText('YOU WON', 50, 200);
    }
};
var getSurrondingBlocks = function (centerBlock) { return blocks.filter(function (block) { return block.x - centerBlock.x <= size && block.x - centerBlock.x >= -size && block.y - centerBlock.y <= size && block.y - centerBlock.y >= -size && (block.x - centerBlock.x != 0 || block.y - centerBlock.y != 0); }); };
var getFullSurrondingBlocks = function (centerBlockPosition, loopBlocks) {
    var centerBlock = blocks.find(function (block) { return block.x == centerBlockPosition.x && block.y == centerBlockPosition.y; });
    if (centerBlock.surroundingBombs)
        return [centerBlock];
    if (loopBlocks.length == 0)
        loopBlocks.push(centerBlock);
    var surrondingBlocks = getSurrondingBlocks(centerBlock).filter(function (block) { return (!block.flag || (block.flag && block.surroundingBombs != 0 && !block.bomb)); });
    var remainingBlocks = surrondingBlocks.filter(function (surrondingBlock) { return !surrondingBlock.bomb && surrondingBlock.surroundingBombs == 0 && !loopBlocks.some(function (loopBlock) { return loopBlock.x == surrondingBlock.x && loopBlock.y == surrondingBlock.y; }); });
    loopBlocks.push.apply(loopBlocks, surrondingBlocks);
    if (remainingBlocks.every(function (block) { return block.surroundingBombs != 0; }))
        return surrondingBlocks;
    for (var _i = 0, remainingBlocks_1 = remainingBlocks; _i < remainingBlocks_1.length; _i++) {
        var block = remainingBlocks_1[_i];
        var blocks_1 = getFullSurrondingBlocks(block, loopBlocks);
        surrondingBlocks.push.apply(surrondingBlocks, blocks_1);
        loopBlocks.push.apply(loopBlocks, blocks_1);
    }
    return surrondingBlocks;
};
var getSurroundingBombCount = function (block) {
    var blocks = getSurrondingBlocks(block);
    if (!blocks)
        return 0;
    return blocks.filter(function (block) { return block.bomb; }).length;
};
var generateMap = function (blockPosition) {
    for (var i = 0; i < bombCount; i++) {
        bombPositions.push(randomPosition(blockPosition));
    }
    var color = ColorType.Light;
    var _loop_1 = function (i) {
        if (gameWidth % (size * 2) != 0 && i != 0)
            color = color == ColorType.Dark ? ColorType.Light : ColorType.Dark;
        var _loop_2 = function (j) {
            var bomb = bombPositions.some(function (pos) { return pos.x == i && pos.y == j; });
            color = color == ColorType.Dark ? ColorType.Light : ColorType.Dark;
            blocks.push({ bomb: bomb, color: color, exposed: false, flag: false, surroundingBombs: 0, x: i, y: j });
        };
        for (var j = 0; j <= gameHeight; j += size) {
            _loop_2(j);
        }
    };
    for (var i = 0; i <= gameWidth; i += size) {
        _loop_1(i);
    }
    blocks.forEach(function (block) {
        block.surroundingBombs = block.bomb ? 0 : getSurroundingBombCount({ x: block.x, y: block.y });
    });
    updateFlagCounter();
    mapGenerated = true;
};
var randomPosition = function (block) {
    var bomb = {
        x: Math.round((Math.random() * gameWidth) / size) * size,
        y: Math.round((Math.random() * gameHeight) / size) * size
    };
    var surroundingBlocksHaveBomb = bomb.x - block.x <= size && bomb.x - block.x >= -size && bomb.y - block.y <= size && bomb.y - block.y >= -size && (bomb.x - block.x != 0 || bomb.y - block.y != 0);
    if (!surroundingBlocksHaveBomb && !bombPositions.some(function (pos) { return bomb.x == pos.x && bomb.y == pos.y; }) && bomb.x != block.x && bomb.y != block.y)
        return bomb;
    else
        return randomPosition(block);
};
var updateFlagCounter = function () {
    rectangle(0, 0, flagCanvas.width, flagCanvas.height, '#202020', flagContext);
    flagContext.drawImage(flag, flagCanvas.width / 2 - 40, 0, 40, 40);
    flagContext.fillStyle = 'red';
    flagContext.font = '40px Arial';
    flagContext.fillText(currentFlagCount.toString(), flagCanvas.width / 2, 40 / 1.15);
};
var updateMap = function (blockPosition) {
    var surrondingBlocks = getFullSurrondingBlocks(blockPosition, []);
    if (surrondingBlocks.length != 1)
        surrondingBlocks.push(blocks.find(function (block) { return block.x == blockPosition.x && block.y == blockPosition.y; }));
    surrondingBlocks.forEach(function (block) {
        block.exposed = true;
        rectangle(block.x, block.y, size, size, getBlockColor(block));
        if (block.surroundingBombs == 0)
            return;
        gameContext.fillStyle = 'yellow';
        gameContext.font = "".concat(size / 2, "px Arial");
        gameContext.fillText(block.surroundingBombs.toString(), block.x + size / 2.75, block.y + size / 1.5);
    });
};
var handleLeftClick = function (event) {
    var rect = gameCanvas.getBoundingClientRect();
    var blockPosition = {
        x: Math.floor((event.pageX - rect.left) / size) * size,
        y: Math.floor((event.pageY - rect.top) / size) * size
    };
    if (!mapGenerated)
        generateMap(blockPosition);
    var block = blocks.find(function (block) { return block.x == blockPosition.x && block.y == blockPosition.y; });
    if (block.exposed || block.flag)
        return;
    void checkGameLoss(block);
    if (!gameRunning)
        return;
    updateMap(blockPosition);
    checkGameWin();
};
var getBlockColor = function (block) {
    if (block.exposed) {
        return block.color == ColorType.Dark ? darkBlue : lightBlue;
    }
    return block.color == ColorType.Dark ? darkGreen : lightGreen;
};
var handleRightClick = function (event) {
    var rect = gameCanvas.getBoundingClientRect();
    var blockPosition = {
        x: Math.floor((event.pageX - rect.left) / size) * size,
        y: Math.floor((event.pageY - rect.top) / size) * size
    };
    if (!mapGenerated)
        generateMap(blockPosition);
    var block = blocks.find(function (block) { return block.x == blockPosition.x && block.y == blockPosition.y; });
    console.log(block);
    if (block.exposed)
        return;
    if (!block.flag) {
        gameContext.drawImage(flag, block.x, block.y, size, size);
        block.flag = true;
        currentFlagCount--;
        checkGameWin();
    }
    else {
        rectangle(block.x, block.y, size, size, getBlockColor(block));
        block.flag = false;
        currentFlagCount++;
    }
    updateFlagCounter();
};
var startGame = function () {
    blocks = [];
    bombPositions = [];
    gameRunning = true;
    mapGenerated = false;
    gameId++;
    currentFlagCount = bombCount;
    rectangle(0, 0, gameCanvas.width, gameCanvas.height, lightGreen);
    for (var i = 0; i <= gameCanvas.height; i += size * 2) {
        for (var j = 0; j <= gameCanvas.width; j += size * 2) {
            rectangle(j, i, size, size, darkGreen);
            rectangle(j + size, i + size, size, size, darkGreen);
        }
    }
    rectangle(0, 0, flagCanvas.width, flagCanvas.height, '#202020', flagContext);
};
var gameId = 0;
var gameRunning;
var mapGenerated;
var blocks;
var bombPositions;
var currentFlagCount;
startGame();
//# sourceMappingURL=script.js.map