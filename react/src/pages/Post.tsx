import React from 'react';

const Post = ({match}:any) => {
    return (
        <div>
            포스트 {match.params.id}
        </div>
    );
};

export default Post;