import 'aframe';
import 'aframe-state-component';
import React from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './react-components/sidebar';
import { Messenger } from './react-components/messenger';
import 'semantic-ui-css/semantic.min.css';

function mountUI() {
    ReactDOM.render(
        <Sidebar>
            <Messenger />
        </Sidebar>,
        document.getElementById("ui-root")
    );
}

const onReady = () => {
    mountUI();
};

AFRAME.registerState({
    initialState: {
        message: 'Sample message'
    },
});

document.addEventListener("DOMContentLoaded", onReady);
