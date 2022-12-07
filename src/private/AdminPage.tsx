import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import { auth, createService, getCategories, getServiceByUser, getSpecialty, updateUser, deleteServiceFirebase } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { User, Address } from '../models/UserModel';
import { Schedule, Service } from '../models/ServiceModel';
import Swal from 'sweetalert2';

const AdminPage = () => {
  useEffect(() => {
    onAuthStateChanged(auth, handleUserStateChanged);
  }, []);
  const navigate = useNavigate();
  const [state, setSate] = useState(0);
  const [services, setServices] = useState([]);
  let userData: User;
  let serviceData: Service = {
    isActive: true
  }
  let addressData: Address = {}
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
  const [service, setService] = useState(serviceData);
  const [category, setCategories] = useState(null);
  const [specialty, setSpecialty] = useState([]);
  const [addressService, setAddressService] = useState(addressData);
  const [schedule, setSchedule] = useState(scheduleData);
  const [edit, setEdit] = useState(false);
  async function handleCategoryChange(e) {
    setService({
      ...service,
      [e.target.name]: e.target.value
    })
    if (e.target.value != "") {
      const sp = await getSpecialty(e.target.value)
      setSpecialty(sp);
    }
  }
  async function handleServiceChange(e) {
    setService({
      ...service,
      [e.target.name]: e.target.value
    })
  }
  async function handleUserStateChanged(u) {
    if (u) {
      setUser({
        ...u
      })
      setSate(2);
    } else {
      setSate(4);
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
  function handleIntervalChange(e) {
    setSchedule({
      ...schedule,
      [e.target.name]: parseInt(e.target.value)
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
  function handleServiceAddressChange(e) {
    setAddressService({
      ...addressService,
      [e.target.name]: e.target.value
    })
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (edit) {

    } else {
      service.schedule = schedule;
      service.address = addressService;
      service.userId = user.uid;
      user.isService = true;
      await createService(service);
      await updateUser(user);
      console.log(user)
      Swal.fire({
        title: 'Servicio registrado',
        html: 'Se ha registrado exitósamente el servicio',
        icon: 'success',
        confirmButtonText: 'Continuar',
        allowOutsideClick: false,
        allowEnterKey: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/main/admin");
        }
      })
    }
  }
  async function handleUserLoggedIn(u) {
    const s = await getServiceByUser(u.uid);
    setServices(s)
    const categories = await getCategories();
    setCategories(categories)
    setUser({
      ...u
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
  async function handleEditService(e, element) {
    setEdit(true);
    console.log(element.schedule)
    const sp = await getSpecialty(element.categoryId)
    setSpecialty(sp);
    setService({ ...element })
    setSchedule({
      ...element.schedule
    })
    console.log(service)
    setAddressService({
      ...element.address
    })
  }
  async function getServices() {
    console.log(user)
    const s = await getServiceByUser(user.uid);
    setServices(s)
  }
  function deleteService(e, element) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este servicio se eliminará pero seguirá estando disponible para las citas agendadas",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        element.isActive = false;
        await deleteServiceFirebase(element);
        getServices();
        Swal.fire(
          '¡Eliminado!',
          'El servicio se ha retirado exitosamente',
          'success'
        )
      }
    })
  }
  function handleCleanForm(e) {
    setEdit(false);
    setService(serviceData)
    setAddressService(addressData)
    setSchedule(scheduleData)
    setSpecialty([])
  }
  if (state == 2) {
    return (
      <>
        <div className='container-fluid'>
          <h3 className='m-3'>Agregar un Servicio</h3>
          <div className='row mb-3 justify-content-end'>
            <div className='col-auto text-center'>
            </div>
          </div>
          <div className='container-fluid ms-2 border bg-light pt-4 pb-4 text-right'>
            <div className='row'>
              <div className='col-md-4 text-center'>
                <h5>Mis servicios</h5>
                <hr className='ms-2 me-2' />
                {services.length > 0 ?
                  services.map(element => (
                    <div key={element.uid} className='container-fluid rounded border shadow mb-2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.6), rgba( 0, 0, 0, 0.6)), url(${element.imageUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                      <div className='container-fluid pt-2 pb-2'>
                        <span className='fw-bold fs-5' style={{ color: "white" }}>{element.name}</span>
                      </div>
                      <div className='container-fluid mb-1'>
                        <span className='fw-bold' style={{ color: "white" }}>{element.price > 0 ? "$" + element.price : "gratuito"}</span>
                      </div>
                      <div className='container-fluid p-1 text-right justify-content-end d-flex align-items-end mb-2'>
                        <button type='button' onClick={() => handleEditService(event, element)} className='btn btn-sm btn-primary'>
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button type='button' onClick={() => deleteService(event, element)} className='btn btn-sm btn-danger ms-1'>
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </div>
                    </div>
                  ))
                  :
                  <div className='container-fluid text-center'>
                    <span>No tienes servicios propios</span>
                  </div>
                }
              </div>
              <div className='col-md-8'>
                <div className='col-12'>
                  <form onSubmit={handleSubmit}>
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Agregar Nuevo Servicio
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                          <div className="row g-3 accordion-body">
                            <div className="col-md-6">
                              <label className="form-label">Categoría <b className='obligatorio'>*</b></label>
                              <select name='categoryId' onChange={handleCategoryChange} className="form-select" required>
                                <option value="">Seleccionar una opción...</option>
                                {category ?
                                  category.map(element => (
                                    <option key={element.id} value={element.id} selected={element.id === service.categoryId}>{element.name}</option>
                                  ))
                                  :
                                  ""
                                }
                              </select>

                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Especialidad <b className='obligatorio'>*</b></label>
                              <select name='specialtyId' onChange={handleServiceChange} id="specialtyselect" className="form-select" required>
                                <option value="">Seleccionar una opción...</option>
                                {specialty ?
                                  specialty.map(element => (
                                    <option key={element.id} value={element.id} selected={element.id === service.specialtyId}>{element.name}</option>
                                  ))
                                  :
                                  ""
                                }
                              </select>
                            </div>
                            <div className="col-md-8">
                              <label className="form-label">Nombre del Servicio <b className='obligatorio'>*</b></label>
                              <input name='name' onChange={handleServiceChange} type="text" className="form-control" defaultValue={service.name} placeholder='Ejemplo: Electricista a Domicilio' required />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Precio <b className='obligatorio'>*</b></label>
                              <div className="input-group">
                                <span className="input-group-text" id="basic-addon1">$</span>
                                <input name='price' onChange={handleServiceChange} type="number" className="form-control" defaultValue={service.price} placeholder="159" />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <label className="form-label">Descripción del Servicio <b className='obligatorio'>*</b></label>
                              <textarea name='description' onChange={handleServiceChange} className="form-control" defaultValue={service.description} placeholder='Debes de ser llamativo, solo tendrás 500 caracteres disponibles' maxLength={500}></textarea>
                            </div>
                            <div className="col-md-12">
                              <label className="form-label">Dirección 1 <b className='obligatorio'>*</b></label>
                              <input name='address1' onChange={handleServiceAddressChange} type="text" className="form-control" defaultValue={addressService.address1} placeholder='Calle #Número Colonia' required />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label">Dirección 2</label>
                              <input name='address2' onChange={handleServiceAddressChange} type="text" defaultValue={addressService.address2} placeholder='Opcional: Calle #Número Colonia' className="form-control" />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Ciudad <b className='obligatorio'>*</b></label>
                              <input name='city' onChange={handleServiceAddressChange} type="text" defaultValue={addressService.city} className="form-control" required />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Estado <b className='obligatorio'>*</b></label>
                              <select name='state' onChange={handleServiceAddressChange} defaultValue={addressService.state} className="form-select" required>
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
                              <input name='zip' onChange={handleServiceAddressChange} type="number" className="form-control" defaultValue={addressService.zip} required />
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
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Horario del Servicio
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
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
                    </div>
                    {!edit ?
                      <div className='container-fluid d-flex justify-content-end align-items-end'>
                        <button type='button' onClick={handleCleanForm} className='btn btn-secondary me-2 mt-2 mb-2'>
                          Cancelar
                        </button>
                        <button type='submit' className='btn btn-primary mt-2 mb-2'>
                          Agregar Servicio
                        </button>
                      </div>
                      :
                      <div className='container-fluid d-flex justify-content-end align-items-end'>
                        <button type='button' onClick={handleCleanForm} className='btn btn-secondary me-2 mt-2 mb-2'>
                          Cancelar
                        </button>
                        <button type='submit' className='btn btn-warning mt-2 mb-2'>
                          Editar Servicio
                        </button>
                      </div>
                    }

                  </form>
                </div>
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

export default AdminPage