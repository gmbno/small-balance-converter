import { InjectedConnector } from "@web3-react/injected-connector";

const metamask = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
});

export { metamask }
