import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// REDUX
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../../redux/actions/dataActions';
// MUI
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
// MUI Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

class LikeButton extends Component {
    likedPost = () => {
        if(this.props.user.likes && this.props.user.likes.find(
            like => like.postId === this.props.postId
        )) {
            return true;
        }
        else {
            return false;
        }
    }

    likePost = () => {
        this.props.likePost(this.props.postId)
    }
    unlikePost = () => {
        this.props.unlikePost(this.props.postId)
    }

    render() {
        dayjs.extend(relativeTime);
        const { authenticated } = this.props.user;
        
        const likeButton = !authenticated ? (
            <Link to="/login">
                <ToolTip title="Like">
                    <IconButton>
                            <FavoriteBorder color="primary" />
                    </IconButton>
                </ToolTip>
            </Link>
        ) : (
            this.likedPost() ? (
                <ToolTip title="Unlike">
                    <IconButton onClick={this.unlikePost}>
                        <FavoriteIcon color='primary' />
                    </IconButton>
                </ToolTip>
            ) : (
                <ToolTip title="Like">
                    <IconButton onClick={this.likePost}>
                        <FavoriteBorder color='primary' />
                    </IconButton>
                </ToolTip>
            )
        );

        return (
            <Fragment>
                {likeButton}
            </Fragment>
        )
    }
}

LikeButton.propTypes = {
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likePost,
    unlikePost
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton   );
