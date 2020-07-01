import React, {Fragment} from 'react';
import NoImg from '../images/no-img.png';
import PropTypes from 'prop-types';
// MUI 
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

const styles = ({
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    cardContent: {
        width: '100%',
        flexDirection: 'column',
        padding: 25,
        position: 'relative'
    },
    coverImage: {
        minWidth: 200,
        objectFit: 'cover'
    },
    handle: {
        width: 60,
        height: 22,
        backgroundColor: '#ffb74d',
        marginBottom: 7,
        marginTop: 7
    },
    date: {
        width: 100,
        height: 14,
        backgroundColor: 'rgba(0,0,0, 0.2)',
        marginBottom: 8
    },
    fullLine: {
        width: '90%',
        height: 12,
        backgroundColor: 'rgba(0,0,0, 0.6)',
        marginBottom: 10
    },
    halfLine: {
        width: '50%',
        height: 12,
        backgroundColor: 'rgba(0,0,0, 0.6)',
        marginBottom: 10
    }

});

const PostSkeleton = (props) => {
    const { classes } = props;

    return (
        <Fragment>
            {Array.from({ length: 5 }).map((item, index) => (
                <Card className={classes.card} key={index}>
                    <CardMedia className={classes.coverImage} image={NoImg}/>
                    <CardContent className={classes.cardContent}>
                        <div className={classes.handle}/>
                        <div className={classes.date}/>
                        <div className={classes.fullLine}/>
                        <div className={classes.fullLine}/>
                        <div className={classes.halfLine}/>
                    </CardContent>
                </Card>
            ))}
        </Fragment>
    )
}

PostSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PostSkeleton);