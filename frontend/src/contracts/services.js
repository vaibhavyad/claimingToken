import Web3 from 'web3';
import ABI from './ABI.json';

const contractAddress = '0xEB2E6113f624f5A80c743111f40c0Cfce06B74b2';

const contractABI = ABI


const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    return web3;
  } else {
    return null;
  }
}
/**
 * 
 * @param {*} web3 
 * @returns 
 */
const getContract = async (web3) => {
  if (web3) {
    return new web3.eth.Contract(contractABI, contractAddress);
  } else {
    return null;
  }
}
/**
 * 
 * @param {*} contract 
 * @returns 
 */
const getRemainingTokens = async (contract) => {
  const balance = await contract.methods.balanceOf(contractAddress).call();
  return Web3.utils.fromWei(balance, 'ether');
};

/**
 * 
 * @param {*} contract 
 * @returns 
 */
 const getNoOfClaimedUsers = async (contract) => {
  const claimedUsers = await contract.methods.noOfClaimUser().call();
  return claimedUsers;
};

/**
 * 
 * @param {*} contract 
 * @param {*} account 
 */
const claimTokens = async (contract, account) => {
    try {
      await contract.methods.claimTokens().send({ from: account });
    } catch (error) {
      console.log("Error:" ,error.message);
    }
  } 


export default { claimTokens, getNoOfClaimedUsers, getRemainingTokens, getWeb3, getContract }