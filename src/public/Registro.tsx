import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Address } from '../models/UserModel';
import { Service } from '../models/ServiceModel';
import { auth, createService, existsUser, updateUser } from '../utils/firebase';
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
    let serviceData: Service = {}
    const [user, setUser] = useState(userData);
    const [address, setAddress] = useState(addressData);
    const [addressService, setAddressService] = useState(addressData);
    const [service, setService] = useState(serviceData);
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
    function handleServiceAddressChange(e) {
        setAddressService({
            ...addressService,
            [e.target.name]: e.target.value
        })
        console.log(addressService)
    }

    function handleServiceChange(e) {
        setService({
            ...service,
            [e.target.name]: e.target.value
        })
        console.log(service)
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
            service.address = addressService;
            user.birthDay = new Date(moment(user.birthDay).toString());
            const tmp = { ...user };
            tmp.email = user.email;
            tmp.processCompleted = true;
            await updateUser(tmp);
            await createService(service);
            Swal.fire({
                title: 'Cuenta registrada',
                html: 'Se ha registrado exitósamente la cuenta, clic en OK para continuar',
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEnterKey: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
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
                        <form className="row g-3">
                            <div className='col-12'>
                                <div className="accordion" id="accordionExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                {textoregistro}
                                            </button>
                                        </h2>
                                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="row g-3 accordion-body">
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
                                            </div>
                                        </div>
                                    </div>
                                    {user.isService ?
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingTwo">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    Datos del Servicio
                                                </button>
                                            </h2>
                                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                <div className="row g-3 accordion-body">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Categoría <b className='obligatorio'>*</b></label>
                                                        <select name='categoryId' onChange={handleServiceChange} className="form-select" required>
                                                            <option value="">Seleccionar una opción...</option>
                                                            <option value="h2TuZ9yp3gJ3AOSO845F">Gastronomía</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Especialidad <b className='obligatorio'>*</b></label>
                                                        <select name='specialtyId' onChange={handleServiceChange} className="form-select" required>
                                                            <option value="">Seleccionar una opción...</option>
                                                            <option value="aOp3yB7aUI3Ci8kcHtPe">Repostería</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label">Nombre del Servicio <b className='obligatorio'>*</b></label>
                                                        <input name='name' onChange={handleServiceChange} type="text" className="form-control" placeholder='Ejemplo: Electricista a Domicilio' required />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label">Descripción del Servicio <b className='obligatorio'>*</b></label>
                                                        <textarea name='description' onChange={handleServiceChange} className="form-control" placeholder='Debes de ser llamativo, solo tendrás 500 caracteres disponibles' maxLength={500}></textarea>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label">Dirección 1 <b className='obligatorio'>*</b></label>
                                                        <input name='address1' onChange={handleServiceAddressChange} type="text" className="form-control" placeholder='Calle #Número Colonia' required />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label">Dirección 2</label>
                                                        <input name='address2' onChange={handleServiceAddressChange} type="text" placeholder='Opcional: Calle #Número Colonia' className="form-control" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Ciudad <b className='obligatorio'>*</b></label>
                                                        <input name='city' onChange={handleServiceAddressChange} type="text" className="form-control" required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">Estado <b className='obligatorio'>*</b></label>
                                                        <select name='state' onChange={handleServiceAddressChange} className="form-select" required>
                                                            <option value="">Seleccionar una opción...</option>
                                                            <option value="Guanajuato">Guanajuato</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label">CP <b className='obligatorio'>*</b></label>
                                                        <input name='zip' onChange={handleServiceAddressChange} type="number" className="form-control" required />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : ""}
                                    {user.isService ?
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingThree">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                    Horario del Servicio
                                                </button>
                                            </h2>
                                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    {/* Intevalo */}
                                                    <label className="form-label">Selecciona La duración por cada servicio <b className='obligatorio'>*</b></label>
                                                    <div className="input-group mb-3">  
                                                        <input type="number" className="form-control" aria-label="Ejemplo: 30" />
                                                        <span className="input-group-text">minutos</span>
                                                    </div>

                                                    {/* Lunes */}
                                                    <div className="row mb-3">
                                                        <div className="col-sm-4">
                                                            <div className="form-check">
                                                                <label className="form-check-label mt-2">
                                                                    <input className="form-check-input" type="checkbox" /> Lunes
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Inicio</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Fin</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Martes */}
                                                    <div className="row mb-3">
                                                        <div className="col-sm-4">
                                                            <div className="form-check">
                                                                <label className="form-check-label mt-2">
                                                                    <input className="form-check-input" type="checkbox" /> Martes
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Inicio</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Fin</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Miércoles */}
                                                    <div className="row mb-3">
                                                        <div className="col-sm-4">
                                                            <div className="form-check">
                                                                <label className="form-check-label mt-2">
                                                                    <input className="form-check-input" type="checkbox" /> Miércoles
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Inicio</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Fin</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Jueves */}
                                                    <div className="row mb-3">
                                                        <div className="col-sm-4">
                                                            <div className="form-check">
                                                                <label className="form-check-label mt-2">
                                                                    <input className="form-check-input" type="checkbox" /> Jueves
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Inicio</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Fin</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Viernes */}
                                                    <div className="row mb-3">
                                                        <div className="col-sm-4">
                                                            <div className="form-check">
                                                                <label className="form-check-label mt-2">
                                                                    <input className="form-check-input" type="checkbox" /> Viernes
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Inicio</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Fin</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Sábado */}
                                                    <div className="row mb-3">
                                                        <div className="col-sm-4">
                                                            <div className="form-check">
                                                                <label className="form-check-label mt-2">
                                                                    <input className="form-check-input" type="checkbox" /> Sábado
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Inicio</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Fin</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Domingo */}
                                                    <div className="row mb-3">
                                                        <div className="col-sm-4">
                                                            <div className="form-check">
                                                                <label className="form-check-label mt-2">
                                                                    <input className="form-check-input" type="checkbox" /> Domingo
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Inicio</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="row mb-3">
                                                                <label className="col-sm-2 col-form-label">Fin</label>
                                                                <div className="col-sm-9 offset-sm-1">
                                                                    <input type="time" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                        : ""}
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
