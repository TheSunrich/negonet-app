import React, { useEffect, useState } from 'react'
import logoimg from '../assets/imgs/servicios.png';
import googlelogo from '../assets/imgs/google.png';
import { Link, useLocation, useParams, Navigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const Loading = () => {
    /*
    0: inicializado
    1: loading
    2: login completo
    3: login pero sin registro
    4: no hay nadie logueado
    */
    const [state, setCurrentSate] = useState(0);
    useEffect(() => {
        setCurrentSate(1);
        onAuthStateChanged(auth, handleUserStateChanged);
    }, []);

    function handleUserStateChanged(user) {
        if (user) {
            setCurrentSate(3);
            console.log(user.displayName);
        } else {
            setCurrentSate(4);
            console.log("No hay nadie autenticado...");
        }
    }
    if(state == 3){
        return <Navigate to="/register"/>
    }


    return (
        <div className='row justify-content-center text-center loadpage container-fluid'>
            <div className='col align-self-center'>
                <h1>Loading</h1>
                <br />
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>

        </div>
    )
}

export default Loading