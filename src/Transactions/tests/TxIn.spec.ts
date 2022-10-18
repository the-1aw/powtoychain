import TxIn from '../TxIn';

describe('TxIn testing', () => {
  it('Should instanciate TxIn class', () => {
    const txIn = new TxIn({
      txOutId: '',
      txOutIdx: 0,
    });
    expect(txIn).toBeInstanceOf(TxIn);
  });
});
