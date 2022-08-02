interface Position {
    x: number;
    y: number;
}

interface BlockPosition extends Position {
    bomb: boolean;
    color: ColorType;
    exposed: boolean;
    flag: boolean;
    surroundingBombs: number;
}
