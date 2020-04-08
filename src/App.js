import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom'
import {Container} from 'react-bootstrap';
import { Spin } from 'antd';
import ChangePassword from './screens/ChangePassword';
import MyProfile from './screens/MyProfile';
import SecurityQuestions from './screens/SecurityQuestions';
import Success from './screens/Success';
import { ApiService } from './services/ApiService'

import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';
import 'antd/dist/antd.css';


class App extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            environment: "prd"
        }
    }

    async componentDidMount() {
        const envData = await this._apiService.getEnvironment()
        this.setState({
            isLoading: false,
            environment: envData && envData.environment
        })
    }

    render() {
        const {isLoading, environment} = this.state
        return (
            <div>
                {isLoading ? <div className="text-center mt-5-p"><Spin className='mt-50 custom-loading'/></div> :
                    <div>
                        <Header environment={environment}/>
                        <Container>
                            <Switch>
                                <React.Fragment>
                                    <Route path='/SelfService/auth/change-password' component={ChangePassword}/>
                                    <Route path='/SelfService/auth/security-question' component={SecurityQuestions}/>
                                    <Route path='/SelfService/auth/my-profile' component={MyProfile}/>
                                    <Route path='/SelfService/auth/success' component={Success}/>
                                </React.Fragment>
                            </Switch>
                            <Footer/>
                        </Container>
                    </div>
                }
            </div>
        );
    }
}

export default App;