import React from "react";
import { Divider, Header } from "semantic-ui-react";
import style from "./sidebar.module.css";

export const Sidebar = (props) => (
    <div className={style.wrap}>
        <Header
            content="A-Frame Meetings"
            icon="street view"
        />

        <Divider />

        {props.children}
    </div>
);
