import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Components
import PropTypes from 'prop-types';
import DeletePost from './DeletePost';
import PostDialog from './PostDialog';
import LikeButton from './LikeButton';
// REDUX
import { connect } from 'react-redux';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
        position: 'relative'
    },
    image: {
        minWidth: 200,
        maxHeight: 200
    },
    content: {
        padding: 25
    }
}

class Post extends Component {
    
    render() {
        dayjs.extend(relativeTime);
    
        // destructure the variable => const classes = this.props.classes
        // 'classes' used to store the styles object variable (MUI)
        const { 
            classes, 
            post: { body, createdAt, userImage, userHandle, likeCount, commentCount, postId }, 
            user: { authenticated, credentials: {handle} }
        } = this.props;


        return (
            <Card className={classes.card}>
                <CardMedia 
                    image={userImage}
                    title="Profile Image"
                    className={classes.image}
                />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/user/${userHandle}`} color="secondary">
                        {userHandle}
                    </Typography>
                    {authenticated && userHandle === handle ? (
                        <DeletePost postId={postId}/>
                        ) : null
                    }
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton postId={postId}/>
                    <span>{likeCount} Likes</span>
                    <PostDialog postId={postId} userHandle={userHandle} openDialog={this.props.openDialog}/>
                    <span>{commentCount} comments</span>
                </CardContent>
            </Card>
        )
    }
}
Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
    user: state.user,
    // data: state.data
})


export default connect(mapStateToProps, null)(withStyles(styles)(Post));
