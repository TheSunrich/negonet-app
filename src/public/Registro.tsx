import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Address } from '../models/UserModel';
import { auth, existsUser, updateUser } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import Loading from '../components/Loading';
import moment from 'moment';
import Swal from 'sweetalert2';

export default function Registro() {
    useEffect(() => {
        onAuthStateChanged(auth, handleUserStateChanged);
    }, []);
    const navigate = useNavigate();
    const [state, setSate] = useState(0);
    let userData: User = {
        email: "",
        firstName: "",
        address: {},
        isService: false
    }
    let addressData: Address = {}
    const [user, setUser] = useState(userData);
    const [address, setAddress] = useState(addressData);
    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    function handleChangeService(e) {
        if (e.target.checked) {
            setUser({
                ...user,
                isService: true
            })
        } else {
            setUser({
                ...user,
                isService: false
            })
        }
    }
    function handleAddressChange(e) {
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
            setSate(4);
            console.log("No hay nadie autenticado...");
            console.log(state)
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Espera un momento',
            html: 'Estamos registrando tu información en el sistema',
            allowOutsideClick: false,
            showConfirmButton: false,
            allowEnterKey: false,
            didOpen: () => {
                Swal.showLoading(Swal.getDenyButton())
            },
        });
        const exists = await existsUser(user.email);
        if (exists) {
            Swal.fire({
                title: 'Ya existe la cuenta',
                html: 'Encontramos una cuenta registrada con el correo ' + user.email + ', intenta con otra diferente',
                icon: 'error'
            });
            setSate(5);
        } else {
            user.address = address;
            user.birthDay = new Date(moment(user.birthDay).toString());
            const tmp = { ...user };
            tmp.email = user.email;
            tmp.processCompleted = true;
            await updateUser(tmp);
            Swal.fire({
                title: 'Cuenta registrada',
                html: 'Se ha registrado exitósamente la cuenta, clic en OK para continuar',
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEnterKey: false,
                allowEscapeKey: false
            }).then((result) =>{
                if(result.isConfirmed){
                    navigate("/main");
                }
            })
        }   

    }
    function handleUserLoggedIn(user) {
        navigate("/main");
    }
    function handleUserUserNotRegistered(user) {
        setUser({
            email: user.email,
            uid: user.uid,
            imageUrl: user.photoURL,
            firstName: user.displayName
        })
        //navigate("/register");
        setSate(3);
    }
    function handleUserNotLoggedIn(user) {
        setSate(4);
    }
    if (state === 3 || state === 4 || state === 5) {
        return (
            <>
                <div onSubmit={handleSubmit} className='row container-fluid justify-content-center text-dark'>
                    <div className='row col-md-6 mt-4 mb-5'>
                        <h4>{textoregistro}</h4>
                        {state === 5 ?
                            <p>El correo ya existe</p> : ''}
                        <form className="row g-3 border-top">
                            <div className="col-md-6">
                                <label className="form-label">Nombre <b className='obligatorio'>*</b></label>
                                <input name='firstName' onChange={handleChange} type="text" className="form-control" value={user.firstName} required />
                                <div className="valid-feedback">
                                    Looks good!
                                </div>

                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Apellidos <b className='obligatorio'>*</b></label>
                                <input name='lastName' onChange={handleChange} type="text" className="form-control" required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Teléfono <b className='obligatorio'>*</b></label>
                                <input name='phone' onChange={handleChange} type="text" className="form-control" placeholder="A 10 dígitos" maxLength={10} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Fecha de Nacimiento <b className='obligatorio'>*</b></label>
                                <input name='birthDay' onChange={handleChange} type="date" className="form-control" required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">CURP <b className='obligatorio'>*</b></label>
                                <input name='curp' onChange={handleChange} type="text" className="form-control" maxLength={18} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Correo <b className='obligatorio'>*</b></label>
                                <input name='email' onChange={handleChange} type="email" className="form-control" placeholder="example@gmail.com" value={user.email} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Contraseña <b className='obligatorio'>*</b></label>
                                <input name='password' onChange={handleChange} type="password" className="form-control" placeholder="********" required />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Dirección 1 <b className='obligatorio'>*</b></label>
                                <input name='address1' onChange={handleAddressChange} type="text" className="form-control" placeholder='Calle #Número Colonia' required />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Dirección 2</label>
                                <input name='address2' onChange={handleAddressChange} type="text" placeholder='Opcional: Calle #Número Colonia' className="form-control" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Ciudad <b className='obligatorio'>*</b></label>
                                <input name='city' onChange={handleAddressChange} type="text" className="form-control" required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Estado <b className='obligatorio'>*</b></label>
                                <select name='state' onChange={handleAddressChange} className="form-select" required>
                                    <option value="">Seleccionar una opción...</option>
                                    <option value="Guanajuato">Guanajuato</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">CP <b className='obligatorio'>*</b></label>
                                <input name='zip' onChange={handleAddressChange} type="number" className="form-control" required />
                            </div>
                            <div className="col-12">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="gridCheck" onChange={handleChangeService} />
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
