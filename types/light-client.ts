export type Cell = {
    row: number,
    col: number
}

export type Block = {
    network: string;
    number: string;
    hash: string;
    totalCellCount: number;
    confidence: number;
    sampleCount: number;
    hasDaSubmissions: boolean;
};

export type Matrix = {
    maxRow: number,
    maxCol: number,
    verifiedCells: Cell[],
    totalCellCount: number,
    originalRows: number,
    originalCols: number,
}

export type BlockHeader = {
    blockHash: string,
    blockNumber: number,
    matrixRows: number,
    matrixCols: number,
}

export type BlockToProcess = {
    block: Block,
    matrix: Matrix,
    verifiedCells: Cell[],
    proofs: Uint8Array[],
    commitments: Uint8Array[]
    network: string
}


