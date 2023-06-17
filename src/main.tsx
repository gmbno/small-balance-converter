import "./index.css"

import { Web3ReactProvider } from "@web3-react/core";
import React from "react"
import ReactDOM from "react-dom/client"
import Web3 from "web3";

import App from "./App.tsx"

function getLibrary(provider: any) {
    return new Web3(provider);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Web3ReactProvider getLibrary={getLibrary}>
            <App/>
        </Web3ReactProvider>
    </React.StrictMode>,
)
