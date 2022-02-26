import Web3 from 'web3'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default function (context, inject) {
  // pass null as provider to not force connection during plugin instantiation
  // as it will be set via web3.setProvider via an action
  const web3 = new Web3(null)

  inject('web3', web3)
}
