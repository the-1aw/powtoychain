import { createHash } from 'crypto';
import TxIn from './TxIn';
import TxOut from './TxOut';
import type { IdlessTransaction, ITransaction } from './types';
import UnspentTxOutList from './UnspentTxOutList';

class Transaction implements ITransaction {
  id: string;

  txInList: Array<TxIn>;

  txOutList: Array<TxOut>;

  constructor(idlessTransaction: IdlessTransaction) {
    this.txInList = idlessTransaction.txInList;
    this.txOutList = idlessTransaction.txOutList;
    this.id = Transaction.genTransactionId(idlessTransaction);
  }

  static genTransactionId({ txInList, txOutList }: IdlessTransaction): string {
    const txInString = txInList.map(({ txOutId, txOutIdx }) => `${txOutId}${txOutIdx}`).join('');
    const txOutString = txOutList.map(({ address, amount }) => `${address}${amount}`).join('');
    return createHash('sha256').update(`${txInString}${txOutString}`).digest('hex');
  }

  isValidTransactionStructure = (): boolean => {
    if (typeof this.id !== 'string') {
      return false;
    }
    if (!(this.txInList instanceof Array)) {
      return false;
    }
    if (!this.txInList.map(TxIn.hasValidStructure).every((isValid) => isValid)) {
      return false;
    }
    if (!(this.txOutList instanceof Array)) {
      return false;
    }
    if (!this.txOutList.map(TxOut.hasValidStructure).every((isValid) => isValid)) {
      return false;
    }
    return true;
  };

  static isValidTransactionStructure = (transaction: Transaction): boolean => {
    if (typeof transaction.id !== 'string') {
      return false;
    }
    if (!(transaction.txInList instanceof Array)) {
      return false;
    }
    if (!transaction.txInList.map(TxIn.hasValidStructure).every((isValid) => isValid)) {
      return false;
    }
    if (!(transaction.txOutList instanceof Array)) {
      return false;
    }
    if (!transaction.txOutList.map(TxOut.hasValidStructure).every((isValid) => isValid)) {
      return false;
    }
    return true;
  };

  static isValidTransactionList = (transactionList: Transaction[]): boolean => {
    const validationArray = transactionList.map(Transaction.isValidTransactionStructure);
    return validationArray.every((isValidTx) => isValidTx);
  };

  validate(unspentTxOutList: UnspentTxOutList): boolean {
    if (Transaction.genTransactionId(this) !== this.id) {
      return false;
    }

    const hasValidTxIns: boolean = this.txInList
      .map((txIn) => txIn.validate(this, unspentTxOutList))
      .every((isValid) => isValid);
    if (!hasValidTxIns) {
      return false;
    }

    const totalTxInValue = this.txInList
      .map((txIn) => unspentTxOutList.findUnspentTxOut(txIn.txOutId, txIn.txOutIdx)?.amount ?? 0)
      .reduce((acc, curr) => acc + curr, 0);

    const totalTxOutValue: number = this.txOutList.map((txOut) => txOut.amount).reduce((a, b) => a + b, 0);
    if (totalTxOutValue !== totalTxInValue) {
      return false;
    }

    return true;
  }
}

export default Transaction;
