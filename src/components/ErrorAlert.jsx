import React from 'react';
export default function ErrorAlert({ errorMessage }) {
    if (errorMessage !== "") {
        return (
            <div className="alert alert-danger" role="alert">{errorMessage}</div>
        );
    }
    return null;
}