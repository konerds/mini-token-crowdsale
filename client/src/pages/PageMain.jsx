import { useEth } from '../contexts/EthContext';
import { useEffect, useState } from 'react';
import styles from './PageMain.module.css';

function PageMain() {
    const { state } = useEth();
    const [walletAddressOfOwner, setWalletAddressOfOwner] = useState('');
    const [addressForBuying, setAddressForBuying] = useState('');
    const [enteredWalletAddress, setEnteredWalletAddress] = useState('');
    const [balanceOfKNT, setBalanceOfKNT] = useState(0);
    const updateBalanceOfKNT = async () =>
        state?.token?.methods.balanceOf(state?.accounts?.[0]).call().then(setBalanceOfKNT);
    useEffect(() => {
        console.log(state);
        state?.kycVerify?.methods.owner().call().then(setWalletAddressOfOwner);
        setAddressForBuying(state?.addressForBuying);
        updateBalanceOfKNT();
        state?.token?.events.Transfer({ to: state?.accounts?.[0] }).on('data', (_) => {
            updateBalanceOfKNT();
        });
    }, [state]);
    const handlerOfKYCWhitelisting = async (e) => {
        if (!enteredWalletAddress) {
            alert('Invalid wallet address!');
            return;
        }
        await state?.kycVerify?.methods.setToCompleted(enteredWalletAddress).send({ from: state?.accounts?.[0] });
        alert(`KYC for ${enteredWalletAddress} is processing...!`);
    };
    const handlerOfBuyingKNT = async (e) => {
        await state?.crowdsale?.methods
            .buyTokens(state?.accounts?.[0])
            .send({ from: state?.accounts?.[0], value: state?.web3?.utils.toWei('1', 'wei') });
    };
    return (
        <>
            {!state?.isLoaded ? (
                <p>⚠️ MetaMask is not connected to the same network as the one you deployed to.</p>
            ) : (
                <>
                    <div className={styles.container}>
                        <h1>Konerd Token Sale</h1>
                        <h2>ERC-20 Protocol</h2>
                        <hr />
                        <p>This dapp will work with the Sepolia Ethereum Test Network</p>
                        <p>
                            You can't buy without KYC Verification, KYC Verify request feature for whitelisting will be
                            added soon.
                        </p>
                        <hr />
                        {state?.accounts?.[0] === walletAddressOfOwner && (
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
                                <hr />
                            </div>
                        )}
                        <div className={styles.buyingKNT}>
                            <p>
                                You currently have <b>{balanceOfKNT} KNT</b>
                            </p>
                            <p>
                                If you want to buy KNT, send <b>Wei</b> to this address: {addressForBuying}
                            </p>
                            <p className={styles.danger}>
                                ※ Must send Wei unit, not Ether (1 Wei = 0.000000000000000001 Eth)
                            </p>
                            <button type='button' onClick={handlerOfBuyingKNT}>
                                Buy 1 KNT (1 Wei = 1 KNT)
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default PageMain;
