import { Cell, Matrix } from "@/types/light-client";

export const getNetworkUrl = (network: string) => {
    switch (network) {
        case "Mainnet":
            return "wss://mainnet.avail-rpc.com/"
        default:
            return "wss://turing-rpc.avail.so/ws"
    }
}

export const generateRandomCells = (rows: number, cols: number, count: number) => {
    const cells: Cell[] = [];
    const used = new Set<string>();
    
    while (cells.length < count) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        const key = `${row},${col}`;
        
        if (!used.has(key)) {
            used.add(key);
            cells.push({ row, col });
        }
    }
    
    return cells.sort((a, b) => a.row - b.row || a.col - b.col);
};

export const sleep = (delay: number | undefined) => new Promise((resolve) => setTimeout(resolve, delay))

export const calculateGridDimensions = (matrix: Matrix) => {
    const totalMatrixCells = matrix.maxRow * matrix.maxCol;
    const GRID_SIZE_PX = 384;
    
    // Determine display grid size based on total cells
    let displaySize: number;
    if (totalMatrixCells <= 64) {
        displaySize = 8;     // For small data (≤ 2KB)
    } else if (totalMatrixCells <= 1024) {
        displaySize = 32;    // For medium data (≤ 32KB)
    } else {
        displaySize = 64;    // For large data (> 32KB)
    }
    
    return {
        rows: displaySize,
        cols: displaySize,
        cellSize: Math.floor(GRID_SIZE_PX / displaySize)
    };
};

export const formatCells = (cells: Cell[]): string => {
    return cells.map(cell => `(${cell.row},${cell.col})`).join(', ');
  };



export const mapCellToDisplayGrid = (
    cell: { row: number, col: number },
    matrix: Matrix,
    displaySize: number
): { displayRow: number, displayCol: number } => {
    // Use same zone-based mapping for all grid sizes
    const zoneRows = 2;
    const zoneCols = 3;
    const zoneHeight = displaySize / zoneRows;
    const zoneWidth = displaySize / zoneCols;
    
    const colFraction = cell.col / matrix.maxCol;
    const rowFraction = cell.row / matrix.maxRow;
    
    // For all matrix sizes, use the same zone-based distribution
    const baseZone = Math.floor(colFraction * zoneCols);
    const zoneOffset = (colFraction * zoneCols) % 1;
    
    // Calculate row position based on original row and zone
    const rowPosition = rowFraction * zoneRows;
    const displayRow = Math.floor(displaySize * (rowPosition + zoneOffset) / zoneRows);
    
    // Calculate column position using zone-based distribution
    const displayCol = Math.floor((baseZone + zoneOffset) * zoneWidth);
    return {
        displayRow: Math.min(Math.max(0, displayRow), displaySize - 1),
        displayCol: Math.min(Math.max(0, displayCol), displaySize - 1)
    };
};

// Only show grid mapping for blocks with DA submissions
export const logGridMapping = (matrix: Matrix, displaySize: number): void => {
    if (!matrix.verifiedCells || matrix.verifiedCells.length === 0) return;

    const mappedCells = matrix.verifiedCells.map(cell => {
        const mapped = mapCellToDisplayGrid(cell, matrix, displaySize);
        return {
            original: `(${cell.row},${cell.col})`,
            mapped: `(${mapped.displayRow},${mapped.displayCol})`
        };
    });

    console.debug('Grid mapping:', {
        matrixDimensions: `${matrix.maxRow}x${matrix.maxCol}`,
        displayGrid: `${displaySize}x${displaySize}`,
        verifiedCells: mappedCells
    });
}

