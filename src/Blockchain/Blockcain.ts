import { Block, HashlessBlock } from '../Block';
import hashMatchesDifficulty from '../hash';

export const BLOCK_GENERATION_INTERVAL = 10; // sec;
export const DIFFICULTY_ADJUSTMENT_INTERVAL = 10; // blocks
export const EXPECTED_TIME = DIFFICULTY_ADJUSTMENT_INTERVAL * BLOCK_GENERATION_INTERVAL;

class Blockchain {
  public genesis: Block;

  private chain: Block[] = [];

  constructor(genesis?: HashlessBlock) {
    const defaultGenesis: HashlessBlock = {
      index: 0,
      prevHash: '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
      timestamp: Date.now(),
      data: 'Genesis Block',
      difficulty: 0,
      nonce: 0,
    };
    this.genesis = new Block(genesis ?? defaultGenesis);
    this.chain.push(this.genesis);
  }

  get length(): number {
    return this.chain.length;
  }

  get lastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  get content(): Block[] {
    return [...this.chain];
  }

  get difficulty(): number {
    const { lastBlock, chain } = this;
    if (lastBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && lastBlock.index !== 0) {
      return Blockchain.adjustDifficulty(lastBlock, chain);
    }
    return lastBlock.difficulty;
  }

  get cumulatedDifficulty(): number {
    return this.chain.map((block) => 2 ** block.difficulty).reduce((a, b) => a + b);
  }

  static getCumulatedDifficulty(chain: Block[]): number {
    return chain.map((block) => 2 ** block.difficulty).reduce((a, b) => a + b);
  }

  static isValidChain(chain: Block[], genesis?: Block): boolean {
    if (genesis && !genesis.compare(chain[0])) {
      return false;
    }
    for (let i = 0; i < chain.length - 1; i += 1) {
      if (!Block.isValidNewBlock(chain[i], chain[i + 1])) {
        return false;
      }
    }
    return true;
  }

  replaceChain(newChain: Block[]): void {
    if (Blockchain.isValidChain(newChain) && Blockchain.getCumulatedDifficulty(newChain) > this.cumulatedDifficulty) {
      if (newChain.length > this.length) {
        this.chain = newChain;
      }
    } else {
      throw new Error('new chain is invalid');
    }
  }

  generateNextBlock(data: string): Block {
    const { lastBlock, difficulty } = this;
    const nextIndex = lastBlock.index + 1;
    const newBlock = Blockchain.findBlock({
      index: nextIndex,
      prevHash: lastBlock.hash,
      timestamp: Date.now(),
      data,
      difficulty,
    });
    return newBlock;
  }

  static findBlock({ index, prevHash, timestamp, data, difficulty }: Omit<HashlessBlock, 'nonce'>): Block {
    for (let nonce = 0; ; nonce += 1) {
      const hash = Block.calculateHash({ index, prevHash, timestamp, data, difficulty, nonce });
      if (hashMatchesDifficulty(hash, difficulty)) {
        return new Block({ index, prevHash, timestamp, data, difficulty, nonce });
      }
    }
  }

  private static adjustDifficulty(lastBlock: Block, chain: Block[]): number {
    const preAdjustmentBlock = chain[chain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeTaken = lastBlock.timestamp - preAdjustmentBlock.timestamp;
    if (timeTaken < EXPECTED_TIME / 2) {
      return preAdjustmentBlock.difficulty + 1;
    }
    if (timeTaken > EXPECTED_TIME * 2) {
      return preAdjustmentBlock.difficulty - 1;
    }
    return preAdjustmentBlock.difficulty;
  }

  addNewBlock(newBlock: Block): boolean {
    if (Block.isValidNewBlock(this.lastBlock, newBlock)) {
      this.chain.push(newBlock);
      return true;
    }
    return false;
  }
}

export default Blockchain;
