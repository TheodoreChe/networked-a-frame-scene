import React from "react";
import { Button, Comment, Divider, Form } from "semantic-ui-react";

export const Messenger = () => (
    <>
        <Form>
            <Form.Field>
                <label>Name</label>
                <input />
            </Form.Field>
            <Form.TextArea />
            <Button content='Add Reply' primary />
        </Form>

        <Divider />

        <Comment.Group>
            <Comment>
                <Comment.Author as='a'>Alex Moore</Comment.Author>
                <Comment.Metadata>
                    <div>Today at 5:42PM</div>
                </Comment.Metadata>
                <Comment.Text>Thanks. See you tomorrow.</Comment.Text>
            </Comment>
        </Comment.Group>
    </>
);
