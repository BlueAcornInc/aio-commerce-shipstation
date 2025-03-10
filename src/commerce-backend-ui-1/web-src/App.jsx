// src/commerce-backend-ui-1/web-src/App.jsx
import React from 'react';
import { Provider } from '@react-spectrum/provider';
import { theme } from '@react-spectrum/theme-default';
import ShipstationConfigForm from './ShipstationConfigForm.jsx';
import ExtensionRegistration from './ExtensionRegistration.jsx';
import ReactDOM from 'react-dom';

export default function App() {
    // Default to mock URL if process is undefined (browser)
    const isDev = typeof process === 'undefined' || process.env.NODE_ENV === 'development';
    const namespace = (typeof process !== 'undefined' && process.env.__OW_NAMESPACE) || '35582-shipstation-stage';
    const appName = 'aio-commerce-shipstation-app';
    const ACTION_URL = isDev
        ? 'http://localhost:8080/mock-config'
        : `${window.location.origin}/api/v1/web/${namespace}-${appName}/shipstation-config`;
    console.log('ACTION_URL:', ACTION_URL);

    return (
        <Provider theme={theme} colorScheme="light">
            <ExtensionRegistration />
            <ShipstationConfigForm actionUrl={ACTION_URL} />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));