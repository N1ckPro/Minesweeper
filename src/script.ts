enum ColorType {
    Dark,
    Light
}

const gameCanvas = document.getElementById('canvas') as HTMLCanvasElement;
const gameContext = gameCanvas.getContext('2d')!;
const flagCanvas = document.getElementById('flag_count') as HTMLCanvasElement;
const flagContext = flagCanvas.getContext('2d')!;

gameCanvas.width = 600;
gameCanvas.height = 600;
flagCanvas.width = 600;
flagCanvas.height = 100;

const size = 40;
const gameWidth = gameCanvas.width - size;
const gameHeight = gameCanvas.height - size;
const bombPercentage = 20;
const bombCount = Math.round((gameCanvas.width / size) * (gameCanvas.height / size) * (bombPercentage / 100));
const darkBlue = '#0000ff';
const darkGreen = '#33ff33';
const lightBlue = '#3333ff';
const lightGreen = '#99ff99';

const flag = new Image();
flag.src = 'images/flag.png';

const rectangle = (x: number, y: number, width: number, length: number, color: string, context = gameContext) => {
    context.fillStyle = color;
    context.fillRect(x, y, width, length);
};

gameCanvas.addEventListener('click', event => {
    if (!gameRunning) return;
    if (event.button == 0) return handleLeftClick(event);
});

gameCanvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (gameRunning) handleRightClick(event);
}, false);

window.addEventListener('keydown', event => {
    if (event.key.toLowerCase() == 'r') startGame();
});

const getRandomIndex = (length: number, indexes: number[]) => {
    const index = Math.round(Math.random() * length);
    if (!indexes.some(ind => ind == index)) indexes.push(index);
    else getRandomIndex(length, indexes);
};

const checkGameLoss = async (block: BlockPosition) => {
    if (block.bomb) {
        const gameIdTemp = gameId;
        gameRunning = false;

        const loopBlocks = blocks.filter(block => block.bomb || block.flag);
        const indexes: number[] = [];
        loopBlocks.forEach(() => {
            getRandomIndex(loopBlocks.length - 1, indexes);
        });

        for await (const index of indexes) {
            if (gameId != gameIdTemp) return;
            const block = loopBlocks[index];

            if (block.flag && block.bomb) continue;
            if (block.flag && !block.bomb) rectangle(block.x, block.y, size, size, getBlockColor(block));
            else {
                gameContext.fillStyle = 'black';
                gameContext.beginPath();
                gameContext.arc(block.x + size / 2, block.y + size / 2, size / 4, 0, 2 * Math.PI);
                gameContext.fill();
                gameContext.stroke();
            }
            await new Promise(resolve => window.setTimeout(resolve, 200));
        }
        if (gameId != gameIdTemp) return;

        gameContext.fillStyle = 'red';
        gameContext.font = '50px Arial';
        gameContext.fillText('GAME OVER', 50, 200);
    }
};

const checkGameWin = () => {
    if (blocks.filter(block => !block.bomb).every(block => block.exposed)) {
        gameRunning = false;
        gameContext.fillStyle = 'green';
        gameContext.font = '50px Arial';
        gameContext.fillText('YOU WON', 50, 200);
    }
};

const getSurrondingBlocks = (centerBlock: Position) => blocks.filter(block => block.x - centerBlock.x <= size && block.x - centerBlock.x >= -size && block.y - centerBlock.y <= size && block.y - centerBlock.y >= -size && (block.x - centerBlock.x != 0 || block.y - centerBlock.y != 0));

const getFullSurrondingBlocks = (centerBlockPosition: Position, loopBlocks: Position[]) => {
    const centerBlock = blocks.find(block => block.x == centerBlockPosition.x && block.y == centerBlockPosition.y)!;
    if (centerBlock.surroundingBombs) return [centerBlock];

    if (loopBlocks.length == 0) loopBlocks.push(centerBlock);
    const surrondingBlocks = getSurrondingBlocks(centerBlock).filter(block => (!block.flag || (block.flag && block.surroundingBombs != 0 && !block.bomb)));
    const remainingBlocks = surrondingBlocks.filter(surrondingBlock => !surrondingBlock.bomb && surrondingBlock.surroundingBombs == 0 && !loopBlocks.some(loopBlock => loopBlock.x == surrondingBlock.x && loopBlock.y == surrondingBlock.y));
    loopBlocks.push(...surrondingBlocks);

    if (remainingBlocks.every(block => block.surroundingBombs != 0)) return surrondingBlocks;

    for (const block of remainingBlocks) {
        const blocks = getFullSurrondingBlocks(block, loopBlocks);
        surrondingBlocks.push(...blocks);
        loopBlocks.push(...blocks);
    }
    return surrondingBlocks;
};

const getSurroundingBombCount = (block: Position) => {
    const blocks = getSurrondingBlocks(block);
    if (!blocks) return 0;

    return blocks.filter(block => block.bomb).length;
};

const generateMap = (blockPosition: Position) => {
    for (let i = 0; i < bombCount; i++) {
        bombPositions.push(randomPosition(blockPosition));
    }

    let color = ColorType.Light as ColorType.Dark | ColorType.Light;
    for (let i = 0; i <= gameWidth; i += size) {
        if (gameWidth % (size * 2) != 0 && i != 0) color = color == ColorType.Dark ? ColorType.Light : ColorType.Dark;
        for (let j = 0; j <= gameHeight; j += size) {
            const bomb = bombPositions.some(pos => pos.x == i && pos.y == j);
            color = color == ColorType.Dark ? ColorType.Light : ColorType.Dark;
            blocks.push({ bomb, color, exposed: false, flag: false, surroundingBombs: 0, x: i, y: j });
        }
    }

    blocks.forEach(block => {
        block.surroundingBombs = block.bomb ? 0 : getSurroundingBombCount({ x: block.x, y: block.y });
    });

    updateFlagCounter();

    mapGenerated = true;
};

const randomPosition = (block: Position): Position => {
    const bomb = {
        x: Math.round((Math.random() * gameWidth) / size) * size,
        y: Math.round((Math.random() * gameHeight) / size) * size
    } satisfies Position;
    const surroundingBlocksHaveBomb = bomb.x - block.x <= size && bomb.x - block.x >= -size && bomb.y - block.y <= size && bomb.y - block.y >= -size && (bomb.x - block.x != 0 || bomb.y - block.y != 0);

    if (!surroundingBlocksHaveBomb && !bombPositions.some(pos => bomb.x == pos.x && bomb.y == pos.y) && bomb.x != block.x && bomb.y != block.y) return bomb;
    else return randomPosition(block);
};

const updateFlagCounter = () => {
    rectangle(0, 0, flagCanvas.width, flagCanvas.height, '#202020', flagContext);
    flagContext.drawImage(flag, flagCanvas.width / 2 - 40, 0, 40, 40);
    flagContext.fillStyle = 'red';
    flagContext.font = '40px Arial';
    flagContext.fillText(currentFlagCount.toString(), flagCanvas.width / 2, 40 / 1.15);
};

const updateMap = (blockPosition: Position) => {
    const surrondingBlocks = getFullSurrondingBlocks(blockPosition, []);
    if (surrondingBlocks.length != 1) surrondingBlocks.push(blocks.find(block => block.x == blockPosition.x && block.y == blockPosition.y)!);

    surrondingBlocks.forEach(block => {
        block.exposed = true;
        rectangle(block.x, block.y, size, size, getBlockColor(block));

        if (block.surroundingBombs == 0) return;
        gameContext.fillStyle = 'yellow';
        gameContext.font = `${size / 2}px Arial`;
        gameContext.fillText(block.surroundingBombs.toString(), block.x + size / 2.75, block.y + size / 1.5);
    });
};

const handleLeftClick = (event: MouseEvent) => {
    const rect = gameCanvas.getBoundingClientRect();
    const blockPosition = {
        x: Math.floor((event.pageX - rect.left) / size) * size,
        y: Math.floor((event.pageY - rect.top) / size) * size
    } satisfies Position;

    if (!mapGenerated) generateMap(blockPosition);
    const block = blocks.find(block => block.x == blockPosition.x && block.y == blockPosition.y)!;

    if (block.exposed || block.flag) return;

    void checkGameLoss(block);
    if (!gameRunning) return;

    updateMap(blockPosition);
    checkGameWin();
};

const getBlockColor = (block: BlockPosition) => {
    if (block.exposed) {
        return block.color == ColorType.Dark ? darkBlue : lightBlue;
    }

    return block.color == ColorType.Dark ? darkGreen : lightGreen;
};

const handleRightClick = (event: MouseEvent) => {
    const rect = gameCanvas.getBoundingClientRect();
    const blockPosition = {
        x: Math.floor((event.pageX - rect.left) / size) * size,
        y: Math.floor((event.pageY - rect.top) / size) * size
    } satisfies Position;

    if (!mapGenerated) generateMap(blockPosition);

    const block = blocks.find(block => block.x == blockPosition.x && block.y == blockPosition.y)!;
    console.log(block);

    if (block.exposed) return;
    if (!block.flag) {
        gameContext.drawImage(flag, block.x, block.y, size, size);
        block.flag = true;
        currentFlagCount--;
        checkGameWin();
    } else {
        rectangle(block.x, block.y, size, size, getBlockColor(block));
        block.flag = false;
        currentFlagCount++;
    }
    updateFlagCounter();
};

const startGame = () => {
    blocks = [];
    bombPositions = [];
    gameRunning = true;
    mapGenerated = false;
    gameId++;
    currentFlagCount = bombCount;

    rectangle(0, 0, gameCanvas.width, gameCanvas.height, lightGreen);
    for (let i = 0; i <= gameCanvas.height; i += size * 2) {
        for (let j = 0; j <= gameCanvas.width; j += size * 2) {
            rectangle(j, i, size, size, darkGreen);
            rectangle(j + size, i + size, size, size, darkGreen);
        }
    }
    rectangle(0, 0, flagCanvas.width, flagCanvas.height, '#202020', flagContext);
};

let gameId = 0;
let gameRunning: boolean;
let mapGenerated: boolean;
let blocks: BlockPosition[];
let bombPositions: Position[];
let currentFlagCount: number;
startGame();
