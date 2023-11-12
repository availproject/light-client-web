"use client";

import AvailChain from "@/components/availchain";
import BlockData from "@/components/blockdata";
import DsMatrix from "@/components/dsmatrix";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/header";
import { useState, useEffect } from "react";
import init, { check } from "@/avail-light/pkg/wasm_avail_light";
import config from "../utils/config";
import { sleep } from "@/utils/helper";
import { Block, Matrix, Cell } from "@/types/light-client";
import { runLC } from "@/repository/avail-light.repository";
import Link from "next/link";

export default function Home() {
  const [latestBlock, setLatestBlock] = useState<Block | null>(null);
  const [blockList, setBlockList] = useState<Array<Block>>([]);
  const [matrix, setMatrix] = useState<Matrix>({
    maxRow: 0,
    maxCol: 0,
    verifiedCells: [],
    totalCellCount: 0,
  });
  const [running, setRunning] = useState<Boolean>(false);
  const [stop, setStop] = useState<Function | null>(null);

  useEffect(() => {
    init();
  }, []);

  const refreshApp = () => {
    setRunning(true);
    setBlockList([]);
    setMatrix({ maxRow: 0, maxCol: 0, verifiedCells: [], totalCellCount: 0 });
    setLatestBlock(null);
  };

  const processBlock = async (
    block: Block,
    matrix: Matrix,
    cells: Cell[],
    proofs: Uint8Array[],
    commitments: Uint8Array[]
  ) => {
    addBlock(block);

    //Indivisual cell verification
    let verifiedCount = 0;
    let verifiedCells: Cell[] = [];

    for (let i = 0; i < cells.length; i++) {
      if (block.number < (latestBlock?.number || 0)) {
        return;
      }
      let cell = cells[i];

      const res = check(
        proofs[i],
        commitments[cell.row],
        matrix.maxCol,
        cell.row,
        cell.col
      );
      //console.log(res)
      if (res) {
        verifiedCount++;
        const confidence = 100 * (1 - 1 / Math.pow(2, verifiedCount));
        verifiedCells.push(cell);

        setLatestBlock({
          hash: block.hash,
          number: block.number,
          totalCellCount: block.totalCellCount,
          confidence: confidence,
          sampleCount: block.sampleCount,
        });
        console.log("Updating verified cells details.")

        setMatrix({
          maxRow: matrix.maxRow,
          maxCol: matrix.maxCol,
          //@ts-ignore
          verifiedCells,
          totalCellCount: matrix.totalCellCount,
        });

        await sleep(100);
      }
    }
  };

  const run = async () => {
    refreshApp();

    runLC(processBlock, setStop);
  };

  const addBlock = (newBlock: Block) => {
    setLatestBlock(newBlock);

    //@ts-ignore
    setBlockList((list) => {
      let newBlockList: Block[] = [];
      for (
        let i = list.length - 1;
        i >= 0 && i > list.length - config.BLOCK_LIST_SIZE;
        i--
      ) {
        newBlockList.push(list[i]);
      }
      newBlockList.reverse();
      newBlockList.push(newBlock);
      return newBlockList;
    });
    //setBlockList(blockList => [...blockList, newBlock])
  };

  return (
    <>
      <Navbar
        showButton
        button={
          <Button
            onClick={() => {
              running ? (stop?.(), setRunning(false)) : run();
            }}
            variant={"outline"}
            className="text-white rounded-full border-opacity-70 bg-opacity-50 lg:px-8 lg:py-6 px-6 py-4 font-thicccboibold"
          >
            {running ? "Stop Running the LC" : "Start Running the LC"}
          </Button>
        }
      />
      <main className="">
        {" "}
        <div className="flex lg:flex-row flex-col-reverse lg:h-screen w-screen">
          <div className="lg:w-[60%] flex flex-col ">
            <div className="lg:h-[35%] 2xl:h-[40%] flex flex-col items-start justify-center mt-10">
              {running ? (
                <AvailChain blockList={blockList} />
              ) : (
                <div className="flex flex-col p-16 2xl:p-20 space-y-10 2xl:space-y-14">
                  <h2 className="text-5xl 2xl:text-7xl font-thicccboibold leading-tight text-white !text-left hidden lg:block ">
                    Get Started with Avail&apos;s LC documentation{" "}
                    <Link
                      href={"https://github.com/availproject/avail-light"}
                      className="text-[#3CBBF9] underline"
                    >
                      here.
                    </Link>
                  </h2>
                  <p className="text-2xl  2xl:text-4xl  font-thicccboisemibold  text-white !text-left  hidden lg:block text-opacity-80 ">
                    Click the button above to see it in action ↗
                  </p>
                </div>
              )}
            </div>
            <DsMatrix matrix={matrix} />
          </div>
          <div className="lg:w-[40%] flex items-start lg:mt-20">
            <BlockData
              latestBlock={latestBlock}
              run={run}
              running={running}
              stop={stop}
              setRunning={setRunning}
            />
          </div>
        </div>
      </main>
    </>
  );
}
