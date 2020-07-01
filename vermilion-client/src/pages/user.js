import React, { Component } from 'react'
import PropTypes from 'prop-types';
// Components
import Post from '../components/posts/Post';
import StaticProfile from '../components/profile/StaticProfile';
import Profile from '../components/profile/Profile';
import PostSkeleton from '../util/PostSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';
// REDUX
import { connect } from 'react-redux';
import { getUserPosts, getUserProfile } from '../redux/actions/dataActions';
// MUI
import Grid from '@material-ui/core/Grid';

class user extends Component {

    state = {
        postIdParam: null,
        oldPath: ''
    }
    componentDidMount() {
        // .match similar to .params -> holds data about the url
        const handle = this.props.match.params.handle;
        const postId = this.props.match.params.postId;
        const old = window.location.pathname;
        
        if(postId) {
            this.setState({
                postIdParam: postId,
                oldPath: old
            })
        } else {
            this.setState({
                oldPath: old
            })
        }
        this.props.getUserProfile(handle);
        this.props.getUserPosts(handle);
    }

    componentDidUpdate() {
        const { oldPath } = this.state;
        let newPath = window.location.pathname;
        
        if (oldPath !== newPath) {
            if (!newPath.split('/')[3]) {            
                // window.history.pushState(null, null, newPath);
                this.setState({
                    oldPath: newPath
                })
                let handle = newPath.substr(6);
                // console.log('redirecting -> ' + handle)
                this.props.getUserProfile(handle);
                this.props.getUserPosts(handle);
            }
        }
        
    }
    
    render() {
        const { 
            data: { posts, loading, profile }, 
            user: {credentials: { handle }} 
        } = this.props;
        const { postIdParam } = this.state;
        const userhandle = this.props.match.params.handle;
        
        const postsMarkup = loading ? (
            <PostSkeleton />
        ) : (!posts[0] ? (
            <div>
                <p>No Posts from this user</p>
                <PostSkeleton />
            </div>
        ) : !postIdParam ? (
            posts.map(post => 
                <Post key={post.postId} post={post} commentCount={post.commentCount} />
            )
        ) : (
            posts.map(post => {
                if(post.postId !== postIdParam) {
                    return <Post key={post.postId} post={post} commentCount={post.commentCount} />
                }
                else return <Post key={post.postId} post={post} commentCount={post.commentCount} openDialog/>
            })
        ));

        return (
            <Grid container spacing={4}>
                <Grid item sm={4} xs={12}>
                    {loading ? (
                            <ProfileSkeleton />
                        ) : (!profile.handle ? (
                            <div>
                                <p>User not found</p>
                                <ProfileSkeleton />
                            </div>
                            ) : (userhandle === handle ? (
                                <Profile />
                            ) : <StaticProfile profile={profile}/>)
                        )
                    }
                </Grid>
                <Grid item sm={8} xs={12}>
                    {postsMarkup}
                </Grid>
                
                
            </Grid>
        )
    }
}

user.propTypes = {
    getUserPosts: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data,
    user: state.user
});

export default connect(mapStateToProps, { getUserPosts, getUserProfile })(user);
