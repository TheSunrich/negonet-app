import React from 'react'
import '../styles/principal.css';
import logoimg from '../assets/imgs/negonet logo.png';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const NavBar = ({ children }) => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bar">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"><img src={logoimg} width="33" /></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" relative="path" className="nav-link">NegoNet</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" relative="path" className="nav-link">Página Principal</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Agenda una Cita</a>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" relative="path" className="nav-link">Iniciar Sesión</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Dar Servicio</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Contáctanos</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
            <Footer/>
        </>
    )
}

export default NavBar