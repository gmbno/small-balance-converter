import {
  AppBar,
  Avatar,
  Box,
  Button,
  SelectChangeEvent,
  Toolbar,
} from '@mui/material';
import { useState } from 'react';

import { ConnectionDrawer } from '../ConnectionDrawer/ConnectionDrawer.tsx';
import { NetworkSelect } from './NetworkSelect.tsx';

interface InternalAppBarProps {
  activate: any;
  deactivate: any;
  active: boolean;
  chainId: number | undefined;
  account: string | null | undefined;
  library: any;
}

export const InternalAppBar = ({
  activate,
  deactivate,
  active,
  chainId,
  account,
  library,
}: InternalAppBarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleChainChange = async (event: SelectChangeEvent<number>) => {
    await library.currentProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${Number(event.target.value).toString(16)}` }],
    });
  };

  const formattedAccount =
    account?.substring(0, 6) +
    '...' +
    account?.substring(account.length - 4, account.length);
  return (
    <Box>
      <AppBar position={'fixed'}>
        <Toolbar>
          <Avatar
            src={
              'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Recycling_symbol.svg/2116px-Recycling_symbol.svg.png'
            }
          />
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            {active && (
              <>
                <NetworkSelect value={chainId} onChange={handleChainChange} />
                <Button variant={'contained'} onClick={deactivate}>
                  {formattedAccount}
                </Button>
              </>
            )}
            {!active && (
              <Button
                variant={'contained'}
                onClick={() => setIsDrawerOpen(true)}>
                Connect
              </Button>
            )}
          </div>
          <ConnectionDrawer
            isOpen={isDrawerOpen}
            setIsOpen={setIsDrawerOpen}
            activate={activate}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
