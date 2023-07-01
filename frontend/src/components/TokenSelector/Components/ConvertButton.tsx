import { Button } from '@mui/material';

import { AvailableToken } from '../TokenSelector.tsx';

interface ConvertButtonProps {
  availableTokens: Array<AvailableToken>;
}

export const ConvertButton = ({ availableTokens }: ConvertButtonProps) => {
  const selectedTokens = availableTokens.filter((x) => x.selected);
  return (
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
  );
};
