import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import jwtDecode from 'jwt-decode';
import AuthRoute from './util/AuthRoute';
import axios from 'axios';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
// Components
import Navbar from './components/layout/Navbar';
// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';
import search from './pages/search';
// Firebase
import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyCZfFSaBXAnB22nZc9kDtqIN6HqWK3kmoM",
  authDomain: "vermilion-e6c9c.firebaseapp.com",
  databaseURL: "https://vermilion-e6c9c.firebaseio.com",
  projectId: "vermilion-e6c9c",
  storageBucket: "vermilion-e6c9c.appspot.com",
  messagingSenderId: "199989571817",
  appId: "1:199989571817:web:07dffde8a1c77c75140078",
  measurementId: "G-6F047QB6PW"
};
firebase.initializeApp(firebaseConfig); 

// this creates a theme from MUI for our overall app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#bf360c',
    },
    secondary: {
      main: '#ffb74d',
    }
  },
  typography: {
    useNextVariants: true
  }
})

// used for the build static folder
axios.defaults.baseURL = 'https://us-central1-vermilion-e6c9c.cloudfunctions.net/api';

const token = localStorage.FBIdToken;
if(token) {
  const decodedToken = jwtDecode(token);
  // console.log(decodedToken);
  if(decodedToken.exp*1000 < Date.now()) { // expired token
    store.dispatch(logoutUser());
    window.location.href = 'login';
  }
  else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path='/' component={home} />
                <AuthRoute exact path='/login' component={login} />
                <AuthRoute exact path='/signup' component={signup} />
                <Route exact path='/user/:handle' component={user} />
                <Route exact path='/user/:handle/post/:postId' component={user} />
                <Route exact path='/search' component={search} />
              </Switch>
            </div>
          </Router>
        </Provider>
        
      </MuiThemeProvider>
    );
  }
}

export default App;
