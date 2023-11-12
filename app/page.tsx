'use client'

import AvailChain from "@/components/availchain";
import BlockData from "@/components/blockdata";
import DsMatrix from "@/components/dsmatrix";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/header";
import { useState, useEffect } from "react";
import init, { check } from "@/avail-light/pkg/wasm_avail_light"
import config from "../utils/config"
import { sleep } from "@/utils/helper";
import { Block, Matrix, Cell } from "@/types/light-client";
import { runLC } from "@/repository/avail-light.repository";



export default function Home() {

  const [latestBlock, setLatestBlock] = useState<Block>({
    number: 0,
    hash: "",
    totalCellCount: 0,
    confidence: 0

  })
  const [blockList, setBlockList] = useState<Array<Block>>([])
  const [matrix, setMatrix] = useState<Matrix>({ maxRow: 0, maxCol: 0, verifiedCells: [] })

  const [running, setRunning] = useState<Boolean>(false)
  const [stop, setStop] = useState<any>(null)


  useEffect(() => {
    init()
  }, [])

  const refreshApp = () => {
    setRunning(true)
    setBlockList([])
    setMatrix({ maxRow: 0, maxCol: 0, verifiedCells: [] })
    setLatestBlock({
      number: 0,
      hash: "",
      totalCellCount: 0,
      confidence: 0
    })
  }

  const processBlock = (block: Block, matrix: Matrix, cells: Cell[], proofs: Uint8Array[], commitments: Uint8Array[]) => {
    addBlock(block)

    //Indivisual cell verification
    let verifiedCount = 0
    let verifiedCells: Cell[] = []
    cells.forEach(async (cell, i) => {

      //console.log(proofs[i], commitments[cell.row], c, cell.row, cell.col)
      const res = check(proofs[i], commitments[cell.row], matrix.maxCol, cell.row, cell.col)
      //console.log(res)
      if (res) {
        await sleep((i + 1) * 1000)
        verifiedCount++
        const confidence = 100 * (1 - (1 / (Math.pow(2, verifiedCount))))
        verifiedCells.push(cell)
        //@ts-ignore
        setLatestBlock({ hash: block.hash, number: block.number, totalCellCount: block.totalCellCount, confidence: confidence })
        //console.log(verifiedCells)
        setMatrix({
          maxRow: matrix.maxRow,
          maxCol: matrix.maxCol,
          //@ts-ignore
          verifiedCells
        })
      }
    })
  }






  const run = () => {
    refreshApp()
    runLC(processBlock, setStop)
  }



  const addBlock = (newBlock: Block) => {
    setLatestBlock(newBlock)

    //@ts-ignore
    setBlockList((list) => {
      let newBlockList: Block[] = []
      for (let i = list.length - 1; i >= 0 && i > list.length - config.BLOCK_LIST_SIZE; i--) {
        newBlockList.push(list[i])
      }
      newBlockList.reverse()
      newBlockList.push(newBlock)
      return newBlockList
    })
    //setBlockList(blockList => [...blockList, newBlock])
  }

  return (
    <>
      <Navbar showButton button={<Button onClick={() => { running ? (stop(), setRunning(false)) : run() }} variant={'outline'} className='text-white rounded-full border-opacity-70 bg-opacity-50 lg:px-8 lg:py-6 px-6 py-4 font-thicccboibold'>{running ? 'Stop Running the LC' : 'Start Running the LC'}</Button>} />
      <main className=""> <div className="flex lg:flex-row flex-col-reverse lg:h-screen w-screen">
          <div className="lg:w-[60%] flex flex-col ">
            <div className="lg:h-[35%] 2xl:h-[40%] flex flex-col items-start justify-center mt-10">
              <AvailChain blockList={blockList} />
            </div>
            <DsMatrix matrix={matrix} />
          </div>
          <div className="lg:w-[40%] flex items-start lg:mt-20">
            <BlockData latestBlock={latestBlock} run={run} running={running} stop={stop} setRunning={setRunning} />
          </div>
        </div>

      </main>
    </>
  );
}


