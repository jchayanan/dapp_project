import React, { Component } from 'react'
import Certification from '../../../src/contracts/Certification.json'
import getWeb3 from '../../getWeb3'
import ipfs from '../../ipfs'
import ModalComponent from './modal'
import { Table } from 'reactstrap';
import ModalImage from './modal-image'
import ModalCert from './modal-cert'
import ModalInform from './modal-inform'
import '../styles/home.scss'
import '../styles/form.scss'
import '../styles/button.scss'
import '../styles/submit_btn.scss'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.captureFile = this.captureFile.bind(this)
    this.sendHash = this.sendHash.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      buffer: null,
      ipfsHash: '',
      verified: null,
      showVerified: false,
      showMessage: false,
      certificateID: [],
      certificateAll: [],
      clear: null,
      email:'',
      name:'',
      candidate:'',
      org:'',
      course:'',
      certId:'',
      address:'',
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)
      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = Certification.networks[networkId]
      const instance = new web3.eth.Contract(
        Certification.abi,
        deployedNetwork && deployedNetwork.address,
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
    } catch (error) {
      console.error(error)
    }
  }

  handleChange(event){
    this.setState({
      // Computed property names
      // keys of the objects are computed dynamically
      [event.target.name] : event.target.value
    })
  }

  sendHash = async (e) => {
    e.preventDefault();
    const { accounts, contract } = this.state;
    const d = new Date();
    const issuer = await contract.methods.getIssuer(accounts[0]).call()
    if (issuer === true) {const result = await ipfs.files.add(this.state.buffer)
      const ipfsHash = await result[0].hash;
      this.setState({ ipfsHash: ipfsHash});
      console.log("ipfsHash", this.state.ipfsHash);
      await contract.methods
        .generateCertificate(
          this.state.email,
          this.state.candidate,
          this.state.org,
          this.state.course,
          this.state.ipfsHash,
          d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear()
        )
        .send({ from: accounts[0], gas: 3000000 })
        .then(
          (result) => {
            console.log("onSubmit...");
            console.log(result.events.CertificateGenerated.returnValues);
            alert("Upload successfully!")
          },
          (error) => {
            console.log(error)
          }
        );
      } else {alert("You are not allowed");}
    
      this.setState({email: '', candidate:'', org:'', course:'', clear: Date.now()})
  };

  captureFile(e) {
    e.preventDefault()
    const file = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  // onSubmitStudentCertID = async (e) => {
  //   const { contract } = this.state
  //   e.preventDefault()
  //   const certificate = await contract.methods
  //     .getCertificate(this.state.certId)
  //     .call()
  //   this.setState({ ipfsHash: certificate[5]})
  //   console.log(certificate)
  // }


  onSubmitStudentEmail = async (e) => {
    const { contract, certificateAll } = this.state;
    const fetch = (certID) => {
       return contract.methods.getCertificate(certID).call()
    }
    e.preventDefault();
    const certificates = await contract.methods
      .getAllCertificate(this.state.email)
      .call()
    if(certificateAll.length === 0){certificates.map((certificate) => {
      fetch(certificate).then((response) => {
        this.state.certificateAll.push(response);
        this.setState({ certificateID: certificates, showMessage: true});
        return null;
      })})} 
      console.log(this.state.certificateAll)
    console.log(certificates);
  }

  onSubmitCompany = async (e) => {
    this.forceUpdate();
    const { contract } = this.state
    e.preventDefault()
    const verify_result = await contract.methods
      .isVerified(this.state.certId)
      .call()
    console.log(this.state.certId)
    console.log(verify_result)
    this.setState({verified: verify_result, showVerified: true})
  }

  onSubmitModal = async (e) => {
    e.preventDefault()
    const { accounts, contract } = this.state
    await contract.methods
      .issuerRegister(
        document.getElementById('issuer-address').value)
      .send({ from: accounts[0], gas: 3000000 }).then(
        (result) => {
          console.log("onSubmit...");
          console.log(result.events.IssuerRegistered.returnValues)
        },
        (error) => {
          alert(error)
          console.log(error)
        }
      );
      
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div>
        <section className="et-hero-tabs">
          <h1>Certification System</h1>
          <h3>Using Etherum Blockchain</h3>
          <div id="container" className="pt-4">
            <button className="log-in">
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">
                <ModalComponent
                  title="Register Issuer"
                  cancelButtonText="Cancel"
                  actionButtonText="Submit"
                  buttonText="Register"
                  whenClicked={this.onSubmitModal}
                  whenChange={this.handleChange}
                />
              </span>
            </button>
          </div>

          <div className="et-hero-tabs-container">
            <a className="et-hero-tab-u" href="#tab-university">
              University
            </a>
            <a className="et-hero-tab" href="#tab-student">
              Student
            </a>
            <a className="et-hero-tab" href="#tab-company">
              Company
            </a>
            <span className="et-hero-tab-slider"></span>
          </div>
        </section>

        <main className="et-main">
          <section className="et-slider" id="tab-university">
            <div className="row">
              <div>
                <h1>University</h1>
                <h3> Upload a Certificate</h3>
              </div>
              <div className="container">
                <h2>Upload Data</h2>
                <form onSubmit={this.sendHash} className="form">
                  <fieldset className="form-fieldset ui-input __first">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      tabIndex="0"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="username">
                      <span data-text="E-mail Address">E-mail Address</span>
                    </label>
                  </fieldset>

                  <fieldset className="form-fieldset ui-input __second">
                    <input
                      type="text"
                      name="candidate"
                      id="candidate"
                      tabIndex="0"
                      value={this.state.candidate}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="name">
                      <span data-text="Name">Name</span>
                    </label>
                  </fieldset>

                  <fieldset className="form-fieldset ui-input __third">
                    <input
                      type="text"
                      name="org"
                      id="org-name"
                      value={this.state.org}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="new-password">
                      <span data-text="Organization">Organization</span>
                    </label>
                  </fieldset>

                  <fieldset className="form-fieldset ui-input __fourth">
                    <input
                      type="text"
                      name="course"
                      id="course-name"
                      value={this.state.course}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="repeat-new-password">
                      <span data-text="Courses">Courses</span>
                    </label>
                  </fieldset>

                  <label className="file">
                    <div
                      style={{
                        border: "1px solid #494949",
                        borderRadius: "50px",
                        padding: "10px",
                        backgroundColor: "#F7F7F7",
                        marginTop: "20px",
                      }}
                    >
                      <input
                        type="file"
                        id="file"
                        aria-label="File browser example"
                        onChange={this.captureFile}
                        key={this.state.date}
                      />
                    </div>
                  </label>
                  <div className="form-footer">
                    <div id="container" className="pt-14">
                      <button className="log-in">
                        <span className="circle" aria-hidden="true">
                          <span className="icon arrow"></span>
                        </span>
                        <span className="button-text">Upload</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section className="et-slide-student" id="tab-student">
            <h1>Student</h1>
            <div className="student-form">
              {/* <form onSubmit={this.onSubmitStudentCertID} className="form">
                <fieldset className="form-fieldset ui-input __first">
                  <input
                    type="text"
                    name="certId"
                    id="certId"
                    tabIndex="0"
                    placeholder="For display Certificate"
                    onChange={this.handleChange}
                  />
                  <label htmlFor="certId">
                    <span data-text="certId">Certificate ID</span>
                  </label>
                </fieldset>
                <div className="d-flex justify-content-center pb-3">
                  <ModalImage
                    buttonText="Submit"
                    title="Certificate"
                    cancelButtonText="Close"
                    ipfsHash={this.state.ipfsHash}
                    onClick={this.onSubmitStudentCertID}
                  />
                </div>
              </form> */}
              <form onSubmit={this.onSubmitStudentEmail} className="form">
                <fieldset className="form-fieldset ui-input __second">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    tabIndex="0"
                    placeholder="For display all certificate"
                    onChange={this.handleChange}
                  />
                  <label htmlFor="email">
                    <span data-text="E-mail Address">E-mail Address</span>
                  </label>
                </fieldset>
                <div className="d-flex justify-content-center pb-3">
                  <button
                    type="submit"
                    className="button-submit"
                    certificateID={this.state.certificateID}
                    email={this.state.email}
                    onClick={this.onSubmitStudentEmail}
                  >
                    <span>Submit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            {this.state.showMessage && (
              <div>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course</th>
                      <th>Organization</th>
                      <th>ID</th>
                      <th>IPFS</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  {this.state.certificateAll.map((id, index) => (
                    <React.Fragment key={id[0]}>
                      <tbody>
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{id[4]}</td>
                          <td>{id[3]}</td>
                          <td>
                            {id[0]}
                          </td>
                          <td><ModalCert
                              title="Certificate"
                              buttonText={id[5]}
                              cancelButtonText="Close"
                              ipfsHash={this.state.ipfsHash}
                              onClick={this.onSubmitStudentCertID}
                            /></td>
                          <td>{id[6]}</td>
                        </tr>
                      </tbody>
                    </React.Fragment>
                  ))}
                </Table>
              </div>
            )}
          </section>
          <section className="et-slide-company" id="tab-company">
            <h1>Company</h1>
            <form onSubmit={this.onSubmitCompany} className="form">
              <fieldset className="form-fieldset ui-input __first">
                <input
                  type="text"
                  name="certId"
                  id="certId"
                  tabIndex="0"
                  onChange={this.handleChange}
                />
                <label htmlFor="certId">
                  <span data-text="Certificate ID">Certificate ID</span>
                </label>
              </fieldset>
              <div className="form-footer">
                <div className="d-flex justify-content-center pb-3">
                  <button type="submit" className="button-submit">
                    <span>Submit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
            {this.state.showVerified && (
              <div>
                <h2>This Certificate ID has</h2>{" "}
                {this.state.verified ? (
                  <div>
                    <h2>
                      Already Verified
                      <img
                        className="icon"
                        src="./images/check.png"
                        alt="verified-icon"
                      />
                    </h2>
                  </div>
                ) : (
                  <div>
                    <h2>
                      Not Verify
                      <img
                        className="icon"
                        src="./images/cross.png"
                        alt="unverified-icon"
                      />
                    </h2>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }
}

