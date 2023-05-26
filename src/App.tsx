import "./App.css"

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import { InternalAppBar } from "./components/AppBar/InternalAppBar.tsx";

const theme = createTheme({
    palette: {
        mode: "dark",
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme/>
            <InternalAppBar/>
        </ThemeProvider>
    )
}

export default App
