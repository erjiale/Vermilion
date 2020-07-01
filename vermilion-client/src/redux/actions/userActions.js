import { 
    SET_USER, 
    SET_ERRORS, 
    CLEAR_ERRORS, 
    LOADING_UI, 
    SET_UNAUTHENTICATED, 
    LOADING_USER, 
    MARK_NOTIFICATIONS_READ,
    SET_AUTHENTICATED,
    STOP_LOADING_USER
} from '../types';
import axios from 'axios';
import firebase from 'firebase'; // for google sign-in and other firebase Dev Features


export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
    .then(res => {
        // console.log(res.data);
        // store the token for continued sessions
        const FBIdToken = `Bearer ${res.data.token}`;
        localStorage.setItem('FBIdToken', FBIdToken);
        axios.defaults.headers.common['Authorization'] = FBIdToken; // need to set the headers with the token
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        history.push('/'); // redirect to home page // pass history as a param
    })
    .catch(err => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data
        })
    })
};

export const loginUserWithProvider = (userData, history) => dispatch => {
    console.log(userData)
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        .then(idToken => {
            const FBIdToken = `Bearer ${idToken}`;
            localStorage.setItem('FBIdToken', FBIdToken);
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            dispatch({ type: SET_AUTHENTICATED })
            dispatch(getUserData());
            history.push('/');
        }).catch( err => {
            console.log(err);
        });
}

export const signupUserWithProvider = (newUserData, history) => (dispatch) => {
    let user = firebase.auth().currentUser;
    if(user) {
        console.log(user);
        newUserData.email = user.email;
        newUserData.uid = user.uid;
        axios.post('/signup/provider', newUserData)
            .then(() => {

                dispatch(getUserData());
                dispatch({ type: CLEAR_ERRORS });
                history.push('/');
            })
            .catch((err) => {
                if(err.response && (err.response.data || err.response.status === 500 )) {
                    console.log(err.response.data)
                    dispatch({
                        type: SET_ERRORS,
                        payload: err.response.data
                    })
                }
                // else {
                //     const FBIdToken = `Bearer ${idToken}`;
                //     localStorage.setItem('FBIdToken', FBIdToken);
                //     axios.defaults.headers.common['Authorization'] = FBIdToken;
                //     dispatch(getUserData());
                //     dispatch({ type: CLEAR_ERRORS });
                //     history.push('/');
                // }
            })
    } else {
        console.log('user not logged in')
    }
    
}
export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserData)
    .then(res => {
        // console.log(res.data);
        // store the token for continued sessions
        const FBIdToken = `Bearer ${res.data.token}`;
        localStorage.setItem('FBIdToken', FBIdToken);
        axios.defaults.headers.common['Authorization'] = FBIdToken; // need to set the headers with the token
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        history.push('/'); // redirect to home page // history passed as a param
    })
    .catch(err => {
        if (err.response && err.response.data) {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        }
        else {
            console.log(err);
        }
    })
};

export const logoutUser = () => (dispatch) => {
    // firebase.auth().signOut();
    firebase.auth().signOut()
        .then(() => {
            console.log('Signed out successfully!')
        })
        .catch(err => {
            console.log('Could not sign out' + err)
        });
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({
        type: SET_UNAUTHENTICATED
    })
}
export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER })
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({ type: STOP_LOADING_USER })
            console.log(err)
        })
};

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER })
    axios.post('/user/image', formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => {
            console.log(err)
        }) 
}

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user', userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => {
            console.error(err);
        })
} 

export const markNotificationsRead = (notificationIds) => dispatch => {
    axios.post(`/notifications`, notificationIds)
        .then( res => {
            dispatch({
                type: MARK_NOTIFICATIONS_READ
            })
        })
        .catch( err => {
            console.log(err);
        })
};
