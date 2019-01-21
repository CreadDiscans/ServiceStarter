import React from 'react';
import { Link } from 'react-router-dom';

const ThemeHeader = () => {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div className="container d-flex flex-column flex-md-row">
          <Link className="navbar-brand col-sm-3 col-md-2 mr-0" to="/">Service Starter</Link>
          {
            process.env.NODE_ENV === 'development' && 
            (
              <React.Fragment>
                <Link className="py-2 d-none d-md-inline-block text-muted" to="/theme-test">theme test</Link>
              </React.Fragment>
            )
          }
        </div>
      </nav>
    );
};

export default ThemeHeader;