import React from 'react';
import queryString from 'query-string';

const About = ({location, match}:any) => {
    const query = queryString.parse(location.search);

    const detail = query.detail === 'true';
    const { name } = match.params;

    return (
        <div>
            <h2>About {name}</h2>
            {detail && 'detail: blahblah'}
        </div>
    );
};

export default About;