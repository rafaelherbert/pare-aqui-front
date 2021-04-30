import React from 'react';
import { Menu, MenuItem } from '../components/Menu.jsx';

export default function Landing () {
    return (
        <div>
            <Menu>
                <MenuItem name="Buscar Vagas" path="/lots"></MenuItem>
                <MenuItem name="Login" path="/login"></MenuItem>
            </Menu>
        </div>
    );
}