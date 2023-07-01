import BigNumber from 'bignumber.js';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFetch } from 'use-http';

import { AvailableToken } from './TokenSelector.tsx';

const balanceOfABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
interface useTokenSelectorProps {
  chainId: number | undefined;
  account: string | null | undefined;
  library: any;
  setAvailableTokens: Dispatch<SetStateAction<AvailableToken[]>>;
}

export const useTokenSelector = ({
  chainId,
  account,
  library,
  setAvailableTokens,
}: useTokenSelectorProps) => {
  const { get, response, loading } = useFetch('http://localhost:3000');

  useEffect(() => {
    getAccountTokens();
  }, [chainId, account]);

  async function getAccountTokens() {
    if (!chainId || !account) {
      setAvailableTokens([]);
      return;
    }

    const contracts: Array<AvailableToken> = await get(
      `/getAccountTokens?chainId=${chainId}&walletAddress=${account}`
    );
    if (!response.ok) return;

    for (const contract of contracts) {
      const loadedContract = new library.eth.Contract(
        balanceOfABI,
        contract.contractAddress
      );

      contract.balance = await loadedContract.methods.balanceOf(account).call();
      contract.convertedBalanceString = new BigNumber(
        contract.balance + 'e-' + contract.tokenDecimal
      ).toString();
      contract.formattedUsdValue = new BigNumber(
        contract.convertedBalanceString
      )
        .times(new BigNumber(contract.usdPrice))
        .toFormat(2);
    }

    const displayableTokens = contracts.filter((x) => x.balance !== '0');
    setAvailableTokens(displayableTokens);
  }

  return { loading };
};
