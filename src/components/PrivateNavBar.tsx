import React from 'react'
import '../styles/principal.css';
import logoimg from '../assets/imgs/negonet logo.png';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const PrivateNavBar = ({ children }) => {
    return (
        <>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2 bar'>
                        <div className="d-flex flex-column flex-shrink-0 p-3 bar text-light barwidth">
                            <a href="/" className="d-flex align-items-center link-light text-decoration-none">
                                <span className="fs-4"><img src={logoimg} width="30" /><b className='ms-3'>Perfil</b></span>
                            </a>
                            <hr />
                            <ul className="nav nav-pills flex-column mb-auto">
                                <li className="nav-item">
                                    <a href="#" className="nav-link link-light" aria-current="page">
                                        Mis Citas
                                    </a>
                                </li>
                                <li className='nav-item'>
                                    <a href="#" className="nav-link link-light">
                                        Información Personal
                                    </a>
                                </li>
                            </ul>
                            {/*Esta parte es para aquellos usuarios que brindan servicio*/}
                            <ul className="nav nav-pills bg-light rounded flex-column mt-1">
                                <li className='nav-item'>
                                    <a href="#" className="nav-link link-dark">
                                        Horarios
                                    </a>
                                </li>
                                <li className='nav-item'>
                                    <a href="#" className="nav-link link-dark">
                                        Ver Citas
                                    </a>
                                </li>
                                <li className='nav-item'>
                                    <a href="#" className="nav-link link-dark">
                                        Configurar Servicio
                                    </a>
                                </li>
                            </ul>
                            <hr />
                            <div className="dropdown">
                                <a href="#" className="d-flex align-items-center link-light text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                                    <strong>mdo</strong>
                                </a>
                                <ul className="dropdown-menu text-small shadow">
                                    <li><a className="dropdown-item" href="#">New project...</a></li>
                                    <li><a className="dropdown-item" href="#">Settings</a></li>
                                    <li><a className="dropdown-item" href="#">Profile</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Sign out</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-10'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrivateNavBar