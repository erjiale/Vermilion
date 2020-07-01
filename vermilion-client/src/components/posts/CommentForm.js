import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// REDUX
import { connect } from 'react-redux';
import { addComment } from '../../redux/actions/dataActions';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
    button: {
        marginTop: 7
    },
    visibleSeparator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
    },
};

class CommentForm extends Component {
    state = {
        body: '',
        errors: {}
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        // clear the form after we submit props
        if(!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                body: ''
            })
        }
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.addComment(this.props.postId, {body: this.state.body});
    }

    render() {
        const { classes, authenticated } = this.props;
        const { errors } = this.state;

        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{ textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Comment"
                        error={errors.comment ? true : false}
                        helperText={errors.comment}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                    />
                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                    >
                        Submit
                    </Button>
                    <hr className={classes.visibleSeparator} />
                </form>
            </Grid>
        ) : (
            <Grid item sm={12} style={{ textAlign: 'center' }}>
                <p>
                    <Link to="/login" className="redirectLink">Login</Link>/
                    <Link to="/signup" className="redirectLink">Register</Link>
                    &nbsp;to comment
                </p>
                <hr className={classes.visibleSeparator} />
            </Grid>
        )

        return commentFormMarkup
    }
}

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
}
const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps, { addComment } )(withStyles(styles)(CommentForm));
