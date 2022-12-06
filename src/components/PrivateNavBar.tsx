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
    console.log(imgurl)
    if (state === 2) {
        return (
            <>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-auto bar'>
                            <div className="d-flex flex-column flex-shrink-0 p-3 bar text-light barwidth">
                                <a href="/main" className="d-flex align-items-center link-light text-decoration-none">
                                    <span className="fs-4"><img src={logoimg} width="30" /><b className='ms-3'>Perfil</b></span>
                                </a>
                                <hr />
                                <ul className="nav nav-pills flex-column mb-auto">
                                <li className="nav-item">
                                        <a href="#" className="nav-link link-light" aria-current="page">
                                            Servicios
                                        </a>
                                    </li>
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
                                    {!user.isService ?
                                        <li className='nav-item'>
                                            <a href="#" className="nav-link link-light">
                                                Dar Servicio
                                            </a>
                                        </li>
                                        :""
                                    }
                                </ul>
                                {/*Esta parte es para aquellos usuarios que brindan servicio*/
                                    user.isService ?
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
                                        : ""
                                }

                                <hr />
                                <div className="dropdown">
                                    <a href="#" className="d-flex align-items-center link-light text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={user.imageUrl} alt="" width="32" height="32" className="rounded-circle me-2" />
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
                        <div className='col-10'>
                            <Outlet />
                        </div>
                    </div>
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