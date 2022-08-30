import { Block, HashlessBlock } from '../Block';

class Blockchain {
  public genesis: Block;

  private chain: Block[] = [];

  constructor(genesis?: HashlessBlock) {
    const defaultGenesis: HashlessBlock = {
      index: 0,
      prevHash: '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
      timestamp: Date.now(),
      data: 'Genesis Block',
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
    if (Blockchain.isValidChain(newChain)) {
      if (newChain.length > this.length) {
        this.chain = newChain;
      }
    } else {
      throw new Error('new chain is invalid');
    }
  }

  generateNextBlock(data: string): Block {
    const { lastBlock } = this;
    const nextIndex = lastBlock.index + 1;
    const newBlock = new Block({
      index: nextIndex,
      prevHash: lastBlock.hash,
      timestamp: Date.now(),
      data,
    });
    return newBlock;
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
