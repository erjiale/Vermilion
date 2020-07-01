import { 
    SET_USER, 
    SET_AUTHENTICATED, 
    SET_UNAUTHENTICATED, 
    LOADING_USER, 
    LIKE_POST, 
    UNLIKE_POST, 
    MARK_NOTIFICATIONS_READ,
    STOP_LOADING_USER
} from '../types';

const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state, // return the current state, 
                authenticated: true, // and then any changes
                loading: false
            }
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload // spread operator will bind the response to the initialState-> credentials = credentials, likes = likes, etc...
            }
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case STOP_LOADING_USER:
            return {
                ...state,
                loading: false
            }
        case LIKE_POST:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        postId: action.payload.postId
                    }
                ]
            }
        case UNLIKE_POST:
            return {
                ...state,
                likes: state.likes.filter(
                    (like) => like.postId !== action.payload.postId
                )
            };
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach(notif => notif.read = true);
            return {
                ...state
            }
        default:
            return state;
    }
}

