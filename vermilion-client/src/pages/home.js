import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Post from '../components/posts/Post';
import Profile from '../components/profile/Profile';
import PostSkeleton from '../util/PostSkeleton';
// Redux
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';
// MUI
import Grid from '@material-ui/core/Grid';

// api: https://us-central1-vermilion-e6c9c.cloudfunctions.net/api
class home extends Component {

    componentDidMount() {
        this.props.getPosts();
    }
    
    render() {
        const { posts, loading } = this.props.data;
        let recentPostsMarkup = !loading ? (
            posts.map((post) => 
                <Post key={post.postId} post={post} commentCount={post.commentCount}/>
            )
        ) : <PostSkeleton />;
        return (
            <Grid container spacing={4}>
                <Grid item sm={4} xs={12}>
                    <h3>User Profile</h3>
                    <Profile />
                </Grid>
                <Grid item sm={8} xs={12}>
                    <h3>Recent Posts</h3>
                    {recentPostsMarkup}
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, {getPosts})(home);
