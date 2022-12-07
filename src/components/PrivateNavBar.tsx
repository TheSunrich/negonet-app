import '../styles/principal.css';
import logoimg from '../assets/imgs/negonet logo.png';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import { auth, existsUser, getUser, updateUser } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { User } from '../models/UserModel';


const PrivateNavBar = ({ children }) => {
    useEffect(() => {
        onAuthStateChanged(auth, handleUserStateChanged);
    }, []);
    const navigate = useNavigate();
    const [state, setSate] = useState(0);
    let userData: User;
    const [user, setUser] = useState(userData);
    const [imgurl, setImage] = useState(0);
    async function handleUserStateChanged(u) {
        if (u) {
            const exists = await getUser(u.uid);
            setUser({
                ...exists
            })
            console.log(exists)
            setImage(u.photoURL)
            setSate(2);
        } else {
            setSate(4);
        }
    }
    async function handleUserLoggedIn(u) {
        setSate(2);
    }
    function handleUserUserNotRegistered(user) {
        navigate("/register");
    }
    function handleUserNotLoggedIn(user) {
        setSate(4);
        navigate("/login");
    }

    function logOut() {
        console.log("logout")
        auth.signOut();
    }
    if (state === 2) {
        return (
            <>
                <div className='container-fluid fullwidth'>
                    <div className='row'>
                        <div className='col-2 bar' id='lateralbar' style={{position: "fixed", backgroundColor: user.backgroundColor2 ? user.backgroundColor2 : "#1392c4"}}>
                            <div className="d-flex flex-column flex-shrink-0 p-3 bar text-light barwidth" id='insidelateralbar' style={{backgroundColor: user.backgroundColor2 ? user.backgroundColor2 : "#1392c4"}}>
                                <Link to="/main" relative='path' className="d-flex align-items-center link-light text-decoration-none">
                                    <span className="fs-4"><img src={logoimg} width="30" /><b className='ms-3'>Perfil</b></span>
                                </Link>
                                <hr />
                                <ul className="nav nav-pills flex-column mb-auto">
                                    <li className="nav-item">
                                        <Link to="/main" relative="path" className="nav-link link-light">Servicios</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/main/reservation" relative="path" className="nav-link link-light">Mis Citas</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link to="/main/information" relative="path" className="nav-link link-light">Información Personal</Link>
                                    </li>
                                    {!user.isService ?
                                        <li className='nav-item'>
                                            <Link to="/main/admin" relative="path" className="nav-link link-light">Dar Servicio</Link>
                                        </li>
                                        : ""
                                    }
                                </ul>
                                {/*Esta parte es para aquellos usuarios que brindan servicio*/
                                    user.isService ?
                                        <ul className="nav nav-pills bg-light rounded flex-column mt-1">
                                            <li className='nav-item'>
                                                <Link to="/main/appointment" relative="path" className="nav-link link-dark">Ver Citas</Link>
                                            </li>
                                            <li className='nav-item'>
                                                <Link to="/main/settings" relative="path" className="nav-link link-dark">Configurar Servicio</Link>
                                            </li>
                                        </ul>
                                        : ""
                                }

                                <hr />
                                <div className="dropdown">
                                    <a href="#" className="d-flex align-items-center link-light text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={user.imageUrl} alt="" width="32" height="32" className="rounded-circle me-2 imgcover"/>
                                        <strong>{user.firstName}</strong>
                                    </a>
                                    <ul className="dropdown-menu text-small shadow">
                                        <li><a className="dropdown-item" href="#">Contáctanos</a></li>
                                        <li><a className="dropdown-item" href="#">Aviso de Privacidad</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="#" onClick={logOut}>Cerrar Sesión</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='col-10 offset-md-2'>
                            <Outlet />
                        </div>
                    </div>
                </div>
                <header id="responsivenavbar" className="p-3 mb-3 border-bottom navbartopmain minwidth" style={{ backgroundColor: user.backgroundColor2 ? user.backgroundColor2 : "#1392c4"}}>
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                            <Link to="/main" relative='path' className="d-flex align-items-center mb-2 mb-lg-0 text-light text-decoration-none">
                                <span className="fs-4"><img src={logoimg} width="30" /><b className='ms-3'>Perfil</b></span>
                            </Link>
                            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                                <li className="nav-item">
                                    <Link to="/main" relative="path" className="nav-link px-2 link-light">Servicios</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/main/reservation" relative="path" className="nav-link px-2 link-light">Mis Citas</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link to="/main/information" relative="path" className="nav-link px-2 link-light">Información Personal</Link>
                                </li>
                                {!user.isService ?
                                    <li className='nav-item'>
                                        <Link to="/main/admin" relative="path" className="nav-link px-2 link-light">Dar Servicio</Link>
                                    </li>
                                    : ""
                                }
                                {user.isService ?
                                    <li className='nav-item'>
                                        <Link to="/main/settings" relative="path" className="nav-link px-2 link-light">Configurar Servicio</Link>                                    </li>
                                    : ""
                                }
                                {user.isService ?
                                    <li className='nav-item'>
                                        <Link to="/main/appointment" relative="path" className="nav-link px-2 link-light">Ver Citas</Link>
                                    </li>
                                    : ""
                                }
                            </ul>



                            <div className="dropdown text-end">
                                <a href="#" className="d-block link-light text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={user.imageUrl} alt="" width="32" height="32" className="rounded-circle imgcover"/>
                                    <strong className='ms-2'>{user.firstName}</strong>
                                </a>
                                <ul className="dropdown-menu text-small shadow">
                                    <li><a className="dropdown-item" href="#">Contáctanos</a></li>
                                    <li><a className="dropdown-item" href="#">Aviso de Privacidad</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#" onClick={logOut}>Cerrar Sesión</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>
                <div className='container-fluid minwidth'>
                    <Outlet />
                </div>
            </>
        )
    }
    return <AuthProvider
        onUserLoggedIn={handleUserLoggedIn}
        onUserNotRegistered={handleUserUserNotRegistered}
        onUserNotLoggedIn={handleUserNotLoggedIn}>
        <Loading />
    </AuthProvider>
}

export default PrivateNavBar