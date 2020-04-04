import React from "react"
import {Col, Row, Container, Form, FormGroup} from "react-bootstrap";
import message from "antd/lib/message";
import {ApiService} from "../services/ApiService";
import Spin from "antd/lib/spin";

class SecurityQuestions extends React.Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      error: {},
      allChallenges: [{question: '', answer: ''}, {question: '', answer: ''}, {question: '', answer: ''}],
      allQuestions: [],
      userInfo: {},
      isLoaderShow: false,
      isEnabled: true,
      errorMessage: '',
      apiMessage: '',
      isPasswordExpired: false,
      isQuestionSaving: false
    }
  }

  async componentDidMount() {
    const {location, isExpired} = this.props
    let {allChallenges, errorMessage} = this.state;
    const currentPath = (location && location.pathname.split("/")) || []
    const path = (currentPath && currentPath[3]) || ""
    document.title = "My Profile";
    this.setState({
      path,
      isLoaderShow: true
    });

    const userInfo = await this._apiService.getUserInformation()
    if (!userInfo || userInfo.error) {
      window.scrollTo(0, 0);
      this.setState({
        apiMessage: userInfo && userInfo.error,
        errorMessage: 'apiError',
        isLoaderShow: false
      });
    } else {
      const {challengeQuestions} = userInfo;
      if (challengeQuestions && challengeQuestions.length) {
        challengeQuestions.forEach((item, index) => {
          allChallenges[index] = {question: item, answer: ''}
        })
      } else {
        errorMessage = "setChallengeFirst"
      }
      this.setState({
        allChallenges,
        isLoaderShow: false,
        userInfo,
        errorMessage: isExpired ? 'isExpired' : errorMessage,
      }, () => this.getChallengeQuestions())
    }
  }

  getChallengeQuestions = async () => {
    let allQuestions = []
    const data = await this._apiService.getChallengeQuestions()
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
      const {challengeQuestions} = data;
      if (challengeQuestions && challengeQuestions.length) {
        challengeQuestions.forEach(item => {
          allQuestions.push({
            question: item,
            answer: ""
          })
        })
      }

      this.setState({
        allQuestions: allQuestions,
        isLoaderShow: false
      })
    }
  }

  checkErr = () => {
    const {errorMessage, isPasswordExpired, apiMessage} = this.state
    let message = null;
    let expiredMessageDisplayed = false;
    switch (errorMessage) {
      case 'apiError':
        isPasswordExpired === false
          ? message = <Row className='error-banner pl-5'>
            <p className='mt-3 mb-3'>{apiMessage}</p></Row>
          : message = <Row className='error-banner pl-5'>
            <p className='mt-3 mb-3'>Your password has expired and must be changed before you
              can continue.<br/>{apiMessage}</p></Row>
        expiredMessageDisplayed = true;
        break;
      case 'questionChange':
        message = <Row className='pass-banner pl-5'><p className='mt-3 mb-3'>
          Security Questions and Answers updated successfully. Please change password.</p></Row>;
        break;
      case 'setChallengeFirst':
        message = <Row className='error-banner pl-5'><p className='mt-3 mb-3'>
          Security Questions and Answers for the user have not been set. Please set them first.</p></Row>;
        break;
      case 'isExpired':
        message = <Row className='error-banner pl-5'><p className='mt-3 mb-3'>
          Password will be expired.</p></Row>;
        break;
      case 'duplicateAnswers':
        message = <Row className='error-banner pl-5'><p className='mt-3 mb-3'> The Security Questions and Answers could not be set because there were duplicate answers.</p></Row>;
        break;
      case 'sameQuestion':
        message = <Row className='error-banner pl-5'><p className='mt-3 mb-3'>Security Questions should not be same.</p></Row>;
        break;
      default:
        message = null;
    }
    let expiredMessage = null;
    if (isPasswordExpired === true && expiredMessageDisplayed === false) {
      expiredMessage = <Row className='error-banner pl-5'><p className='mt-2 mb-2'>
        Your password has expired and must be changed before you can continue.</p></Row>
    }
    return {
      message, expiredMessage
    }
  }

  handleChange = (e, i, key) => {
    let {allChallenges} = this.state
    allChallenges[i] = {
      ...allChallenges[i],
      [key]: e.target.value
    }
    this.setState({
      allChallenges
    })
  }

  handleAnswerBlur = (e) => {
    let {error} = this.state
    const {name, value} = e.target
    error[name] = !value ? "Please provide answer" : ""
    this.setState({ error })
  }

  handleChallengeSave = async () => {
    const {allChallenges, userInfo, path} = this.state

    let isQuestionSame = allChallenges[0].question === allChallenges[1].question ||
        allChallenges[0].question === allChallenges[2].question ||
        allChallenges[1].question === allChallenges[2].question;

    let isAnswerSame = allChallenges[0].answer === allChallenges[1].answer ||
        allChallenges[0].answer === allChallenges[2].answer ||
        allChallenges[1].answer === allChallenges[2].answer;

    if (isQuestionSame) {
      window.scrollTo(0, 0);
      return this.setState({
        errorMessage: 'sameQuestion',
      })
    } else if (isAnswerSame) {
      window.scrollTo(0, 0);
      return this.setState({
        errorMessage: 'duplicateAnswers',
      })
    }

    this.setState({
      errorMessage: '',
      afterQuestionSubmit: true,
      isQuestionSaving: true
    })
    const data = {
      challengeQuestions: allChallenges && allChallenges.map(f => ({
        name: f.question,
        value: f.answer
      }))
    }
    const res = await this._apiService.updateQuestion(userInfo.userLogin, data)
    if (!res || res.error) {
      window.scrollTo(0, 0);
      this.setState({
        apiMessage: (data && data.error) || 'Something went wrong!',
        errorMessage: 'apiError',
        afterQuestionSubmit: false,
        isQuestionSaving: false
      });
      // return message.error('something is wrong! please try again');
    } else {
      window.scrollTo(0, 0);
      this.props.history.push('/SelfService/auth/success')
      this.setState({
        afterQuestionSubmit: false,
        errorMessage: "questionChange",
        isQuestionSaving: false
      }, () => {
        if (path !== "security-question") {
          this.props.handleView()
        } else {
          const {allChallenges} = this.state
          allChallenges.forEach(f => f.answer = "")
          this.setState({
            allChallenges
          })
        }
        this.props.history.push('/SelfService/auth/success')
      })
      // return message.success('Question submitted successfully');
    }
  }

  isSaveBtnEnable = () => {
    const {allChallenges} = this.state
    let isDisabled = true
    if (allChallenges && allChallenges.length) {
      isDisabled = !(allChallenges[0].answer && allChallenges[1].answer && allChallenges[2].answer)
    }
    return isDisabled
  }

  onCancel = () => {
    this.props.history.push('/SelfService/auth/my-profile')
  }

  render() {
    const {errorMessage, allChallenges, error, isLoaderShow, allQuestions} = this.state

    let message, expiredMessage = null;
    if (errorMessage) {
      const err = this.checkErr()
      message = err && err.message
      expiredMessage = err && err.expiredMessage
    }

    return (
      <Container className={"container-design"}>
        <h4 className="text-left">Security Questions</h4>
        <hr/>
        {expiredMessage}
        {message}
        <>
          {
            isLoaderShow ? <div className={'text-center'}><Spin className='mt-50 custom-loading'/></div> :
              <>
                {
                  allChallenges && allChallenges.map((item, i) => {
                    const data = allQuestions

                    return (
                      <span key={i.toString() + i}>

                        <Row>
                          <Col xs='12' md='8' lg='6' xl='4'>
                            <FormGroup controlId="formControlsSelect">
                              <label>
                                {`Question ${i + 1}`}
                              </label>
                              <Form.Control
                                  as="select"
                                  onChange={(e) => this.handleChange(e, i, "question")}
                                  value={(allChallenges[i].question) || ""}
                                  size="sm"
                              >
                                {data.filter(item => item.question !== allChallenges[i === 0 ? 1 : i === 1 ? 0 : 0].question && item.question !== allChallenges[i === 0 ? 2 : i === 1 ? 2 : 1].question)
                                    .map((item, index) => <option key={index} value={item.question}>{item.question}</option>)}
                              </Form.Control>
                            </FormGroup>
                          </Col>
                        </Row>

                      <Row className='pb-10-px'>
                        <Col xs='12' md='8' lg='6' xl='4'>
                          <FormGroup controlId="formControlsSelect">
                            <label>
                              <span className='star-color'>*</span>
                              {`Answer ${i + 1}`}
                            </label>
                            <Form.Control
                                name={`ans ${i + 1}`}
                                value={(allChallenges[i] && allChallenges[i].answer) || ""}
                                onChange={(e) => this.handleChange(e, i, "answer")}
                                onBlur={(e) => this.handleAnswerBlur(e)}
                                size="sm"
                            />
                            <span className="text-danger">{(error && error[`ans ${i+1}`]) || ""}</span>
                          </FormGroup>
                        </Col>
                      </Row>

                      </span>
                    )
                  })
                }
                <div className="text-right mt-3">
                  <button
                      className="btn btn-warning btn-sm"
                      onClick={this.onCancel}
                  >
                    Cancel
                  </button> &nbsp;&nbsp;
                  <button className="btn btn-success btn-sm" onClick={this.handleChallengeSave} disabled={this.isSaveBtnEnable()}>
                    {this.state.isQuestionSaving ? <div className="spinner-border spinner-border-sm text-dark"/> : null}
                    {' '}Save
                  </button>
                </div>
              </>
          }
        </>
      </Container>
    );
  }
}

export default SecurityQuestions;