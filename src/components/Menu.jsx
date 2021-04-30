import React from 'react';
import { Link } from 'react-router-dom';

export function Menu(props) {
    return (
        <div className="d-grid gap-2">
            {props.children}
        </div>
    );
}

export function MenuItem({ name, path }) {
    return (
        <Link className="btn btn-primary" to={path}>{name}</Link>
    );
}