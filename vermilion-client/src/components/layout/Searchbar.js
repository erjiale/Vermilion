import React, { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
// MUI Icons
import SearchIcon from '@material-ui/icons/Search';
// Redux
import { connect } from 'react-redux';
import { searchUsers } from '../../redux/actions/dataActions';

const styles = {
    searchBar: {
        backgroundColor: 'rgba(225, 100, 100, 0.4)',
        float: 'right',
        marginTop: 10,
        '&:hover': {
            backgroundColor: 'rgba(225, 100, 100, 0.8)'
        }
    },
    input: {
        marginLeft: 10,
        flex: 1,
        color: 'white'
    },
    iconButton: {
        padding: 10
    }
};

class Searchbar extends Component {
    constructor() {
        super();
        this.state = {
            query: ""
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    // componentDidMount() {
    //     this.setState({
    //         query: ""
    //     })
    // }
    handleSubmit = (event) => {
        event.preventDefault();
        
        if(this.state.query !== "") {
            this.props.history.push(`/search/?q=${this.state.query}`);
            // this.props.history.push(`/search/search`);
            // this.props.searchUsers(this.state.query);
        }
    }

    render() {
        const { classes } = this.props;
        const { query } = this.state;
        return (
            <Fragment>
                <Paper className={classes.searchBar}>
                    <form onSubmit={this.handleSubmit}>
                        <InputBase
                            className={classes.input}
                            name="query"
                            value={query}
                            placeholder="Search for friends"
                            onChange={this.handleChange}
                        />
                        <ToolTip title="Search">
                            <IconButton type="submit" className={classes.iconButton}>
                                <SearchIcon/>
                            </IconButton> 
                        </ToolTip>
                    </form>
                </Paper> 
            </Fragment>
        )
    }
}

export default connect(null, { searchUsers })(withStyles(styles)(withRouter(Searchbar)));
