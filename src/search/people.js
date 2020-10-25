import React from "react";
import NavBar from "../common/navbar";
import PeopleResult from "./peopleResult";
import "./search.css";
import Fuse from 'fuse.js';
import axios from 'axios';
import peopleExample from "../datasets/peopleExample.json"
import { API_DOMAIN } from "../config";

// export default function PeopleSearch() {
//     return (
//         <PeopleSearchPage />
//     )
// }

export default class PeopleSearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // users: peopleExample,
            search: null,
            userdata: null,
            searchResults: []
        };

        this.getSearch = this.getSearch.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
    }

    async componentDidUpdate(){
        // only update search if the search changes
        if (this.props.match.params.query != this.state.search){
            await this.updateSearch();
        }
    }

    async componentDidMount(){
        await this.updateSearch();        
    }

    async updateSearch(){
        this.setState( {
            search: this.props.match.params.query
        })

        // fetch users from API
        await axios.get(API_DOMAIN+'/users')
            .then(res => {
                this.setState({
                    userdata: res.data
                });
            })
            .catch(err => {
                console.error(err);
            });

        this.getSearch();
        
    }

    getSearch() {
        if (this.state.userdata == null){
            this.setState({
                searchResults: []
            });
        }

        this.fuse = new Fuse(this.state.userdata, {
            keys: [
                'firstname',
                'lastname',
                'username'
            ],
            includeScore: true
        })

        // automatically orders results by how cloesly it matches
        const results = this.fuse.search(this.state.search);

        this.setState({
            searchResults: results.map(result => result.item)
        });

        console.log(this.state.searchResults);

    }

    render() {
        if (this.state.searchResults == []){
            return(
                <div>
                    <NavBar isHome={false} />
                </div>
            )
        }
        return (
            <div>
                <NavBar isHome={false}/>
                <div className="resultsContainer">
                    <div className="searchDescription">
                        <h2> Search results for {this.state.search}</h2>
                        {this.state.searchResults.map(function(userItem, i){
                            return <PeopleResult user={userItem} key={i} />;
                        })}
                    </div> 
                </div> 
            </div>
        )
    }
}