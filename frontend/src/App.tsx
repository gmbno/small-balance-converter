import './App.css';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useWeb3React } from '@web3-react/core';

import { InternalAppBar } from './components/AppBar/InternalAppBar.tsx';
import { TokenSelector } from './components/TokenSelector/TokenSelector.tsx';

const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#070816',
          height: '100%',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          '&::-webkit-scrollbar': {
            width: 5,
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ffffff60',
            outline: `1px solid #15051c`,
            borderRadius: '5px',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#655E676E',
          },
          '&.Mui-focusVisible': {
            backgroundColor: '#655E676E',
          },
          ':hover': {
            backgroundColor: '#655E676E',
          },
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#15051c',
    },
  },
});

function App() {
  const { activate, deactivate, active, chainId, account, library } =
    useWeb3React();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <InternalAppBar
        activate={activate}
        deactivate={deactivate}
        active={active}
        chainId={chainId}
        account={account}
        library={library}
      />
      <TokenSelector chainId={chainId} account={account} library={library} />
    </ThemeProvider>
  );
}

export default App;
