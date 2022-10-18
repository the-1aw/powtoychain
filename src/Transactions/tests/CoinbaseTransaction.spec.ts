import CoinbaseTransaction from '../CoinbaseTransaction';
import TxIn from '../TxIn';

describe('CoinbaseTransaction testing', () => {
  it('Should instanciate valid CoinbaseTransaction class', () => {
    const coinbaseTransaction = new CoinbaseTransaction('', 0);
    expect(coinbaseTransaction).toBeInstanceOf(CoinbaseTransaction);
  });
  it('Should be an invalid txInListLength CoinbaseTransaction', () => {
    const coinbaseTransaction = new CoinbaseTransaction('', 0);
    coinbaseTransaction.txInList.push(
      new TxIn({
        txOutId: '',
        txOutIdx: 0,
      }),
    );
    expect(coinbaseTransaction.validate()).toBe(false);
  });
  it('Should be an invalid blockIdx CoinbaseTransaction', () => {
    const coinbaseTransaction = new CoinbaseTransaction('', 0);
    coinbaseTransaction.blockIdx = 1;
    expect(coinbaseTransaction.validate()).toBe(false);
  });
  it('Should be an invalid txOutAmount CoinbaseTransaction', () => {
    const coinbaseTransaction = new CoinbaseTransaction('', 0);
    coinbaseTransaction.txOutList[0].amount = 0;
    expect(coinbaseTransaction.validate()).toBe(false);
  });
});
