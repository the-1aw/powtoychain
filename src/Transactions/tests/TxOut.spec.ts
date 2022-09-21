import TxOut from '../TxOut';

describe('TxOut testOutg', () => {
  it('Should instanciate TxOut class', () => {
    const txOut = new TxOut({
      address: '',
      amount: 0,
    });
    expect(txOut).toBeInstanceOf(TxOut);
  });
});
