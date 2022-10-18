import type Transaction from './Transaction';
import { IUnspendTxOut } from './types';

class UnspentTxOutList {
  private unspentTxOutList: Array<IUnspendTxOut>;

  constructor(unspentTxOutList: Array<IUnspendTxOut> = []) {
    this.unspentTxOutList = unspentTxOutList;
  }

  findUnspentTxOut(txOutId: string, txOutIdx: number): IUnspendTxOut | undefined {
    return this.unspentTxOutList.find((uTxO) => uTxO.txOutId === txOutId && uTxO.txOutIdx === txOutIdx);
  }

  update(newTransactions: Transaction[]): void {
    const newUnspentTxOutList: IUnspendTxOut[] = newTransactions
      .map((t) => {
        return t.txOutList.map((txOut, index) => ({
          txOutId: t.id,
          txOutIdx: index,
          address: txOut.address,
          amount: txOut.amount,
        }));
      })
      .flat();

    const consumedTxOutList = new UnspentTxOutList(
      newTransactions
        .map((t) => t.txInList)
        .flat()
        .map((txIn) => ({
          txOutId: txIn.txOutId,
          txOutIdx: txIn.txOutIdx,
          address: '',
          amount: 0,
        })),
    );

    this.unspentTxOutList = this.unspentTxOutList
      .filter((uTxO) => consumedTxOutList.findUnspentTxOut(uTxO.txOutId, uTxO.txOutIdx))
      .concat(newUnspentTxOutList);
  }
}

export default UnspentTxOutList;
