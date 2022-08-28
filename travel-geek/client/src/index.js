// import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { ApolloProvider } from "@apollo/client";
import { client } from './apollo';
import { Provider as ReduxProvider } from 'react-redux';

import App from './components/App';
import reducers from './reducers';
import axios from 'axios';
import {AuthContextProvider} from "./contexts/auth-context";

window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(
    reduxThunk,
));

ReactDOM.render(
  <ApolloProvider client={client}>
      <ReduxProvider store={store}>
          <AuthContextProvider>
              <App />
          </AuthContextProvider>
      </ReduxProvider>
  </ApolloProvider>,
  document.querySelector('#root')
);
