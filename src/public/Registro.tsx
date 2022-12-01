import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../models/UserModel';
import { auth } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';

function Registro() {
    let userData: User = {
        email: "",
        firstName: ""
    }
    const [user, setUser] = useState(userData);
    console.log(user);
    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const [textoregistro, setTexto] = useState("Regístrate, es gratis");
    useEffect(() => {
        onAuthStateChanged(auth, handleUserStateChanged);
    }, []);
    function handleUserStateChanged(u) {
        if (u) {
            console.log(u);
            setUser({
                email: u.email,
                firstName: u.displayName
            })
            setTexto("Debes completar el registro para continuar")            

        } else {
            console.log("No hay nadie autenticado...");
        }
    }
    const handleSubmit = (e) => {
        user.isService = true;
        e.preventDefault();
    }
    return (
        <>
            <div onSubmit={handleSubmit} className='row container-fluid justify-content-center text-dark'>
                <div className='row col-md-6 mt-4 mb-5'>
                    <h4>{textoregistro}</h4>
                    <form className="row g-3 border-top">
                        <div className="col-md-6">
                            <label className="form-label">Nombre <b className='obligatorio'>*</b></label>
                            <input name='firstName' onChange={handleChange} type="text" className="form-control" value={user.firstName} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Apellidos <b className='obligatorio'>*</b></label>
                            <input name='lastName' onChange={handleChange} type="text" className="form-control" placeholder="1234 Main St" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Teléfono <b className='obligatorio'>*</b></label>
                            <input name='phone' onChange={handleChange} type="text" className="form-control" placeholder="1234 Main St" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Fecha de Nacimiento <b className='obligatorio'>*</b></label>
                            <input name='birthDay' onChange={handleChange} type="date" className="form-control" placeholder="1234 Main St" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">CURP <b className='obligatorio'>*</b></label>
                            <input name='curp' onChange={handleChange} type="text" className="form-control" placeholder="1234 Main St" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Correo <b className='obligatorio'>*</b></label>
                            <input name='email' onChange={handleChange} type="text" className="form-control" placeholder="Apartment, studio, or floor" value={user.email} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Contraseña <b className='obligatorio'>*</b></label>
                            <input name='password' onChange={handleChange} type="text" className="form-control" />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Dirección 1 <b className='obligatorio'>*</b></label>
                            <input name='address1' onChange={handleChange} type="text" className="form-control" />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Dirección 2 <b className='obligatorio'>*</b></label>
                            <input name='address2' onChange={handleChange} type="text" className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Ciudad <b className='obligatorio'>*</b></label>
                            <input name='city' onChange={handleChange} type="text" className="form-control" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Estado <b className='obligatorio'>*</b></label>
                            <select name='state' onChange={handleChange} className="form-select">
                                <option value="">Seleccionar una opción...</option>
                                <option value="Guanajuato">Guanajuato</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">CP <b className='obligatorio'>*</b></label>
                            <input name='zip' onChange={handleChange} type="text" className="form-control" />
                        </div>
                        <div className="col-12">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="gridCheck" />
                                <label className="form-check-label">
                                    Quiero ofrecer un servicio
                                </label>
                            </div>
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary">Registrarme</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Registro