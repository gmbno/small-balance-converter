import { Inject, Injectable } from '@nestjs/common';
import * as EthApi from 'etherscan-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const TRANSACTION_CACHE_KEY = 'transactions:';
const CACHE_TTL = 600000;

@Injectable()
export class EtherscanService {
  private readonly client = EthApi.init('57KTCXUYB6VH2PSMDAUMEYFCWYH3UGN8AV');

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getClient() {
    return this.client;
  }

  async getFilteredTransactions(walletAddress: string) {
    let page = 1;
    let transactionReturnCount = 100;
    let succeededAndReceivedTransactions =
      ((await this.cacheManager.get(
        TRANSACTION_CACHE_KEY + walletAddress,
      )) as Array<any>) || [];

    if (succeededAndReceivedTransactions.length !== 0) {
      console.log(walletAddress, 'returning tsxs from memory cache');
      return succeededAndReceivedTransactions;
    }

    while (transactionReturnCount === 100) {
      const transactions = await this.client.account.tokentx(
        walletAddress,
        undefined,
        0,
        'latest',
        page,
      );

      const filteredTransactions = transactions.result.filter(
        (x) => x.to.toLowerCase() === walletAddress.toLowerCase(),
      );

      succeededAndReceivedTransactions =
        succeededAndReceivedTransactions.concat(filteredTransactions);

      page++;
      transactionReturnCount = transactions.result.length;
    }

    await this.cacheManager.set(
      TRANSACTION_CACHE_KEY + walletAddress,
      succeededAndReceivedTransactions,
      CACHE_TTL,
    );

    return succeededAndReceivedTransactions;
  }
}
