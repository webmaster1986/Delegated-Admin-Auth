import React from "react"
import {Col, Row, Container, Form} from "react-bootstrap";
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
      allChallenges: [],
      isLoaderShow: false,
      isEnabled: true,
      errorMessage: '',
      apiMessage: '',
      isPasswordExpired: false,
      isQuestionSaving: false
    }
  }

  async componentDidMount() {
    const {location} = this.props
    let {allChallenges} = this.state;
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
        challengeQuestions.forEach(item => {
          allChallenges.push({
            question: (item && item.question) || "",
            answer: (item && item.answer) || ""
          })
        })
        this.setState({
          allChallenges,
          isLoaderShow: false
        })
      } else {
        this.getChallengeQuestions()
      }
    }
  }

  getChallengeQuestions = async () => {
    let {allChallenges} = this.state;
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
          allChallenges.push({
            question: item,
            answer: ""
          })
        })
      }

      this.setState({
        allChallenges,
        errorMessage: "setChallengeFirst",
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
    }, () => this.isSaveBtnEnable())
  }

  handleAnswerBlur = (e) => {
    let {error} = this.state
    const {name, value} = e.target
    error[name] = !value ? "Please provide answer" : ""
    this.setState({ error }, () => this.isSaveBtnEnable())
  }

  handleChallengeSave = async () => {
    const {allChallenges, userName, path} = this.state
    this.setState({
      afterQuestionSubmit: true,
      isQuestionSaving: true
    })
    const data = {
      challengeQuestions: allChallenges && allChallenges.map(f => ({
        name: f.question,
        value: f.answer
      }))
    }
    const res = await this._apiService.updateQuestion(userName, data)
    if (!res || res.error) {
      window.scrollTo(0, 0);
      this.setState({
        apiMessage: data && data.error,
        errorMessage: 'apiError',
        afterQuestionSubmit: false,
        isQuestionSaving: false
      });
      // return message.error('something is wrong! please try again');
    } else {
      window.scrollTo(0, 0);
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
      })
      // return message.success('Question submitted successfully');
    }
  }

  isSaveBtnEnable = () => {
    const {allChallenges} = this.state
    let isEnabled = true
    if (allChallenges && allChallenges.length) {
      isEnabled = !allChallenges.every((key) => key.answer)
    }
    this.setState({ isEnabled })
  }

  render() {
    const {errorMessage, securityQuestions, allChallenges, error, isEnabled, isLoaderShow} = this.state

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
                    const data = [allChallenges[i]]
                    return (
                      <Row lg='12' md='12' sm='12' xs='12' key={i.toString() + i}>
                        <Col lg='6' md='6' sm='12' xs='12'>
                          <Row className={"mt-2"}>
                            <Col lg='2' md='3' sm='5' xs='5'>
                              <Form.Label>{`Question ${i + 1}`}</Form.Label>
                            </Col>
                            <Col lg='10' md='9' sm='7' xs='7'>
                              <Form.Control as="select" onChange={(e) => this.handleChange(e, i, "question")} value={(securityQuestions && securityQuestions[i].question) || ""}>
                                {
                                  data.map((item, index) => <option key={index}>{item.question}</option>)
                                }
                              </Form.Control>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg='6' md='6' sm='12' xs='12'>
                          <Row className={"mt-2"}>
                            <Col lg='2' md='3' sm='5' xs='5'>
                              <Form.Label><span className='star-color'>*</span>{`Answer ${i + 1}`}</Form.Label>
                            </Col>
                            <Col lg='10' md='9' sm='7' xs='7'>
                              <Form.Control
                                name={`ans ${i + 1}`}
                                value={(allChallenges[i] && allChallenges[i].answer) || ""}
                                onChange={(e) => this.handleChange(e, i, "answer")}
                                onBlur={(e) => this.handleAnswerBlur(e)}
                              />
                              <span className="text-danger">{(error && error[`ans ${i+1}`]) || ""}</span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )
                  })
                }
                <div className="text-right mt-3">
                  <button className="btn btn-success btn-sm" onClick={this.handleChallengeSave} disabled={isEnabled}>
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