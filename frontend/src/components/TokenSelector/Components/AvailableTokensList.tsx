import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

import { AvailableToken } from '../TokenSelector.tsx';

interface AvailableTokensListProps {
  availableTokens: Array<AvailableToken>;
  setAvailableTokens: Dispatch<SetStateAction<AvailableToken[]>>;
}

export const AvailableTokensList = ({
  availableTokens,
  setAvailableTokens,
}: AvailableTokensListProps) => {
  function onTokenClickHandler(index: number) {
    const updatedAvailableTokens = [...availableTokens];
    updatedAvailableTokens[index].selected =
      !updatedAvailableTokens[index].selected;
    setAvailableTokens(updatedAvailableTokens);
  }

  return (
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
  );
};
