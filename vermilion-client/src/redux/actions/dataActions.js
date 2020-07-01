import { 
    GET_POSTS, 
    LOADING_DATA, 
    LOADING_UI, 
    LIKE_POST, 
    UNLIKE_POST, 
    DELETE_POST, 
    ADD_POST, 
    SET_ERRORS, 
    CLEAR_ERRORS, 
    GET_POST, 
    STOP_LOADING_UI,
    ADD_COMMENT,
    GET_USER_PROFILE,
    SEARCH_USERS
} from '../types';
import axios from 'axios';

export const getPosts = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get('/posts')
        .then(res => {
            // console.log(res.data);
            dispatch({
                type: GET_POSTS,
                payload: res.data 
            }); 
            dispatch({
                type: CLEAR_ERRORS
            })
        })
        .catch(() => {
            dispatch({
                type: GET_POSTS,
                payload: []
            })
        })
};

export const getPost = (postId) => dispatch => {
    dispatch({ type: LOADING_UI })
    axios.get(`/post/${postId}`)
        .then(res => {
            dispatch({
                type: GET_POST,
                payload: res.data
            })
            dispatch({ type: STOP_LOADING_UI }) // we have to stop loading the UI (loading spinner) or it will keep on loading
        })
        .catch(err => {
            console.log(err)
        })
};

export const likePost = (postId) => dispatch => {
    axios.get(`/post/${postId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_POST,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err);
        })
};

export const unlikePost = (postId) => dispatch => {
    axios.get(`/post/${postId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_POST,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err);
        })
};

export const deletePost = (postId) => dispatch => {
    axios.delete(`post/${postId}`)
        .then(res => {
            dispatch({
                type: DELETE_POST,
                payload: postId
            })
        })
        .catch(err => {
            console.log(err);
        })
};

export const addPost = (postBody) => dispatch => {
    dispatch({ type: LOADING_UI })
    axios.post('/post', postBody)
        .then(res => {
            dispatch({
                type: ADD_POST,
                payload: res.data
            })
            dispatch(clearErrors())
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
};

// ACTION creator, a function that only dispatches an action
export const clearErrors = () => dispatch => {
    dispatch({type: CLEAR_ERRORS})
}

export const addComment = (postId, commentBody) => dispatch => {
    axios.post(`/post/${postId}/comment`, commentBody)
        .then(res => {
            dispatch({
                type: ADD_COMMENT,
                payload: res.data
            })
            dispatch(clearErrors())
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

export const getUserPosts = (userHandle) => dispatch => {
    dispatch({ type: LOADING_DATA })
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type: GET_POSTS,
                payload: res.data.posts
            })
        })
        .catch(() => {
            dispatch({
                type: GET_POSTS,
                payload: []
            })
        })
}

export const getUserProfile = (userHandle) => dispatch => {
    dispatch({ type: LOADING_DATA })
    axios.get(`/user/${userHandle}`)
            .then(res => {
                dispatch({
                    type: GET_USER_PROFILE,
                    payload: res.data.user
                })
            })
            .catch(err => {
                console.log(err);
            })
};

export const searchUsers = (searchQuery) => dispatch => {
    dispatch({ type: LOADING_DATA })
    axios.get(`/users/?search=${searchQuery}`)
            .then(res => {
                dispatch({
                    type: SEARCH_USERS,
                    payload: res.data
                })
                // history.push('/login')
            })
            .catch(err => {
                console.log(err);
            })
}