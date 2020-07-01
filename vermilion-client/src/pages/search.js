import React, { Component } from 'react'
import PropTypes from 'prop-types';
// Components
import SearchCard from '../components/searchResults/SearchCard';
// Redux
import { connect } from 'react-redux';
import { searchUsers } from '../redux/actions/dataActions';
// MUI 
import Typography from '@material-ui/core/Typography';

class search extends Component {
    constructor() {
        super();
        this.state = {
            query: window.location.search.split('=')[1]
        }
    }

    componentDidMount() {
        console.log('query: ' + this.state.query);

        if(this.state.query !== "") {
            this.props.searchUsers(this.state.query);
        }
    }

    componentDidUpdate() {
        let newQuery = window.location.search.split('=')[1];
        if(newQuery !== "" && newQuery !== this.state.query) {
            this.setState({
                query: newQuery
            })
            this.props.searchUsers(newQuery);
        }
    }
    
    render() {
        const { data: { searchedUsers, loading } } = this.props;

        return (
            <div>
                <h1>Search results for '{this.state.query}'</h1>
                {loading ? (
                    <Typography>searching user...</Typography>
                ) : (
                    <div>
                        {searchedUsers[0] ? (searchedUsers.map(user => 
                                <SearchCard key={user.user} user={user.user} userImage={user.userImage}/>)
                        ) : (
                            <p>No results found</p>
                        )}
                    </div>
                )}
            </div>
        )
    }
}

search.propTypes = {
    data: PropTypes.object.isRequired,
    searchUsers: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, { searchUsers })(search);