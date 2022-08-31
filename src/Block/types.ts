export interface IBlock {
  hash: string;
  index: number;
  prevHash: string;
  timestamp: number;
  data: string;
  difficulty: number;
  nonce: number;
}

export type HashlessBlock = Omit<IBlock, 'hash'>;
