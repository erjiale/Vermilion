import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
// MUI 
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = {
    cardImage: {
        width: '150px',
        height: '150px',
        objectFit: 'cover'
    }
};

class SearchCard extends Component {
    render() {
        const { classes, user, userImage } = this.props;

        return (
            <Fragment key={user}>
                <img src={userImage} className={classes.cardImage} alt="userImage"/>
                <Typography 
                    variant="h5" 
                    className={classes.cardText} 
                    component={Link} 
                    to={`/user/${user}`}
                >
                    {user}
                </Typography>
            </Fragment>
        )
    }
}

export default withStyles(styles)(SearchCard);