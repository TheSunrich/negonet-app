import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import { auth, existsUser, getUser, updateUser } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { User } from '../models/UserModel';

const MainPage = () => {
  useEffect(() => {
    onAuthStateChanged(auth, handleUserStateChanged);
  }, []);
  const navigate = useNavigate();
  const [state, setSate] = useState(0);
  let userData: User;
  const [user, setUser] = useState(userData);
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
      <div className='container-fluid'>MainPage</div>
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