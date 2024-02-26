export type Cell = {
    row: number,
    col: number
}

export interface Block {
    number: number,
    hash: string,
    totalCellCount: number,
    confidence: number | null,
    sampleCount: number,
    timestamp: number,
}

export type Matrix = {
    maxRow: number,
    maxCol: number,
    verifiedCells: Cell[],
    totalCellCount: number,
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
    randomCells: Cell[],
    proofs: Uint8Array[],
    commitments: Uint8Array[]
}


