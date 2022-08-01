interface Position {
    x: number;
    y: number;
}

interface BlockPosition extends Position {
    bomb: boolean;
    color: string;
    exposed: boolean;
    flag: boolean;
    surroundingBombs: number;
}