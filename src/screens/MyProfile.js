import React, {Fragment, Component} from 'react';
import {Icon} from "antd";
import Spin from 'antd/lib/spin'
import {Link} from 'react-router-dom'
import message from "antd/lib/message";
import moment from "moment";
import DatePicker from "react-datepicker";
import {Form, Container, Row, Col} from 'react-bootstrap';

import "react-datepicker/dist/react-datepicker.css";
import {ApiService} from "../services/ApiService";

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
      isLoading: false,
      isSaving: false,
      isEditable: false,
      errorMessage: '',
      apiMessage: ''
    };
  }

  async componentDidMount() {
    document.title = "My Profile";
    this.setState({
      isLoading: true
    });

    setTimeout(async () => {
      const data = await this._apiService.getUserInformation()
      if (!data || data.error) {
        window.scrollTo(0, 0);
        this.setState({
          apiMessage: data && data.error,
          errorMessage: 'apiError',
          isLoading: false
        });
        return message.error('something is wrong! please try again');
      } else {
        window.scrollTo(0, 0);
        const {firstName, lastName, middleName, email, dob, last4ofSSN, userLogin, userId} = data;
        this.setState({
          firstName, lastName, middleName, email, DOB: dob, SSN: last4ofSSN, userName: userLogin, id: userId,
          isLoading: false
        });
      }
    }, 1000)

  }

  handleChange = (e) => {
    const {name, value} = e.target
    this.setState({
      [name]: value
    })
  }

  render() {
    const {firstName, lastName, middleName, email, DOB, SSN, apiMessage, errorMessage, isEditable, isSaving, isLoading} = this.state;
    return (
      <Fragment>
        <Container className={"container-design"}>
          <h4 className="text-left">
            My Profile
          </h4>
          <hr/>
          { errorMessage === 'apiError' &&
            <Row lg='12' className='error-banner pl-3'>
              <p className='pt-1 pb-1'> {apiMessage}</p>
            </Row>
          }
          <h5>
            Basic Information {' '}
            <Icon className="cursor-pointer text-info" type={isEditable ? 'eye' : 'edit'} theme="outlined" onClick={() => this.setState({ isEditable: !isEditable })}/>
          </h5>

            {
              isLoading ? <div className={'text-center'}><Spin className='mt-50 custom-loading'/></div> :
                <>
                  <Row className='pl-3 pr-3'>
                    <Col lg='6' md='6' sm='12' xs='12'>
                      <Row className='mt-3'>
                        <Col md='3' xs='12'>
                          <p className='text-left'>
                            First Name :
                          </p>
                        </Col>
                        <Col md='7' xs='12'>
                          {
                            !isEditable ?
                              <label>{firstName}</label>
                              : <Form.Control
                                type="text" placeholder="First Name" name='firstName'
                                value={firstName || ""} onChange={this.handleChange}
                              />
                          }
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col md='3' xs='12'>
                          <p className='text-left'>
                            Middle Name :
                          </p>
                        </Col>
                        <Col md='7' xs='12'>
                          {
                            !isEditable ?
                              <label>{middleName}</label>
                              : <Form.Control
                                type="text" placeholder="Middle Name" name='middleName'
                                value={middleName || ""} onChange={this.handleChange}
                              />
                          }
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col md='3' xs='12'>
                          <p className='text-left'>
                            Last Name :
                          </p>
                        </Col>
                        <Col md='7' xs='12'>
                          {
                            !isEditable ?
                              <label>{lastName}</label>
                              : <Form.Control
                                type="text" placeholder="Last Name" name='lastName'
                                value={lastName || ""} onChange={this.handleChange}
                              />
                          }
                        </Col>
                      </Row>
                    </Col>
                    <Col lg='6' md='6' sm='12' xs='12'>
                      <Row className='mt-3'>
                        <Col md='3' xs='12'>
                          <p className='text-left'>
                            E-mail :
                          </p>
                        </Col>
                        <Col md='7' xs='12'>
                          {
                            !isEditable ?
                              <label>{email === "no-email@fdny.nyc.gov" ? '' : email}</label>
                              : <Form.Control
                                type="text" placeholder="Email" name='email'
                                value={email || ""} onChange={this.handleChange}
                              />
                          }
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col md='3' xs='12'>
                          <p className='text-left'>
                            Date of Birth :
                          </p>
                        </Col>
                        <Col md='7' xs='12'>
                          {
                            !isEditable ?
                              <label>{DOB}</label>
                              : <DatePicker
                                value={(DOB && moment(DOB).format("MM/DD/YYYY")) || null} dateFormat="MM/DD/YYYY"
                                onChange={(date) => this.handleChange({target: {name: 'DOB', value: date}})}
                                className='form-control'
                              />
                          }
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col md='3' xs='12'>
                          <p className='text-left'>
                            SSN :
                          </p>
                        </Col>
                        <Col md='7' xs='12'>
                          {
                            !isEditable ?
                              <label>{SSN}</label>
                              : <DatePicker
                                value={(SSN && moment(SSN).format("MM/DD/YYYY")) || null} dateFormat="MM/DD/YYYY"
                                onChange={(date) => this.handleChange({target: {name: 'SSN', value: date}})}
                                className='form-control'
                              />
                          }
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {
                    isEditable && (
                      <div className="text-right mt-5">
                        <button className="btn btn-danger btn-sm"
                                onClick={() => this.setState({isEditable: !isEditable})}>Cancel
                        </button>
                        &nbsp;&nbsp;
                        <button className="btn btn-success btn-sm" onClick={() => {
                        }} disabled={isSaving}>
                          {isSaving ? <div className="spinner-border spinner-border-sm text-dark"/> : null}
                          {' '}Save
                        </button>
                      </div>
                    )
                  }
                  <Row>
                    <Col md={12} className='blank-height'/>
                    <Col md={12} className='margin-top'>
                      <Link to={'/SelfService/auth/change-password'}>Change Password</Link>
                    </Col>
                    <Col md={12} className='margin-top'>
                      <Link to={'/SelfService/auth/security-question'}>Change Security Questions and Answers</Link>
                    </Col>
                  </Row>
                </>
            }
        </Container>
      </Fragment>
    )
  }
}

export default MyProfile1;
