import React from 'react';
// import queryString from 'query-string';

const About = ({location, match}:any) => {
    // const query = queryString.parse(location.search);
    console.log(location);

    return (
        <div>
            <h2>About {match.params.name}</h2>
        </div>
    );
};

export default About;