import React from "react";
import ReactDOM from "react-dom";
import { Sidebar } from "./react-components/sidebar";
import 'semantic-ui-css/semantic.min.css'
import {Messenger} from "./react-components/messenger";

function Root() {
    return (
        <Sidebar>
            <Messenger />
        </Sidebar>
    );
}

ReactDOM.render(<Root />, document.getElementById("ui-root"));