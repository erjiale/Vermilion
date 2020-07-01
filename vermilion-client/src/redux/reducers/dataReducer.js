import { 
    GET_POSTS,
    GET_POST,
    LIKE_POST, 
    UNLIKE_POST, 
    LOADING_DATA, 
    DELETE_POST, 
    ADD_POST,
    ADD_COMMENT,
    GET_USER_PROFILE,
    SEARCH_USERS,
    // GET_USER_POSTS
} from '../types';

const initialState = {
    posts: [], // array that holds all of the posts
    post: {}, // individual post
    profile: {},
    // profilePosts: {},
    searchedUsers: [],
    loading: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            }
        case GET_POST:
            return {
                ...state,
                post: action.payload
            }
        case UNLIKE_POST:
        case LIKE_POST:
            // find the post in the collection of 'posts'
            let index = state.posts.findIndex((post) => post.postId === action.payload.postId);
            // && update the post with the payload from the actionn response
            state.posts[index] = action.payload;
            let commentsArr = state.post.comments;
            // state.posts[index].likeCount = action.payload.likeCount;
            // also update the individual post object
            if(state.post.postId === action.payload.postId) {
                // state.post.likeCount = action.payload.likeCount
                state.post = action.payload; // this action removes the comments array, so we push it back in
            }
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: commentsArr
                }
            }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(
                    pos => pos.postId !== action.payload
                )
            }
        case ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts],
                loading: false
            }
        case ADD_COMMENT:
            let i = state.posts.findIndex((post) => post.postId === action.payload.postId);
            state.posts[i].commentCount = state.posts[i].commentCount + 1;
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: [action.payload, ...state.post.comments],
                    commentCount: state.post.commentCount + 1
                }
            }
        case GET_USER_PROFILE:
            return {
                ...state,
                profile: action.payload
            }
        case SEARCH_USERS:
            return {
                ...state,
                searchedUsers: action.payload,
                loading: false
            }
        default:
            return state;
    }
}   