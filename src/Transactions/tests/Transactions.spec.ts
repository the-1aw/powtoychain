import Transaction from '../Transaction';
import TxIn from '../TxIn';
import TxOut from '../TxOut';

describe('Transaction testing', () => {
  it('Should instanciate Transaction class', () => {
    const transaction = new Transaction({
      txInList: [
        new TxIn({
          txOutIdx: 0,
          txOutId: '',
        }),
      ],
      txOutList: [
        new TxOut({
          address: '',
          amount: 0,
        }),
      ],
    });
    expect(transaction).toBeInstanceOf(Transaction);
  });
});
