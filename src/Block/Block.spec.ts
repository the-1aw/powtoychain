import { createHash } from 'crypto';
import Block from './Block';
import { IBlock } from './types';

describe('Block testing', () => {
  it('Should be a valid block structure', () => {
    const blockContent: IBlock = {
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      hash: createHash('sha256').update('somestring').digest('hex'),
      difficulty: 0,
      nonce: 0,
    };
    expect(Block.isValidBlockStructure(blockContent)).toBe(true);
  });

  it('Should not be valid block structure', () => {
    const wronIndexType: unknown = {
      index: '0',
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      hash: createHash('sha256').update('somestring').digest('hex'),
      difficulty: 0,
      nonce: 0,
    };
    const wronPrevHashType: unknown = {
      index: 0,
      prevHash: 12,
      timestamp: Date.now(),
      data: 'Some data',
      hash: createHash('sha256').update('somestring').digest('hex'),
      difficulty: 0,
      nonce: 0,
    };
    const wrongTimestampType: unknown = {
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: 'some date',
      data: 'Some data',
      hash: createHash('sha256').update('somestring').digest('hex'),
      difficulty: 0,
      nonce: 0,
    };
    const wronDataType: unknown = {
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 12,
      hash: createHash('sha256').update('somestring').digest('hex'),
      difficulty: 0,
      nonce: 0,
    };
    const wronHashType: unknown = {
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      hash: 12,
      difficulty: 0,
      nonce: 0,
    };
    const wronDifficultyType: unknown = {
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      hash: 12,
      difficulty: '0',
      nonce: 0,
    };
    const wronNonceType: unknown = {
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      hash: 12,
      difficulty: 0,
      nonce: '0',
    };
    expect(Block.isValidBlockStructure(wronDataType as IBlock)).toBe(false);
    expect(Block.isValidBlockStructure(wronHashType as IBlock)).toBe(false);
    expect(Block.isValidBlockStructure(wronIndexType as IBlock)).toBe(false);
    expect(Block.isValidBlockStructure(wrongTimestampType as IBlock)).toBe(false);
    expect(Block.isValidBlockStructure(wronPrevHashType as IBlock)).toBe(false);
    expect(Block.isValidBlockStructure(wronNonceType as IBlock)).toBe(false);
    expect(Block.isValidBlockStructure(wronDifficultyType as IBlock)).toBe(false);
  });

  it('Should generate a valid new block', () => {
    const newBlock = new Block({
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      difficulty: 0,
      nonce: 0,
    });
    expect(Block.isValidBlockStructure(newBlock)).toBe(true);
  });

  it('Should be a valid new block', () => {
    const prevBlock = new Block({
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      difficulty: 0,
      nonce: 0,
    });
    const newBlock = new Block({
      index: prevBlock.index + 1,
      prevHash: prevBlock.hash,
      timestamp: Date.now(),
      data: 'Some data',
      difficulty: 0,
      nonce: 0,
    });
    expect(Block.isValidNewBlock(prevBlock, newBlock)).toBe(true);
  });

  it('Should not be a valid block', () => {
    const prevBlock = new Block({
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      difficulty: 0,
      nonce: 0,
    });
    const newBlockWithInvalidPrevHash = new Block({
      index: prevBlock.index + 1,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      difficulty: 0,
      nonce: 0,
    });
    const newBlockWithInvalidIndex = new Block({
      index: prevBlock.index + 1,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      difficulty: 0,
      nonce: 0,
    });
    expect(Block.isValidNewBlock(prevBlock, newBlockWithInvalidIndex)).toBe(false);
    expect(Block.isValidNewBlock(prevBlock, newBlockWithInvalidPrevHash)).toBe(false);
  });

  it('Should compare 2 blocks', () => {
    const block = new Block({
      index: 0,
      prevHash: createHash('sha256').update('somestring').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      difficulty: 0,
      nonce: 0,
    });
    const sameBlock = block;
    const otherBlock = new Block({
      index: 0,
      prevHash: createHash('sha256').update('someOtherString').digest('hex'),
      timestamp: Date.now(),
      data: 'Some data',
      difficulty: 0,
      nonce: 0,
    });
    expect(block.compare(sameBlock)).toBe(true);
    expect(block.compare(otherBlock)).toBe(false);
    expect(Block.compare(block, sameBlock)).toBe(true);
    expect(Block.compare(block, otherBlock)).toBe(false);
  });
});
