import UnspentTxOutList from '../UnspentTxOutList';

describe('UnspentTxOutList Testing', () => {
  it('Should instantiate UnspentTxOutList class', () => {
    const unspendTxOutList = new UnspentTxOutList();
    expect(unspendTxOutList).toBeInstanceOf(UnspentTxOutList);
  });
});
