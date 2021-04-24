import React from 'react';
import { Menu, MenuItem } from '../components/Menu.jsx';
import UserManager from '../UserManager.js';

export default function Home () {
    return (
        <div>
            <p className="text-center">Bem vindo, {UserManager.getUser().nome}!</p>
            <Menu>
                <MenuItem name="Buscar Vagas" path="/lots"></MenuItem>
                <MenuItem name="Agendar Vagas" path="/lots/assign"></MenuItem>
                <MenuItem name="Histórico de Vagas" path="/lots/history"></MenuItem>
                <MenuItem name="Configurações" path="/config"></MenuItem>
                <MenuItem name="Relatar Flanelinha" path="/report"></MenuItem>
                <MenuItem name="Logout" path="/logout"></MenuItem>
            </Menu>
        </div>
    );
}