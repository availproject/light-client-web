import { Block, Matrix } from '@/types/light-client';
import config from "../utils/config"
import { generateRandomCells } from '@/utils/helper';
import { BlockToProcess } from '@/types/light-client';
import { ApiPromise, initialize } from 'avail-js-sdk'

export async function runLC(onNewBlock: Function, registerUnsubscribe: Function): Promise<() => void> {
    const api: ApiPromise = await initialize('wss://turing-rpc.avail.so/ws');
    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(async (header: any) => {
        try {

            const blockNumber = header.number.toString()
            const blockHash = (await api.rpc.chain.getBlockHash(header.number)).toString();
            const extension = JSON.parse(header.extension)
            const commitment = extension.v3.commitment
            const kateCommitment = commitment.commitment.split('0x')[1]

            // Check if block is with empty commitment
            if (kateCommitment !== '') {
                const r = commitment.rows
                const c = commitment.cols

                const totalCellCount = (r * config.EXTENSION_FACTOR) * c
                let sampleCount = Math.min(config.SAMPLE_SIZE, totalCellCount)
                const randomCells = generateRandomCells(r, c, sampleCount)

                const kateProof = await api.rpc.kate.queryProof(randomCells, blockHash);

                console.log(kateProof)

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

                const block: Block = { number: blockNumber, hash: blockHash, totalCellCount, confidence: 0, sampleCount, hasDaSubmissions: true }
                const matrix: Matrix = { maxRow: r, maxCol: c, verifiedCells: [], totalCellCount }
                onNewBlock((list: BlockToProcess[]) => [...list, { block, matrix, randomCells, proofs, commitments }])
            } else {
                const block: Block = { number: blockNumber, hash: blockHash, totalCellCount: 0, confidence: 0, sampleCount: 0, hasDaSubmissions: false }
                onNewBlock((list: BlockToProcess[]) => [...list, { block, matrix: null, randomCells: [], proofs: [], commitments: [] }])
            }
        } catch (error) {
            console.log(error)
        }
    });

    return registerUnsubscribe(() => unsubscribe);
}
