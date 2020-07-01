import React from 'react';
import NoImg from '../images/no-img.png';
import PropTypes from 'prop-types';
// MUI 
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
// MUI Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = ({
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
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
    handle: {
        width: 66,
        height: 22,
        backgroundColor: '#bf360c',
        margin: '0 auto 7px auto'
    },
    date: {
        width: 100,
        height: 14,
        backgroundColor: 'rgba(0,0,0, 0.2)',
        marginBottom: 8
    },
    fullLine: {
        width: '100%',
        height: 15,
        backgroundColor: 'rgba(0,0,0, 0.6)',
        marginBottom: 10
    },
});

const ProfileSkeleton = (props) => {
    const { classes } = props;

    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={NoImg} alt="profile" className="profile-image" />
                </div>
                <hr />
                <div className="profile-details">
                    <div className={classes.handle}/>
                    <hr />
                    <div className={classes.fullLine}/>
                    <div className={classes.fullLine}/>
                    <LocationOn color="primary" /> <span>Location</span>
                    <hr />
                    <LinkIcon color="primary"/> https://website.com
                    <hr />
                    <CalendarToday color="primary" /> Joined Date
                </div>

            </div>
        </Paper>

    )
}

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProfileSkeleton);