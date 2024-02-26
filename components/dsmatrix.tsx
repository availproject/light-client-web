"use client"

import Cell from "./cell";
import { Cell as CellType } from "@/types/light-client";
import { Matrix } from "@/types/light-client";
import config from "../utils/config"

import { useWindowSize } from '@/hooks/use-window-size';

type Props = {
  matrix: Matrix,
  processing: boolean
}

export default function DsMatrix(props: Props) {
  // const matrix: Matrix = {
  //   maxRow: 64,
  //   maxCol: 64,
  //   totalCellCount: 4096,
  //   verifiedCells: []
  // }
  let matrix: Matrix = props.matrix
  let columnCount = matrix.maxCol
  let cells = matrix.verifiedCells
  let totalCellCount = matrix.totalCellCount === 0 ? 128 : matrix.totalCellCount;

  let processing = props.processing;

  const windowSize = useWindowSize();
  let r = matrix.maxRow
  let c = matrix.maxCol


  function getRowCount(): number {
    let defaultRowCount = windowSize.width! < 1500 ? 15 : 20;
    return (r as number > defaultRowCount ? r : defaultRowCount);
  }

  function getColumnCount(): number {
    let defaultColumnCount = windowSize.width! < 760 ? 20 : windowSize.width! < 1500 ? 40 : 60;
    return (c as number > defaultColumnCount ? c : defaultColumnCount);
  }

  let row = new Array(r * config.EXTENSION_FACTOR).fill(1)
  let col = new Array(c).fill(1)

  let totalCells = new Array(totalCellCount).fill(1)

  // function displayCells(): CellType[] {
  //   const timeNow = Date.now();
  //   let displayCells: CellType[] = [];
  //   for (let i = 0; i < totalCellCount; i++) {
  //     if (i == 1) console.log("Display cells is running")
  //     let index = i == 0 ? 1 : i;

  //     let row = Math.floor(index / columnCount);
  //     let col = index % columnCount;

  //     displayCells.push({
  //       row,
  //       col,
  //     });
  //   }

  //   console.log(Date.now() - timeNow)
  //   return displayCells;
  // }

  const checkForSampleCell = (row: any, col: any) => {
    return cells?.some((cell: { row: any; col: any; }) => {
      return cell.row == row && cell.col == col
    })
  }

  const colorCheck = (r: any, c: any) => {
    let row = r
    let col = c
    if (checkForSampleCell(row, col)) {
      return processing ? "#FFFF00" : "#3CBBF9"
    }

    return "#222630"
  }

  return (
    <div className="flex flex-col p-10 space-y-4">
      <h1 className="subheading lg:!text-left !w-full 2xl:pb-2 pb-1">Data Sampling Matrix</h1>
      <div className=" rounded-xl self-start p-4 bg-[#292E3A] max-h-[300px] lg:max-h-[600px] max-w-full">
        <div className="matrix flex flex-wrap self-start max-h-[268px] overflow-auto">
          {/* <div className="grid grid-cols-16 lg:grid-cols-32 gap-2"> */}
          {

            row.map((ele, i) => (
              <div className="flex flex-row" key={i}>
                {col.map((ele, j) => (
                  <div key={j} className="p-[1.5px]">
                    <Cell key={i * c + j} color={colorCheck(i, j)} />
                    {/* <Cell key={i * c + j} color="#FFFF00" /> */}
                  </div>
                ))}
              </div>
            ))
            // displayCells().map((cell, index) => {
            //   return (<Cell key={index} color={colorCheck(cell.row, cell.col)} />)
            // })
            // totalCells.map((ele, i) => {
            //   let index = i == 0 ? 1 : i;

            //   let row = Math.floor(index / columnCount);
            //   let col = index % columnCount;
            //   return (<Cell key={i} color={colorCheck(row, col)} />)
            // })
          }
          {/* </div> */}
        </div>
      </div>
    </div >
  );
}
