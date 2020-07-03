import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom'; // only imports one component from react-router-dom -> TREESHAKING
import PropTypes from 'prop-types';
import AddPost from '../posts/AddPost';
import { withRouter } from 'react-router';
// Components
import Notifications from './Notifications';
import Searchbar from './Searchbar';
// REDUX
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/userActions';
// MUI (Material-UI)
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar'; // importing each component 1 by 1 takes less compiling time
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

// import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import VermilionLogo from '../../images/vermilion-logo.png';

const styles ={
    profile: {
        '& .text': {
            color: '#ffffff',
            paddingLeft: 12,
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    },
    button: {
        marginLeft: 10
    }
};
class Navbar extends Component {

    handleLogout = () => {
        this.props.logoutUser();
    }
    
    render() {
        const { classes, authenticated, credentials: { handle, imageUrl } } = this.props;

        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <div>
                                <IconButton component={Link} to={`/`}>
                                    <Avatar src={VermilionLogo} alt="VermilionLogo" />
                                </IconButton>
                                <Searchbar/>
                            </div>
                            <div>
                                <AddPost />
                                <Link to="/">
                                    <ToolTip title="Home">
                                        <IconButton>
                                            <HomeIcon color="secondary" />
                                        </IconButton>
                                    </ToolTip>
                                </Link>
                            </div>
                            <div>
                                <ToolTip title="My Profile" className={classes.profile}>
                                    <IconButton component={Link} to={`/user/${handle}`}>
                                        <Avatar alt="Profile Image" src={imageUrl} />
                                        <Typography className='text'>{handle}</Typography>
                                    </IconButton>
                                </ToolTip>
                                <Notifications />
                                <ToolTip title="Logout">
                                    <IconButton onClick={this.handleLogout}>
                                        <LogoutIcon color="primary"/>
                                    </IconButton>
                                </ToolTip>
                            </div>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <div>
                                <IconButton component={Link} to={`/`}>
                                    <Avatar src={VermilionLogo} alt="VermilionLogo" />
                                </IconButton>
                                <Searchbar />
                            </div>
                            <Link to="/">
                                <ToolTip title="Home">
                                    <IconButton>
                                        <HomeIcon />
                                    </IconButton>
                                </ToolTip>
                            </Link>
                            <div>
                                <Button className={classes.button} variant="contained" color="primary" component={Link} to='/login'>
                                    Login
                                    </Button>
                                <Button className={classes.button} variant="contained" color="secondary" component={Link} to='/signup'>
                                    Signup
                                </Button>
                            </div>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    credentials: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
    credentials: state.user.credentials
});

export default connect(mapStateToProps, { logoutUser })(withStyles(styles)(withRouter(Navbar)));
