"use client"

import Cell from "./cell";
import { Cell as CellType } from "@/types/light-client";
import { useWindowSize } from '@/hooks/use-window-size';
import { Matrix } from "@/types/light-client";

type Props = {
  matrix: Matrix,
}

export default function DsMatrix(props: Props) {
  let matrix: Matrix = props.matrix
  let columnCount = matrix.maxCol
  let cells = matrix.verifiedCells
  let totalCellCount = matrix.totalCellCount === 0 ? 128 : matrix.totalCellCount;

  function displayCells(): CellType[] {
    let displayCells: CellType[] = [];
    for (let i = 0; i < totalCellCount; i++) {
      let index = i == 0 ? 1 : i;
      let row = Math.floor(index / columnCount);
      let col = index % columnCount;

      displayCells.push({
        row,
        col,
      });
    }

    return displayCells;
  }

  const checkForSampleCell = (row: any, col: any) => {
    return cells?.some((cell: { row: any; col: any; }) => {
      return cell.row == row && cell.col == col
    })
  }

  const colorCheck = (r: any, c: any) => {
    let row = r
    let col = c
    if (checkForSampleCell(row, col)) {
      return "#3CBBF9"
    }
    return "#222630"
  }

  return (
    <div className="flex flex-col p-10 space-y-4">
      <h1 className="subheading lg:!text-left !w-full 2xl:pb-2 pb-1">Data Sampling Matrix</h1>
      <div className=" rounded-xl self-start p-4 bg-[#292E3A] max-h-[300px] lg:max-h-[600px] max-w-full">
        <div className="matrix flex flex-wrap self-start max-h-[268px] lg:max-h-[568px] overflow-auto">
          <div className="grid grid-cols-16 lg:grid-cols-32 gap-2">
            {
              displayCells().map(cell => {
                return (<Cell color={colorCheck(cell.row, cell.col)} />)
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
