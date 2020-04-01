import React, {Component} from 'react';
import {Spinner, Container, Row, Col, Form} from 'react-bootstrap';
import '../App.css';
import PasswordPolicy from '../components/PasswordPolicy'
import 'react-block-ui/style.css';
import {ApiService} from "../services/ApiService";
import Spin from "antd/lib/spin";

const hostUrl = window.location.protocol + '//' + window.location.host;

class MyProfile1 extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      middleName: '',
      lastName: '',
      id: '',
      email: '',
      DOB: '',
      SSN: '',
      userName: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      challenges: [
        {
          challenge: '',
          response: '',
          responseError: false
        },
        {
          challenge: '',
          response: '',
          responseError: false
        },
        {
          challenge: '',
          response: '',
          responseError: false
        }
      ],
      allChallengeQuestions: [],
      isPwdChecked: false,
      isQuestionChecked: false,
      isLoaderShow: false,
      errorMessage: '',
      apiMessage: '',
      isSaving: false,
      isQuestionSaving: false,
      afterPwdSubmit: false,
      afterQuestionSubmit: false
    }

    this.handlePwdCheckbox = this.handlePwdCheckbox.bind(this);
    this.handleQuestionCheckbox = this.handleQuestionCheckbox.bind(this);
    this.handleOldPwdInput = this.handleOldPwdInput.bind(this);
    this.handleNewPwdInput = this.handleNewPwdInput.bind(this);
    this.handleConfirmPwdInput = this.handleConfirmPwdInput.bind(this);
    this.handleSelect0Change = this.handleSelect0Change.bind(this);
    this.handleAnswer0InputChange = this.handleAnswer0InputChange.bind(this);
    this.handleAnswer0Blur = this.handleAnswer0Blur.bind(this);
    this.handleSelect1Change = this.handleSelect1Change.bind(this);
    this.handleAnswer1InputChange = this.handleAnswer1InputChange.bind(this);
    this.handleAnswer1Blur = this.handleAnswer1Blur.bind(this);
    this.handleSelect2Change = this.handleSelect2Change.bind(this);
    this.handleAnswer2InputChange = this.handleAnswer2InputChange.bind(this);
    this.handleAnswer2Blur = this.handleAnswer2Blur.bind(this);
    this.handleChangePwd = this.handleChangePwd.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);

    this.style = {listitem: {paddingBottom: '0', paddingTop: '0'}}
  }

  async componentDidMount() {

    document.title = "My Profile"
    var self = this;

    let url = hostUrl + `/IDSelfService/webapi/authapi/userInformation`
    console.log(url);

    this.setState({
      isLoaderShow: true
    })

    const data = await this._apiService.getUserInformation();
    if (!data || data.error) {
      window.scrollTo(0, 0);
      self.setState({
        apiMessage: 'An error has occurred',
        errorMessage: 'apiError',
        isLoaderShow: false
      })
    } else {
      self.setState({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        email: data.email,
        DOB: data.dob,
        SSN: data.last4ofSSN,
        userName: data.userLogin,
        id: data.userId,
        isLoaderShow: false
      })

      if (data.challengeQuestions.length) {
        self.setState({
          challenges: [
            {
              challenge: data.challengeQuestions[0],
              response: '',
              responseError: false
            },
            {
              challenge: data.challengeQuestions[1],
              response: '',
              responseError: false
            },
            {
              challenge: data.challengeQuestions[2],
              response: '',
              responseError: false
            }
          ]
        })
      }
      console.log(self.state);
    }
  }

  handlePwdCheckbox(e) {
    this.setState(
      function (prevState) {
        return {isPwdChecked: !prevState.isPwdChecked}
      })
  }

  handleQuestionCheckbox = async (e) => {
    this.setState({
      isQuestionChecked: !this.state.isQuestionChecked
    })

    let self = this;
    let url = hostUrl + `/IDSelfService/webapi/unauthapi/allChallengeQuestions`
    console.log(url);

    const data = await this._apiService.getChallengeQuestions();
    if (!data || data.error) {
      window.scrollTo(0, 0);

      self.setState({
        apiMessage: 'An error has occurred',
        errorMessage: 'apiError',
        isLoaderShow: false
      })
    } else {
      self.setState({
        allChallengeQuestions: data.challengeQuestions
        /*allChallengeQuestions: data.challengeQuestions.sort(function () {
          return 0.5 - Math.random()
        })*/
      })
      if (self.state.challenges[0].challenge === '' && self.state.challenges[1].challenge === ''
        && self.state.challenges[2].challenge === '') {
        self.setState({
          challenges: [
            {
              challenge: self.state.allChallengeQuestions[0],
              response: '',
              responseError: false
            },
            {
              challenge: self.state.allChallengeQuestions[1],
              response: '',
              responseError: false
            },
            {
              challenge: self.state.allChallengeQuestions[2],
              response: '',
              responseError: false
            }
          ]
        })

      }
      console.log(self.state.allChallengeQuestions)
    }
  }

  handleOldPwdInput(e) {
    this.setState({
      oldPassword: e.target.value
    })
  }

  handleNewPwdInput(e) {
    this.setState({
      newPassword: e.target.value
    })
  }

  handleConfirmPwdInput(e) {
    this.setState({
      confirmPassword: e.target.value
    })
  }

  handleSelect0Change(e) {
    var question0 = {...this.state.challenges};
    question0[0].challenge = e.target.value;
    this.setState({question0})
  }

  handleAnswer0InputChange(e) {
    var answer0 = {...this.state.challenges}
    answer0[0].response = e.target.value;
    this.setState({answer0})
  }

  handleAnswer0Blur(e) {
    var error0 = {...this.state.challenges}
    if (e.target.value === undefined || e.target.value.length === 0) {
      error0[0].responseError = true;
      this.setState({error0})
    } else {
      error0[0].responseError = false;
      this.setState({error0})
    }
  }

  handleSelect1Change(e) {
    var question1 = {...this.state.challenges};
    question1[1].challenge = e.target.value;
    this.setState({question1})
  }

  handleAnswer1InputChange(e) {
    var answer1 = {...this.state.challenges}
    answer1[1].response = e.target.value;
    this.setState({answer1})
  }

  handleAnswer1Blur(e) {
    var error1 = {...this.state.challenges}
    if (e.target.value === undefined || e.target.value.length === 0) {
      error1[1].responseError = true;
      this.setState({error1})
    } else {
      error1[1].responseError = false;
      this.setState({error1})
    }
  }

  handleSelect2Change(e) {
    var question2 = {...this.state.challenges};
    question2[2].challenge = e.target.value;
    this.setState({question2})
  }

  handleAnswer2InputChange(e) {
    var answer2 = {...this.state.challenges}
    answer2[2].response = e.target.value;
    this.setState({answer2})
  }

  handleAnswer2Blur(e) {
    var error2 = {...this.state.challenges}
    if (e.target.value === undefined || e.target.value.length === 0) {
      error2[2].responseError = true;
      this.setState({error2})
    } else {
      error2[2].responseError = false;
      this.setState({error2})
    }
  }

  handleChangePwd = async () => {
    this.setState({
      afterPwdSubmit: true,
      isSaving: true
    })
    const data = {
      "currentPassword": this.state.oldPassword,
      "newPassword": this.state.newPassword,
      "confirmPassword": this.state.confirmPassword
    }

    let self = this;
    let url = hostUrl + `/IDSelfService/webapi/authapi/users/${this.state.userName}/password`
    console.log(url);

    const res = await this._apiService.updatePassword(this.state.userName, data);
    if (!res || res.error) {
      window.scrollTo(0, 0);
      // console.log(error.response)
      self.setState({
        apiMessage: 'An error has occurred',
        errorMessage: 'apiError',
        afterPwdSubmit: false,
        isSaving: false
      })
    } else {
      window.scrollTo(0, 0);
      self.setState({
        errorMessage: 'passwordChange',
        afterPwdSubmit: false,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        isPwdChecked: false,
        isSaving: false
      })
    }
  }

  handleQuestionChange = async () => {
    this.setState({
      afterQuestionSubmit: true,
      isQuestionSaving: true
    })
    const data = {
      "challengeQuestions": [
        {
          "name": this.state.challenges[0].challenge,
          "value": this.state.challenges[0].response
        },
        {
          "name": this.state.challenges[1].challenge,
          "value": this.state.challenges[1].response
        },
        {
          "name": this.state.challenges[2].challenge,
          "value": this.state.challenges[2].response
        }
      ]
    }

    let self = this;
    let url = hostUrl + `/IDSelfService/webapi/authapi/users/${this.state.userName}/challengeQuestions`
    console.log(url);

    const res = await this._apiService.updateQuestion(this.state.userName, data);
    if (!res || res.error) {
      window.scrollTo(0, 0);
      // console.log(error.response)
      self.setState({
        apiMessage: 'An error has occurred',
        errorMessage: 'apiError',
        afterQuestionSubmit: false,
        isQuestionSaving: false,
      })
    } else {
      window.scrollTo(0, 0);
      self.setState({
        errorMessage: 'questionChange',
        afterQuestionSubmit: false,
        isQuestionChecked: false,
        isQuestionSaving: false,
        challenges: [
          {
            challenge: '',
            response: '',
            responseError: false
          },
          {
            challenge: '',
            response: '',
            responseError: false
          },
          {
            challenge: '',
            response: '',
            responseError: false
          }
        ]
      })
    }
  }

  render() {

    let isPwdPass = this.state.newPassword !== undefined &&
      this.state.newPassword.length !== 0 &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(this.state.newPassword) &&
      !this.state.newPassword.includes(this.state.firstName) &&
      !this.state.newPassword.includes(this.state.lastName) &&
      !this.state.newPassword.includes(this.state.userName) &&
      /[A-Za-z]/.test(this.state.newPassword.substring(0, 1));

    let isSaveBtnWork = this.state.newPassword.length === 0 || this.state.oldPassword.length === 0 || this.state.confirmPassword.length === 0;

    let message = null;

    switch (this.state.errorMessage) {
      case 'passwordChange':
        message = <Row lg='12' className='pass-banner' style={{paddingLeft: '20px'}}><p
          style={{paddingTop: '10px', paddingBottom: '10px'}}>Your password has been changed successfully.</p></Row>;
        break;
      case 'questionChange':
        message = <Row lg='12' className='pass-banner' style={{paddingLeft: '20px'}}><p
          style={{paddingTop: '10px', paddingBottom: '10px'}}>Your security questions and answers have been changed
          successfully.</p></Row>;
        break;
      case 'apiError':
        message = <Row lg='12' className='error-banner' style={{paddingLeft: '20px'}}><p
          style={{paddingTop: '10px', paddingBottom: '10px'}}>{this.state.apiMessage}</p></Row>;
        break;
      default:
        message = null;
    }

    return (
      <Container className={"container-design"}>
        <h4>My Profile</h4>
        <hr/>
        {message}
        {
          this.state.isLoaderShow ? <div className={'text-center'}><Spin className='mt-50 custom-loading'/></div> :
            <>
              <Row>
                <Col md='6' xs='12'>
                  <Row>
                    <Col md='12'>
                      <h5>Basic Information</h5>
                    </Col>
                    <Col md='4' xs='5' className="ml-4">
                      <Form.Label>
                        First Name
                      </Form.Label>
                    </Col>
                    <Col md='7' xs='6'>
                      <Form.Label>
                        {this.state.firstName}
                      </Form.Label>
                    </Col>
                    <Col md='4' xs='5' className="ml-4">
                      <Form.Label>
                        Middle Name
                      </Form.Label>
                    </Col>
                    <Col md='7' xs='6'>
                      <Form.Label>
                        {this.state.middleName}
                      </Form.Label>
                    </Col>
                    <Col md='4' xs='5' className="ml-4">
                      <Form.Label>
                        Last Name
                      </Form.Label>
                    </Col>
                    <Col md='7' xs='6'>
                      <Form.Label>
                        {this.state.lastName}
                      </Form.Label>
                    </Col>
                    <Col md='4' xs='5' className="ml-4">
                      <Form.Label>
                        E-mail
                      </Form.Label>
                    </Col>
                    <Col md='7' xs='6'>
                      <Form.Label>
                        {
                          this.state.email === "no-email@fdny.nyc.gov" ?
                            '' : this.state.email
                        }
                      </Form.Label>
                    </Col>
                    <Col md='4' xs='5' className="ml-4">
                      <Form.Label>
                        Date of Birth
                      </Form.Label>
                    </Col>
                    <Col md='7' xs='6'>
                      <Form.Label>
                        {this.state.DOB}
                      </Form.Label>
                    </Col>
                    <Col md='4' xs='5' className="ml-4">
                      <Form.Label>
                        SSN
                      </Form.Label>
                    </Col>
                    <Col md='7' xs='6'>
                      <Form.Label>
                        {this.state.SSN}
                      </Form.Label>
                    </Col>
                    <Col md='12' className='blank-height'/>
                  </Row>

                  <Col md='12' className="mt-3">
                    <Form.Check
                      custom
                      type='checkbox'
                      id={'custom-1'}
                      checked={this.state.isPwdChecked}
                      onChange={this.handlePwdCheckbox}
                      label='Change Password'
                    />
                  </Col>
                  {
                    this.state.isPwdChecked ?
                      <Row className='ml-1 padding-box border-box mt-2'>
                        <Col md='5'>
                          <Form.Label className=''>
                            <span className='star-color'>*</span>
                            User Login
                          </Form.Label>
                        </Col>
                        <Col md='7'>
                          <Form.Label>
                            {this.state.userName}
                          </Form.Label>
                        </Col>
                        <Col md='5'>
                          <Form.Label className=''>
                            <span className='star-color'>*</span>
                            Current Password
                          </Form.Label>
                        </Col>
                        <Col md='7'>
                          <Form.Control
                            type='password'
                            value={this.state.oldPassword}
                            onChange={this.handleOldPwdInput}
                            // onKeyDown={this.handleOldCaps}
                            // onKeyUp={this.handleOldCaps}
                          />
                          {/* <span className='password-mask'
                      onMouseDown={this.handleOldMask}
                      onMouseUp={this.handleOldMask}
                      style={{ fontSize: '12px', fontWeight: 'bold', color: 'grey' }}
                    >
                      show
                    </span> */}
                        </Col>
                        {/* {
                    this.state.isOldCaps ?
                      <Col lg='5' md='5' sm='5' xs='5' style={{ paddingLeft: '45px', marginTop: '-10px', fontStyle: 'italic', fontSize: '12px', color: '#CC0000' }}>
                        Caps Lock on
                      </Col>
                      :
                      <Col lg='5' md='5' sm='5' xs='5'></Col>
                  } */}
                        <Col md='5'/>
                        {
                          this.state.oldPassword === undefined || this.state.oldPassword.length === 0 ?
                            <Col md='7' className='error-text padding-bottom'>Current Password is required.</Col>
                            :
                            <Col md='7' className='padding-bottom' style={{visibility: 'hidden', fontSize: '12px'}}>123</Col>
                        }
                        <Col md='5'>
                          <Form.Label className=''>
                            <span className='star-color'>*</span>
                            New Password
                          </Form.Label>
                        </Col>
                        <Col md='7'>
                          <Form.Control
                            type='password'
                            value={this.state.newPassword}
                            onChange={this.handleNewPwdInput}
                            // onKeyDown={this.handleNewCaps}
                            // onKeyUp={this.handleNewCaps}
                          />
                          {/* <span className='password-mask'
                      onMouseDown={this.handleNewMask}
                      onMouseUp={this.handleNewMask}
                      style={{ fontSize: '12px', fontWeight: 'bold', color: 'grey' }}
                    >
                      show
                    </span> */}
                        </Col>
                        {/* {
                    this.state.isNewCaps
                      ?
                      <Col lg='5' md='5' sm='5' xs='5' style={{ paddingLeft: '45px', marginTop: '-10px', fontStyle: 'italic', fontSize: '12px', color: '#CC0000' }}>
                        Caps Lock on
                      </Col>
                      :
                      <Col lg='5' md='5' sm='5' xs='5'></Col>
                  } */}
                        <Col md='5'/>
                        {
                          isPwdPass
                            ?
                            <Col md='7' className='padding-bottom' style={{visibility: 'hidden', fontSize: '12px'}}>123</Col>
                            :
                            <Col md='7' className='error-text padding-bottom'>Please follow the password policy.</Col>
                        }
                        <Col md='5'>
                          <Form.Label className=''>
                            <span className='star-color'>*</span>
                            Confirm Password
                          </Form.Label>
                        </Col>
                        <Col md='7'>
                          <Form.Control
                            type='password'
                            value={this.state.confirmPassword}
                            onChange={this.handleConfirmPwdInput}
                            // onKeyDown={this.handleConfirmCaps}
                            // onKeyUp={this.handleConfirmCaps}
                          />
                          {/* <span className='password-mask'
                      onMouseDown={this.handleConfirmMask}
                      onMouseUp={this.handleConfirmMask}
                      style={{ fontSize: '12px', fontWeight: 'bold', color: 'grey' }}
                    >
                      show
                    </span> */}
                        </Col>
                        {/* {
                    this.state.isConfirmCaps ?
                      <Col lg='5' md='5' sm='5' xs='5' style={{ paddingLeft: '45px', marginTop: '-10px', fontStyle: 'italic', fontSize: '12px', color: '#CC0000' }}>
                        Caps Lock on
                      </Col>
                      :
                      <Col lg='5' md='5' sm='5' xs='5'></Col>
                  } */}
                        <Col md='5'/>
                        {
                          this.state.confirmPassword !== this.state.newPassword
                            ?
                            <Col md='7' className='error-text padding-bottom'>Passwords don't match.</Col>
                            :
                            <Col md='7' className='padding-bottom' style={{visibility: 'hidden', fontSize: '12px'}}>123</Col>
                        }
                        <Col md='12' className='ml-4 text-right'>
                          <button className="btn btn-success btn-sm" onClick={this.handleChangePwd} disabled={isSaveBtnWork}>
                            {this.state.isSaving ? <div className="spinner-border spinner-border-sm text-dark"/> : null}
                            {' '}Save Changes
                          </button>
                        </Col>
                      </Row>
                      : null
                  }
                </Col>
                <Col md='6' xs='12'>
                  <PasswordPolicy
                    password={this.state.newPassword}
                    familyName={this.state.lastName}
                    givenName={this.state.firstName}
                    userName={this.state.userName}
                    style={this.style.listitem}
                  />
                </Col>
              </Row>
              <Row>
                <Col md='12' className="ml-3 mt-3">
                  <Form.Check
                    custom
                    type='checkbox'
                    id={'custom-2'}
                    checked={this.state.isQuestionChecked}
                    onChange={this.handleQuestionCheckbox}
                    label='Change Security Questions and Answers'
                  />
                </Col>
                {
                  this.state.isQuestionChecked ?
                    <Col md='12' className="mt-2">
                      <Row className='ml-1 mr-1 border-box text-padding-top'>
                        <Col lg='2' md='4'>
                          <Form.Label className=''>Question 1</Form.Label>
                        </Col>
                        <Col lg='4' md='6'>
                          <Form.Control as="select" onChange={this.handleSelect0Change} value={this.state.challenges[0].challenge}>
                            {
                              this.state.allChallengeQuestions
                                .filter(item => item !== this.state.challenges[1].challenge && item !== this.state.challenges[2].challenge)
                                .map(item => <option>{item}</option>)
                            }
                          </Form.Control>
                        </Col>
                        <Col lg='2' md='4'>
                          <Form.Label>
                            <span className='star-color'>*</span>
                            Answer 1
                          </Form.Label>
                        </Col>
                        <Col lg='4' md='6'>
                          <Form.Control
                            value={this.state.challenges[0].response}
                            onChange={this.handleAnswer0InputChange}
                            onBlur={this.handleAnswer0Blur}
                          />
                        </Col>
                        <Col lg='8'/>
                        {
                          this.state.challenges[0].responseError ?
                            <Col lg='4' className='error-text padding-bottom'>Answer is required.</Col>
                            :
                            <Col lg='4' className='padding-bottom'
                                 style={{visibility: 'hidden', fontSize: '12px'}}>123</Col>
                        }

                        <Col lg='2' md='4'>
                          <Form.Label className=''>Question 2</Form.Label>
                        </Col>
                        <Col lg='4' md='6'>
                          <Form.Control as="select" onChange={this.handleSelect1Change} value={this.state.challenges[1].challenge}>
                            {
                              this.state.allChallengeQuestions
                                .filter(item => item !== this.state.challenges[0].challenge && item !== this.state.challenges[2].challenge)
                                .map(item => <option>{item}</option>)
                            }
                          </Form.Control>
                        </Col>
                        <Col lg='2' md='4'>
                          <Form.Label>
                            <span className='star-color'>*</span>
                            Answer 2
                          </Form.Label>
                        </Col>
                        <Col lg='4' md='6'>
                          <Form.Control
                            value={this.state.challenges[1].response}
                            onChange={this.handleAnswer1InputChange}
                            onBlur={this.handleAnswer1Blur}
                          />
                        </Col>
                        <Col lg='8'/>
                        {
                          this.state.challenges[1].responseError ?
                            <Col lg='4' className='error-text padding-bottom'>Answer is required.</Col>
                            :
                            <Col lg='4' className='padding-bottom'
                                 style={{visibility: 'hidden', fontSize: '12px'}}>123</Col>
                        }

                        <Col lg='2' md='4'>
                          <Form.Label className=''>Question 3</Form.Label>
                        </Col>
                        <Col lg='4' md='6'>
                          <Form.Control as="select" onChange={this.handleSelect2Change} value={this.state.challenges[2].challenge}>
                            {
                              this.state.allChallengeQuestions
                                .filter(item => item !== this.state.challenges[0].challenge && item !== this.state.challenges[1].challenge)
                                .map(item => <option>{item}</option>)
                            }
                          </Form.Control>
                        </Col>
                        <Col lg='2' md='4'>
                          <Form.Label>
                            <span className='star-color'>*</span>
                            Answer 3
                          </Form.Label>
                        </Col>
                        <Col lg='4' md='6'>
                          <Form.Control
                            value={this.state.challenges[2].response}
                            onChange={this.handleAnswer2InputChange}
                            onBlur={this.handleAnswer2Blur}
                          />
                        </Col>
                        <Col lg='8'/>
                        {
                          this.state.challenges[2].responseError ?
                            <Col lg='4' className='error-text padding-bottom'>Answer is required.</Col>
                            :
                            <Col lg='4' className='padding-bottom' style={{visibility: 'hidden', fontSize: '12px'}}>123</Col>
                        }
                        <Col md='12'>
                          <p className='text-left error-text'>Current answers cannot be displayed due to security reasons.</p>
                          <div className="text-right mb-4">
                            <button className="btn btn-success btn-sm" onClick={this.handleQuestionChange}
                              disabled={this.state.challenges[0].response.length === 0 || this.state.challenges[1].response.length === 0 || this.state.challenges[2].response.length === 0}
                            >
                              {this.state.isQuestionSaving ? <div className="spinner-border spinner-border-sm text-dark"/> : null}
                              {' '}Save Changes
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    :
                    null
                }
              </Row>
            </>
        }
      </Container>
    );
  }
}

export default MyProfile1;
