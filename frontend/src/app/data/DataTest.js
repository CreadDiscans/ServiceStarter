import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import {ThemeHeader, ThemeContent, ThemeFooter} from 'app';
import * as A from './index';

class DataTest extends Component {

    menus = [
        {group: 'home', name:'user', link:'/data-test/home/user'},
        {group: 'home', name:'group', link:'/data-test/home/group'},
        {group: 'home', name:'sign', link:'/data-test/home/sign'},
        // data test inserted automatically
    ]

    
    render() {
        this.sideMenu = []
        let group = {}
        this.menus.forEach(item=> {
            if (item.group in group) {
                group[item.group].push(item);
            } else {
                group[item.group] = [item];
            }
        });
        for(let g in group) {
            this.sideMenu.push({
                name: g,
                items: group[g]
            });
        }

        return (
            <React.Fragment>
                <ThemeHeader />
                <ThemeContent sideMenu={this.sideMenu}>
                    <Switch>
                        <Route path="/data-test/home/user" component={A.DataTestHomeUser} />
                        <Route path="/data-test/home/group" component={A.DataTestHomeGroup} />
                        <Route path="/data-test/home/sign" component={A.DataTestHomeSign} />
                        {/* data test inserted automatically */}
                    </Switch>
                </ThemeContent>
                <ThemeFooter />
            </React.Fragment>
        );
    }
};

export default DataTest;
