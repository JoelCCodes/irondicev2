import Web3 from 'web3'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default function ({ $config: { networkData } }, inject) {
  try {
    const web3 = new Web3(networkData[0].rpcUrls[0])
    const web3Socket = new Web3(
      new Web3.providers.WebsocketProvider(networkData[0].socketRpcUrls[0]),
      {
        // Enable auto reconnection
        reconnect: {
          auto: true,
          delay: 5000, // ms
          maxAttempts: 20,
          onTimeout: false,
        },
      }
    )
    console.log('INIT_WEB3: ', web3)
    inject('web3', web3)
  } catch (error) {
    console.warn(
      'web3 or web3socket initialization failed: ',
      new Web3(networkData[0].rpcUrls[0])
    )
  }
}
