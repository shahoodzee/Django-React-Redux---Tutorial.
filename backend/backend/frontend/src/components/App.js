import React, { Component, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './layout/Header';
import Dashboard from './leads/Dashboard';
import { Provider } from 'react-redux';
import store from '../store';


class App extends Component {
    render() {
        return (
            <Provider store = {store}>
            <Fragment>
                <Header/>
                <div className='container'>
                    <Dashboard />
                </div>
            </Fragment> 
            </Provider>
        );
    }
}

const root = document.getElementById('app');
if (root) {
    const reactRoot = createRoot(root);
    reactRoot.render(<App />);
}
