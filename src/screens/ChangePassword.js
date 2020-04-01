import React, { Fragment, Component } from 'react';
import { Spinner, Container, Row, Col, Form } from 'react-bootstrap';
import queryString from 'query-string'
import '../App.css';
import PasswordPolicy from '../components/PasswordPolicy'
import 'react-block-ui/style.css';
import message from "antd/lib/message";
import {ApiService} from "../services/ApiService";
import Spin from "antd/lib/spin";

const hostUrl = window.location.protocol+'//'+window.location.host;

class ChangePassword extends Component {
	_apiService = new ApiService();

	constructor(props) {
		super(props);
		this.state = {
			userName: '',
			familyName: '',
			givenName: '',
			id: '',
			oldPassword: '',
			oldPasswordError: false,
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
			requireChallengeSet: false,
			isPassShow: false,
			isLoaderShow: false,
			isSaving: false,
			isQuestionSaving: false,
			errorMessage: '',
			apiMessage: '',
			afterSubmit: false,
			afterQuestionSubmit: false,
			isPasswordExpired: false
		}

		this.handleOldPwdInput = this.handleOldPwdInput.bind(this);
		this.handleOldPwdBlur = this.handleOldPwdBlur.bind(this);
		this.handleNewPwdInput = this.handleNewPwdInput.bind(this);
		this.handleConfirmPwdInput = this.handleConfirmPwdInput.bind(this);
		this.handleSaveBtnClick = this.handleSaveBtnClick.bind(this);
		this.handleSelect0Change = this.handleSelect0Change.bind(this);
		this.handleAnswer0InputChange = this.handleAnswer0InputChange.bind(this);
		this.handleAnswer0Blur = this.handleAnswer0Blur.bind(this);
		this.handleSelect1Change = this.handleSelect1Change.bind(this);
		this.handleAnswer1InputChange = this.handleAnswer1InputChange.bind(this);
		this.handleAnswer1Blur = this.handleAnswer1Blur.bind(this);
		this.handleSelect2Change = this.handleSelect2Change.bind(this);
		this.handleAnswer2InputChange = this.handleAnswer2InputChange.bind(this);
		this.handleAnswer2Blur = this.handleAnswer2Blur.bind(this);
		this.handleChallengeSaveBtnClick = this.handleChallengeSaveBtnClick.bind(this);

		this.style = { listitem: { paddingBottom: '0', paddingTop: '0' } }
	}

	async componentDidMount() {
		document.title = "Change Password"

		const values = queryString.parse(this.props.location.search)
		console.log(values.code) // code=expired will be added to url if the user is redirected to this page on password expiration
		if (values.code !== undefined && values.code === 'expired') {
			this.setState({
				isPasswordExpired: true
			})
		}
		this.setState({
			isLoaderShow: true
		})

		var self = this;

		const data = await this._apiService.getUserInformation();
		if (!data || data.error) {
			window.scrollTo(0, 0);
			self.setState({
				apiMessage: data && data.error,
				errorMessage: 'apiError',
				isLoaderShow: false,
			})
		} else {
			self.setState({
				userName: data.userLogin,
				familyName: data.firstName,
				givenName: data.lastName,
				id: data.userId,
				isLoaderShow: false
			})
			console.log("response.data.challengeQuestions = "+ data.challengeQuestions)
			if (data.challengeQuestions === undefined || data.challengeQuestions.length === 0) {
				self.setState({
					requireChallengeSet: true
				})
				self.retrieveAllChallengeQuestions();
			}
			console.log(self.state);
		}
	}

	retrieveAllChallengeQuestions = async () => {
		var self = this;
		console.log ("In retrieveAllChallengeQuestions");
		if (self.state.requireChallengeSet === true) {
			this.setState({
				isLoaderShow: true
			})
			const data = await this._apiService.getChallengeQuestions();
			if (!data || data.error) {
				window.scrollTo(0, 0);
				self.setState({
					apiMessage: data && data.error,
					errorMessage: 'apiError',
					isLoaderShow: false
				})
			} else {
				self.setState({
					allChallengeQuestions: data.challengeQuestions,
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
					],
					isLoaderShow: false,
					errorMessage: 'setChallengeFirst'
				})
			}
		}
	}

	handleOldPwdInput(e) {
		this.setState({
			oldPassword: e.target.value
		})
	}

	handleOldPwdBlur(e) {
		if (e.target.value === undefined || e.target.value.length === 0) {
			this.setState({
				oldPasswordError: true
			})
		} else {
			this.setState({
				oldPasswordError: false
			})
		}
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

	handleSaveBtnClick = async () => {
		this.setState({
			isLoaderShow: true,
			isSaving: true,
			afterSubmit: true
		})
		const data = {
			"currentPassword": this.state.oldPassword,
			"newPassword": this.state.newPassword,
			"confirmPassword": this.state.confirmPassword
		}
		let self = this;
		let url = hostUrl+`/SelfService/webapi/authapi/users/${this.state.userName}/password`
		console.log(url);

		const result = await this._apiService.updatePassword(this.state.userName, data)
		if (!result || result.error) {
			window.scrollTo(0, 0);
			// console.log(error.response)
			self.setState({
				apiMessage: result && result.error,
				errorMessage: 'apiError',
				isLoaderShow: false,
				afterSubmit: false,
				isSaving: false
			})
		} else {
			window.scrollTo(0, 0);
			self.setState({
				isLoaderShow: false,
				errorMessage: 'pass',
				afterSubmit: false,
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
				isPasswordExpired: false,
				isSaving: false
			})
		}
	}

	handleSelect0Change(e) {
		var question0 = { ...this.state.challenges };
		question0[0].challenge = e.target.value;
		this.setState({ question0 })
	}

	handleAnswer0InputChange(e) {
		var answer0 = { ...this.state.challenges }
		answer0[0].response = e.target.value;
		this.setState({ answer0 })
	}

	handleAnswer0Blur(e) {
		var error0 = { ...this.state.challenges }
		if (e.target.value === undefined || e.target.value.length === 0) {
			error0[0].responseError = true;
			this.setState({ error0 })
		} else {
			error0[0].responseError = false;
			this.setState({ error0 })
		}
	}

	handleSelect1Change(e) {
		var question1 = { ...this.state.challenges };
		question1[1].challenge = e.target.value;
		this.setState({ question1 })
	}

	handleAnswer1InputChange(e) {
		var answer1 = { ...this.state.challenges }
		answer1[1].response = e.target.value;
		this.setState({ answer1 })
	}

	handleAnswer1Blur(e) {
		var error1 = { ...this.state.challenges }
		if (e.target.value === undefined || e.target.value.length === 0) {
			error1[1].responseError = true;
			this.setState({ error1 })
		} else {
			error1[1].responseError = false;
			this.setState({ error1 })
		}
	}

	handleSelect2Change(e) {
		var question2 = { ...this.state.challenges };
		question2[2].challenge = e.target.value;
		this.setState({ question2 })
	}

	handleAnswer2InputChange(e) {
		var answer2 = { ...this.state.challenges }
		answer2[2].response = e.target.value;
		this.setState({ answer2 })
	}

	handleAnswer2Blur(e) {
		var error2 = { ...this.state.challenges }
		if (e.target.value === undefined || e.target.value.length === 0) {
			error2[2].responseError = true;
			this.setState({ error2 })
		} else {
			error2[2].responseError = false;
			this.setState({ error2 })
		}
	}

	handleChallengeSaveBtnClick = async () => {
		this.setState({
			isLoaderShow: true,
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
		const result = await this._apiService.updateQuestion(this.state.userName, data)
		if (!result || result.error) {
			window.scrollTo(0, 0);
			// console.log(error.response)
			self.setState({
				apiMessage: result && result.error,
				errorMessage: 'apiError',
				isLoaderShow: false,
				afterQuestionSubmit: false,
				requireChallengeSet: true,
				isQuestionSaving: false
			})
		} else {
			window.scrollTo(0, 0);
			self.setState({
				isLoaderShow: false,
				errorMessage: 'questionChange',
				afterQuestionSubmit: false,
				requireChallengeSet: false,
				isQuestionSaving: false
			})
		}
	}

	render() {

		let isPwdPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(this.state.newPassword) &&
			// !this.state.newPassword.includes(this.state.userName) &&
			/[A-Za-z]/.test(this.state.newPassword.substring(0, 1));

		let isSaveBtnWork = this.state.oldPassword === undefined || this.state.oldPassword.length === 0 ||
			!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@$!%*?&])[A-Za-z\d$@#$!%*?&]{8,}/.test(this.state.newPassword) ||
			this.state.newPassword.toUpperCase().includes(this.state.userName) ||
			this.state.newPassword.toUpperCase().includes(this.state.familyName) ||
			this.state.newPassword.toUpperCase().includes(this.state.givenName) ||
			!/[A-Za-z]/.test(this.state.newPassword.substring(0, 1)) ||
			this.state.confirmPassword !== this.state.newPassword;

		let message = null;
		let expiredMessageDisplayed = false;
		switch (this.state.errorMessage) {
			case 'apiError':
					this.state.isPasswordExpired === false 
						? message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px', paddingBottom: '10px' }}>{this.state.apiMessage}</p></Row>
						: message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px', paddingBottom: '10px' }}>Your password has expired and must be changed before you can continue.<br/>{this.state.apiMessage}</p></Row>
					expiredMessageDisplayed = true;
				break;
			case 'pass':
				message = <Row className='pass-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px', paddingBottom: '10px' }}>Your password has been changed successfully. Please <a href={`/oamsso/logout.html?end_url=/SelfService/unauth/logout`}>logout</a> and login to the application again.</p></Row>
				break;
			case 'questionChange':
				message = <Row className='pass-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px', paddingBottom: '10px' }}>Security Questions and Answers updated successfully. Please change password.</p></Row>;
				break;
			case 'setChallengeFirst':
				message = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px', paddingBottom: '10px' }}>Security Questions and Answers for the user have not been set. Please set them first.</p></Row>;
				break;
			default:
				message = null;
		}
		let expiredMessage = null;
		if (this.state.isPasswordExpired === true && expiredMessageDisplayed === false) {
			expiredMessage = <Row className='error-banner' style={{ paddingLeft: '20px' }}><p style={{ paddingTop: '10px', paddingBottom: '10px' }}>Your password has expired and must be changed before you can continue.</p></Row>
		}

		return (
			<Container className={"container-design"}>
				<h4 className="text-left">Change Password</h4>
				<hr/>
				{expiredMessage}
				{message}
					{
						this.state.isLoaderShow ? <div className={'text-center'}><Spin className='mt-50 custom-loading'/></div> :
							<>
								{
									this.state.requireChallengeSet ?
										<>
											<Row>
												<Col md='12'>
													{//<Row className='h5'><p>Please set the challege questions first</p></Row>
													}
													<Row>
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
																<Col lg='4' className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
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
																<Col lg='4' className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
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
																<Col lg='4' className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
														}

													</Row>

												</Col>
											</Row>
											<div className="text-right mt-5">
												<button className="btn btn-success btn-sm" onClick={this.handleChallengeSaveBtnClick}
																disabled={this.state.challenges[0].response.length === 0 || this.state.challenges[1].response.length === 0 || this.state.challenges[2].response.length === 0}>
													{this.state.isQuestionSaving ? <div className="spinner-border spinner-border-sm text-dark"/> : null}
													{' '}Next
												</button>
											</div>

										</>
										:

										<>
											<Row>
												<Col md={6} xs={12}>
													<Row>
														<Col md='5'>
															<Form.Label>
																<span className='star-color'>*</span>
																Current Password
															</Form.Label>
														</Col>
														<Col md='7'>
															<Form.Control
																type='password'
																value={this.state.oldPassword}
																onChange={this.handleOldPwdInput}
																onBlur={this.handleOldPwdBlur}
															/>
														</Col>
														<Col md='5'/>
														{
															this.state.oldPasswordError ?
																<Col md='7' className='error-text padding-bottom'>Current Password is required.</Col>
																:
																<Col md='7' className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
														}
													</Row>
													<Row>
														<Col md='5'>
															<Form.Label>
																<span className='star-color'>*</span>
																New Password
															</Form.Label>
														</Col>
														<Col md='7'>
															<Form.Control
																type='password'
																value={this.state.newPassword}
																onChange={this.handleNewPwdInput}
															/>
														</Col>
														<Col md='5'/>
														{
															this.state.newPassword === '' ? <Col md='7' className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
																:
																isPwdPass ?
																	<Col md='7' className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
																	:
																	<Col md='7' className='error-text padding-bottom'>Please follow the password policy.</Col>
														}
													</Row>
													<Row>
														<Col md='5'>
															<Form.Label>
																<span className='star-color'>*</span>
																Confirm Password
															</Form.Label>
														</Col>
														<Col md='7'>
															<Form.Control
																type='password'
																value={this.state.confirmPassword}
																onChange={this.handleConfirmPwdInput}
															/>
														</Col>
														<Col md='5'/>
														{
															this.state.confirmPassword !== this.state.newPassword
																?
																<Col md='7' className='error-text padding-bottom'>Passwords don't match.</Col>
																:
																<Col md='7' className='padding-bottom' style={{ visibility: 'hidden', fontSize: '12px' }}>123</Col>
														}
													</Row>
												</Col>
												<Col md={6} xs={12} className='margin-bottom'>
													<PasswordPolicy
														password={this.state.newPassword}
														familyName={this.state.familyName}
														givenName={this.state.givenName}
														userName={this.state.userName}
														style={this.style.listitem}
													/>
												</Col>
											</Row>
											<>
												<button className="btn btn-success btn-sm" onClick={this.handleSaveBtnClick} disabled={isSaveBtnWork}>
													{this.state.isSaving ? <div className="spinner-border spinner-border-sm text-dark"/> : null}
													{' '}Save Changes
												</button>
											</>
										</>
								}
								</>
					}
			</Container>

		);
	}
}

export default ChangePassword;
