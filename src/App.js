import React from 'react';
import {Route, Switch} from 'react-router-dom'
import {Container} from 'react-bootstrap';

import ChangePassword from './screens/ChangePassword';
import MyProfile from './screens/MyProfile';
import SecurityQuestions from './screens/SecurityQuestions';
import Success from './screens/Success';

import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';
import 'antd/dist/antd.css';

const App = () => (
  <div>
    <Header/>
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
)

export default App;
