import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser, uploadImage, signupUserWithProvider } from '../../redux/actions/userActions';
import EditDetails from './EditDetails';
import ProfileSkeleton from '../../util/ProfileSkeleton';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import { Button, Typography, Paper } from '@material-ui/core';
import MuiLink from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
// MUI Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

const styles = {
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& .button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        }
    },
    buttons: {
        textAlign: 'center',
        margin: '10px auto 10px auto',
        '& a': {
            margin: '20px 10px'
        }
    },
    progress: {
        position: 'absolute'
    }
};

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            handle: "",
            errors: {}
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
    }
    handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name); // 3 params
        this.props.uploadImage(formData)
    }
    handleEditPicture = () => {
        const fileInput = document.getElementById('imageUpload');
        fileInput.click();
    }
    handleLogout = () => {
        this.props.logoutUser();
    }
    handleChange =(event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            handle: this.state.handle
        }
        this.props.signupUserWithProvider(userData, this.props.history);
    }
    render() {
        const { classes, user: { credentials: { handle, createdAt, imageUrl, bio, website, location }, loading, authenticated }} = this.props;
        const { errors } = this.state;
        let profileMarkup = !loading ? (authenticated ? (
            handle !== undefined) ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="ProfilePic" className="profile-image"/>
                        <input 
                            type="file" 
                            id="imageUpload" 
                            onChange={this.handleImageChange}
                            hidden="hidden"
                        />
                        <IconButton onClick={this.handleEditPicture} className="button">
                            <ToolTip title="Edit Profile Picture" placement="left">
                                <EditIcon color="primary"/>
                            </ToolTip>
                        </IconButton>
                    </div>
                    <hr/>
                    <div className="profile-details">
                        <MuiLink component={Link} to={`/user/${handle}`} color="primary" variant="h5">
                            @{handle}
                        </MuiLink>
                        <hr/>
                        {bio && <Typography variant="body2">{bio}</Typography>}
                        <hr/>
                        {location && (
                            <Fragment>
                                <LocationOn color="primary"/> <span>{location}</span>
                                <hr/>
                            </Fragment>
                        )}
                        {website && (
                            <Fragment>
                                <LinkIcon color="primary"/>
                                {/* target="_blank" ===> it opens the website on another tab.... rel=... so that React does not complain */}
                                <a href={website} target="_blank" rel="noopener noreferrer">
                                    {' '}{website}
                                </a>
                                <hr/>
                            </Fragment>
                        )}
                        <CalendarToday color="primary"/>{' '}
                        <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                    <ToolTip title="Logout" placement="top">
                        <IconButton onClick={this.handleLogout}>
                            <KeyboardReturn color="primary"/>
                        </IconButton>
                    </ToolTip>
                    <EditDetails />
                </div>
            </Paper> 
            ) : (<Fragment>
                <form noValidate onSubmit={this.handleSubmit}>
                    <Typography variant="body2">
                        Input a username to finish setting up your account
                    </Typography>
                    <TextField 
                        id="handle" 
                        name="handle" 
                        type="text" 
                        label="Handle/Username" 
                        className={classes.textField}
                        helperText={errors.handle} // Display an error/hint underneath the textField
                        error={errors.handle ? true : false} // makes the textfield RED if there's an error
                        value={this.state.handle}    
                        onChange={this.handleChange} 
                        fullWidth
                    />
                    <Button 
                        type="submit" 
                        variant="contained"
                        color="primary"
                        className={classes.buttons}
                    >
                        Submit Username
                        {loading && (
                            <CircularProgress className={classes.progress} size={25}/>
                        )}
                    </Button>
                </form>
                </Fragment>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body1" align="center">
                    No Profile Found
                </Typography>
                <div className={classes.buttons}>
                    <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
                    <Button variant="contained" color="secondary" component={Link} to="/signup">Signup</Button>
                </div>
            </Paper>
        )) : (
                <ProfileSkeleton />
            );
        return profileMarkup;
    }
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionsToProps = {
    logoutUser,
    uploadImage,
    signupUserWithProvider
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
