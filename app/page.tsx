'use client'
import AvailChain from "@/components/availchain";
import BlockData from "@/components/blockdata";
import DsMatrix from "@/components/dsmatrix";

import { useState, useEffect } from "react";
import { createApi } from '../utils/api'
import init, { check } from "@/avail-light/pkg/wasm_avail_light"
import { Button } from "@/components/ui/button";
import Navbar from "@/components/header";

const COMMITMENT_SIZE = 48;
const KATE_PROOF_SIZE = 80;
const EXTENSION_FACTOR = 2;
const SAMPLE_SIZE = 10;
const BLOCK_LIST_SIZE = 5;


export default function Home() {


  const [running, setRunning] = useState(false)
  const [stop, setStop] = useState<any>(null)

  const [latestBlock, setLatestBlock] = useState({
    number: "",
    hash: "",
    totalCellCount: "",
    confidence: ""
  })
  const [blockList, setBlockList] = useState([])
  const [matrix, setMatrix] = useState(
    {
      row: 0,
      col: 0,
      cells: []
    }
  )
  useEffect(() => {
    init()
  }, [])

  const sleep = (delay: number | undefined) => new Promise((resolve) => setTimeout(resolve, delay))

  const generateRandomCells = (r: number, c: number, count: number) => {
    const extendedRowCount = r * 2
    const maxCellCount = extendedRowCount * c;
    let size = count;
    if (maxCellCount < count) {
      size = maxCellCount
    }
    let cellList: { row: number; col: number; }[] = []
    let randomPointList = randomUniqueNum(maxCellCount, size)
    randomPointList.forEach((p) => {
      const row = Math.floor(p / c)
      const col = p - row * c
      cellList.push({ row, col })
    })
    return cellList
  }


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


  const run = async () => {
    setRunning(true)
    const api: any = await createApi();

    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header: any) => {

      //Extracting the data out from header
      const blockNumber = header.number.toString()
      const extension = JSON.parse(header.extension)
      console.log("Header Extension: ", extension)

      const commitment = extension.v1.commitment
      const kateCommitment = commitment.commitment.split('0x')[1]
      const r = commitment.rows
      const c = commitment.cols


      //fetching block hash from number 
      const blockHash = (await api.rpc.chain.getBlockHash(header.number)).toString();
      console.log(`New Block with hash: ${blockHash}, Number: ${blockNumber} `)

      //Detaiils updated on UI
      const totalCellCount = (r * EXTENSION_FACTOR) * c
      addBlock(blockNumber, blockHash, r, c, totalCellCount)

      //Generating SAMPLE_SIZE random cell for sampling
      let sampleCount = SAMPLE_SIZE
      if (sampleCount >= totalCellCount) {
        sampleCount = 5
      }
      const cells = generateRandomCells(r, c, sampleCount)

      //Query data proof for sample 0,0
      const kateProof = await api.rpc.kate.queryProof(cells, blockHash);
      const kate_Proof = Uint8Array.from(kateProof)
      const kate_commitment = Uint8Array.from(kateCommitment.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)))

      //Creating commitement array based on rows and proof array based on cells
      let commitments: Uint8Array[] = []
      for (let i = 0; i < (r * EXTENSION_FACTOR); i++) {
        commitments.push(kate_commitment.slice(i * COMMITMENT_SIZE, (i + 1) * COMMITMENT_SIZE))
      }
      let proofs: Uint8Array[] = []
      for (let i = 0; i < SAMPLE_SIZE; i++) {
        proofs.push(kate_Proof.slice(i * KATE_PROOF_SIZE, (i + 1) * KATE_PROOF_SIZE))
      }

      //Indivisual cell verification
      let verifiedCount = 0
      let verifiedCells: any = []
      cells.forEach(async (cell, i) => {

        //console.log(proofs[i], commitments[cell.row], c, cell.row, cell.col)
        const res = check(proofs[i], commitments[cell.row], c, cell.row, cell.col)
        //console.log(res)
        if (res) {
          await sleep(i * 1000)
          verifiedCount++
          const confidence = 100 * (1 - (1 / (Math.pow(2, verifiedCount))))
          verifiedCells.push(cell)
          //@ts-ignore
          setLatestBlock({ hash: blockHash, number: blockNumber, totalCellCount: (r * EXTENSION_FACTOR) * c, confidence: confidence })
          //console.log(verifiedCells)
          setMatrix({
            row: r * EXTENSION_FACTOR,
            col: c,
            //@ts-ignore
            verifiedCells
          })
        }
      })
    });

    setStop(() => unsubscribe)
  }



  const addBlock = (number: any, hash: any, r: any, c: any, tCount: number) => {
    let newBlock = {
      blockNumber: number,
      blockHash: hash,
      matrixRows: r,
      matrixCols: c,
      totalCellCount: tCount,
    };


    setLatestBlock({
      hash: hash,
      number: number,
      //@ts-ignore
      totalCellCount: tCount,
      //@ts-ignore
      confidence: 0
    })

    //@ts-ignore
    setBlockList((list) => {
      let newBlockList: any = []
      for (let i = list.length - 1; i >= 0 && i > list.length - BLOCK_LIST_SIZE; i--) {
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
      <main className="">
        <div className="flex md:flex-row flex-col-reverse lg:h-screen w-screen">
          <div className="lg:w-[60%] overflow-y-auto flex flex-col">
            <div className="lg:h-[40%]">
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


