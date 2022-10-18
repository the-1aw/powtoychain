import Transaction from './Transaction';
import TxIn from './TxIn';
import TxOut from './TxOut';

const COINBASE_AMOUNT = 50;

class CoinbaseTransaction extends Transaction {
  constructor(public address: string, public blockIdx: number) {
    super({
      txInList: [
        new TxIn({
          txOutIdx: blockIdx,
          txOutId: '',
        }),
      ],
      txOutList: [
        new TxOut({
          address,
          amount: COINBASE_AMOUNT,
        }),
      ],
    });
  }

  validate(): boolean {
    if (Transaction.genTransactionId(this) !== this.id) {
      return false;
    }
    if (this.txInList.length !== 1) {
      return false;
    }
    if (this.txInList[0].txOutIdx !== this.blockIdx) {
      return false;
    }
    if (this.txOutList.length !== 1) {
      return false;
    }
    if (this.txOutList[0].amount !== COINBASE_AMOUNT) {
      return false;
    }
    return true;
  }
}

export default CoinbaseTransaction;
