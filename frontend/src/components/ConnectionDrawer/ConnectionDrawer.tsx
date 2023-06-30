import { Avatar, Box, Button, Drawer, List } from '@mui/material';
import React from 'react';

interface ConnectionDrawerParams {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  connectHandler: any;
}

export const ConnectionDrawer = ({
  isOpen,
  setIsOpen,
  connectHandler,
}: ConnectionDrawerParams) => {
  return (
    <Drawer
      anchor={'right'}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{
        sx: {
          borderLeft: 'solid',
          borderWidth: '0.5px',
          borderColor: '#ffffff60',
        },
      }}>
      <Box
        sx={{
          padding: '5px 20px',
        }}>
        <List>
          <Button
            variant={'contained'}
            onClick={connectHandler}
            startIcon={
              <Avatar
                src={
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png'
                }
              />
            }>
            Metamask
          </Button>
        </List>
      </Box>
    </Drawer>
  );
};
