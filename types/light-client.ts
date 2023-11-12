export type Cell = {
    row: number,
    col: number
}

export type Block = {
    number: number,
    hash: string,
    totalCellCount: number,
    confidence: number,
    sampleCount: number
}

export type Matrix = {
    maxRow: number,
    maxCol: number,
    verifiedCells: Cell[]
}

export type BlockHeader = {
    blockHash: string,
    blockNumber: number,
    matrixRows: number,
    matrixCols: number,

}


