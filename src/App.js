import React from 'react';
import {Route, Switch} from 'react-router-dom'
import {Container} from 'react-bootstrap';

import ChangePassword from './screens/ChangePassword1';
import MyProfile from './screens/MyProfile';
import SecurityQuestions from './screens/SecurityQuestions';

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
        </React.Fragment>
      </Switch>
      <Footer/>
    </Container>
  </div>
)

export default App;
