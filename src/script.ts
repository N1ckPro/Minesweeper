
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d');
const size = 40;
const gameWidth = canvas.width - size;
const gameHeight = canvas.height - size;
let gameRunning = true;
let mapGenerated = false;

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (gameRunning) handleRightClick(event);
}, false);

const darkGreen = '#33ff33';
const lightGreen = '#99ff99';

const blocks: BlockPosition[] = [];

const rectangle = (x: number, y: number, width: number, length: number, color: string): void => {
    context.fillStyle = color;
    context.fillRect(x, y, width, length);
};

rectangle(0, 0, canvas.width, canvas.height, lightGreen);
for (let i = 0; i <= canvas.height; i += size * 2) {
    for (let j = 0; j <= canvas.width; j += size * 2) {
        rectangle(j, i, size, size, darkGreen);
        rectangle(j + size, i + size, size, size, darkGreen);
    }
}

const bombPositions: Position[] = [];

const randomPosition = (block: Position): Position => {
    const bomb = {
        x: Math.round((Math.random() * gameWidth) / size) * size,
        y: Math.round((Math.random() * gameHeight) / size) * size
    };
    const surroundingBlocksHaveBomb = bomb.x - block.x <= size && bomb.x - block.x >= -size && bomb.y - block.y <= size && bomb.y - block.y >= -size && (bomb.x - block.x != 0 || bomb.y - block.y != 0);

    if (!surroundingBlocksHaveBomb && !bombPositions.some(pos => bomb.x == pos.x && bomb.y == pos.y) && bomb.x != block.x && bomb.y != block.y) return bomb;
    else return randomPosition(block);
};

const getSurroundingBombCount = (block: Position): number => {
    const blocks = getSurrondingBlocks(block);
    if (!blocks) return 0;

    return blocks.filter(block => block.bomb).length;
};

const getSurrondingBlocks = (centerBlock: Position): BlockPosition[] => blocks.filter(block => block.x - centerBlock.x <= size && block.x - centerBlock.x >= -size && block.y - centerBlock.y <= size && block.y - centerBlock.y >= -size && (block.x - centerBlock.x != 0 || block.y - centerBlock.y != 0));

const getFullSurrondingBlocks = (centerBlockPosition: Position, loopBlocks: Position[]): BlockPosition[] => {
    const centerBlock = blocks.find(block => block.x == centerBlockPosition.x && block.y == centerBlockPosition.y);
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

const checkGameLoss = (block: BlockPosition): void => {
    if (block.bomb && !block.flag) {
        gameRunning = false;
        context.fillStyle = 'red';
        context.font = '50px Arial';
        context.fillText('GAME OVER', 50, 200);
    }
};

const checkGameWin = (): void => {
    if (blocks.filter(block => !block.bomb).every(block => block.exposed)) {
        gameRunning = false;
        context.fillStyle = 'green';
        context.font = '50px Arial';
        context.fillText('YOU WON', 50, 200);
    }
};

const updateMap = (blockPosition: Position): void => {
    const surrondingBlocks = getFullSurrondingBlocks(blockPosition, []);
    if (surrondingBlocks.length != 1) surrondingBlocks.push(blocks.find(block => block.x == blockPosition.x && block.y == blockPosition.y));

    surrondingBlocks.forEach(block => {
        block.exposed = true;
        rectangle(block.x, block.y, size, size, '#0000ff');

        if (block.surroundingBombs == 0) return;
        context.fillStyle = 'yellow';
        context.font = '20px Arial';
        context.fillText(block.surroundingBombs.toString(), block.x + 15, block.y + 25);
    });
};

const generateMap = (blockPosition: Position): void => {
    for (let i = 0; i < 25; i++) {
        bombPositions.push(randomPosition(blockPosition));
    }

    let color = lightGreen;
    for (let i = 0; i <= gameWidth; i += size) {
        if (gameWidth % (size * 2) != 0 && i != 0) color = color == darkGreen ? lightGreen : darkGreen;
        for (let j = 0; j <= gameHeight; j += size) {
            const bomb = bombPositions.some(pos => pos.x == i && pos.y == j);
            color = color == darkGreen ? lightGreen : darkGreen;
            blocks.push({ bomb, color, exposed: false, flag: false, surroundingBombs: 0, x: i, y: j });
        }
    }

    blocks.forEach(block => {
        block.surroundingBombs = block.bomb ? 0 : getSurroundingBombCount({ x: block.x, y: block.y });
    });

    mapGenerated = true;
};

const handleLeftClick = (event: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    const blockPosition: Position = {
        x: Math.floor((event.pageX - rect.left) / size) * size,
        y: Math.floor((event.pageY - rect.top) / size) * size
    };

    if (!mapGenerated) generateMap(blockPosition);
    const block = blocks.find(block => block.x == blockPosition.x && block.y == blockPosition.y);

    if (block.exposed || block.flag) return;

    checkGameLoss(block);
    checkGameWin();
    updateMap(blockPosition);
};

const handleRightClick = (event: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    const blockPosition: Position = {
        x: Math.floor((event.pageX - rect.left) / size) * size,
        y: Math.floor((event.pageY - rect.top) / size) * size
    };

    if (!mapGenerated) generateMap(blockPosition);

    const block = blocks.find(block => block.x == blockPosition.x && block.y == blockPosition.y);
    console.log(block);

    if (block.exposed) return;
    if (!block.flag) {
        rectangle(block.x, block.y, size, size, 'red');
        block.flag = true;
        checkGameWin();
    } else {
        rectangle(block.x, block.y, size, size, block.color);
        block.flag = false;
    }
};

canvas.addEventListener('click', event => {
    if (!gameRunning) return;
    if (event.button == 0) return handleLeftClick(event);
});
