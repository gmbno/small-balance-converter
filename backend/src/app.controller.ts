import { Controller, Get, Query } from '@nestjs/common';
import { EtherscanService } from './services/etherscan.service';

@Controller()
export class AppController {
  constructor(private readonly etherscanService: EtherscanService) {}

  @Get('getAccountTokens')
  async getAccountTokens(@Query() query): Promise<Array<string>> {
    const { chain, walletAddress } = query;

    console.log(query);

    let balances = [];

    if (chain === 'eth') {
      const transactions = await this.etherscanService.getFilteredTransactions(
        walletAddress,
      );
      balances = await this.etherscanService.getTokenBalancesFromTransactions(
        walletAddress,
        transactions,
      );
    }

    return balances;
  }
}
