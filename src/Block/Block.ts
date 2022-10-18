import { createHash } from 'crypto';
import hashMatchesDifficulty from '../hash';
import type { IBlock, HashlessBlock, IBlockDataFunctions } from './types';

export default class Block<DataType> implements IBlock<DataType> {
  public hash: string;

  public index: number;

  public prevHash: string;

  public timestamp: number;

  public data: DataType;

  public difficulty: number;

  public nonce: number;

  public dataFunctions: Required<IBlockDataFunctions<DataType>>;

  constructor({
    index,
    prevHash,
    timestamp,
    data,
    difficulty,
    nonce,
    serializeData = (d) => `${d}`,
    compareData = (a, b) => a === b,
  }: HashlessBlock<DataType>) {
    this.index = index;
    this.prevHash = prevHash;
    this.timestamp = timestamp;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.dataFunctions = {
      serializeData,
      compareData,
    };
    this.hash = Block.calculateHash({ index, prevHash, timestamp, data, difficulty, nonce });
  }

  static calculateHash<T>(
    { index, prevHash, timestamp, data, difficulty, nonce }: HashlessBlock<T>,
    serializeData: (data: T) => string = (d) => `${d}`,
  ): string {
    return createHash('sha256')
      .update(`${index}${prevHash}${timestamp}${serializeData(data)}${difficulty}${nonce}`)
      .digest('hex');
  }

  static isValidBlockStructure<T>(
    block: IBlock<T>,
    validateDataStructure: (data: T) => boolean = (d) => typeof d === 'string',
  ): boolean {
    return (
      typeof block.index === 'number' &&
      typeof block.prevHash === 'string' &&
      typeof block.timestamp === 'number' &&
      validateDataStructure(block.data) &&
      typeof block.hash === 'string' &&
      typeof block.difficulty === 'number' &&
      typeof block.nonce === 'number'
    );
  }

  static compare<T>(
    block: Block<T>,
    otherBlock: Block<T>,
    compareData: (Adata: T, Bdata: T) => boolean = (a, b) => a === b,
  ): boolean {
    return (
      block.index === otherBlock.index &&
      block.prevHash === otherBlock.prevHash &&
      block.timestamp === otherBlock.timestamp &&
      compareData(block.data, otherBlock.data) &&
      block.hash === otherBlock.hash &&
      block.difficulty === otherBlock.difficulty &&
      block.nonce === otherBlock.nonce
    );
  }

  compare(otherBlock: Block<DataType>): boolean {
    return (
      this.index === otherBlock.index &&
      this.prevHash === otherBlock.prevHash &&
      this.timestamp === otherBlock.timestamp &&
      this.dataFunctions.compareData(this.data, otherBlock.data) &&
      this.hash === otherBlock.hash &&
      this.difficulty === otherBlock.difficulty &&
      this.nonce === otherBlock.nonce
    );
  }

  static isValidNewBlock<T>(prevBlock: Block<T>, newBlock: Block<T>): boolean {
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

  static hasValidHash<T>(block: Block<T>, serializeData: (data: T) => string = (d) => `${d}`): boolean {
    if (
      block.hash !==
      Block.calculateHash(
        {
          ...block,
        },
        serializeData,
      )
    ) {
      return false;
    }
    if (!hashMatchesDifficulty(block.hash, block.difficulty)) return false;
    return true;
  }

  hasValidHash(): boolean {
    if (
      this.hash !==
      Block.calculateHash(
        {
          ...this,
        },
        this.dataFunctions.serializeData,
      )
    ) {
      return false;
    }
    if (!hashMatchesDifficulty(this.hash, this.difficulty)) return false;
    return true;
  }

  static isValidTimestamp<T>(newBlock: Block<T>, prevBlock: Block<T>): boolean {
    return prevBlock.timestamp - 60 < newBlock.timestamp && newBlock.timestamp - 60 < Date.now();
  }
}
