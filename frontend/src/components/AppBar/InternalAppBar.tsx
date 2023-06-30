import {
  AppBar,
  Avatar,
  Button,
  SelectChangeEvent,
  Toolbar,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { connectors } from '../../Connectors.ts';
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

  const sign = async () => {
    /*if (!account || !library?.eth) return;

    try {
      const hash = sha3('wBUvKDz%DrMT*KQmb99T%E@m7*eQ6M!i') as string;
      const signature = await library?.eth.personal.sign(hash, account, '');
      console.log(
        await library?.eth.personal.ecRecover(hash, signature),
        account
      );
    } catch (e) {
      disconnectHandler();
    }*/
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage.getItem('isWalletConnected') === String(true)) {
        try {
          await activate(connectors.injected);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, [activate]);

  useEffect(() => {
    sign();
  }, [library?.eth]);

  const handleChainChange = async (event: SelectChangeEvent<number>) => {
    await library.currentProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${Number(event.target.value).toString(16)}` }],
    });
  };

  const disconnectHandler = () => {
    deactivate();
    localStorage.setItem('isWalletConnected', String(false));
  };

  const connectHandler = () => {
    activate(connectors.injected);
    localStorage.setItem('isWalletConnected', String(true));
    setIsDrawerOpen(false);
  };

  const formattedAccount =
    account?.substring(0, 6) +
    '...' +
    account?.substring(account.length - 4, account.length);

  return (
    <AppBar
      position={'fixed'}
      sx={{
        backgroundColor: '#00000000',
        backgroundImage: 'none',
        height: '0px',
      }}>
      <Toolbar>
        <Avatar
          src={
            'https://logos-world.net/wp-content/uploads/2021/10/Recycle-Symbol.png'
          }
        />
        <div style={{ marginLeft: 'auto', display: 'flex' }}>
          {active && (
            <>
              <NetworkSelect value={chainId} onChange={handleChainChange} />
              <Button
                variant={'outlined'}
                onClick={() => disconnectHandler()}
                sx={{ maxHeight: 40 }}>
                {formattedAccount}
              </Button>
            </>
          )}
          {!active && (
            <Button
              variant={'outlined'}
              onClick={() => setIsDrawerOpen(true)}
              sx={{ maxHeight: 40 }}>
              Connect
            </Button>
          )}
        </div>
        <ConnectionDrawer
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
          connectHandler={connectHandler}
        />
      </Toolbar>
    </AppBar>
  );
};
