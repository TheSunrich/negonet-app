import cocinero from '../assets/imgs/cocinero.jpg';
import React, { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Address } from '../models/UserModel';
import { Schedule, Service } from '../models/ServiceModel';
import { auth, createService, existsUser, getCategories, getSpecialty, updateUser, storage, uploadImage, getUser, getServiceByUser, getAppointmentAll } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
  const [user, setUser] = useState({});

  async function handleUserStateChanged(u) {
    if (u) {
      const exists = await getUser(u.uid);
      setUser({
        ...exists
      })
      console.log(exists)
      const apexists = await getAppointmentAll(u.uid);
      setAppointment({
        ...apexists
      })
      console.log(apexists)
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
              <div className='container-fluid p-3'>
                <div className='container-fluid border-top border-start border-end bg-primary rounded-top img2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${cocinero})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                </div>
                <div className='container border-start border-bottom border-end bg-light rounded-bottom pb-2 pt-1'>
                  <div className='row'>
                    <div className='col-6'>
                      <span className='text-secondary fw-bold'>Fecha: 05/12/2022</span>
                    </div>
                    <div className='col-6 justify-content-end align-items-end d-flex'>
                      <span className='badge bg-success'>Completado</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='container-fluid p-3'>
                <div className='container-fluid border-top border-start border-end bg-primary rounded-top img2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${cocinero})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                </div>
                <div className='container border-start border-bottom border-end bg-light rounded-bottom pb-2 pt-1'>
                  <div className='row'>
                    <div className='col-6'>
                      <span className='text-secondary fw-bold'>Fecha: 05/12/2022</span>
                    </div>
                    <div className='col-6 justify-content-end align-items-end d-flex'>
                      <span className='badge bg-danger'>Cancelado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Citas Actuales y Por venir */}
          <div className='col-md-4 text-center'>
            <div className='bg-danger border bg-light'>
              <h5 className='mt-3'>Actuales y por Venir</h5>
              <hr className='ms-2 me-2' />
              <div className='container-fluid p-3'>
                <div className='container-fluid border-top border-start border-end bg-primary rounded-top img2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${cocinero})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                </div>
                <div className='container border-start border-bottom border-end bg-light rounded-bottom pb-2 pt-1'>
                  <div className='row'>
                    <div className='col-6'>
                      <span className='text-secondary fw-bold'>Fecha: 07/12/2022</span>
                    </div>
                    <div className='col-6 justify-content-end align-items-end d-flex'>
                      <span className='badge bg-primary'>En proceso</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='container-fluid p-3'>
                <div className='container-fluid border-top border-start border-end bg-primary rounded-top img2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${cocinero})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                </div>
                <div className='container border-start border-bottom border-end bg-light rounded-bottom pb-2 pt-1'>
                  <div className='row'>
                    <div className='col-6'>
                      <span className='text-secondary fw-bold'>Fecha: 08/12/2022</span>
                    </div>
                    <div className='col-6 justify-content-end align-items-end d-flex'>
                      <span className='badge bg-warning'>Mañana</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Citas futuras*/}
          <div className='col-md-4 text-center'>
            <div className='bg-danger border bg-light'>
              <h5 className='mt-3'>Futuras</h5>
              <hr className='ms-2 me-2' />
              <div className='container-fluid p-3'>
                <div className='container-fluid border-top border-start border-end bg-primary rounded-top img2' style={{ background: `linear-gradient(rgba( 0, 0, 0, 0.5), rgba( 0, 0, 0, 0.5)), url(${cocinero})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center", opacity: "1" }}>
                </div>
                <div className='container border-start border-bottom border-end bg-light rounded-bottom pb-2 pt-1'>
                  <div className='row'>
                    <div className='col-6'>
                      <span className='text-secondary fw-bold'>Fecha: 15/12/2022</span>
                    </div>
                    <div className='col-6 justify-content-end align-items-end d-flex'>
                      <span className='badge bg-info'>Futura</span>
                    </div>
                  </div>
                </div>
              </div>
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