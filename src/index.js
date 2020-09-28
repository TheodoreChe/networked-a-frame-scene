import socketIOClient from "socket.io-client";
import 'aframe';
import 'aframe-state-component';
import 'networked-aframe';
import React from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './react-components/sidebar';
import { Messenger } from './react-components/messenger';
import 'semantic-ui-css/semantic.min.css';

const PORT = process.env.SERVER_PORT || 4001;
const SERVER_URL = process.env.SERVER_URL || 'ws://localhost';

window.io = socketIOClient;
window.io(`${SERVER_URL}:${PORT}`);

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
