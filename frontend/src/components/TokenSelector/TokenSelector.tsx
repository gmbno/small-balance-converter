import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from '@mui/material';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useFetch } from 'use-http';

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

interface CenterPaperProps {
  chainId: number | undefined;
  account: string | null | undefined;
  library: any;
}

type Contract = {
  contractAddress: string;
  tokenSymbol: string;
  tokenDecimal: string;
  usdPrice: string;
  logoUrl: string;
};

type AvailableToken = Contract & {
  balance: string;
  convertedBalanceString: string;
  formattedUsdValue: string;
  selected?: boolean;
};

export const TokenSelector = ({
  chainId,
  account,
  library,
}: CenterPaperProps) => {
  const [availableTokens, setAvailableTokens] = useState<Array<AvailableToken>>(
    []
  );

  const {
    get: getFromBackend,
    response: responseFromBackend,
    loading: loadingFromBackend,
  } = useFetch('http://localhost:3000');

  useEffect(() => {
    getAccountTokens();
  }, [chainId, account]);

  async function getAccountTokens() {
    if (!chainId || !account) {
      setAvailableTokens([]);
      return;
    }

    const contracts: Array<AvailableToken> = await getFromBackend(
      `/getAccountTokens?chainId=${chainId}&walletAddress=${account}`
    );
    if (!responseFromBackend.ok) return;

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
    setAvailableTokens(
      JSON.parse(
        JSON.stringify([
          ...displayableTokens,
          ...displayableTokens,
          ...displayableTokens,
          ...displayableTokens,
        ])
      )
    );
  }

  function onTokenClickHandler(index: number) {
    const updatedAvailableTokens = [...availableTokens];
    updatedAvailableTokens[index].selected =
      !updatedAvailableTokens[index].selected;
    setAvailableTokens(updatedAvailableTokens);
  }

  const selectedTokens = availableTokens.filter((x) => x.selected);
  if (!account) return null;

  console.log(availableTokens);
  return (
    <Paper
      elevation={8}
      sx={{
        minWidth: '35%',
        minHeight: '30%',
        maxHeight: '60%',
        height: 'fit-content',
        borderRadius: '14px',
        borderStyle: 'solid',
        borderWidth: '0.5px',
        borderColor: '#ffffff60',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Typography variant={'h6'} sx={{ padding: '10px 10px 0px 10px' }}>
        Select tokens to convert
      </Typography>
      <Paper
        sx={{
          maxHeight: 'calc(100% - 110px)',
          borderRadius: '14px',
          borderStyle: 'solid',
          borderWidth: '0.5px',
          borderColor: '#ffffff60',
          margin: '7px 5px',
          padding: '7px 2px',
        }}>
        <List
          disablePadding
          sx={{
            height: '100%',
            overflow: 'auto',
            overflowY: 'scroll',
          }}>
          {availableTokens.map((contract, index) => (
            <ListItem
              key={index + contract.contractAddress}
              disableGutters
              disablePadding>
              <ListItemButton
                selected={contract.selected}
                onClick={() => onTokenClickHandler(index)}
                sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{ width: 35, height: 35, marginRight: '5px' }}
                    src={contract.logoUrl}>
                    <Typography variant={'caption'}>
                      {contract.tokenSymbol}
                    </Typography>
                  </Avatar>
                  {contract.tokenSymbol}
                </Box>
                ≈ {contract.formattedUsdValue}$
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button
        size={'large'}
        disabled={!selectedTokens?.length}
        variant={'outlined'}
        sx={{
          margin: '5px',
          borderRadius: '14px',
          backgroundColor: '#260a36',
        }}>
        Convert{' ≈ '}
        {selectedTokens.length &&
          selectedTokens
            .map((x) => parseFloat(x.formattedUsdValue))
            .reduce((sum, x) => parseFloat((sum + x).toFixed(2)))}
        {'$'}
      </Button>
      {loadingFromBackend && (
        <CircularProgress
          color="primary"
          variant="indeterminate"
          sx={{
            position: 'absolute',
            top: '50%',
            left: 'calc(50% - 20px)',
          }}
        />
      )}
    </Paper>
  );
};
