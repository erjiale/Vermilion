import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// props => {Component being used when called, global variable 'authenticated', any other props ...rest}
const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route
        {...rest}
        render={(props) => 
            authenticated === true ? <Redirect to='/' /> : <Component {...props} />
        }
    />
);

AuthRoute.propTypes = {
    user: PropTypes.object
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps, null)(AuthRoute);
