import React, {Fragment, Component} from 'react';
import Spin from 'antd/lib/spin'
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
          </h5>

            {
              isLoading ? <div className={'text-center'}><Spin className='mt-50 custom-loading'/></div> :
                <>
                  <Row className='pl-3 pr-3'>
                    <Col lg='6' md='6' sm='12' xs='12'>

                      <Form as={Row}  >
                        <Form.Label column md="4">
                          First Name
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                              value={firstName}
                              name="firstName"
                              onChange={this.handleChange}
                              size="sm"
                              readOnly
                              plaintext
                          />
                        </Col>
                      </Form>

                      <Form as={Row}>
                        <Form.Label column md="4">
                          Middle Name
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                              value={middleName}
                              name="middleName"
                              onChange={this.handleChange}
                              size="sm"
                              readOnly
                              plaintext
                          />
                        </Col>
                      </Form>

                      <Form as={Row} >
                        <Form.Label column md="4">
                          Last Name
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                              value={lastName}
                              name="lastName"
                              onChange={this.handleChange}
                              size="sm"
                              readOnly
                              plaintext
                          />
                        </Col>
                      </Form>

                      <Form as={Row} >
                        <Form.Label column md="4">
                          E-mail
                        </Form.Label>
                        <Col md="8">
                          <Form.Control
                              value={email === "no-email@fdny.nyc.gov" ? '' : email}
                              name="lastName"
                              onChange={this.handleChange}
                              size="sm"
                              readOnly
                              plaintext
                          />
                        </Col>
                      </Form>

                      <Form as={Row} style={{alignItems: 'center'}} >
                        <Form.Label column md="4">
                          Date of Birth
                        </Form.Label>
                        <Col md="8">
                          {
                            isEditable ?
                              <DatePicker
                                  value={(DOB && moment(DOB).format("MM/DD/YYYY")) || null}
                                  dateFormat="MM/DD/YYYY"
                                  onChange={(date) => this.handleChange({target: {name: 'DOB', value: date}})}
                                  className='form-control form-control-sm'
                              /> :
                              <span style={{color: '#212529'}}>{DOB && moment(DOB).format("MM/DD/YYYY")}</span>
                          }
                        </Col>
                      </Form>

                      <Form as={Row} style={{alignItems: 'center'}}>
                        <Form.Label column md="4">
                          SSN
                        </Form.Label>
                        <Col md="8">
                          {
                            isEditable ?
                                <DatePicker
                                    value={(SSN && moment(SSN).format("MM/DD/YYYY")) || null}
                                    dateFormat="MM/DD/YYYY"
                                    onChange={(date) => this.handleChange({target: {name: 'SSN', value: date}})}
                                    className='form-control form-control-sm'
                                /> :
                                <span style={{color: '#212529'}}>{SSN && moment(SSN).format("MM/DD/YYYY")}</span>
                          }
                        </Col>
                      </Form>

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

                </>
            }
        </Container>
      </Fragment>
    )
  }
}

export default MyProfile1;
