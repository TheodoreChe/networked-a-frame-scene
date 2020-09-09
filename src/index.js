import socketIOClient from "socket.io-client";
import 'aframe';
import 'aframe-state-component';
import 'networked-aframe';
import React from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './react-components/sidebar';
import { Messenger } from './react-components/messenger';
import 'semantic-ui-css/semantic.min.css';

window.io = socketIOClient;
window.io('ws://localhost:4001');

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
        message: 'Alex Moore:\nThanks. See you tomorrow.\n\n'
    },
});

document.addEventListener("DOMContentLoaded", onReady);
