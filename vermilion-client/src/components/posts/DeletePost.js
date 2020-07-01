import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deletePost } from '../../redux/actions/dataActions';

// MUI 
import withStyles from '@material-ui/core/styles/withStyles';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

import DeleteIcon from '@material-ui/icons/DeleteOutline';

const styles = {
    deleteButton: {
        left: '90%',
        position: 'absolute'
    }
}
class DeletePost extends Component {
    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }
    handleClose = () => {
        this.setState({
            open: false
        })
    }
    deletePost = () => {
        // console.log(window.location.pathname);
        this.props.deletePost(this.props.postId);
        this.setState({
            open: false
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <ToolTip title="Delete Post" >
                    <IconButton onClick={this.handleOpen} className={classes.deleteButton}>
                        <DeleteIcon color="secondary"/>
                    </IconButton>
                </ToolTip>
                <Dialog
                    open={this.state.open}
                    onClose={this.state.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Confirm you want to delete the post
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.deletePost} color="secondary">Delete Post</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeletePost.propTypes = {
    postId: PropTypes.string.isRequired,
    deletePost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,

}

export default connect(null, {deletePost} )(withStyles(styles)(DeletePost));
