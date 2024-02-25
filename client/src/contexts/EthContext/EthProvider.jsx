import React, { useReducer, useCallback, useEffect } from 'react';
import Web3 from 'web3';
import EthContext from './EthContext';
import { reducer, actions, initialState } from './state';

function EthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const init = useCallback(async (artifactKonerdToken, artifactKonerdTokenCrowdsale, artifactKYCVerify) => {
        if (artifactKonerdToken && artifactKonerdTokenCrowdsale && artifactKYCVerify) {
            const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
            const accounts = await web3.eth.requestAccounts();
            const networkID = await web3.eth.net.getId();
            const { abi: abiKonerdToken } = artifactKonerdToken;
            let addressKonerdToken, contractKonerdToken;
            try {
                addressKonerdToken = artifactKonerdToken.networks[networkID].address;
                contractKonerdToken = new web3.eth.Contract(abiKonerdToken, addressKonerdToken);
            } catch (err) {
                console.error(err);
            }
            const { abi: abiKonerdTokenCrowdsale } = artifactKonerdTokenCrowdsale;
            let addressKonerdTokenCrowdsale, contractKonerdTokenCrowdsale;
            try {
                addressKonerdTokenCrowdsale = artifactKonerdTokenCrowdsale.networks[networkID].address;
                contractKonerdTokenCrowdsale = new web3.eth.Contract(
                    abiKonerdTokenCrowdsale,
                    addressKonerdTokenCrowdsale
                );
            } catch (err) {
                console.error(err);
            }
            const { abi: abiKYCVerify } = artifactKYCVerify;
            let addressKYCVerify, contractKYCVerify;
            try {
                addressKYCVerify = artifactKYCVerify.networks[networkID].address;
                contractKYCVerify = new web3.eth.Contract(abiKYCVerify, addressKYCVerify);
            } catch (err) {
                console.error(err);
            }
            dispatch({
                type: actions.init,
                data: {
                    isLoaded: true,
                    web3,
                    accounts,
                    networkID,
                    token: contractKonerdToken,
                    crowdsale: contractKonerdTokenCrowdsale,
                    kycVerify: contractKYCVerify,
                    addressForBuying: addressKonerdTokenCrowdsale,
                },
            });
        }
    }, []);
    useEffect(() => {
        const tryInit = async () => {
            try {
                init(
                    require('../../contracts/KonerdToken.json'),
                    require('../../contracts/KonerdTokenCrowdsale.json'),
                    require('../../contracts/KYCVerify.json')
                );
            } catch (err) {
                console.error(err);
            }
        };
        tryInit();
    }, [init]);
    useEffect(() => {
        const events = ['chainChanged', 'accountsChanged'];
        const handleChange = () => {
            init(state.artifact);
        };
        events.forEach((e) => window.ethereum?.on(e, handleChange));
        return () => {
            events.forEach((e) => window.ethereum.removeListener(e, handleChange));
        };
    }, [init, state.artifact]);
    return (
        <EthContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {children}
        </EthContext.Provider>
    );
}

export default EthProvider;
