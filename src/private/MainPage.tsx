import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import { auth, existsUser, getCategories, getServices, getSpecialty, getUser, searchService, updateUser, checkAvailabilityService, addAppointment } from '../utils/firebase';
import { json, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { User } from '../models/UserModel';
import cocinero from '../assets/imgs/cocinero.jpg';
import moment, { weekdays } from 'moment';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker'
import getDay from "date-fns/getDay"
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns';
import { Appointment } from '../models/AppointmentModel';
moment.lang('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
  weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
});


const MainPage = () => {
  useEffect(() => {
    onAuthStateChanged(auth, handleUserStateChanged);
  }, []);
  const navigate = useNavigate();
  const [state, setSate] = useState(0);
  let userData: User;
  const [user, setUser] = useState(userData);
  const [quotes, getQuotes] = useState();
  const [services, setService] = useState([]);
  const [category, setCategories] = useState(null);
  const [specialty, setSpecialty] = useState([]);
  const [specialtyAvailable, setAvailableS] = useState(true);
  const [search, setButtonSearch] = useState(true);
  const [searchOptions, setSearch] = useState({ categoryId: "", specialtyId: "" })
  const [currentServicio, setCurrentServicio] = useState({});
  const [currentShedule, setCurrentShedule] = useState({});
  const [hours, setHours] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentHour, setCurrentHour] = useState({});
  const [userInformation, setUserInformation] = useState({});
  const [paymentType, setPaymentType] = useState("");


  async function handleUserStateChanged(u) {
    if (u) {
      setUser({
        ...u
      })
      const categories = await getCategories();
      setCategories(categories)
      setSate(2);
    } else {
      setSate(4);
    }
  }
  async function handleUserLoggedIn(u) {
    const s = await getServices(u);
    setService(s)
    setSate(2);
  }
  async function handleCategoryChange(e) {
    if (e.target.value != "") {
      const sp = await getSpecialty(e.target.value)
      setSpecialty(sp);
      setAvailableS(false);
      setSearch({
        ...searchOptions,
        categoryId: e.target.value
      })
      setButtonSearch(false);
    } else {
      setButtonSearch(true);
      setAvailableS(true);
    }
  }
  async function handleSpecialtyChange(e) {
    if (e.target.value != "") {
      setSearch({
        ...searchOptions,
        specialtyId: e.target.value
      })

    } else {
      setSearch({
        ...searchOptions,
        specialtyId: ""
      })
    }
    console.log(searchOptions)
  }
  async function handleSearchService(e) {
    e.preventDefault();
    const s = await searchService(searchOptions);
    console.log(s)
    setService(s);
  }
  async function handleSubmitService(e) {

  }
  function handleUserUserNotRegistered(user) {
    navigate("/register");
  }
  function handleUserNotLoggedIn(user) {
    setSate(4);
    navigate("/login");
  }
  function handleChangeDayService(e) {
    moment.locale('es');

    // día en español
    let cDay = moment(e).format('dddd')

    console.log(cDay)

    if (cDay != "") {
      let day = cDay;
      let hours = currentServicio.schedule.days.filter(element => {
        console.log(element, day)
        return element.day == day
      }).filter(element => element.hours.length > 0).filter(element => element.hours.filter(element => element.disponible).length > 0)[0].hours

      let finalHours = hours.map(async element => {
        let dataStart = new Date(moment(e).format('YYYY-MM-DD') + " " + element.inicio);
        let dataEnd = new Date(moment(e).format('YYYY-MM-DD') + " " + element.final);
        if (await checkAvailabilityService(currentServicio.id, dataStart, dataEnd)) {
          return element;
        }
      })

      Promise.all(finalHours).then((values) => {
        console.log(values.filter(element => element != undefined))
        setHours(values.filter(element => element != undefined));
      });



    } else {
      setHours([]);

    }

  }
  function handleAgendarCita(service) {
    let interval = service.schedule.interval;
    service.schedule.days.map((element, index) => {
      let horas = getHorasByIntervalo(element.startHour, element.endHour, interval);
      element.hours = horas;
      console.log(element)
    })

    setCurrentServicio(service);



  }
  const filterDays = (days) => {

    moment.locale('es');
    //get days from currentServicio.schedule.days
    let daysAvailables = currentServicio.schedule.days.map(element => {
      switch (element.day) {
        case "Lunes":
          return 1;
        case "Martes":
          return 2;
        case "Miércoles":
          return 3;
        case "Jueves":
          return 4;
        case "Viernes":
          return 5;
        case "Sábado":
          return 6;
        case "Domingo":
          return 0;
        default:
          return 0;
      }
    });
    let today = new Date();

    const day = days.getDay();
    return daysAvailables.includes(day)

  }
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleChange = (e) => {
    setIsOpen(!isOpen);
    setStartDate(e);
    handleChangeDayService(e)
  };
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  function guardarCita() {
    const data: Appointment = {
      dateStart: new Date(moment(startDate).format('YYYY-MM-DD') + " " + currentHour.inicio),
      dateEnd: new Date(moment(startDate).format('YYYY-MM-DD') + " " + currentHour.final),
      userProviderId: currentServicio.userId,
      userClientId: user.uid,
      serviceId: currentServicio.id,
      serviceImageUrl: currentServicio.imageUrl,
      serviceName: currentServicio.name,
      servicePrice: currentServicio.price,
      clientName: userInformation.name,
      isHomeService: currentServicio.isHomeService,
      address: currentServicio.address,
      paymentType: userInformation.paymentType,
      cardData: userInformation.cardData,
      age: userInformation.age,
      information: userInformation.information,
      isCanceled: false,
      status: "Generado"
    }
    data.paymentType == "tarjeta" ? data.cardData = userInformation.cardData : data.cardData = null;


    //si hay un campo indefinido, no se guarda la cita
    console.log(data)
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        console.log(element, element == undefined)
        if (element === undefined) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que faltan datos',
          })
          return;
        }
      }
    }
    Swal.fire({
      title: 'Por favor espere mientras se guarda la cita',
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading(null)
        await addAppointment(data).then(res => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'Cita agendada',
              text: 'Se ha agendado la cita correctamente',
            })
            navigate("reservation");
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se ha podido agendar la cita',
            })
          }
        })

      }
    })

    /*
    
      service : currentServicio,
      user : user
    */
  }

  function handlePaymentType(e) {
    setUserInformation({ ...userInformation, paymentType: e.target.value })
    setPaymentType(e.target.value);
  }

  function submitAgendar() {
    Swal.fire({
      title: '¿Estas seguro de agendar esta cita?',
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,

    }).then((result) => {
      if (result.isConfirmed) {
        guardarCita();
      } else if (result.isDenied) {
        Swal.fire('Cita no agendada', '', 'info')
      }

    })
  }

  function handleUserInformation(e) {
    e.preventDefault();
    console.log(user);
    if (e.target.name == "cardNumber") {
      let cardData = userInformation.cardData ? userInformation.cardData : { cardNumber: "", dateExpire: "", cvv: "" };
      cardData.cardNumber = e.target.value;
      setUserInformation({ ...userInformation, cardData: cardData })
    } else if (e.target.name == "dateExpire") {
      let cardData = userInformation.cardData ? userInformation.cardData : { cardNumber: "", dateExpire: "", cvv: "" };
      cardData.dateExpire = e.target.value;
      setUserInformation({ ...userInformation, cardData: cardData })
    } else if (e.target.name == "cvv") {
      let cardData = userInformation.cardData ? userInformation.cardData : { cardNumber: "", dateExpire: "", cvv: "" };
      cardData.cvv = e.target.value;
      setUserInformation({ ...userInformation, cardData: cardData })
    } else {
      setUserInformation({ ...userInformation, [e.target.name]: e.target.value })
    }

  }

  function handleHourSelected(e) {
    console.log("que pedo basura", e.target.value)
    let value = e.target.value.split("-")[0].trim();
    let hour = hours.filter(element => element.inicio == value)[0];
    console.log(hour)
    setCurrentHour(hour)
  }

  function getHorasByIntervalo(inicio, fin, intervalo) {
    console.log(inicio, fin, intervalo)
    inicio = moment(inicio, "HH:mm");
    fin = moment(fin, "HH:mm");
    let horas = [];
    let tempFin = moment(inicio, "HH:mm").add(intervalo, "minutes");
    let i = 0;
    while (inicio < fin) {
      horas.push({ i: i, inicio: inicio.format("HH:mm"), final: tempFin.format("HH:mm"), disponible: true });
      inicio.add(intervalo, "minutes");
      tempFin.add(intervalo, "minutes");
      i++;
    }
    return horas;
  }
  if (state == 2) {
    return (
      <>
        <div className='container-fluid'>
          <h3 className='m-3'>Servicios de la Comunidad</h3>
          <div className='row mb-3 justify-content-end'>
            <div className='col-auto text-center'>
              <form onSubmit={handleSearchService} className="row g-3 pb-3 rounded">
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">Categoría</label>
                  <select name='categoryId' onChange={handleCategoryChange} className="form-select form-select-sm" required>
                    <option value="">Seleccionar una opción...</option>
                    {
                      category.map(element => (
                        <option key={element.id} value={element.id}>{element.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-md-5">
                  <label htmlFor="inputPassword4" className="form-label">Especialidad</label>
                  <select name='specialtyId' onChange={handleSpecialtyChange} id="specialtyselect" className="form-select form-select-sm" disabled={specialtyAvailable} required>
                    <option value="">Seleccionar una opción...</option>
                    {
                      specialty.map(element => (
                        <option key={element.id} value={element.id}>{element.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-md-3 align-midle d-flex align-items-center mt-5">
                  <button disabled={search} type="submit" className="btn btn-sm btn-primary text-light">Buscar Servicio</button>

                </div>
              </form>
            </div>
          </div>
          <div className='container-fluid border bg-light pt-4 pb-4 ms-2 text-right servicescontainer'>
            {services.length > 0 ?
              <div className='row'>
                {
                  services.map(element => (
                    <div key={element.id} className='col-md-3 mb-2'>
                      <div className='row m-1 rounded shadow bg-light' >
                        <div className='col-12 img rounded-top hover' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${element.imageUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                        </div>
                        <div className='col-12 info rounded-bottom '>
                          <div className='row'>
                            <div className='col-12 mt-1 text-secondary text-center'>
                              {element.name}
                            </div>
                            <div className='col-12 mt-1 text-secondary text-center'>
                              <span className='text-success fw-bold'>{element.price > 0 ?
                                "$" + element.price : "gratuito"}</span>
                            </div>
                            <div className='col-12 mt-1 text-secondary text-center'>
                              <button className='btn btn-sm btn-gradient' data-bs-toggle="modal" data-bs-target="#modalGenerarCita" onClick={() => handleAgendarCita(element)}>
                                Contratar Servicio
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                  ))
                }
              </div>
              :
              <div className='row'>
                <div className='col text-center'>
                  <span className='fw-bold'>No hay información disponible</span>
                  <br />
                  <br />
                  <span>Busca en un futuro, seguro encontrarás el servicio que quieres</span>
                </div>
              </div>

            }
          </div>
        </div>
        <div className="modal" id="modalGenerarCita" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Agenda una Cita</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className='row'>
                  <div className='col-6 text-center'>

                    <h1 className='fs-5 text-right fw-bold mt-4'>{currentServicio.name}</h1>
                    <h3 className='text-info mt-2'><b>${currentServicio.price}</b></h3>
                    <p className='mt-4'>Descripción</p>
                    <p className='text-right bg-light border pt-2 pb-2'>{currentServicio.description}</p>
                  </div>
                  <div className='col-6 justify-content-end align-items-end d-flex pe-3'>
                      <img src={currentServicio.imageUrl} alt="" className='img-fluid rounded roundedimg2' />
                  </div>

                </div>


                <form className='row g-3 mt-4' onSubmit={handleSubmitService}>
                  <div className="col-md-8">
                    <label className="form-label">¿A qué nombre está el servicio? <b className='obligatorio'>*</b></label>
                    <input name='name' type="text" className="form-control" value={user.firstName} onChange={handleUserInformation} placeholder='Te reconocerán por este nombre' required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Edad <b className='obligatorio'>*</b></label>
                    <input name='age' type="number" onChange={handleUserInformation} className="form-control" min={0} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Datos Importantes <b className='obligatorio'>*</b></label>
                    <textarea name='information' className="form-control" onChange={handleUserInformation} placeholder='Ingresa cualquier información relevante (alergias, ubicaciones, pedido especial)' maxLength={500}></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Selecciona la fecha<b className='obligatorio'>*</b></label>
                    <br></br>
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary btn-block" onClick={handleClick}>
                        {startDate ? format(startDate, 'dd/MM/yyyy') : "Seleccionar fecha y hora"}
                      </button>
                    </div>

                    {isOpen && (
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => { handleChange(date) }}
                        filterDate={(d) => filterDays(d)}
                        minDate={new Date()}
                        timeIntervals={currentServicio.schedule ? currentServicio.schedule.interval : 60}
                        dateFormat="MMMM d"
                        placeholderText="Select a weekday" inline />
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Hora <b className='obligatorio'>*</b></label>
                    <select name='hour' className="form-select " required onChange={handleHourSelected}>
                      <option value="" >Seleccionar una opción...</option>
                      {
                        hours ?
                          hours.map(element => (
                            <option key={element.i} value={element.id}>{element.inicio} - {element.final}</option>
                          ))
                          :
                          <option >No hay horas disponibles</option>
                      }
                    </select>
                  </div>
                  <label className="form-label">Método de pago<b className='obligatorio'>*</b></label>

                  <div className="col-md-12">
                    <div className='form-check form-check-inline'>
                      <input className="form-check-input" type="radio" name="payment" id="inlineRadio1" value="efectivo" onChange={handlePaymentType} required />
                      <label className="form-check-label" htmlFor="inlineRadio1">Efectivo</label>
                    </div>
                    <div className='form-check form-check-inline'>
                      <input className="form-check-input" type="radio" name="payment" id="inlineRadio1" value="tarjeta" onChange={handlePaymentType} required />
                      <label className="form-check-label" htmlFor="inlineRadio1">Tarjeta</label>
                    </div>
                  </div>

                  {
                    paymentType === 'tarjeta' ?
                      <div className='row'>
                        <div className="col-md-4">
                          <label className="form-label">Número de tarjeta <b className='obligatorio'>*</b></label>
                          <input name='cardNumber' type="number" className="form-control" onChange={handleUserInformation} placeholder='**** **** **** ****' required />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Fecha de expiración <b className='obligatorio'>*</b></label>
                          <input name='dateExpire' type="text" className="form-control" onChange={handleUserInformation} placeholder='**/**' required />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Código de seguridad <b className='obligatorio'>*</b></label>
                          <input name='cvv' type="number" className="form-control" onChange={handleUserInformation} placeholder='***' required />
                        </div>
                      </div>


                      : null
                  }

                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={submitAgendar}>Agendar</button>
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

export default MainPage