import { Block } from '../Block';
import Blockchain from './Blockcain';

describe('Block testing', () => {
  it('Should create a blockchain with a valid genesis block', () => {
    const now = Date.now();
    const defaultGenesis = new Block({
      index: 0,
      prevHash: '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
      timestamp: now,
      data: 'Genesis Block',
      difficulty: 0,
      nonce: 0,
    });
    const chain = new Blockchain(defaultGenesis);
    const genesis = chain.lastBlock;

    expect(Block.isValidBlockStructure(genesis)).toBe(true);
    expect(chain.length).toBe(1);
    expect(genesis.compare(defaultGenesis)).toBe(true);
    expect(Blockchain.isValidChain(chain.content)).toBe(true);
  });

  it('Should create a blockchain and add new block', () => {
    const chain = new Blockchain();
    const newBlock = chain.generateNextBlock('first non genesis block');
    const isInsertValid = chain.addNewBlock(newBlock);
    expect(isInsertValid).toBe(true);
    expect(chain.length).toBe(2);
    expect(Blockchain.isValidChain(chain.content)).toBe(true);
  });

  it('Should be able to replace chain', () => {
    const smallestChain = new Blockchain();
    smallestChain.addNewBlock(smallestChain.generateNextBlock('some block'));
    const longestChain = new Blockchain();
    longestChain.addNewBlock(longestChain.generateNextBlock('some block'));
    longestChain.addNewBlock(longestChain.generateNextBlock('some block'));
    expect(smallestChain.length).toBeLessThan(longestChain.length);
    smallestChain.replaceChain(longestChain.content);
    expect(smallestChain.length).toBe(longestChain.length);
  });
});