import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App/App';
import FormRegister from './components/Form/FormRegister';
import User from './components/User/User';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Store from './store';
const store = Store();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={App} exact/>
        <Route path="/register" component={FormRegister} exact />
        <Route path="/user" component={User} exact />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
