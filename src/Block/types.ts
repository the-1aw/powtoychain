export interface IBlock<T = string> {
  hash: string;
  index: number;
  prevHash: string;
  timestamp: number;
  data: T;
  difficulty: number;
  nonce: number;
}

export type HashlessBlock<T = string> = Omit<IBlock<T>, 'hash'>;
