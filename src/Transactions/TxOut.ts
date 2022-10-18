import validateAddress from '../address';
import { ITxOut } from './types';

class TxOut implements ITxOut {
  address: string;

  amount: number;

  constructor({ address, amount }: ITxOut) {
    this.address = address;
    this.amount = amount;
  }

  hasValidStructure(): boolean {
    if (typeof this.address !== 'string') {
      return false;
    }
    if (!validateAddress(this.address)) {
      return false;
    }
    if (typeof this.amount !== 'number') {
      return false;
    }

    return true;
  }

  static hasValidStructure(txOut: ITxOut): boolean {
    if (typeof txOut.address !== 'string') {
      return false;
    }
    if (!validateAddress(txOut.address)) {
      return false;
    }
    if (typeof txOut.amount !== 'number') {
      return false;
    }
    return true;
  }
}

export default TxOut;
