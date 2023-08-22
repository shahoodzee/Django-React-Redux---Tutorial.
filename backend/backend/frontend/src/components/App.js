import React, { Component, Fragment } from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import store from '../store';

import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import Header from './layout/Header';
import Dashboard from './leads/Dashboard';
import Alert from './layout/Alerts';

// Alert Options
const alertOptions = {
    timeout: 3000,
    position: 'top center',
};

class App extends Component {
    render() {
        return (
            <Provider store = {store}>
            <AlertProvider template={AlertTemplate}{...alertOptions}> 

            <Fragment>
            <Alert/>    
                <Header/>
                <div className='container'>
                    <Dashboard />
                </div>
            </Fragment> 
            </AlertProvider>
            </Provider>
        );
    }
}

const root = document.getElementById('app');
if (root) {
    const reactRoot = createRoot(root);
    reactRoot.render(<App />);
}
