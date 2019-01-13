import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import * as A from 'app';

class DataTest extends Component {

    sideMenu = [{
        name: 'board',
        items: [
            {name:'board', link:'/data-test/board'}, 
        ]
    }]

    
    render() {
        return (
            <React.Fragment>
                <A.ThemeHeader />
                <A.ThemeContent sideMenu={this.sideMenu}>
                    <Switch>
                        <Route path="/data-test/board" component={A.DataTestBoard} />
                    </Switch>
                </A.ThemeContent>
                <A.ThemeFooter />
            </React.Fragment>
        );
    }
};

export default DataTest;
