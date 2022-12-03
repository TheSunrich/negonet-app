import React, { useEffect, useState } from 'react'
import logoimg from '../assets/imgs/servicios.png';
import googlelogo from '../assets/imgs/google.png';
import { Link, useLocation, useParams, Navigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const Loading = () => {
    return (
        <div className='row justify-content-center text-center loadpage container-fluid'>
            <div className='col align-self-center'>
                <h1>Cargando</h1>
                <br />
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>

        </div>
    )
}

export default Loading