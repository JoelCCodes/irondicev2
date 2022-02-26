import Web3 from 'web3'

export default async function (context, inject) {
  //   const httpEndpoint = 'http://127.0.0.1:8545'
  //   const web3 = new Web3(new Web3.providers.HttpProvider(httpEndpoint))
  let web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')

  inject('web3', web3)
}
