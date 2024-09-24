"use client";

import Cell from "./cell";
import { Cell as CellType } from "@/types/light-client";
import { Matrix } from "@/types/light-client";
import config from "../utils/config";

type Props = {
  matrix: Matrix;
  processing: boolean;
  hasDaSubmissions: boolean;
  blockNumber: string;
};

export default function DsMatrix(props: Props) {

  let matrix: Matrix = props.matrix;
  let cells = matrix.verifiedCells;

  let processing = props.processing;
  let r = matrix.maxRow;
  let c = matrix.maxCol;

  let _r = r*config.EXTENSION_FACTOR

  let row = new Array(r * config.EXTENSION_FACTOR).fill(1);
  let col = new Array(c).fill(1);

  const checkForSampleCell = (row: any, col: any) => {
    return cells?.some((cell: { row: any; col: any }) => {
      return cell.row == row && cell.col == col;
    });
  };

  const colorCheck = (r: any, c: any) => {
    let row = r;
    let col = c;
    if (checkForSampleCell(row, col)) {
      return processing ? "#FFFF00" : "#3CBBF9";
    }

    return "#222630";
  };

  return (
    <div className="flex flex-col p-10 space-y-4">
      <div className="flex flex-col space-y-2">
      <h1 className="heading lg:!text-3xl lg:!text-left !w-full 2xl:pb-2 pb-1">
        Data Sampling Matrix{" "}
     {props.hasDaSubmissions &&  <span className={`!text-opacity-70 text-opacity !text-md text-[#22C55F]`}>
          {`(${_r} X ${c})`}
        </span>}   
      </h1>
      </div>
      {props.hasDaSubmissions ? (
  <div className="rounded-xl self-start p-4 bg-[#292E3A] max-h-[300px] lg:max-h-[600px] max-w-full">
    <div className="matrix flex flex-wrap self-start max-h-[268px] overflow-auto">
      {row.map((ele, i) => (
        <div className="flex flex-row" key={i}>
          {col.map((ele, j) => (
            <div key={j} className="p-[1.5px]">
              <Cell key={i * c + j} color={colorCheck(i, j)} />
            </div>
          ))}
        </div>
      ))}
      {/* <h2 className="">Loading...</h2> */}
    </div>
  </div>
) : (
  <div className="rounded-xl self-start p-4 bg-[#292E3A] max-h-[200px] lg:max-h-[300px] max-w-full relative">
    <div className="matrix flex flex-wrap self-start max-h-[268px] overflow-auto">
      {[...Array(10)].map((_, i) => (
        <div className="flex flex-row" key={i}>
          {[...Array(80)].map((_, j) => (
            <div key={j} className="p-[1.5px]">
              <Cell key={i * 128 + j} color="#222630" />
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className=" text-center flex flex-row items-center justify-center -rotate-[10px]">
  
        <h2 className="text-[#D2D3D4] text-center text whitespace-nowrap">Block   <span className={`z-50 text-lg text-[#3CBBF9] text-opacity-70`}><a href={`https://avail.subscan.io/block/${props.blockNumber}`}>#{props.blockNumber}</a></span> has no DA submissions</h2>
      </div>
    </div>
  </div>
)}
      <h2 className="text-[#D2D3D4] text-center ">{props.hasDaSubmissions ? `(Scroll to see the cells getting sampled in realtime)` : ``}</h2>
    </div>
  );
}
