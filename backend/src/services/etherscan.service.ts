import { Inject, Injectable } from '@nestjs/common';
import * as EthApi from 'etherscan-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import BigNumber from 'bignumber.js';

const TRANSACTION_CACHE_KEY = 'transactions:';
const BALANCES_CACHE_KEY = 'balances:';

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
      300000,
    );

    return succeededAndReceivedTransactions;
  }

  async getTokenBalancesFromTransactions(
    walletAddress: string,
    transactions: Array<any>,
  ) {
    const balances = [];

    const map = new Map(
      transactions.map((x) => [x.contractAddress.toLowerCase(), x]),
    );
    const deduplicatedTransactions = [...map.values()];

    for (const x of deduplicatedTransactions) {
      const balance = await this.cacheManager.get(
        BALANCES_CACHE_KEY + x.tokenName + walletAddress,
      );
      if (balance) {
        console.log(
          walletAddress,
          'got balance from memory cache',
          x.contractAddress,
          x.tokenName,
          balance,
        );
        balances.push({
          tokenName: x.tokenName,
          tokenSymbol: x.tokenSymbol,
          balance,
        });
        continue;
      }

      try {
        const balanceResult = await this.client.account.tokenbalance(
          walletAddress,
          '',
          x.contractAddress,
        );

        const balanceBN = new BigNumber(
          balanceResult.result + 'e-' + x.tokenDecimal,
        ).toString();

        await this.cacheManager.set(
          BALANCES_CACHE_KEY + x.tokenName + walletAddress,
          balanceBN,
          300000,
        );
        balances.push({
          tokenName: x.tokenName,
          tokenSymbol: x.tokenSymbol,
          balance: balanceBN,
        });

        console.log(walletAddress, x.contractAddress, x.tokenName, balanceBN);
      } catch (e) {
        console.error(e);
      }
    }

    return balances;
  }
}
