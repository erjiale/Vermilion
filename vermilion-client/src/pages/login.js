import React, { Component } from 'react'
import PropTypes from 'prop-types'; // good practice to state the data types of each prop
import { Link } from 'react-router-dom';
// REDUX
import { connect } from 'react-redux';
import { loginUser, loginUserWithProvider } from '../redux/actions/userActions';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// Firebase Auth
import firebase from 'firebase'; // for google sign-in and other firebase Dev Features
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const styles = {
    form: {
        textAlign: 'center'
    },
    pageTitle: {
        margin: '20px 0px 0px 0px'
    },
    textField: {
        margin: '15px 0 20px 0'
    },
    button: {
        marginTop: '10px',
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.6rem',
        marginTop: '10'
    },
    msg: {
        marginTop: '10'
    },
    progress: {
        position: 'absolute'
    }
}
class login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {},
        }
    }
    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false
        }
    }
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // console.log(user)
                this.props.loginUserWithProvider(user, this.props.history);
            }
            else {
                console.log('Not signed in')
            }
        })
    }
    // will handle any errors after onSubmit
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history);
    };

    handleChange = (event) => { 
        // the event has a target property that in this case is the TextField
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        // loading when moved to redux is inside of UI
        const { classes, UI: {loading} } = this.props;
        const { errors } = this.state;

        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <Typography variant="h2" className={classes.pageTitle}>Login</Typography>
                    <br/>
                    <small>Don't have an account? Sign up <Link to="/signup" className="redirectLink">here</Link></small>
                    <form noValidate onSubmit={this.handleSubmit}> 
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Email" 
                            className={classes.textField}
                            helperText={errors.email} // Display an error/hint underneath the textField
                            error={errors.email ? true : false} // makes the textfield RED if there's an error
                            value={this.state.email}    
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password" 
                            className={classes.textField}
                            helperText={errors.password} // helperText to display a error/hint underneath the textField
                            error={errors.password ? true : false}
                            value={this.state.password} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            className={classes.button}
                            disabled={loading}
                        >
                            Login
                            {loading && (
                                <CircularProgress className={classes.progress} size={25}/>
                            )}
                        </Button>
                    </form>
                    <StyledFirebaseAuth
                        uiConfig={this.uiConfig}
                        firebaseAuth={firebase.auth()}
                    />
                </Grid>
                <Grid item sm/>   
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

// takes the global state and then we get the states we need
const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

// which actions we are gonna to use
const mapActionsToProps = {
    loginUser,
    loginUserWithProvider
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
