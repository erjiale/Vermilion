import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
// Redux
import { connect } from 'react-redux';
import { getPost, clearErrors } from '../../redux/actions/dataActions';
// Components
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// MUI Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';

const styles = {
    invisLine: {
        border: 'none',
        margin: 4
    },
    profileImage: {
        width: 200,
        height: 200,
        objectFit: 'cover',
        maxWidth: '100%',
        borderRadius: '50%'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '80%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinner: {
        textAlign: 'center'
    },

};

class PostDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    }

    componentDidMount() {
        if(this.props.openDialog) {
            this.handleOpen();
        }
    }
    handleOpen = () => {
        let oldPath = window.location.pathname;

        const { userHandle, postId } = this.props;
        const newPath = `/user/${userHandle}/post/${postId}`;

        if (oldPath === newPath) oldPath = `/user/${userHandle}`; // handles case where we don't have oldPath

        // when a dialog is opened, this will change the url to newPath
        window.history.pushState(null, null, newPath);

        this.setState({
            open: true,
            oldPath,
            newPath
        });
        this.props.getPost(this.props.postId);
    };
    handleClose = () => {
        // this reverts the url to our old path
        window.history.pushState(null, null, this.state.oldPath)
        this.setState({
            open: false
        });
        this.props.clearErrors();
    };

    render() {
        const { 
            classes, 
            post: { postId, body, createdAt, likeCount, commentCount, userImage, userHandle, comments },
            UI: { loading }
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinner}>
                <CircularProgress size={180} thickness={2}/>
            </div>
        ) : (
            <Grid container spacing={2}>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/user/${userHandle}`}
                    >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisLine} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisLine} />
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton postId={postId}/>
                    <span>{likeCount} Likes</span>
                    <ToolTip title="Comment">
                        <IconButton>
                            <ChatIcon color='primary' />
                        </IconButton>
                    </ToolTip>
                    <span>{commentCount} comments</span>
                </Grid>
                <hr className={classes.visibleSeparator} />
                <CommentForm postId={postId} />
                <Comments comments={comments} />
            </Grid>
        );
        return (
            <Fragment>
                <ToolTip title="Comments" className={classes.commentButton}>
                    <IconButton onClick={this.handleOpen}>
                        <ChatIcon color='primary' />
                    </IconButton>
                </ToolTip>
                <ToolTip title="Expand Post" className={classes.expandButton}>
                    <IconButton onClick={this.handleOpen}>
                        <UnfoldMore color='primary' />
                    </IconButton>
                </ToolTip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <ToolTip title="Create a Post!" className={classes.closeButton}>
                        <IconButton onClick={this.handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </ToolTip>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }

}

PostDialog.propTypes = {
    getPost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    post: state.data.post,
    UI: state.UI
});

const mapActionsToProps = {
    getPost,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostDialog));