import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import {ThemeHeader, ThemeFooter, ThemeContent} from 'app';
import * as T from './index';

class ThemeTest extends Component {

    sideMenu = {
        'Bootstrap': [
            {name:'alert', link:'/theme-test/bootstrap/alert'}
        ]
    }

    render() {
        return (
            <React.Fragment>
                <ThemeHeader />
                <ThemeContent sideMenu={this.sideMenu}>
                    <Switch>
                        <Route path="/theme-test/bootstrap/alert" component={T.BSAlertTest} />
                    </Switch>
                </ThemeContent>
                <ThemeFooter />
            </React.Fragment>
        );
    }
};

export default ThemeTest;