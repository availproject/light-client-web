"use client"

import Cell from "./cell";
import { useWindowSize } from '@/hooks/use-window-size';
import { Matrix } from "@/types/light-client";

type Props = {
  matrix: Matrix
}

export default function DsMatrix(props: Props) {
  const windowSize = useWindowSize();
  let matrix: Matrix = props.matrix
  let r = matrix.maxRow
  let c = matrix.maxCol
  let cells = matrix.verifiedCells

  function getRowCount(): number {
    let defaultRowCount = windowSize.width! < 1500 ? 15 : 20;
    return (r as number > defaultRowCount ? r : defaultRowCount);
  }

  function getColumnCount(): number {
    let defaultColumnCount = windowSize.width! < 760 ? 20 : windowSize.width! < 1500 ? 40 : 60;
    return (c as number > defaultColumnCount ? c : defaultColumnCount);
  }

  let row = new Array(getRowCount()).fill(1)
  let col = new Array(getColumnCount()).fill(1)

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
        <div className="matrix self-start max-h-[268px] lg:max-h-[568px] overflow-auto">
          {
            row.map((ele, i) => (
              <div className="flex flex-row" key={i}>
                {col.map((ele, j) => (
                  <div key={j} className="p-[1.5px]">
                    <Cell color={colorCheck(i, j)} key={j} />
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
