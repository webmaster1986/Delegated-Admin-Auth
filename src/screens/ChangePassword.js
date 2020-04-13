import React, {Component} from 'react';
import {Row, Col, Form, Container} from 'react-bootstrap';
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import queryString from "query-string"
import {ApiService, getLoginUser} from "../services/ApiService";
import SecurityQuestions from "./SecurityQuestions";
import PasswordPolicy from '../components/PasswordPolicy'

class ChangePassword extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            firstName: '',
            lastName: '',
            oldPassword: '',
            oldPasswordError: false,
            newPassword: '',
            confirmPassword: '',
            isLoaderShow: false,
            errorMessage: '',
            apiMessage: '',
            isPasswordExpired: false,
            isSaving: false,
            requireChallengeSet: false,
            user: getLoginUser()
        }
        this.style = {listitem: {paddingBottom: '0', paddingTop: '0'}}
    }

    async componentDidMount() {
        document.title = "My Profile";

        const values = queryString.parse(this.props.location.search)
        console.log(values.code) // code=expired will be added to url if the user is redirected to this page on password expiration
        if (values.code !== undefined && values.code === 'expired') {
            this.setState({
                isPasswordExpired: true
            })
        }

        this.setState({
            isLoaderShow: true
        });

        const data = await this._apiService.getUserInformation()
        if (!data || data.error) {
            window.scrollTo(0, 0);
            this.setState({
                apiMessage: data && data.error,
                errorMessage: 'apiError',
                isLoaderShow: false
            });
            return message.error('An error has occurred');
        } else {
            window.scrollTo(0, 0);
            const {firstName, lastName, middleName, email, dob, last4ofSSN, userLogin, userId, challengeQuestions} = data;
            this.setState({
                firstName, lastName, middleName, email, dob, last4ofSSN, userLogin, userId,
                isLoaderShow: false
            }, () => {
                if (!(challengeQuestions && challengeQuestions.length)) {
                    this.setState({
                        requireChallengeSet: true,
                        errorMessage: 'setChallengeFirst'
                    })
                }
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleOldPwdBlur = (e) => {
        this.setState({
            oldPasswordError: !e.target.value
        })
    }

    handleSaveBtnClick = async () => {
        const {oldPassword, newPassword, confirmPassword, userLogin} = this.state
        this.setState({
            isSaving: true
        })
        const data = {
            currentPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        }
        const res = await this._apiService.updatePassword(userLogin, data)
        if (!res || res.error) {
            window.scrollTo(0, 0);
            let errMessage = 'An error has occurred.'
            if(res && res.errorData && res.errorData.response && res.errorData.response.data && res.errorData.response.data.message) {
                errMessage = res.errorData.response.data.message
            }
            this.setState({
                apiMessage: errMessage,
                errorMessage: 'apiError',
                isSaving: false
            });
            // return message.error('something is wrong! please try again');
        } else {
            const url = this.getBackUrl()
            if(url) {
                window.location.href = url
            } else {
                window.scrollTo(0, 0);
                this.setState({
                    currentPassword: "", newPassword: "", confirmPassword: "", oldPassword: "",
                    isSaving: false, errorMessage: 'pass',
                })
                this.props.history.push('/SelfService/auth/success')
                // return message.success('password updated successfully');
            }
        }
    }

    isSaveBtnEnable = () => {
        const {oldPassword, newPassword, confirmPassword} = this.state
        return !(newPassword && oldPassword && confirmPassword) || confirmPassword !== newPassword;
    }

    checkErr = () => {
        const {errorMessage, isPasswordExpired, apiMessage} = this.state
        let message = null;
        let expiredMessageDisplayed = false;
        switch (errorMessage) {
            case 'apiError':
                isPasswordExpired === false
                    ? message = <Row className='error-banner pl-5'><p className='mt-3 mb-3'>{apiMessage}</p></Row>
                    : message =
                        <Row className='error-banner pl-5'><p className='mt-3 mb-3'>Your password has expired and must
                            be changed before you can continue.<br/>{apiMessage}</p></Row>
                expiredMessageDisplayed = true;
                break;
            case 'pass':
                message = <Row className='pass-banner pl-5'><p className='mt-3 mb-3'>Your password has been changed
                    successfully. Please <a
                        href={`/oamsso/logout.html?end_url=/SelfService/unauth/logout`}>logout</a> and login to the
                    application again.</p></Row>
                break;
            case 'questionChange':
                message = <Row className='pass-banner pl-5'><p className='mt-3 mb-3'>
                    Security Questions and Answers updated successfully. Please change password.</p></Row>;
                break;
            default:
                message = null;
        }
        let expiredMessage = null;
        if (isPasswordExpired && !expiredMessageDisplayed) {
            expiredMessage =
                <Row className='error-banner pl-5'><p className='mt-2 mb-2'>Your password has expired and must be
                    changed before you can continue.</p></Row>
        }
        return {
            message, expiredMessage
        }
    }

    handleView = () => {
        this.setState({
            requireChallengeSet: false,
            errorMessage: "questionChange"
        })
    }

    getBackUrl = () => {
        const {location} = this.props
        let url = ""
        const urlObj = queryString.parse(location.search);
        if(urlObj && urlObj.backUrl){

            // const array = Object.keys(urlObj).map(x => x)
            // const data = []
            // array.forEach(x => {
            //     if(!x) {
            //         return
            //     }
            //     if(x === "backUrl") {
            //         data.push(urlObj[x])
            //     } else {
            //         data.push(`?${x}=${urlObj[x]}`)
            //     }
            // })

            url = `${urlObj.backUrl}${urlObj.checksum ? `?checksum=${urlObj.checksum}` : "" }`
        }
        return url
    }

    render()
    {
        const {errorMessage, confirmPassword, newPassword, oldPassword, oldPasswordError, firstName, lastName, userLogin, isLoaderShow, requireChallengeSet, isPasswordExpired} = this.state

        let isPwdPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@^$!%*?&])[A-Za-z\d$@^#$!%*?&]{8,}/.test(newPassword) &&
            !newPassword.includes(userLogin) &&
            /[A-Za-z]/.test(newPassword.substring(0, 1));

        let message, expiredMessage = null;
        if (errorMessage || isPasswordExpired) {
            const err = this.checkErr()
            message = err && err.message
            expiredMessage = err && err.expiredMessage
        }

        return (
            <>
                {
                    requireChallengeSet ?
                        <SecurityQuestions
                            handleView={this.handleView}
                            isChangePassword={true}
                        /> :
                        <Container className={"container-design"}>
                            <h4 className="text-left">Change Password</h4>
                            <hr/>
                            {expiredMessage}
                            {message}
                            {
                                isLoaderShow ?
                                    <div className={'text-center'}><Spin className='mt-50 custom-loading'/></div> :
                                    <>
                                        <Row>
                                            <Col md={6} xs={12}>

                                                <Form as={Row}>
                                                    <Form.Label column md={4} xs={12}>
                                                        User Login
                                                    </Form.Label>
                                                    <Col md={8} xs={12}>
                                                        <Form.Control
                                                            value={userLogin || ""}
                                                            size="sm"
                                                            plaintext
                                                            readOnly
                                                        />
                                                    </Col>
                                                </Form>

                                                <Form as={Row} className="pb-10-px">
                                                    <Form.Label column md={4} xs={12}>
                                                        <span className='star-color'>*</span>Current Password
                                                    </Form.Label>
                                                    <Col md={5} xs={12}>
                                                        <Form.Control
                                                            type="password"
                                                            placeholder=""
                                                            value={oldPassword}
                                                            name="oldPassword"
                                                            onChange={this.handleChange}
                                                            onBlur={this.handleOldPwdBlur}
                                                            size="sm"
                                                        />
                                                        <span
                                                            className='error-text'>{oldPasswordError && "Current Password is required."}</span>
                                                    </Col>
                                                </Form>
                                                <Form as={Row} className="pb-10-px">
                                                    <Form.Label column md={4} xs={12}>
                                                        <span className='star-color'>*</span>New Password
                                                    </Form.Label>
                                                    <Col md={5} xs={12}>
                                                        <Form.Control
                                                            type="password"
                                                            placeholder=""
                                                            value={newPassword}
                                                            name="newPassword"
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                        />
                                                        <span
                                                            className='error-text'>{newPassword && !isPwdPass && "Please follow the password policy."}</span>
                                                    </Col>
                                                </Form>
                                                <Form as={Row} className="pb-10-px">
                                                    <Form.Label column md={4} xs={12}>
                                                        <span className='star-color'>*</span>Confirm Password
                                                    </Form.Label>
                                                    <Col md={5} xs={12}>
                                                        <Form.Control
                                                            type="password"
                                                            placeholder=""
                                                            value={confirmPassword}
                                                            name="confirmPassword"
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                        />
                                                        <span
                                                            className='error-text'>{confirmPassword !== newPassword && "Passwords do not match."}</span>
                                                    </Col>
                                                </Form>

                                                <Form as={Row} className="pb-10-px">
                                                    <Form.Label column md={4} xs={12}/>
                                                    <Col md={5} xs={12}>
                                                        <div className="text-right mt-5-p">
                                                            <button
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() => this.props.history.push('/SelfService/auth/my-profile')}
                                                            >
                                                                Cancel
                                                            </button> &nbsp;&nbsp;
                                                            <button className="btn btn-success btn-sm"
                                                                    onClick={() => this.handleSaveBtnClick()}
                                                                    disabled={this.isSaveBtnEnable()}>
                                                                {this.state.isSaving ? <div
                                                                    className="spinner-border spinner-border-sm text-dark"/> : null}
                                                                {' '}Save
                                                            </button>
                                                        </div>
                                                    </Col>
                                                </Form>
                                            </Col>
                                            <Col md={1}/>
                                            <Col md={5} xs={12} className='margin-bottom'>
                                                <PasswordPolicy
                                                    password={newPassword}
                                                    familyName={firstName || ''}
                                                    givenName={lastName || ''}
                                                    userName={userLogin || ""}
                                                    style={this.style.listitem}
                                                />
                                            </Col>
                                        </Row>

                                    </>
                            }
                        </Container>
                }
            </>
        )
    }
}

    export
    default
    ChangePassword;
