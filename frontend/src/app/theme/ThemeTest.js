import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import * as A from 'app';

class ThemeTest extends Component {

    sideMenu = [{
        name: 'board',
        items: [
            {name:'list', link:'/theme-test/board/list'}, 
            {name:'detail', link:'/theme-test/board/detail'},
            {name:'editor', link:'/theme-test/board/editor'},
        ]
    }]

    render() {
        return (
            <React.Fragment>
                <A.ThemeHeader />
                <A.ThemeContent sideMenu={this.sideMenu}>
                    <Switch>
                        <Route path="/theme-test/board/list" component={A.ThemeBoardListTest} />
                        <Route path="/theme-test/board/detail" component={A.ThemeBoardDetailTest} />
                        <Route path="/theme-test/board/editor" component={A.ThemeBoardEditorTest} />
                    </Switch>
                </A.ThemeContent>
                <A.ThemeFooter />
            </React.Fragment>
        );
    }
};

export default ThemeTest;