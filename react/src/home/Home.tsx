import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component<any> {

    move(link:string) {
        this.props.history.push(link)
    }

    render() {
        return (
            <div>
                <h2>
                    홈
                </h2>
                <div><a onClick={()=> this.move("/about")}>about</a></div>
                <div><a onClick={()=> this.move("/message")}>message</a></div>
                <div><Link to="/signin">signin</Link></div>
                <div><Link to="/signup">signup</Link></div>
            </div>
        );
    }
}

export default Home;