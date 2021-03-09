/*
File: SearchAPI.js
?: Searches the recipepuppy API for recipes that match the searchTerm.
*/
import React, { useEffect } from 'react'
const axios = require('axios').default;

export default function SearchAPI({ searchTerm, curPage, setResults, setSearching }) {
    //On mount, search the API for the recipe and the set searching to false. 
    //Uses axios (basically fetch but easy to set up CORS)
    useEffect(() => {
        const fetchResults = () => {
            const formattedSearch = searchTerm.replace(" ", ",");
            // console.log(formattedSearch);
            
            
            axios.get('/api/?i=' + formattedSearch + '&p=' + curPage, { "Access-Control-Allow-Origin": "*" })
                .then(res => {
                    let found = [];
                    for(let i in res["data"]["results"]) {
                        if(!res["data"]["results"][i]["title"].includes('"') 
                        && !res["data"]["results"][i]["title"].includes("'") 
                        && !res["data"]["results"][i]["title"].includes('&')) {
                            found = [...found, res["data"]["results"][i]];
                        }
                        
                    }
                    // console.log(found);
                    setResults(found);
                    
                });

        };

        fetchResults();
        setSearching(false);
    }, []);

    return <></>;
    
}
