import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// REDUX
import { connect } from 'react-redux';
import { addPost, clearErrors } from '../../redux/actions/dataActions';

// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// MUI Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
    progressSpinner: {
        position: 'absolute',
        left: '50%'
    },
    submitButton: {
        position: 'relative',
        margin: '20px 0 10px 0',
        float: 'right'
    },
    closebutton: {
        position: 'absolute',
        left: '90%'
    }
};

class AddPost extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    }

    // props received after Submit
    componentWillReceiveProps(nextProps) {
        if(nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ 
                body: '', 
                open: false,
                errors: {} 
            });
        }
    }
    handleOpen = () => {
        this.setState({
            open: true
        });
    };
    handleClose = () => {
        this.props.clearErrors()
        this.setState({
            open: false,
            errors: {}
        });
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.addPost({ body: this.state.body }); 
    }

    render() {
        const { errors } = this.state;
        const { classes, UI: { loading } } = this.props;
        return (
            <Fragment>
                <ToolTip title="Create a Post!">
                    <IconButton onClick={this.handleOpen} >
                        <AddIcon />
                    </IconButton>
                </ToolTip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <ToolTip title="Create a Post!" className={classes.closebutton}>
                        <IconButton onClick={this.handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </ToolTip>
                    <DialogTitle>Create A New Post</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="body"
                                type="text"
                                label="Body"
                                multiline
                                rows="3"
                                placeholder="Write a new post..."
                                error={errors.body ? true : false}
                                helperText={errors.body}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                             <Button 
                                type="submit" 
                                variant="contained"
                                color="secondary"
                                className={classes.submitButton}
                                disabled={loading} // disabled on Loading
                            >
                                Add Post
                                {loading && (
                                    <CircularProgress size={25} className={classes.progressSpinner}/>
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

AddPost.propTypes = {
    addPost: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI
});

export default connect(mapStateToProps, { addPost, clearErrors })(withStyles(styles)(AddPost));
