import { createHash } from 'crypto';
import hashMatchesDifficulty from '../hash';
import type { IBlock, HashlessBlock } from './types';

export default class Block implements IBlock {
  public hash: string;

  public index: number;

  public prevHash: string;

  public timestamp: number;

  public data: string;

  public difficulty: number;

  public nonce: number;

  constructor({ index, prevHash, timestamp, data, difficulty, nonce }: HashlessBlock) {
    this.index = index;
    this.prevHash = prevHash;
    this.timestamp = timestamp;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.hash = Block.calculateHash({ index, prevHash, timestamp, data, difficulty, nonce });
  }

  static calculateHash({ index, prevHash, timestamp, data, difficulty, nonce }: HashlessBlock): string {
    return createHash('sha256').update(`${index}${prevHash}${timestamp}${data}${difficulty}${nonce}`).digest('hex');
  }

  static isValidBlockStructure(block: IBlock): boolean {
    return (
      typeof block.index === 'number' &&
      typeof block.prevHash === 'string' &&
      typeof block.timestamp === 'number' &&
      typeof block.data === 'string' &&
      typeof block.hash === 'string' &&
      typeof block.difficulty === 'number' &&
      typeof block.nonce === 'number'
    );
  }

  static compare(block: Block, otherBlock: Block): boolean {
    return (
      block.index === otherBlock.index &&
      block.prevHash === otherBlock.prevHash &&
      block.timestamp === otherBlock.timestamp &&
      block.data === otherBlock.data &&
      block.hash === otherBlock.hash &&
      block.difficulty === otherBlock.difficulty &&
      block.nonce === otherBlock.nonce
    );
  }

  compare(otherBlock: Block): boolean {
    return (
      this.index === otherBlock.index &&
      this.prevHash === otherBlock.prevHash &&
      this.timestamp === otherBlock.timestamp &&
      this.data === otherBlock.data &&
      this.hash === otherBlock.hash &&
      this.difficulty === otherBlock.difficulty &&
      this.nonce === otherBlock.nonce
    );
  }

  static isValidNewBlock(prevBlock: Block, newBlock: Block): boolean {
    if (newBlock.index !== prevBlock.index + 1) {
      return false;
    }
    if (newBlock.prevHash !== prevBlock.hash) {
      return false;
    }
    if (!newBlock.hasValidHash()) {
      return false;
    }
    if (!Block.isValidTimestamp(prevBlock, newBlock)) {
      return false;
    }
    return true;
  }

  static hasValidHash(block: Block): boolean {
    if (
      block.hash !==
      Block.calculateHash({
        ...block,
      })
    ) {
      return false;
    }
    if (!hashMatchesDifficulty(block.hash, block.difficulty)) return false;
    return true;
  }

  hasValidHash(): boolean {
    if (
      this.hash !==
      Block.calculateHash({
        ...this,
      })
    ) {
      return false;
    }
    if (!hashMatchesDifficulty(this.hash, this.difficulty)) return false;
    return true;
  }

  static isValidTimestamp(newBlock: Block, prevBlock: Block): boolean {
    return prevBlock.timestamp - 60 < newBlock.timestamp && newBlock.timestamp - 60 < Date.now();
  }
}
