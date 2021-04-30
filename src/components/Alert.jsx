import React from 'react';
export default function Alert({ message = "", type = "danger" }) {
    if (message !== "") {
        return (
            <div className={"alert alert-" + type} role="alert">{message}</div>
        );
    }
    return null;
}