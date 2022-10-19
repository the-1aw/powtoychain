import { Block, IBlockDataFunctions } from '../Block';
import Blockchain, { DIFFICULTY_ADJUSTMENT_INTERVAL } from './Blockchain';

const now = Date.now();
const defaultGenesis = new Block({
  index: 0,
  prevHash: '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
  timestamp: now,
  data: 'Genesis Block',
  difficulty: 0,
  nonce: 0,
});

const defaultNumberGenesis = new Block({
  index: 0,
  prevHash: '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
  timestamp: now,
  data: 0,
  difficulty: 0,
  nonce: 0,
});

const numberDataFunctions: IBlockDataFunctions<number> = {
  compareData: (aNumber: number, bNumber: number) => aNumber === bNumber,
  serializeData: (n: number) => `${n}`,
};

describe('Block testing', () => {
  it('Should create a blockchain with a valid genesis block', () => {
    const chain = new Blockchain(defaultGenesis);
    const genesis = chain.lastBlock;

    expect(Block.isValidBlockStructure(genesis)).toBe(true);
    expect(chain.length).toBe(1);
    expect(genesis.compare(defaultGenesis)).toBe(true);
    expect(Blockchain.isValidChain(chain.content)).toBe(true);
    const numberChain = new Blockchain(defaultNumberGenesis, numberDataFunctions);
    const numberGenesis = numberChain.lastBlock;

    expect(Block.isValidBlockStructure(numberGenesis, (n: unknown) => typeof n === 'number')).toBe(true);
    expect(numberChain.length).toBe(1);
    expect(numberGenesis.compare(defaultNumberGenesis)).toBe(true);
    expect(Blockchain.isValidChain(numberChain.content)).toBe(true);
  });

  it('Should not be valid chains', () => {
    const chain = new Blockchain(defaultGenesis);
    const wrongGenesis = new Block({
      index: 1,
      prevHash: '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
      timestamp: now,
      data: 'Genesis Block',
      difficulty: 0,
      nonce: 0,
    });
    const genesis = chain.lastBlock;
    expect(genesis.compare(wrongGenesis)).toBe(false);
    expect(Blockchain.isValidChain(chain.content, wrongGenesis)).toBe(false);
  });

  it('Should create a blockchain and add new block', () => {
    const chain = new Blockchain(defaultGenesis);
    const newBlock = chain.generateNextBlock('first non genesis block');
    const isInsertValid = chain.addNewBlock(newBlock);
    expect(isInsertValid).toBe(true);
    expect(chain.length).toBe(2);
    expect(Blockchain.isValidChain(chain.content)).toBe(true);
  });

  it('Should create a blockchain but not add new block', () => {
    const chain = new Blockchain(defaultGenesis);
    const newBlock = chain.generateNextBlock('first non genesis block');
    newBlock.index = 0;
    const isInsertValid = chain.addNewBlock(newBlock);
    expect(isInsertValid).toBe(false);
    expect(chain.length).toBe(1);
    expect(Blockchain.isValidChain(chain.content)).toBe(true);
  });

  it('Should be able to replace chain', () => {
    const smallestChain = new Blockchain(defaultGenesis);
    smallestChain.addNewBlock(smallestChain.generateNextBlock('some block'));
    const longestChain = new Blockchain(defaultGenesis);
    longestChain.addNewBlock(longestChain.generateNextBlock('some block'));
    longestChain.addNewBlock(longestChain.generateNextBlock('some block'));
    expect(smallestChain.length).toBeLessThan(longestChain.length);
    smallestChain.replaceChain(longestChain.content);
    expect(smallestChain.length).toBe(longestChain.length);
  });

  it('Should not be able to replace chain', () => {
    const smallestChain = new Blockchain(defaultGenesis);
    smallestChain.addNewBlock(smallestChain.generateNextBlock('some block'));
    const longestChain = new Blockchain(defaultGenesis);
    longestChain.addNewBlock(longestChain.generateNextBlock('some block'));
    longestChain.addNewBlock(longestChain.generateNextBlock('some block'));
    const wrongLongestChain = longestChain.content;
    wrongLongestChain[wrongLongestChain.length - 1].index = -1;
    expect(() => smallestChain.replaceChain(wrongLongestChain)).toThrow(Error);
    expect(smallestChain.length).toBe(2);
  });

  it('Should increase difficulty', () => {
    const chain = new Blockchain(defaultGenesis);
    const nbBlock = 50;
    while (chain.length < nbBlock) {
      chain.addNewBlock(chain.generateNextBlock('some block'));
    }
    const { lastBlock } = chain;
    expect(lastBlock.difficulty).toBe(nbBlock / DIFFICULTY_ADJUSTMENT_INTERVAL - 1);
  });
});
