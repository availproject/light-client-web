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
import { Block, Matrix, Cell, BlockToProcess } from "@/types/light-client";
import { runLC } from "@/repository/avail-light.repository";
import Link from "next/link";

export default function Home() {
  const [blocksToProcess, setblocksToProcess] = useState<Array<BlockToProcess>>([])
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
  const [processingBlock, setProcessingBlock] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const refreshApp = () => {
    setRunning(true);
    setBlockList([]);
    setMatrix({ maxRow: 0, maxCol: 0, verifiedCells: [], totalCellCount: 0 });
    setLatestBlock(null);
  };



  useEffect(() => {
    if (!processingBlock && blocksToProcess.length > 0) {
      const blockToProcess: BlockToProcess = blocksToProcess[0]
      processBlock(blockToProcess.block, blockToProcess.matrix, blockToProcess.randomCells, blockToProcess.proofs, blockToProcess.commitments)
      setblocksToProcess((list: BlockToProcess[]) => list.slice(1, list.length))
    }
  }, [blocksToProcess, processingBlock])



  const processBlock = async (
    block: Block,
    matrix: Matrix | null,
    cells: Cell[],
    proofs: Uint8Array[],
    commitments: Uint8Array[]
  ) => {
    addNewBlock(block, matrix);
    setProcessingBlock(true);

    if (matrix && cells.length > 0) {
      let verifiedCount = 0;
      let verifiedCells: Cell[] = [];

      for (let i = 0; i < cells.length; i++) {
        if (block.number < (latestBlock?.number || 0)) {
          return;
        }
        let cell = cells[i];

        try {
          // console.log('Checking cell:', cell);
          // console.log('Proof:', proofs[i]);
          // console.log('Commitment:', commitments[cell.row]);
          // console.log('Matrix maxCol:', matrix.maxCol);

          const res = check(
            proofs[i],
            commitments[cell.row],
            matrix.maxCol,
            cell.row,
            cell.col
          );

          console.log('Check result:', res);

          if (res) {
            verifiedCount++;
            const confidence = 100 * (1 - 1 / Math.pow(2, verifiedCount));
            verifiedCells.push(cell);

            setLatestBlock({
              ...block,
              confidence: confidence,
            });

            setMatrix({
              maxRow: matrix.maxRow,
              maxCol: matrix.maxCol,
              verifiedCells,
              totalCellCount: matrix.totalCellCount,
            });

            await sleep(100);
          }
        } catch (error) {
          console.error('Error in check function:', error);
          console.error('Error details:', {
            proofLength: proofs[i].length,
            commitmentLength: commitments[cell.row].length,
            maxCol: matrix.maxCol,
            row: cell.row,
            col: cell.col
          });
        }
      }
    }

    setProcessingBlock(false);
  };

  const run = async () => {
    refreshApp();
    runLC(setblocksToProcess, setStop);
  };

  const scrollToBlocks = () => {
    setTimeout(() => window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    }), 500);
  }

  const addNewBlock = (newBlock: Block, matrix: Matrix | null) => {
    setLatestBlock(newBlock);
    if (matrix) {
      setMatrix({
        maxRow: matrix.maxRow,
        maxCol: matrix.maxCol,
        verifiedCells: [],
        totalCellCount: matrix.totalCellCount,
      });
    } else {
      setMatrix({
        maxRow: 0,
        maxCol: 0,
        verifiedCells: [],
        totalCellCount: 0,
      });
    }
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
        <div className="md:hidden flex flex-col items-center justify-center py-8">
          <Button onClick={() => { running ? (stop?.(), setRunning(false)) : (run(), scrollToBlocks()) }} variant={'outline'} className='text-white rounded-full border-opacity-70 bg-opacity-50 px-8 py-6  font-thicccboibold'>{running ? 'Stop Running the LC' : 'Start Running the LC'}</Button>
        </div>
        {running && (latestBlock != null) ? (
          <div className="flex lg:flex-row flex-col-reverse lg:h-screen w-screen">
            <div className="lg:w-[60%] flex flex-col " id="blocks-section">
              {running ? (
                <div className="lg:h-[35%] 2xl:h-[40%] min-h-[100px] flex flex-col items-start justify-center mt-10">
                  <AvailChain blockList={blockList} />
                </div>
              ) : ("")}
              <DsMatrix matrix={matrix} processing={processingBlock} hasDaSubmissions={latestBlock.hasDaSubmissions} blockNumber={latestBlock.number} />
            </div>
            <div className="lg:w-[40%] flex items-start lg:mt-20">
              <BlockData
                latestBlock={latestBlock}
                running={running}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:p-16 p-6 2xl:p-20 space-y-10 2xl:space-y-14 ">
            <h2 className="text-5xl 2xl:text-7xl font-thicccboibold leading-tight text-white !text-left lg:block ">
              Avail Light Client (Web)
            </h2>
            <p className="text-xl font-ppmori  text-white !text-left lg:block text-opacity-80 ">
              This is an experimental light client for Avail. It runs <i>entirely
                in your browser</i> to verify that block data is available, by
              verifying Avail&#39;s KZG commitment proofs locally. Click
              the button above to see it in action!
            </p>
            <p className="text-xl  font-ppmori  text-white !text-left lg:block text-opacity-80 ">
              Check out the{" "}
              <Link
                href={"https://github.com/availproject/light-client-web"}
                className="text-[#3CBBF9] underline"
                target={"_blank"}
              >
                source code
              </Link>
              , and learn more about Avail at{" "}
              <Link
                href={"https://availproject.org/"}
                className="text-[#3CBBF9] underline"
                target={"_blank"}
              >
                availproject.org
              </Link>
            </p>
            <p className="text-xl  2xl:text-4xl  font-ppmori text-white !text-left lg:block text-opacity-80 ">
              P.S. Do you want to share the awesomeness?{" "}
              <Link
                href={"https://twitter.com/intent/tweet?text=Check out @AvailProject's new Web Light Client at https://light.avail.tools/ !"}
                className="text-[#3CBBF9] underline"
                target={"_blank"}
              >
                Tweet about it
              </Link>
              {" "}and be sure to tag <Link href={"https://twitter.com/AvailProject"} className="text-[#3CBBF9]" target={"_blank"}>@AvailProject!</Link>
            </p>
          </div>
        )}
      </main>
    </>
  );
}
