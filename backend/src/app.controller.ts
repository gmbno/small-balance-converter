import { Controller, Get, Query } from '@nestjs/common';
import { EtherscanService } from './services/etherscan.service';
import { DextoolsService } from './services/dextools.service';

@Controller()
export class AppController {
  constructor(
    private readonly etherscanService: EtherscanService,
    private readonly dextoolsService: DextoolsService,
  ) {}

  @Get('getAccountTokens')
  async getAccountTokens(@Query() query): Promise<Array<any>> {
    const { chainId, walletAddress } = query;
    let transactions = [];
    let chainShortName = '';

    console.log(query);

    if (chainId === '1') {
      chainShortName = 'ether';
      transactions = await this.etherscanService.getFilteredTransactions(
        walletAddress,
      );
    }

    const map = new Map(transactions.map((x) => [x.contractAddress, x]));
    const deduplicatedTransactions = [...map.values()];

    for (const x of deduplicatedTransactions) {
      const infos = await this.dextoolsService.getUSDPriceAndTokenLogoFromLP(
        chainShortName,
        x.contractAddress,
      );
      console.log(x.tokenSymbol, infos);
      x.usdPrice = infos?.price;
      x.logoUrl = infos?.logoUrl;
    }

    const contractsWithLp = deduplicatedTransactions.filter((x) =>
      Boolean(x.usdPrice),
    );

    return contractsWithLp.map((x) => {
      return {
        tokenSymbol: x.tokenSymbol,
        tokenDecimal: x.tokenDecimal,
        contractAddress: x.contractAddress,
        usdPrice: x.usdPrice,
        logoUrl: x.logoUrl,
      };
    });
  }
}
