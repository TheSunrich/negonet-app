import React, { useEffect, useState } from 'react'
import logoimg from '../assets/imgs/servicios.png';
import googlelogo from '../assets/imgs/google.png';
import { Link, useLocation, useParams, Navigate } from 'react-router-dom';
import { auth, existsUser, userExists } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AuthProvider from '../components/AuthProvider';
import Loading from '../components/Loading';

function Login() {
    /*
    0: inicializado
    1: loading
    2: login completo
    3: login pero sin registro
    4: no hay nadie logueado
    5: El usuario existe
    */
    const [state, setCurrentSate] = useState(0);
    const [credentials, setCurrentCredentials] = useState({email:"", password:""});
    async function handleOnClick() {
        const googleProvider = new GoogleAuthProvider();
        await signInWithGoogle(googleProvider);

        async function signInWithGoogle(googleProvider) {
            try {
                const res = await signInWithRedirect(auth, googleProvider);
                console.log(res)
            } catch (error) {
                console.error(error);
            }
        }
    }
    async function handleChange(e){
        setCurrentCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }
    async function handleOnLogin() {
        console.log(credentials)
        const exists = await existsUser(credentials.email);
        console.log(exists)
        if(exists){
            console.log("El usuario es correcto");
            setCurrentSate(5);
        }else{
            console.log("No existe el usuario");
        }
    }
    const navigate = useNavigate();
    function handleUserLoggedIn(user) {
        navigate("/main");
    }
    function handleUserUserNotRegistered(user) {
        navigate("/register");
    }
    function handleUserNotLoggedIn() {
        //navigate("/login");
        setCurrentSate(4);
    }

    if (state === 4) {
        return (
            <>
                <div className='row container-fluid justify-content-center text-dark logincontainer'>
                    <div className='row col-md-7 mt-5 height480'>
                        <div className='col-md-6 rounded-start text-center align-self-center'>
                            <img src={logoimg} width="380"></img>
                        </div>
                        <div className='col-md-6 bg-light rounded'>
                            <div className='mb-3 mt-3 text-center'>
                                <h4>Iniciar Sesión</h4>
                            </div>
                            <hr></hr>
                            <div className="mb-3">
                                <label className="form-label"><i className="bi bi-person-circle"></i> Usuario <b className='obligatorio'>*</b></label>
                                <input name='email' onKeyUp={handleChange} type="email" className="form-control" placeholder="nombre@ejemplo.com" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><i className="bi bi-incognito"></i> Contraseña <b className='obligatorio'>*</b></label>
                                <input name='password' onKeyUp={handleChange} type="password" className="form-control" placeholder="********" />
                                <div id="emailHelp" className="form-text text-center textopregunta  ">Recuerda que NegoNet no pedirá en ningún momento tus credenciales de acceso.</div>
                            </div>
                            <div className=' text-center'>
                                <button onClick={handleOnLogin} className='btn btn-primary'>
                                    <i className="bi bi-door-open-fill"></i> Iniciar Sesión
                                </button>
                            </div>
                            <div id="emailHelp" className="form-text text-center mt-3 textopregunta">¿No tienes una cuenta?</div>
                            <div className='text-center'>
                                <Link to="/register" className='link text-info mt-2'>
                                    Regístrate
                                </Link>
                                <div id="emailHelp" className="form-text text-center textopregunta mt-3s">o</div>
                                <button type='button' onClick={handleOnClick} className='btn btn-light'>
                                    <img src={googlelogo} width="20"></img> Ingresa con Google
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container-fluid blankspace50'>

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

export default Login