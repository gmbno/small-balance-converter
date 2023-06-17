import './App.css';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useWeb3React } from '@web3-react/core';

import { InternalAppBar } from './components/AppBar/InternalAppBar.tsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
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
    </ThemeProvider>
  );
}

export default App;
