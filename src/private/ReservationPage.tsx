import cocinero from '../assets/imgs/cocinero.jpg';
import React, { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, getUser, getAppointmentActual, getAppointmentFuture, getAppointmentPast } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import Loading from '../components/Loading';
import moment from 'moment';
import Swal from 'sweetalert2';
const ReservationPage = () => {
  useEffect(() => {
    onAuthStateChanged(auth, handleUserStateChanged);
  }, []);
  const navigate = useNavigate();
  const [state, setSate] = useState(0);
  const [appointment, setAppointment] = useState([]);
  const [appointmentPast, setPast] = useState([]);
  const [appointmentActual, setActual] = useState([]);
  const [appointmentFuture, setFuture] = useState([]);
  const [user, setUser] = useState({});

  async function handleUserStateChanged(u) {
    if (u) {
      const exists = await getUser(u.uid);
      setUser({
        ...exists
      })
      const past = await getAppointmentPast(u.uid);
      setPast(
        past
      )
      const actual = await getAppointmentActual(u.uid);
      setActual(
        actual
      )
      const future = await getAppointmentFuture(u.uid);
      setFuture(
        future
      )
      console.log(past)
      console.log(actual)
      console.log(future)
      setSate(2);
    } else {
      setSate(4);
    }
  }

  async function handleUserLoggedIn(u) {
    setSate(2);
  }
  function handleUserUserNotRegistered(user) {
    navigate("/register");
  }
  function handleUserNotLoggedIn(user) {
    setSate(4);
    navigate("/login");
  }
  async function showAlertStatus(appointment){
    console.log(appointment);
  }
  if (state == 2) {
    return (
      <div className='container-fluid'>
        <h3 className='m-3'>Mis Citas</h3>
        <div className='row mb-3 justify-content-end'>
          <div className='col-auto text-center'>
          </div>
        </div>
        <div className='row pt-4 pb-4 ms-2 text-right'>
          {/*Citas Pasadas */}
          <div className='col-md-4 text-center'>
            <div className='bg-danger border bg-light'>
              <h5 className='mt-3'>Pasadas</h5>
              <hr className='ms-2 me-2' />
              {appointmentPast.length > 0 ?
                appointmentPast.map(appointment => (
                  <div key={appointment.id} className='container-fluid p-3 hover' onClick={() => showAlertStatus(appointment)}>
                    <div className='container-fluid border-top border-start border-end bg-primary rounded-top img2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${appointment.serviceImageUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                    </div>
                    <div className='container border-start border-bottom border-end bg-light rounded-bottom pb-2 pt-1'>
                      <div className='row'>
                        <div className='col-6'>
                          <span className='text-secondary fw-bold'>{moment(appointment.dateStart.seconds * 1000).format("LLL")}</span>
                        </div>
                        <div className='col-6 justify-content-end align-items-end d-flex'>
                          {appointment.status == "Generado" ?
                            <span className='badge bg-primary'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Recibido" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Completado" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Cancelado" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                :
                <div className='container-fluid p-3'>
                  <span>No hay información disponible</span>
                </div>
              }
            </div>
          </div>
          {/*Citas Actuales y Por venir */}
          <div className='col-md-4 text-center'>
            <div className='bg-danger border bg-light'>
              <h5 className='mt-3'>Actuales y por Venir</h5>
              <hr className='ms-2 me-2' />
              {appointmentActual.length > 0 ?
                appointmentActual.map(appointment => (
                  <div key={appointment.id} className='container-fluid p-3 hover' onClick={() => showAlertStatus(appointment)}>
                    <div className='container-fluid border-top border-start border-end bg-primary rounded-top img2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${appointment.serviceImageUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                    </div>
                    <div className='container border-start border-bottom border-end bg-light rounded-bottom pb-2 pt-1'>
                      <div className='row'>
                        <div className='col-6'>
                          <span className='text-secondary fw-bold'>{moment(appointment.dateStart.seconds * 1000).format("LLL")}</span>
                        </div>
                        <div className='col-6 justify-content-end align-items-end d-flex'>
                          {appointment.status == "Generado" ?
                            <span className='badge bg-primary'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Recibido" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Completado" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Cancelado" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                :
                <div className='container-fluid p-3'>
                  <span>No hay información disponible</span>
                </div>
              }
            </div>
          </div>
          {/*Citas futuras*/}
          <div className='col-md-4 text-center'>
            <div className='bg-danger border bg-light'>
              <h5 className='mt-3'>Futuras</h5>
              <hr className='ms-2 me-2' />
              {appointmentFuture.length > 0 ?
                appointmentFuture.map(appointment => (
                  <div key={appointment.id} className='container-fluid p-3 hover' onClick={() => showAlertStatus(appointment)}>
                    <div className='container-fluid border-top border-start border-end bg-primary rounded-top img2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${appointment.serviceImageUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                    </div>
                    <div className='container border-start border-bottom border-end bg-light rounded-bottom pb-2 pt-1'>
                      <div className='row'>
                        <div className='col-6'>
                          <span className='text-secondary fw-bold'>{moment(appointment.dateStart.seconds * 1000).format("LLL")}</span>
                        </div>
                        <div className='col-6 justify-content-end align-items-end d-flex'>
                          {appointment.status == "Generado" ?
                            <span className='badge bg-primary'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Recibido" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Completado" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                          {appointment.status == "Cancelado" ?
                            <span className='badge bg-success'>{appointment.status}</span>
                            : ""
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                :
                <div className='container-fluid p-3'>
                  <span>No hay información disponible</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
  return <AuthProvider
    onUserLoggedIn={handleUserLoggedIn}
    onUserNotRegistered={handleUserUserNotRegistered}
    onUserNotLoggedIn={handleUserNotLoggedIn}>
    <Loading />
  </AuthProvider>
}

export default ReservationPage