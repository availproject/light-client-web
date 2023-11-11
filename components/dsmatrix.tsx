"use client"

//@ts-ignore
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import { useEffect } from "react";
import Cell from "./cell";
import { useWindowSize } from '@/hooks/use-window-size';


export default function DsMatrix(props: any) {
  const windowSize = useWindowSize();
  let matrix = props.matrix
  let r = matrix.row
  let c = matrix.col
  let cells = matrix.verifiedCells


  let row = new Array(parseInt(windowSize.width! < 760 ? '15' : windowSize.width! > 1500 ? '20' : '15')).fill(1)
  let col = new Array(parseInt(windowSize.width! < 760 ? '20' : windowSize.width! > 1500 ? '60' : ' 40')).fill(1)

  const checkForSampleCell = (row: any, col: any) => {
    return cells?.some((cell: { row: any; col: any; }) => {
      return cell.row == row && cell.col == col
    })
  }

  const colorCheck = (r: any, c: any) => {
    let row = r
    let col = c
    if (checkForSampleCell(row, col)) {
      return "#131215"
    }
    return "#222630"
  }

  const rows = () => {
    let rows = [];
    for (let i = 0; i < 10; i++) {
      rows.push(
        <div className="flex flex-row" key={i}>
          {columns()}
        </div>
      );
    }

    return rows;
  }

  const columns = () => {
    let rows = [];
    for (let i = 0; i < 10; i++) {
      rows.push(<Cell color={"#2DCF2A"} key={i} />)
    }

    return rows;
  }



  return (
    <div className="flex flex-col p-10 space-y-4">
      <h1 className="subheading lg:!text-left !w-full 2xl:pb-2 pb-1">Data Sampling Matrix</h1>
      <div className=" rounded-xl self-start p-4 bg-[#292E3A] max-h-[300px] lg:max-h-[600px] max-w-full">
        <div className="matrix self-start   max-h-[268px] lg:max-h-[568px] overflow-auto">
          {
            rows()
          }
        </div>
      </div>
    </div>
  );
}
