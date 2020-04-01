import React, { Component } from 'react';
import {Row, Col, Form, Container} from 'react-bootstrap';
import SecurityQuestions from "./SecurityQuestions";
import PasswordPolicy from '../components/PasswordPolicy'
import message from "antd/lib/message";
import {ApiService, getLoginUser} from "../services/ApiService";
import Spin from "antd/lib/spin";

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
		this.style = { listitem: { paddingBottom: '0', paddingTop: '0' } }
	}

	async componentDidMount() {
		document.title = "My Profile";
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
			return message.error('something is wrong! please try again');
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
		const {oldPassword, newPassword, confirmPassword, userName} = this.state
		this.setState({
			isSaving: true
		})
		const data = {
			currentPassword: oldPassword,
			newPassword: newPassword,
			confirmPassword: confirmPassword
		}
		const res = await this._apiService.updatePassword(userName, data)
		if (!res || res.error) {
			window.scrollTo(0, 0);
			this.setState({
				apiMessage: data && data.error,
				errorMessage: 'apiError',
				isSaving: false
			});
			// return message.error('something is wrong! please try again');
		} else {
			window.scrollTo(0, 0);
			this.setState({
				currentPassword: "", newPassword: "", confirmPassword: "", oldPassword: "",
				isSaving: false, errorMessage: 'pass',
			})
			// return message.success('password updated successfully');
		}
	}

	isSaveBtnEnable = () => {
		const {oldPassword, newPassword, confirmPassword } = this.state
		return !(newPassword && oldPassword && confirmPassword);
	}

	checkErr = () => {
		const {errorMessage, isPasswordExpired, apiMessage} = this.state
		let message = null;
		let expiredMessageDisplayed = false;
		switch (errorMessage) {
			case 'apiError':
				isPasswordExpired === false
					? message = <Row className='error-banner pl-5'><p className='mt-3 mb-3'>{apiMessage}</p></Row>
					: message = <Row className='error-banner pl-5'><p className='mt-3 mb-3'>Your password has expired and must be changed before you can continue.<br/>{apiMessage}</p></Row>
				expiredMessageDisplayed = true;
				break;
			case 'pass':
				message = <Row className='pass-banner pl-5'><p className='mt-3 mb-3'>Your password has been changed successfully. Please <a href={`/oamsso/logout.html?end_url=/SelfService/unauth/logout`}>logout</a> and login to the application again.</p></Row>
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
			expiredMessage = <Row className='error-banner pl-5'><p className='mt-2 mb-2'>Your password has expired and must be changed before you can continue.</p></Row>
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

	render() {
		const {errorMessage, confirmPassword, newPassword, oldPassword, user, oldPasswordError, firstName, lastName, userName, isLoaderShow, requireChallengeSet} = this.state
		let isPwdPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(newPassword) &&
			/[A-Za-z]/.test(newPassword.substring(0, 1));

		let message, expiredMessage = null;
		if (errorMessage) {
			const err = this.checkErr()
			message = err && err.message
			expiredMessage = err && err.expiredMessage
		}

		return (
			<>
				{
					requireChallengeSet ?
						<SecurityQuestions
							handleView={() => this.handleView()}
						/> :
						<Container className={"container-design"}>
							<h4 className="text-left">Change Password</h4>
							<hr/>
							{expiredMessage}
							{message}
							{
								isLoaderShow ? <div className={'text-center'}><Spin className='mt-50 custom-loading'/></div> :
									<>
										<Row>
											<Col md={6} xs={12}>
												<Row>
													<Col lg='5' md='5' sm='5' xs='5'>
														<Form.Label>
															<span className='text-danger'>*</span>
															User Login
														</Form.Label>
													</Col>
													<Col lg='7' md='7' sm='7' xs='7'>
														<p>{user.login || ""}</p>
													</Col>
												</Row>
												<Row>
													<Col md={5} xs={12}>
														<Form.Label>
															<span className='text-danger'>*</span>
															Current Password
														</Form.Label>
													</Col>
													<Col md={7} xs={12}>
														<Form.Control type="password" placeholder="" value={oldPassword} name="oldPassword"
																					onChange={this.handleChange} onBlur={this.handleOldPwdBlur}
														/>
													</Col>
													<Col lg='5' md='5' sm='5' xs='5'/>
													{
														oldPasswordError ?
															<Col md={7} xs={12} className='error-text padding-bottom'>Current Password is required.</Col> :
															<Col md={7} xs={12} className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
													}
												</Row>
												<Row>
													<Col md={5} xs={12}>
														<Form.Label>
															<span className='text-danger'>*</span>
															New Password
														</Form.Label>
													</Col>
													<Col md={7} xs={12}>
														<Form.Control type="password" placeholder="" value={newPassword} name="newPassword" onChange={this.handleChange} />
													</Col>
													<Col md={5} xs={12}/>
													{
														!newPassword ? <Col md={7} xs={12} className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
															:
															isPwdPass ?
																<Col md={7} xs={12} className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
																:
																<Col md={7} xs={12} className='error-text padding-bottom'>Please follow the password policy.</Col>
													}
												</Row>
												<Row>
													<Col md={5} xs={12}>
														<Form.Label>
															<span className='text-danger'>*</span>
															Confirm Password
														</Form.Label>
													</Col>
													<Col md={7} xs={12}>
														<Form.Control type="password" placeholder="" value={confirmPassword} name="confirmPassword" onChange={this.handleChange} />
													</Col>
													<Col md={5} xs={12}/>
													{
														confirmPassword !== newPassword ?
															<Col md={7} xs={12} className='error-text padding-bottom'>Passwords don't match.</Col> :
															<Col md={7} xs={12} className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
													}
												</Row>
											</Col>
											<Col md={6} xs={12} className='margin-bottom'>
												<PasswordPolicy
													password={newPassword}
													familyName={lastName}
													givenName={firstName}
													userName={userName}
													style={this.style.listitem}
												/>
											</Col>
										</Row>
										<Row className="ml-2">
											<button className="btn btn-success btn-sm" onClick={() => this.handleSaveBtnClick()} disabled={this.isSaveBtnEnable()}>
												{this.state.isSaving ? <div className="spinner-border spinner-border-sm text-dark"/> : null}
												{' '}Save
											</button>
										</Row>
									</>
							}
						</Container>
				}
			</>
		)
	}
}

export default ChangePassword;
