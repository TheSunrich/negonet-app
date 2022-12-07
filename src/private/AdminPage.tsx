import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import { auth, createService, getCategories, getServiceByUser, getSpecialty, updateUser, deleteServiceFirebase } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { User, Address } from '../models/UserModel';
import { Schedule, Service } from '../models/ServiceModel';
import Swal from 'sweetalert2';
import Select from 'react-select';

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
  let scheduleSelect = [
    { value: 30, label: "30 minutos" },
    { value: 45, label: "45 minutos" },
    { value: 60, label: "1 hora" },
    { value: 75, label: "1 hora 15 minutos" },
    { value: 90, label: "1 hora 30 minutos" },
    { value: 105, label: " 1 hora 45 minutos" },
    { value: 120, label: "2 horas" }
  ]
  const [user, setUser] = useState(userData);
  const [service, setService] = useState(serviceData);
  const [category, setCategories] = useState(null);
  const [specialty, setSpecialty] = useState([]);
  const [addressService, setAddressService] = useState(addressData);
  const [schedule, setSchedule] = useState(scheduleData);
  const [schePreData, setSchedulePre] = useState(schedulePredata);
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
    console.log(edit)
    setAddressService({
      ...addressService,
      [e.target.name]: e.target.value
    })
    console.log(e.target.value)
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
          getServices();
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
    console.log(schedule)
    console.log(service)
    setAddressService({
      ...element.address
    })
    let predata = schedulePredata
    for (let i = 0; i < schedulePredata.days.length; i++) {
      const presaved = schedulePredata.days[i];
      for (let j = 0; j < schedule.days.length; j++) {
        const saved = schedule.days[j];
        if(presaved.day == saved.day){
          console.log(presaved.day, " == ", saved.day)
          schedulePredata.days[i] = saved;
          break;
        }
      }
      
    }
    console.log(schedulePredata)
    setSchedulePre({
      ...schedulePredata
    })
    /*setSchedulePre({
      ...element.schedule
    })*/
    console.log(schePreData)
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
                    <div key={element.id} className='container-fluid rounded border shadow mb-2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.6), rgba( 0, 0, 0, 0.6)), url(${element.imageUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
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
                              <select name='state' onChange={handleServiceAddressChange} className="form-select" required>
                                <option value="">Seleccionar una opción...</option>
                                {states.map(state => (
                                  <option key={state} value={state} selected={(edit && (state == addressService.state))}>{state}</option>
                                ))
                                }
                              </select>
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">CP <b className='obligatorio'>*</b></label>
                              <input name='zip' onChange={handleServiceAddressChange} type="number" className="form-control" defaultValue={addressService.zip} required />
                            </div>
                            <div className="col-12">
                              <div className="form-check">
                                <input name='isHomeService' className="form-check-input" type="checkbox" id="homeCheck" onChange={handleHomeService} checked={service.isHomeService} />
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
                              <option value="">Seleccionar Intervalo...</option>
                              {schedule.days.length > 1 ?
                                scheduleSelect.map(interval => (
                                  <option key={interval.value} value={interval.value} selected={interval.value == schedule.interval}>{interval.label}</option>
                                ))
                                :
                                scheduleSelect.map(interval => (
                                  <option key={interval.value} value={interval.value}>{interval.label}</option>
                                ))
                              }
                            </select>
                            {
                              schePreData.days.map((element, index) => (
                                <div key={element.day} className="row mb-3">
                                  <div className="col-sm-4">
                                    <div className="form-check">
                                      <label className="form-check-label mt-2">
                                        <input className="form-check-input" type="checkbox" value={element.day} onChange={handleDayChange} checked={element.startHour != ""}/> {element.day}
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="row mb-3">
                                      <label className="col-sm-2 col-form-label">Inicio</label>
                                      <div className="col-sm-9 offset-sm-1">
                                        <input required disabled={element.startHour == ""} id={element.day + "s"} type="time" className="form-control" onChange={(e) => handleStartHourChange(e, element)} defaultValue={element.startHour} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <div className="row mb-3">
                                      <label className="col-sm-2 col-form-label">Fin</label>
                                      <div className="col-sm-9 offset-sm-1">
                                        <input required disabled={element.endHour  == ""} id={element.day + "e"} type="time" className="form-control" onChange={(e) => handleEndHourChange(e, element)} defaultValue={element.endHour} />
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