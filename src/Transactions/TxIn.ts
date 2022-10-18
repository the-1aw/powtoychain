import ec from '../ellipticCurve';
import type Transaction from './Transaction';
import { ITxIn } from './types';
import UnspentTxOutList from './UnspentTxOutList';

class TxIn implements ITxIn {
  txOutId: string;

  txOutIdx: number;

  signature: string | null;

  constructor({ txOutId, txOutIdx }: Omit<ITxIn, 'signature'>) {
    this.txOutId = txOutId;
    this.txOutIdx = txOutIdx;
    this.signature = null;
  }

  sign(transaction: Transaction, privateKey: string, unspentTxOuts: UnspentTxOutList): void {
    const dataToSign = transaction.id;
    const referencedUnspentTxOut = unspentTxOuts.findUnspentTxOut(this.txOutId, this.txOutIdx);
    const referencedAddress = referencedUnspentTxOut?.address;
    if (ec.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex', false) !== referencedAddress) {
      this.signature = null;
    }
    const key = ec.keyFromPrivate(privateKey, 'hex');
    const signature: string = key.sign(dataToSign).toDER('hex');
    this.signature = signature;
  }

  hasValidStructure(): boolean {
    if (typeof this.signature !== 'string') {
      return false;
    }
    if (typeof this.txOutId !== 'string') {
      return false;
    }
    if (typeof this.txOutIdx !== 'number') {
      return false;
    }
    return true;
  }

  validate(transaction: Transaction, unspentTxOuts: UnspentTxOutList): boolean {
    const referencedUTxOut = unspentTxOuts.findUnspentTxOut(this.txOutId, this.txOutIdx);
    if (!referencedUTxOut || !this.signature) {
      return false;
    }
    const { address } = referencedUTxOut;
    const key = ec.keyFromPublic(address, 'hex');
    return key.verify(transaction.id, this.signature);
  }

  static hasValidStructure(txIn: ITxIn): boolean {
    if (txIn == null) {
      return false;
    }
    if (typeof txIn.signature !== 'string') {
      return false;
    }
    if (typeof txIn.txOutId !== 'string') {
      return false;
    }
    if (typeof txIn.txOutIdx !== 'number') {
      return false;
    }
    return true;
  }
}

export default TxIn;
