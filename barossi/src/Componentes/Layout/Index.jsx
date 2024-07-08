import React from 'react'
import { Outlet } from "react-router-dom";
import { Cabecalho } from "./Cabecalho/Index";
import { Menu } from "./Menu/Index";

export function Layout() {
    return (
        <div className="main">
            <Cabecalho />
            <div className="main__container">
                <Menu />
                <Outlet />
            </div>
        </div>
    )
}