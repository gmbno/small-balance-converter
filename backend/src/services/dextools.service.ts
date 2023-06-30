import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const LPs_CACHE_KEY = 'lps:';
const CACHE_TTL = 600;
@Injectable()
export class DextoolsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getUSDPriceAndTokenLogoFromLP(
    chainShortName: string,
    contractAddress: string,
  ) {
    let body: any = await this.cacheManager.get(
      LPs_CACHE_KEY + contractAddress,
    );

    if (!body) {
      const response = await fetch(
        `https://www.dextools.io/shared/search/pair?chains=${chainShortName}&query=${contractAddress}`,
        {
          body: null,
          method: 'GET',
        },
      );

      body = await response.json();
      await this.cacheManager.set(
        LPs_CACHE_KEY + contractAddress,
        body,
        CACHE_TTL,
      );
    }

    const lp = body.results.filter((x) => x.type === 'stable-based-pair')[0];
    if (!lp) return null;

    const price = lp.price;
    const logoUrl = lp.token.logo
      ? `https://www.dextools.io/resources/tokens/logos/${lp.token.logo}`
      : null;

    return { price, logoUrl };
  }
}
