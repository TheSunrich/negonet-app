import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Address } from '../models/UserModel';
import { auth, existsUser, updateUser } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import Loading from '../components/Loading';
import moment from 'moment';

export default function Registro() {
    useEffect(() => {
        onAuthStateChanged(auth, handleUserStateChanged);
    }, []);
    const navigate = useNavigate();
    const [state, setSate] = useState(0);
    let userData: User = {
        email: "",
        firstName: "",
        address: {}
    }
    let addressData: Address = {}
    const [user, setUser] = useState(userData);
    const [address, setAddress] = useState(addressData)
    function handleChange(e){
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    function handleAddressChange(e){
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }
    const [textoregistro, setTexto] = useState("Regístrate, es gratis");

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
    async function handleSubmit(e){
        console.log("Submit")
        e.preventDefault();
        user.isService = true;

        const exists = await existsUser(user.email);
        console.log(exists)
        if(exists){
            console.log("El usuario existe")
            setSate(5);
        }else{
            user.address = address;
            user.birthDay =  new Date(moment(user.birthDay).toString());
            const tmp = {...user};
            tmp.email = user.email;
            tmp.processCompleted = true;
            console.log(tmp)
            await updateUser(tmp);
        }
        
        console.log(user)
    }
    function handleUserLoggedIn(user) {
        navigate("/");
    }
    function handleUserUserNotRegistered(user) {
        setUser({
            email: user.email,
            firstName: user.displayName,
            uid: user.uid
        })
        //navigate("/register");
        setSate(3);
    }
    function handleUserNotLoggedIn(user) {
        navigate("/login");
    }
    if (state === 3 || state === 5) {
        return (
            <>
                <div onSubmit={handleSubmit} className='row container-fluid justify-content-center text-dark'>
                    <div className='row col-md-6 mt-4 mb-5'>
                        <h4>{textoregistro}</h4>
                        {state === 5 ?
                        <p>El correo ya existe</p>: ''}
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
                                <input name='email' onChange={handleChange} type="email" className="form-control" placeholder="Apartment, studio, or floor" value={user.email} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Contraseña <b className='obligatorio'>*</b></label>
                                <input name='password' onChange={handleChange} type="password" className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Dirección 1 <b className='obligatorio'>*</b></label>
                                <input name='address1' onChange={handleAddressChange} type="text" className="form-control" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Dirección 2 <b className='obligatorio'>*</b></label>
                                <input name='address2' onChange={handleAddressChange} type="text" className="form-control" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Ciudad <b className='obligatorio'>*</b></label>
                                <input name='city' onChange={handleAddressChange} type="text" className="form-control" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Estado <b className='obligatorio'>*</b></label>
                                <select name='state' onChange={handleAddressChange} className="form-select">
                                    <option value="">Seleccionar una opción...</option>
                                    <option value="Guanajuato">Guanajuato</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">CP <b className='obligatorio'>*</b></label>
                                <input name='zip' onChange={handleAddressChange} type="number" className="form-control" />
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
    return <AuthProvider
        onUserLoggedIn={handleUserLoggedIn}
        onUserNotRegistered={handleUserUserNotRegistered}
        onUserNotLoggedIn={handleUserNotLoggedIn}>
        <Loading />
    </AuthProvider>


}
