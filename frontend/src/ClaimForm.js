import React, { useState, useEffect } from 'react';

import ClaimingToken from './contracts/services'; // import path of services


function ClaimForm() {
const [remainingTokens, setRemainingTokens] = useState('');
const [numberOfClaimUsers, setNumberOfClaimUsers] = useState(0);
const [account, setAccount] = useState('');

useEffect(() => {
    if (account) {
        fetchData();
    }
}, [account]);

/**
 * Connect wallet
 */ 

async function connectWallet() {
    const web3 = await ClaimingToken.getWeb3();
    if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
    }
}


/**
 * Retrieved Data dynamically from the blockchain.
 */
async function fetchData() {
    const web3 = await ClaimingToken.getWeb3();
    const contract = await ClaimingToken.getContract(web3);
    if (contract) {
        const remaining = await ClaimingToken.getRemainingTokens(contract);
        const claimUsers = await ClaimingToken.getNoOfClaimedUsers(contract);
        setRemainingTokens(remaining);
        setNumberOfClaimUsers(claimUsers.toString());
    }
}
/**
 * Implement the Claim token 
 */
async function ClaimTokens() {
    const web3 = await ClaimingToken.getWeb3();
    const contract = await ClaimingToken.getContract(web3);
    if (contract && account) {
        await ClaimingToken.claimTokens(contract, account);
        fetchData();
    }
}

return (
    <div class ="App">
            <h1>ClaimingToken Dashboard  </h1>
            <h2>Etherum Sepolia Testnet</h2>
            {account ? (
                <>
                    <p>Connected Account: {account}</p>
                    <p>Remaining Tokens for Distribution: {remainingTokens} CLMT</p>
                    <p>Number of users who have claimed tokens: {numberOfClaimUsers}</p>
                    <p>Number of Holder Tokens: {numberOfClaimUsers}</p>
                    <button onClick={ClaimTokens}>Claim Tokens</button>
                </>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
    </div>
);
}

export default ClaimForm;