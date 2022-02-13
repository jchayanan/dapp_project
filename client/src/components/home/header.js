import React, { Component } from 'react'
import getWeb3 from '../../getWeb3'
import '../styles/header.scss'

export default class header extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        web3: null,
        accounts: null,
        contract: null,
    }

    componentDidMount = async () => {
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3()
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts()
          const src = accounts[0]
          console.log(src)
    
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, accounts: src})
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          )
          console.error(error)
        }
      } 
    
  render() {
    return (
      <nav className="nav-bar">
          <li>Account</li>
          <li>{this.state.accounts}</li>
      </nav>
    )
  }
}
