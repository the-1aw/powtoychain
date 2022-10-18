import type TxIn from './TxIn';
import type TxOut from './TxOut';

export interface ITxIn {
  txOutId: string;
  txOutIdx: number;
  signature: string | null;
}

export interface ITxOut {
  address: string;
  amount: number;
}

type TransactionId = string;

export interface ITransaction {
  id: TransactionId;
  txInList: Array<TxIn>;
  txOutList: Array<TxOut>;
}

export interface IUnspendTxOut {
  txOutId: string;
  txOutIdx: number;
  address: string;
  amount: number;
}

export interface ITxInSignParams {
  txIn: ITxIn;
  txId: TransactionId;
  privateKey: string;
  unspendTxOut: IUnspendTxOut;
}

export type IdlessTransaction = Omit<ITransaction, 'id'>;
