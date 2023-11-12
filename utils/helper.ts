import { Cell } from "@/types/light-client";

export const generateRandomCells = (r: number, c: number, count: number) => {
    const extendedRowCount = r * 2
    const maxCellCount = extendedRowCount * c;
    let size = count;
    if (maxCellCount < count) {
        size = maxCellCount
    }
    let cellList: Array<Cell> = []
    let randomPointList = randomUniqueNum(maxCellCount, size)
    randomPointList.forEach((p) => {
        const row = Math.floor(p / c)
        const col = p - row * c
        cellList.push({ row, col })
    })
    return cellList
}

export const sleep = (delay: number | undefined) => new Promise((resolve) => setTimeout(resolve, delay))


const randomUniqueNum = (range: number, outputCount: number) => {
    let arr = []
    for (let i = 0; i < range; i++) {
        arr.push(i)
    }
    let result = [];
    for (let i = 1; i <= outputCount; i++) {
        const random = Math.floor(Math.random() * (range - i));
        result.push(arr[random]);
        arr[random] = arr[range - i];
    }
    return result;
}