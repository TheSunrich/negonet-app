import React, { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Address } from '../models/UserModel';
import { Schedule, Service } from '../models/ServiceModel';
import { auth, createService, existsUser, getCategories, getSpecialty, updateUser, storage, uploadImage } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
    let serviceData: Service = {
        isActive: true
    }
    let schedulePredata: Schedule = {
        interval: 30,
        days: [
            {
                day: "Lunes",
                startHour: "",
                endHour: ""
            },
            {
                day: "Martes",
                startHour: "",
                endHour: ""
            },
            {
                day: "Miércoles",
                startHour: "",
                endHour: ""
            },
            {
                day: "Jueves",
                startHour: "",
                endHour: ""
            },
            {
                day: "Viernes",
                startHour: "",
                endHour: ""
            },
            {
                day: "Sábado",
                startHour: "",
                endHour: ""
            },
            {
                day: "Domingo",
                startHour: "",
                endHour: ""
            }
        ]
    }
    let scheduleData: Schedule = {
        interval: 30,
        days: []
    }
    const [user, setUser] = useState(userData);
    const [address, setAddress] = useState(addressData);
    const [addressService, setAddressService] = useState(addressData);
    const [service, setService] = useState(serviceData);
    const [schedule, setSchedule] = useState(scheduleData);
    const [category, setCategories] = useState(null);
    const [specialty, setSpecialty] = useState([]);
    const [specialtyAvailable, setAvailableS] = useState(true);
    const [userImg, setUserImg] = useState(null);
    const [serviceImg, setServiceImg] = useState(null);
    const [prevUserImg, setPrevUserImg] = useState(null);
    const [prevServiceImg, setPrevServiceImg] = useState(null);
    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    async function handleChangeService(e) {
        if (e.target.checked) {
            const categories = await getCategories();
            setCategories(categories)
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
    function handleDayChange(e) {
        let scheduleday = {};
        let ids = e.target.value + "s";
        let ide = e.target.value + "e";
        const startHour = document.getElementById(ids) as HTMLInputElement;
        const endHour = document.getElementById(ide) as HTMLInputElement;
        if (e.target.checked) {
            startHour.disabled = false;
            endHour.disabled = false;
            startHour.required = true;
            endHour.required = true;
            const result = schedule.days.find(({ day }) => day === e.target.value);
            if (result === undefined) {
                scheduleday = {
                    day: e.target.value,
                    hours: {
                        startHour: "",
                        endHour: ""
                    }
                }
                schedule.days.push(scheduleday)
                setSchedule(schedule);
            }
        } else {
            startHour.disabled = true;
            endHour.disabled = true;
            startHour.value = "";
            endHour.value = "";
            startHour.required = false;
            endHour.required = false;
            const result = schedule.days.find(({ day }) => day === e.target.value);
            if (result != undefined) {
                let position = schedule.days.indexOf(result);
                schedule.days.splice(position, 1);
                setSchedule(schedule);
            }
        }
    }
    function handleHomeService(e) {
        if (e.target.checked) {
            setService({
                ...service,
                [e.target.name]: true
            })
        } else {
            setService({
                ...service,
                [e.target.name]: false
            })
        }
    }
    function handleStartHourChange(e, element) {
        element.startHour = (e.target.value);
        const result = schedule.days.find(({ day }) => day === element.day);
        if (result != undefined) {
            let position = schedule.days.indexOf(result);
            schedule.days[position] = element;
            setSchedule(schedule);
        }
    }
    function handleEndHourChange(e, element) {
        element.endHour = (e.target.value);
        const result = schedule.days.find(({ day }) => day === element.day);
        if (result != undefined) {
            let position = schedule.days.indexOf(result);
            schedule.days[position] = element;
            setSchedule(schedule);
        }
    }
    function handleIntervalChange(e) {
        setSchedule({
            ...schedule,
            [e.target.name]: parseInt(e.target.value)
        })
    }
    function handleFileChangeUser(e) {

        // Preview image
        const file = e.target.files[0];
        console.log(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setUserImg(file);
            setPrevUserImg(reader.result)
        };
        reader.readAsDataURL(file);

    }
    function handleFileChangeService(e) {
        // Preview image
        const file = e.target.files[0];
        console.log(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setServiceImg(file);
            setPrevServiceImg(reader.result)
        };
        reader.readAsDataURL(file);
    }
    function handleServiceAddressChange(e) {
        setAddressService({
            ...addressService,
            [e.target.name]: e.target.value
        })
    }
    async function handleServiceChange(e) {
        setService({
            ...service,
            [e.target.name]: e.target.value
        })
    }
    async function handleCategoryChange(e) {
        setService({
            ...service,
            [e.target.name]: e.target.value
        })
        if (e.target.value != "") {
            const sp = await getSpecialty(e.target.value)
            setSpecialty(sp);
            setAvailableS(false);
        } else {
            setAvailableS(true);
        }
    }
    async function saveImageUser() {

    }
    async function saveImageService() {

        await uploadImage(serviceImg, "/services/").then((url) => {
            console.log("HOLIS", url);
            setService({
                ...service,
                imageUrl: url
            })
        })

    }
    const [textoregistro, setTexto] = useState("Regístrate, es gratis");

    function handleUserStateChanged(u) {
        if (u) {
            setUser({
                email: u.email,
                firstName: u.displayName
            })
            setTexto("Debes completar el registro para continuar")

        } else {
            setSate(4);
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
        console.log(user)
        if (exists) {
            Swal.fire({
                title: 'Ya existe la cuenta',
                html: 'Encontramos una cuenta registrada con el correo ' + user.email + ', intenta con otra diferente',
                icon: 'error'
            });
            setSate(5);
        } else {
            user.address = address;
            user.isService ? service.address = addressService : ""
            user.isService ? service.schedule = schedule : ""
            user.isService ? service.userId = user.uid : ""
            user.isService ? service.isActive = true : ""
            user.birthDay = new Date(moment(user.birthDay).toString());
            await uploadImage(userImg, "/users/").then((url) => {
                user.imageUrl = url;
            })
            if (user.imageUrl) {
                const tmp = { ...user };
                tmp.email = user.email;
                tmp.processCompleted = true;
                await updateUser(tmp);

                user.isService ? await uploadImage(serviceImg, "/services/").then((url) => {
                    service.imageUrl = url;
                }) : ""
                user.isService ? await createService(service) : ""
                await singInWEmail(user.email, user.password);
                async function singInWEmail(email, password) {
                    try {
                        const res = await createUserWithEmailAndPassword(auth, email, password)
                        let userTmp = { ...user, uid: res.user.uid }
                        await updateUser(userTmp);
                        user.isService ? service.userId = res.user.uid : ""
                        console.log(service)
                        user.isService ? await createService(service) : ""
                    }
                    catch (error) {
                        Swal.fire({
                            title: 'Error al registrarse',
                            html: 'Ocurrió un error al registrarse, intenta de nuevo',
                            icon: 'error'
                        })
                        return;
                    }
                }
                sendEmail();
                Swal.fire({
                    title: 'Cuenta registrada',
                    html: 'Se ha registrado exitósamente la cuenta',
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    allowOutsideClick: false,
                    allowEnterKey: false,
                    allowEscapeKey: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/main");
                    }
                })
            } else {
                Swal.fire({
                    title: 'Error al subir la imagen',
                    html: 'Ocurrió un error al subir la imagen, intenta de nuevo',
                    icon: 'error'
                })
            }




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
    const inputRef = useRef(null);
    const sendEmail = () => {
        emailjs.send("service_twzyttc", "template_t1kcbfq", {
            to_name: user.name,
            email: user.email,
        }, 'WYN-KBuNfBcx9Yi38');
    };
    if (state === 3 || state === 4 || state === 5) {
        return (
            <>
                <div className='row container-fluid justify-content-center text-dark'>
                    <div className='row col-md-6 mt-4 mb-5'>
                        <form onSubmit={handleSubmit} className="row g-3">
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
                                                <div className='col-md-12'>
                                                    <label className="form-label">Imagen de perfil <b className='obligatorio'>*</b></label>
                                                    <div className="input-group mb-3">
                                                        <input type="file" className="form-control" name='imageUrl' id="inputGroupFile02" onChange={handleFileChangeUser} />
                                                    </div>
                                                </div>
                                                <div className='col-md-6' style={{ display: "none" }}>
                                                    <img src={prevUserImg} className='img-fluid' width={80} height={80} />
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
                                                        <option value="Aguascalientes">Aguascalientes</option>
                                                        <option value="Baja California">Baja California</option>
                                                        <option value="Baja California Sur">Baja California Sur</option>
                                                        <option value="Campeche">Campeche</option>
                                                        <option value="Chiapas">Chiapas</option>
                                                        <option value="Chihuahua">Chihuahua</option>
                                                        <option value="Ciudad de México">Ciudad de México</option>
                                                        <option value="Coahuila">Coahuila</option>
                                                        <option value="Colima">Colima</option>
                                                        <option value="Durango">Durango</option>
                                                        <option value="Guanajuato">Guanajuato</option>
                                                        <option value="Guerrero">Guerrero</option>
                                                        <option value="Hidalgo">Hidalgo</option>
                                                        <option value="Jalisco">Jalisco</option>
                                                        <option value="México">México</option>
                                                        <option value="Michoacán">Michoacán</option>
                                                        <option value="Morelos">Morelos</option>
                                                        <option value="Nayarit">Nayarit</option>
                                                        <option value="Nuevo León">Nuevo León</option>
                                                        <option value="Oaxaca">Oaxaca</option>
                                                        <option value="Puebla">Puebla</option>
                                                        <option value="Querétaro">Querétaro</option>
                                                        <option value="Quintana Roo">Quintana Roo</option>
                                                        <option value="San Luis Potosí">San Luis Potosí</option>
                                                        <option value="Sinaloa">Sinaloa</option>
                                                        <option value="Sonora">Sonora</option>
                                                        <option value="Tabasco">Tabasco</option>
                                                        <option value="Tamaulipas">Tamaulipas</option>
                                                        <option value="Tlaxcala">Tlaxcala</option>
                                                        <option value="Veracruz">Veracruz</option>
                                                        <option value="Yucatán">Yucatán</option>
                                                        <option value="Zacatecas">Zacatecas</option>
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
                                                        <select name='categoryId' onChange={handleCategoryChange} className="form-select" required>
                                                            <option value="">Seleccionar una opción...</option>
                                                            {
                                                                category.map(element => (
                                                                    <option key={element.id} value={element.id}>{element.name}</option>
                                                                ))
                                                            }
                                                        </select>

                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Especialidad <b className='obligatorio'>*</b></label>
                                                        <select name='specialtyId' onChange={handleServiceChange} id="specialtyselect" className="form-select" disabled={specialtyAvailable} required>
                                                            <option value="">Seleccionar una opción...</option>
                                                            {
                                                                specialty.map(element => (
                                                                    <option key={element.id} value={element.id}>{element.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <label className="form-label">Nombre del Servicio <b className='obligatorio'>*</b></label>
                                                        <input name='name' onChange={handleServiceChange} type="text" className="form-control" placeholder='Ejemplo: Electricista a Domicilio' required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">Precio <b className='obligatorio'>*</b></label>
                                                        <div className="input-group">
                                                            <span className="input-group-text" id="basic-addon1">$</span>
                                                            <input name='price' onChange={handleServiceChange} type="number" className="form-control" placeholder="159" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label">Descripción del Servicio <b className='obligatorio'>*</b></label>
                                                        <textarea name='description' onChange={handleServiceChange} className="form-control" placeholder='Debes de ser llamativo, solo tendrás 500 caracteres disponibles' maxLength={500}></textarea>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label">Imagen del servicio <b className='obligatorio'>*</b></label>
                                                        <input name='imageUrl' onChange={handleFileChangeService} type="file" className="form-control" />
                                                    </div>
                                                    <div className="col-md-6" style={{ display: "none" }}>
                                                        <img src={prevServiceImg} alt="" className="img-fluid" width={100} height={80} />
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
                                                            <option value="Aguascalientes">Aguascalientes</option>
                                                            <option value="Baja California">Baja California</option>
                                                            <option value="Baja California Sur">Baja California Sur</option>
                                                            <option value="Campeche">Campeche</option>
                                                            <option value="Chiapas">Chiapas</option>
                                                            <option value="Chihuahua">Chihuahua</option>
                                                            <option value="Ciudad de México">Ciudad de México</option>
                                                            <option value="Coahuila">Coahuila</option>
                                                            <option value="Colima">Colima</option>
                                                            <option value="Durango">Durango</option>
                                                            <option value="Guanajuato">Guanajuato</option>
                                                            <option value="Guerrero">Guerrero</option>
                                                            <option value="Hidalgo">Hidalgo</option>
                                                            <option value="Jalisco">Jalisco</option>
                                                            <option value="México">México</option>
                                                            <option value="Michoacán">Michoacán</option>
                                                            <option value="Morelos">Morelos</option>
                                                            <option value="Nayarit">Nayarit</option>
                                                            <option value="Nuevo León">Nuevo León</option>
                                                            <option value="Oaxaca">Oaxaca</option>
                                                            <option value="Puebla">Puebla</option>
                                                            <option value="Querétaro">Querétaro</option>
                                                            <option value="Quintana Roo">Quintana Roo</option>
                                                            <option value="San Luis Potosí">San Luis Potosí</option>
                                                            <option value="Sinaloa">Sinaloa</option>
                                                            <option value="Sonora">Sonora</option>
                                                            <option value="Tabasco">Tabasco</option>
                                                            <option value="Tamaulipas">Tamaulipas</option>
                                                            <option value="Tlaxcala">Tlaxcala</option>
                                                            <option value="Veracruz">Veracruz</option>
                                                            <option value="Yucatán">Yucatán</option>
                                                            <option value="Zacatecas">Zacatecas</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label">CP <b className='obligatorio'>*</b></label>
                                                        <input name='zip' onChange={handleServiceAddressChange} type="number" className="form-control" required />
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="form-check">
                                                            <input name='isHomeService' className="form-check-input" type="checkbox" id="homeCheck" onChange={handleHomeService} />
                                                            <label className="form-check-label">
                                                                Puedo brindar servicio a Domicilio
                                                            </label>
                                                        </div>
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
                                                    <select name='interval' className="mb-3 form-select" aria-label="Default select example" onChange={handleIntervalChange}>
                                                        <option value="" disabled>Seleccionar Intervalo...</option>
                                                        <option value="30">30 minutos</option>
                                                        <option value="45">45 minutos</option>
                                                        <option value="60">1 hora</option>
                                                        <option value="75">1 hora 15 minutos</option>
                                                        <option value="90">1 hora 30 minutos</option>
                                                        <option value="105">1 hora 45 minutos</option>
                                                        <option value="120">2 horas</option>
                                                    </select>
                                                    {/* Lunes */}

                                                    {
                                                        schedulePredata.days.map(element => (
                                                            <div key={element.day} className="row mb-3">
                                                                <div className="col-sm-4">
                                                                    <div className="form-check">
                                                                        <label className="form-check-label mt-2">
                                                                            <input className="form-check-input" type="checkbox" value={element.day} onChange={handleDayChange} /> {element.day}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-4">
                                                                    <div className="row mb-3">
                                                                        <label className="col-sm-2 col-form-label">Inicio</label>
                                                                        <div className="col-sm-9 offset-sm-1">
                                                                            <input required disabled={true} id={element.day + "s"} type="time" className="form-control" onChange={(e) => handleStartHourChange(e, element)} defaultValue={element.startHour} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-4">
                                                                    <div className="row mb-3">
                                                                        <label className="col-sm-2 col-form-label">Fin</label>
                                                                        <div className="col-sm-9 offset-sm-1">
                                                                            <input required disabled={true} id={element.day + "e"} type="time" className="form-control" onChange={(e) => handleEndHourChange(e, element)} defaultValue={element.endHour} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
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
