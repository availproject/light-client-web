import { Block, Matrix } from '@/types/light-client';
import config from "../utils/config"
import { generateRandomCells } from '@/utils/helper';
import { BlockToProcess } from '@/types/light-client';
import {ApiPromise, initialize} from 'avail-js-sdk'

export async function runLC(onBlock: Function, registerUnsubscribe: Function): Promise<() => void> {
    const api: ApiPromise = await initialize('wss://turing-rpc.avail.so/ws');
    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header: any) => {
        const blockNumber = header.number.toString()
        const blockHash = (await api.rpc.chain.getBlockHash(header.number)).toString();
        const timestamp = Date.now();

        try {
            const extension = JSON.parse(header.extension)
            const commitment = extension.v3.commitment
            const kateCommitment = commitment.commitment.split('0x')[1]
            const r = commitment.rows
            const c = commitment.cols

            const totalCellCount = (r * config.EXTENSION_FACTOR) * c
            let sampleCount = Math.min(config.SAMPLE_SIZE, totalCellCount)
            const randomCells = generateRandomCells(r, c, sampleCount)

            const rpc: any = api.rpc
            const kateProof = await rpc.kate.queryProof(randomCells, blockHash);

            const kate_Proof = Uint8Array.from(kateProof)
            const kate_commitment = Uint8Array.from(kateCommitment.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)))

            let commitments: Uint8Array[] = []
            for (let i = 0; i < (r * config.EXTENSION_FACTOR); i++) {
                commitments.push(kate_commitment.slice(i * config.COMMITMENT_SIZE, (i + 1) * config.COMMITMENT_SIZE))
            }
            let proofs: Uint8Array[] = []
            for (let i = 0; i < sampleCount; i++) {
                proofs.push(kate_Proof.slice(i * config.KATE_PROOF_SIZE, (i + 1) * config.KATE_PROOF_SIZE))
            }

            const block: Block = { number: blockNumber, hash: blockHash, totalCellCount, confidence: 0, sampleCount, timestamp, hasDaSubmissions: true }
            const matrix: Matrix = { maxRow: r, maxCol: c, verifiedCells: [], totalCellCount }
            onBlock((list: BlockToProcess[]) => [...list, { block, matrix, randomCells, proofs, commitments }])
        } catch (error) {
            const block: Block = { number: blockNumber, hash: blockHash, totalCellCount: 0, confidence: 0, sampleCount: 0, timestamp, hasDaSubmissions: false }
            onBlock((list: BlockToProcess[]) => [...list, { block, matrix: null, randomCells: [], proofs: [], commitments: [] }])
        }
    });

    return registerUnsubscribe(() => unsubscribe);
}
