import { useEth } from '../contexts/EthContext';
import { useEffect, useState } from 'react';
import styles from './PageMain.module.css';

function PageMain() {
    const { state } = useEth();
    const [isOwner, setIsOwner] = useState(false);
    const [isKYCVerified, setIsKYCVerified] = useState(false);
    const [walletAddressOfOwner, setWalletAddressOfOwner] = useState('');
    const [addressForBuying, setAddressForBuying] = useState('');
    const [enteredWalletAddress, setEnteredWalletAddress] = useState('');
    const [balanceOfKNT, setBalanceOfKNT] = useState(0);
    const [totalSupplyOfKNT, setTotalSupplyOfKNT] = useState(0);
    const updateIsKYCVerified = () => {
        if (state) {
            state.kycVerify?.methods.getIsCompleted(state.currentAccount).call().then(setIsKYCVerified);
        }
    };
    const updateBalanceOfKNT = () => {
        if (state) {
            state.token?.methods.balanceOf(state.currentAccount).call().then(setBalanceOfKNT);
        }
    };
    const updateTotalSupplyOfKNT = () => {
        if (state) {
            state.token?.methods.totalSupply().call().then(setTotalSupplyOfKNT);
        }
    };
    useEffect(() => {
        const fetch = async () => {
            setWalletAddressOfOwner((await state.kycVerify?.methods.owner().call()) || '');
            setAddressForBuying(state.addressForBuying);
            updateBalanceOfKNT();
            updateTotalSupplyOfKNT();
        };
        if (state) {
            fetch().then(() => {
                state.token?.events.Transfer({ to: state.currentAccount }).on('data', (_) => {
                    fetch();
                });
                state.kycVerify?.events.KYCVerifyCompleted({ to: state.currentAccount }).on('data', (_) => {
                    setIsKYCVerified(true);
                });
                state.kycVerify?.events.KYCVerifyUncompleted({ to: state.currentAccount }).on('data', (_) => {
                    setIsKYCVerified(false);
                });
            });
        }
    }, [state]);
    useEffect(() => {
        if (state) {
            const isOwner = state.currentAccount?.toUpperCase() === walletAddressOfOwner.toUpperCase();
            setIsOwner(isOwner);
            if (isOwner) {
                setIsKYCVerified(false);
            } else {
                updateIsKYCVerified();
            }
        }
    }, [state, walletAddressOfOwner]);
    const handlerOfKYCWhitelisting = async (_) => {
        if (!enteredWalletAddress) {
            alert('Invalid wallet address!');
            return;
        }
        if (state) {
            await state.kycVerify?.methods.setToCompleted(enteredWalletAddress).send({ from: state.currentAccount });
            alert(`KYC for ${enteredWalletAddress} is processing...!`);
        }
    };
    const handlerOfRequestingKYCVerification = async (_) => {
        if (state) {
            await state.kycVerify?.methods.requestVerification().send({ from: state.currentAccount });
            alert(`KYC Verification for ${state.currentAccount} is being requested...!`);
        }
    };
    const handlerOfBuyingKNT = async (_) => {
        if (state) {
            await state.crowdsale?.methods
                .buyTokens(state.currentAccount)
                .send({ from: state.currentAccount, value: state.web3?.utils.toWei('1', 'wei') });
        }
    };
    return (
        <>
            {state && (
                <>
                    {!state.isLoaded ? (
                        <p>⚠️ MetaMask is not connected to the Sepolia Ethereum Test Network!</p>
                    ) : (
                        <>
                            <div className={styles.container}>
                                <h1>Konerd Token Sale</h1>
                                <h2>ERC-20 Protocol</h2>
                                <hr />
                                <p>This dapp will work with the Sepolia Ethereum Test Network.</p>
                                <p>
                                    You can't buy without KYC Verification, KYC Verify request feature for whitelisting
                                    will be added soon.
                                </p>
                                <hr />
                                <div>
                                    <p>
                                        Current Total Supply:{' '}
                                        <span className={styles.danger}>
                                            <b>{totalSupplyOfKNT} KNT</b>
                                        </span>
                                    </p>
                                    <hr />
                                </div>
                                {isOwner ? (
                                    <div className={styles.addingKYCWhitelist}>
                                        <h3>KYC Whitelist</h3>
                                        <div>
                                            Wallet address to allow:{' '}
                                            <input
                                                type='text'
                                                placeholder='Wallet address (i.e. 0x123...abc)'
                                                value={enteredWalletAddress}
                                                onChange={(e) => {
                                                    setEnteredWalletAddress(e.target.value);
                                                }}
                                            />
                                            <button type='button' onClick={handlerOfKYCWhitelisting}>
                                                Add to Whitelist
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {!isKYCVerified ? (
                                            <div className={styles.requestingKYCVerification}>
                                                <button type='button' onClick={handlerOfRequestingKYCVerification}>
                                                    Request KYC Verification
                                                </button>
                                                <hr />
                                            </div>
                                        ) : (
                                            <div className={styles.buyingKNT}>
                                                <p>
                                                    You currently have <b>{balanceOfKNT} KNT</b>
                                                </p>
                                                <p>
                                                    If you want to buy KNT, send <b>Wei</b> to this address:{' '}
                                                    {addressForBuying}
                                                </p>
                                                <p className={styles.danger}>
                                                    ※ Must send Wei unit, not Ether (1 Wei = 0.000000000000000001 Eth)
                                                </p>
                                                <button type='button' onClick={handlerOfBuyingKNT}>
                                                    Buy 1 KNT (1 Wei = 1 KNT)
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default PageMain;
