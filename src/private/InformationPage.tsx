import React, { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Address } from '../models/UserModel';
import { Schedule, Service } from '../models/ServiceModel';
import { auth, createService, existsUser, getCategories, getSpecialty, updateUser, storage, uploadImage, getUser, getServiceByUser } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import Loading from '../components/Loading';
import moment from 'moment';
import Swal from 'sweetalert2';

export default function InformationPage() {
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
  let states = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Ciudad de México",
    "Coahuila",
    "Colima",
    "Durango",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "México",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas"
  ]
  const [user, setUser] = useState(userData);
  const [address, setAddress] = useState(addressData);
  const [userImg, setUserImg] = useState(null);
  const [prevUserImg, setPrevUserImg] = useState(null);
  const [services, setServices] = useState([]);
  const [color, setColor] = useState("blue");
  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }
  function handleAddressChange(e) {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
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

  async function handleUserStateChanged(u) {
    if (u) {
      const exists = await getUser(u.uid);
      setUser({
        ...exists
      })
      console.log(exists)
      setSate(2);
    } else {
      setSate(4);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    user.address = address;
    console.log(user)
    user.birthDay.seconds ? "" : user.birthDay = new Date(moment(user.birthDay).toString())

    userImg ? await uploadImage(userImg, "/users/").then((url) => {
      user.imageUrl = url;
    }) : ""
    await updateUser(user);
    //sendEmail();
    Swal.fire({
      title: 'Cuenta actualizada',
      html: 'Se ha actualizado exitósamente la información',
      icon: 'success',
      confirmButtonText: 'Continuar',
      allowOutsideClick: false,
      allowEnterKey: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    })
  }
  async function handleSubmitColor1(e){
    setColor(e.target.value)
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }
  async function handleSubmitColor2(e){
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
    document.getElementById("responsivenavbar").style.backgroundColor = e.target.value;
    document.getElementById("insidelateralbar").style.backgroundColor = e.target.value;
    document.getElementById("lateralbar").style.backgroundColor = e.target.value;
  }
  async function handleUserLoggedIn(u) {
    u.backgroundColor1 ? setColor(u.backgroundColor1) : setColor("#4bccff");
    const s = await getServiceByUser(u.uid);
    setServices(s)
    setUser({
      ...u
    })
    setAddress({
      ...u.address
    })
    setSate(2);
  }
  function handleUserUserNotRegistered(user) {
    navigate("/register");
  }
  function handleUserNotLoggedIn(user) {
    setSate(4);
    navigate("/login");
  }
  const sendEmail = () => {
    emailjs.send("service_twzyttc", "template_t1kcbfq", {
      to_name: user.name,
      email: user.email,
    }, 'WYN-KBuNfBcx9Yi38');
  };
  if (state === 2) {
    return (
      <>
        <div className='row headertoprofile'>
          <div className='col-12' style={{ backgroundColor: color }}>
            <img src={user.imageUrl} className="roundedimg" style={{ backgroundColor: user.backgroundColor2 }}/>
          </div>
        </div>
        <div className='row bg-light'>
          <div className='col-12 mt-2'>
            <h2 className='ms-4'>Bienvenido de nuevo, {user.firstName}</h2>
          </div>
        </div>
        <div className='row bg-light'>
          <div className='col-12 p-5'>
            <form onSubmit={handleSubmit} className="row g-3 p-3 border bg-white">
              <div className="row g-3 accordion-body">
                <div className='col-md-12'>
                  <h5>Datos Personales</h5>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Nombre <b className='obligatorio'>*</b></label>
                  <input name='firstName' onChange={handleChange} type="text" className="form-control" value={user.firstName} required />
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Apellidos <b className='obligatorio'>*</b></label>
                  <input name='lastName' onChange={handleChange} type="text" className="form-control" value={user.lastName} required />
                </div>
                <div className='col-md-3'>
                  <label className="form-label">Imagen de perfil <b className='obligatorio'>*</b></label>
                  <div className="input-group mb-3">
                    <input type="file" className="form-control" name='imageUrl' id="inputGroupFile02" onChange={handleFileChangeUser} />
                  </div>
                </div>
                <div className='col-md-3' style={{ display: "none" }}>
                  <img src={prevUserImg} className='img-fluid' width={80} height={80} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Teléfono <b className='obligatorio'>*</b></label>
                  <input name='phone' onChange={handleChange} type="text" className="form-control" placeholder="A 10 dígitos" maxLength={10} value={user.phone} required />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Nacimiento <b className='obligatorio'>*</b></label>
                  <input name='birthDay' onChange={handleChange} type="date" className="form-control" value={user.birthDay.seconds ? new Date(user.birthDay.seconds * 1000).toISOString().slice(0, 10) : user.birthDay} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">CURP <b className='obligatorio'>*</b></label>
                  <input name='curp' onChange={handleChange} type="text" className="form-control" maxLength={18} value={user.curp} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Correo <b className='obligatorio'>*</b></label>
                  <input name='email' onChange={handleChange} type="email" className="form-control" placeholder="example@gmail.com" value={user.email} required />
                </div>
                <div className="col-md-2 mb-4">
                  <label className="form-label">Contraseña <b className='obligatorio'>*</b></label>
                  <input name='password' onChange={handleChange} type="password" className="form-control" placeholder="********" value={user.password} required />
                </div>
                <div className='col-md-1 mb-1'>
                  <label htmlFor="exampleColorInput" className="form-label">Color 1</label>
                  <input type="color" className="form-control form-control-color" name='backgroundColor1' id="exampleColorInput" onChange={handleSubmitColor1} value={ user.backgroundColor1 ?  user.backgroundColor1 : "#ffffff"}/>
                </div>
                <div className='col-md-1 mb-1'>
                  <label htmlFor="exampleColorInput" className="form-label">Color 2</label>
                  <input type="color" className="form-control form-control-color" name='backgroundColor2' id="exampleColorInput" onChange={handleSubmitColor2} value={ user.backgroundColor2 ?  user.backgroundColor2 : "#ffffff"}/>
                </div>

                <div className='col-md-12 mt-2'>
                  <h5>Dirección Personal</h5>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Dirección 1 <b className='obligatorio'>*</b></label>
                  <input name='address1' onChange={handleAddressChange} type="text" className="form-control" placeholder='Calle #Número Colonia' value={user.address.address1} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Dirección 2</label>
                  <input name='address2' onChange={handleAddressChange} type="text" placeholder='Opcional: Calle #Número Colonia' value={user.address.address2} className="form-control" />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Ciudad <b className='obligatorio'>*</b></label>
                  <input name='city' onChange={handleAddressChange} type="text" className="form-control" value={user.address.city} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Estado <b className='obligatorio'>*</b></label>
                  <select name='state' onChange={handleAddressChange} className="form-select" required>
                    <option value="">Seleccionar una opción...</option>
                    {states.map(state => (
                      <option key={state} value={state} selected={(state == user.address.state)}>{state}</option>
                    ))
                    }
                  </select>
                </div>
                <div className="col-md-1">
                  <label className="form-label">CP <b className='obligatorio'>*</b></label>
                  <input name='zip' onChange={handleAddressChange} type="number" className="form-control" value={user.address.zip} required />
                </div>
              </div>
              <div className="col-12 d-flex align-items-center justify-content-center text-right mt-4 mb-3">
                <button type="submit" className="btn btn-primary">Actualizar información</button>
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