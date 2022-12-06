import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import { auth, existsUser, getServices, getUser, updateUser } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { User } from '../models/UserModel';
import cocinero from '../assets/imgs/cocinero.jpg';

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
  function handleUserStateChanged(u) {
    if (u) {
      setUser({
        ...u
      })
      setSate(2);
    } else {
      setSate(4);
    }
  }
  async function handleUserLoggedIn(u) {
    const s = await getServices();
    setService(s)
    console.log(services)
    console.log(s)
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
        <h3 className='m-3'>Servicios de la Comunidad</h3>
        <div className='container-fluid text-right'>
          <div className='row'>
            {
              services.map(element => (
                <div key={element.id} className='col-md-4'>
                  <div className='mt-2 mb-2 bg-light border'>
                    <div className='img' style={{background: `url(${element.imageUrl})`, backgroundRepeat: "no-repeat", backgroundSize:"100%"}}>
                      <div className='imgshadow rounded-top'>
                      </div>
                    </div>
                    <div className='text-end container-fluid mb-1'>
                      {element.name}
                    </div>
                    <div className='text-end container-fluid mb-3'>
                      <button className='btn btn-sm btn-primary'>Contratar Servicio</button>
                    </div>
                  </div>
                </div>
              ))
            }
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

export default MainPage