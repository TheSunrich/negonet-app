import cocinero from '../assets/imgs/cocinero.jpg';
import emailjs from '@emailjs/browser';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AuthProvider from '../components/AuthProvider';
import Loading from '../components/Loading';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { auth, getUser, getAppointmentPast, getAppointmentActual, cancelAppointment, getAppointmentFuture, getAppointmentActualProvider, getAppointmentFutureProvider, getAppointmentCancelProvider, getAppointmentCompleteProvider } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AppointmentPage = () => {
  useEffect(() => {
    onAuthStateChanged(auth, handleUserStateChanged);
  }, []);
  const navigate = useNavigate();
  const [state, setSate] = useState(0);
  const [appointment, setAppointment] = useState([]);
  const [appointmentPast, setPast] = useState([]);
  const [appointmentComplete, setComplete] = useState([]);
  const [appointmentActual, setActual] = useState([]);
  const [appointmentFuture, setFuture] = useState([]);
  const [appointmentCancel, setCancel] = useState([]);
  const [user, setUser] = useState({});
  async function handleUserStateChanged(u) {
    if (u) {
      const exists = await getUser(u.uid);
      setUser({
        ...exists
      })
      const past = await getAppointmentCompleteProvider(u.uid);
      setPast(
        past
      )
      const actual = await getAppointmentActualProvider(u.uid);
      setActual(
        actual
      )
      const future = await getAppointmentFutureProvider(u.uid);
      setFuture(
        future
      )
      const cancel = await getAppointmentCancelProvider(u.uid);
      setCancel(
        cancel
      )
      const complete = await getAppointmentCompleteProvider(u.uid);
      setComplete(
        complete
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
  async function showAlertStatus(appointment) {

    console.log(appointment);
    Swal.fire({
      title: 'Información',
      showCancelButton: !appointment.isCanceled && appointment.status !== "Recibido" && appointment.status !== "Completado",
      showDenyButton: !appointment.isCanceled && appointment.status !== "Completado",
      showConfirmButton: !appointment.isCanceled && appointment.status !== "Completado" && appointment.status !== "Completado",
      showCloseButton: true,
      confirmButtonText: 'Cancelar',
      confirmButtonColor: "#dc3741",
      cancelButtonText: "Recibido",
      cancelButtonColor: "#e1d119",
      denyButtonText: "Completado",
      denyButtonColor: "#28a745",
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,

      html: '<b>' + appointment.serviceName + '</b><br/><b class="text-success">$ ' + appointment.servicePrice + '</b>' +
        '<br/> <table class="table borderless"><tbody><tr><th class="col-6">Fecha de Inicio</th><th class="col-6">Fecha de Fin</th></tr><tr><th class="col-6 text-primary" style="font-size: 13px">' + moment(appointment.dateStart.seconds * 1000).format("LLL") + '</th><th class="col-6 text-primary" style="font-size: 13px">' + moment(appointment.dateEnd.seconds * 1000).format("LLL") + '</th></tr></tbody></table>' +
        '<div class="container-fluid"><span>Descripción</span><br/><span class="bg-light">' + appointment.information + '</span></div>' +
        (appointment.isHomeService ? '<div class="container-fluid mt-3"><span class="badge bg-primary">A domicilio</span></div>'
         + '<div class="container-fluid mt-3"><span>' + appointment.addressClient.address1 + '</span><br/><span>' + appointment.addressClient.address2 + '</span><br/><span>' + appointment.addressClient.city + " " + appointment.addressClient.state + ", " + appointment.addressClient.zip + '</span></div>' 
        : '<div class="container-fluid mt-3"><span class="badge bg-primary">En Ubicación</span></div>') +
        (!appointment.isHomeService ? '<div class="container-fluid mt-3"><span>' + appointment.addressService.address1 + '</span><br/><span>' + appointment.addressService.address2 + '</span><br/><span>' + appointment.addressService.city + " " + appointment.addressService.state + ", " + appointment.addressService.zip + '</span></div>' : '<div class="container-fluid mt-3"><span class="badge bg-success">Deberás dirigirte al domicilio</span></div>')
    }).then((result) => {
      console.log(result);
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Estás a punto de cancelar',
          text: "Si cancelas esta cita, le llegará una alerta al cliente",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, Cancelar Cita',
          cancelButtonText: "No"
          //add buttons another button

        }).then(async (result) => {
          if (result.isConfirmed) {
            appointment.isCanceled = true;
            appointment.status = 'Cancelado'
            await cancelAppointment(appointment);
            handleUserStateChanged(user);
            Swal.fire(
              'Cancelada',
              'La cita ha sido cancelada',
              'success'
            )
          }
        })
      } else if(result.isDenied){
        Swal.fire({
          title: 'Estás a punto de completar',
          text: "Si completas esta cita, le llegará una alerta al cliente",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, Completar Cita',
          cancelButtonText: "No"
          //add buttons another button

        }).then(async (result) => {
          if (result.isConfirmed) {
            appointment.isCompleted = true;
            appointment.status = 'Completado'
            await cancelAppointment(appointment);
            handleUserStateChanged(user);
            Swal.fire(
              'Completada',
              'La cita ha sido completada',
              'success'
            )
          }
        })
      } else if(result.isDismissed && result.dismiss === Swal.DismissReason.cancel){
        Swal.fire({
          title: 'Estás a punto de recibir',
          text: "Si recibes esta cita, le llegará una alerta al cliente",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, Recibir Cita',
          cancelButtonText: "No"
          //add buttons another button

        }).then(async (result) => {
          if (result.isConfirmed) {
            appointment.isReceived = true;
            appointment.status = 'Recibido'
            await cancelAppointment(appointment);
            handleUserStateChanged(user);
            Swal.fire(
              'Recibida',
              'La cita ha sido recibida',
              'success'
            )
          }
        })
      }
    })
  }

  if (state == 2) {
    return (
      <div className='container-fluid'>
      <h3 className='m-3'>Servicios Agendados</h3>
      <div className='row mb-3 justify-content-end'>
        <div className='col-auto text-center'>
        </div>
      </div>
      <div className='row pt-4 pb-4 ms-2 text-right'>
        {/*Citas Próximas*/}
        <div className='col-md-4 text-center'>
          <div className='bg-danger border bg-light'>
            <h5 className='mt-3'>Próximas</h5>
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
                          <span className='badge bg-warning'>{appointment.status}</span>
                          : ""
                        }
                        {appointment.status == "Completado" ?
                          <span className='badge bg-success'>{appointment.status}</span>
                          : ""
                        }
                        {appointment.status == "Cancelado" ?
                          <span className='badge bg-danger'>{appointment.status}</span>
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
        {/*Citas Completadas */}
        <div className='col-md-4 text-center'>
          <div className='bg-danger border bg-light'>
            <h5 className='mt-3'>Completadas</h5>
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
                          <span className='badge bg-warning'>{appointment.status}</span>
                          : ""
                        }
                        {appointment.status == "Completado" ?
                          <span className='badge bg-success'>{appointment.status}</span>
                          : ""
                        }
                        {appointment.status == "Cancelado" ?
                          <span className='badge bg-danger'>{appointment.status}</span>
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
        {/*Citas Canceladas */}
        <div className='col-md-4 text-center'>
          <div className='bg-danger border bg-light'>
            <h5 className='mt-3'>Canceladas</h5>
            <hr className='ms-2 me-2' />
            {appointmentCancel.length > 0 ?
              appointmentCancel.map(appointment => (
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
                          <span className='badge bg-warning'>{appointment.status}</span>
                          : ""
                        }
                        {appointment.status == "Completado" ?
                          <span className='badge bg-success'>{appointment.status}</span>
                          : ""
                        }
                        {appointment.status == "Cancelado" ?
                          <span className='badge bg-danger'>{appointment.status}</span>
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

export default AppointmentPage
