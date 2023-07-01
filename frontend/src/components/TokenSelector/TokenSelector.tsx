import { CircularProgress, Paper, Typography } from '@mui/material';
import { useState } from 'react';

import { AvailableTokensList } from './Components/AvailableTokensList.tsx';
import { ConvertButton } from './Components/ConvertButton.tsx';
import { useTokenSelector } from './tokenSelector.helpers.tsx';

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

export type AvailableToken = Contract & {
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
  const { loading } = useTokenSelector({
    chainId,
    account,
    library,
    setAvailableTokens,
  });

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
        <AvailableTokensList
          availableTokens={availableTokens}
          setAvailableTokens={setAvailableTokens}
        />
      </Paper>
      <ConvertButton availableTokens={availableTokens} />
      {loading && (
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
