import '../styles/principal.css';
import logoimg from '../assets/imgs/negonet logo.png';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import { auth, existsUser, getUser, updateUser } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { User } from '../models/UserModel';
import Swal from 'sweetalert2';


const PrivateNavBar = ({ children }) => {
    useEffect(() => {
        onAuthStateChanged(auth, handleUserStateChanged);
    }, []);
    const navigate = useNavigate();
    const [state, setSate] = useState(0);
    let userData: User;
    const [user, setUser] = useState(userData);
    const [imgurl, setImage] = useState(0);
    const [email, setEmail] = useState({ email: "", subject: "", message: "" })

    function handleChange(e) {
        setEmail({
            ...email,
            [e.target.name]: e.target.value
        })
    }
    async function handleSubmitEmail(e) {
        e.preventDefault();
        emailjs.send("service_twzyttc", "template_l8iervk", {
            subject: email.subject,
            email: email.email,
            message: email.message,
        }, 'WYN-KBuNfBcx9Yi38').then(element => {
            Swal.fire({
                title: 'Correo Enviado',
                html: 'NegoNet ha recibido tu correo, te responderemos lo antes posible',
                icon: 'success'
            });
            setEmail({
                email: user.email,
                subject: "",
                message: ""
            })
        })
    }
    async function handleUserStateChanged(u) {
        if (u) {
            const exists = await getUser(u.uid);
            setUser({
                ...exists
            })
            setEmail({
                ...email,
                email: exists.email
            })
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
        auth.signOut();
    }
    if (state === 2) {
        return (
            <>
                <div className='container-fluid fullwidth'>
                    <div className='row'>
                        <div className='col-2 bar' id='lateralbar' style={{ position: "fixed", backgroundColor: user.backgroundColor2 ? user.backgroundColor2 : "#1392c4" }}>
                            <div className="d-flex flex-column flex-shrink-0 p-3 bar text-light barwidth" id='insidelateralbar' style={{ backgroundColor: user.backgroundColor2 ? user.backgroundColor2 : "#1392c4" }}>
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
                                        <img src={user.imageUrl} alt="" width="32" height="32" className="rounded-circle me-2 imgcover" />
                                        <strong>{user.firstName}</strong>
                                    </a>
                                    <ul className="dropdown-menu text-small shadow">
                                        <li><a className="dropdown-item" href='#' data-bs-toggle="modal" data-bs-target="#contactoModal">Contáctanos</a></li>
                                        <li><a className="dropdown-item" href="https://drive.google.com/file/d/1mH58_uNMNAd1tcXJ2As2fRj51y0QC1kl/view?usp=share_link" target="_blank">Aviso de Privacidad</a></li>
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
                <header id="responsivenavbar" className="p-3 mb-3 border-bottom navbartopmain minwidth" style={{ backgroundColor: user.backgroundColor2 ? user.backgroundColor2 : "#1392c4" }}>
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
                                    <img src={user.imageUrl} alt="" width="32" height="32" className="rounded-circle imgcover" />
                                    <strong className='ms-2'>{user.firstName}</strong>
                                </a>
                                <ul className="dropdown-menu text-small shadow">
                                    <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#contactoModal">Contáctanos</a></li>
                                    <li><a className="dropdown-item"  href="https://drive.google.com/file/d/1mH58_uNMNAd1tcXJ2As2fRj51y0QC1kl/view?usp=share_link" target="_blank">Aviso de Privacidad</a></li>
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
                <div className="modal fade" id="contactoModal" aria-labelledby="contactoModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="contactoModalLabel">Escribe un Comentario</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmitEmail}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">Correo de Contacto <b className='obligatorio'>*</b></label>
                                        <input name='email' onChange={handleChange} type="email" className="form-control" id="exampleInputEmail1" required value={email.email} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">Asunto <b className='obligatorio'>*</b></label>
                                        <input name='subject' onChange={handleChange} type="text" className="form-control" id="exampleInputEmail1" maxLength={100} required value={email.subject} />
                                        <div id="emailHelp" className="form-text">Solo cuentas con 80 caracteres</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputPassword1" className="form-label">Comentario <b className='obligatorio'>*</b></label>
                                        <textarea name='message' onChange={handleChange} className="form-control" aria-label="With textarea" maxLength={500} required value={email.message} ></textarea>
                                        <div id="emailHelp" className="form-text">500 caracteres</div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Enviar Comentario</button>
                                </form>
                            </div>
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