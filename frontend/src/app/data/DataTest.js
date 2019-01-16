import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import {ThemeHeader, ThemeContent, ThemeFooter} from 'app';
import DataService from 'service/DataService';
import * as A from './index';

class DataTest extends Component {

    state = {
        'home': [
            {name:'user', link:'/data-test/home/user'},
            {name:'group', link:'/data-test/home/group'},
            {name:'sign', link:'/data-test/home/sign'},
        ],
        'api': [

        ]
    };
    componentDidMount() {
        const dataService = new DataService();
        dataService.select('spec/').subscribe(json=> {
            json.forEach(item=> {
                this.state['api'].push({
                    name: item['name'],
                    link: '/data-test/api/'+item['url']
                })
            });
            this.setState({}); 
        });
    }
    
    render() {
        return (
            <React.Fragment>
                <ThemeHeader />
                <ThemeContent sideMenu={this.state}>
                    <Switch>
                        <Route path="/data-test/home/user" component={A.DataTestHomeUser} />
                        <Route path="/data-test/home/group" component={A.DataTestHomeGroup} />
                        <Route path="/data-test/home/sign" component={A.DataTestHomeSign} />
                        <Route path="/data-test/api" component={A.DataTestApi} />
                    </Switch>
                </ThemeContent>
                <ThemeFooter />
            </React.Fragment>
        );
    }
};

export default DataTest;
