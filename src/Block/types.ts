export interface IBlock<T = string> {
  hash: string;
  index: number;
  prevHash: string;
  timestamp: number;
  data: T;
  difficulty: number;
  nonce: number;
}

export interface IBlockDataFunctions<T> {
  serializeData?: (data: T) => string;
  compareData?: (Adata: T, Bdata: T) => boolean;
}

export type HashlessBlock<T = string> = Omit<IBlock<T> & IBlockDataFunctions<T>, 'hash'>;
