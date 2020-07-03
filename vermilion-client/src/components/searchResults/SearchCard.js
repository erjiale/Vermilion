import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
// MUI 
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
// MUI Icons
import PersonAddIcon from '@material-ui/icons/PersonAdd';;

const styles = {
    root: {
        maxWidth: 170,
        position: 'relative'
    },
    media: {
        height: 170,
        width: '100%',
        objectFit: 'cover',
        margin: 'auto',
    },
    cardText: {
        textAlign: 'center',
        // madWidth: 150,
        // overflow: 'hidden',
        // textOverflow: 'ellipsis'
    },
    iconButton: {
        position: 'absolute',
        zIndex: '1',
        left: '69%',
    }
};

class SearchCard extends Component {
    render() {
        const { classes, user, userImage } = this.props;

        return (
            <Fragment key={user}>
                <Card className={classes.root}>
                        <ToolTip title="Add friend">
                            <IconButton className={classes.iconButton}>
                                <PersonAddIcon color="primary"/>
                            </IconButton>
                        </ToolTip>
                    <CardActionArea component={Link} to={`/user/${user}`}>
                        <CardMedia
                        className={classes.media}
                        image={userImage}
                        title={user}
                        />
                        <CardContent>
                            <Typography noWrap variant="h5" className={classes.cardText}>
                                {user}
                            </Typography>
                        </CardContent>
                    </CardActionArea>                
                </Card>
            </Fragment>
        )
    }
}

export default withStyles(styles)(SearchCard);