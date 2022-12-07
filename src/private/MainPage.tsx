import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AuthProvider from '../components/AuthProvider';
import { auth, existsUser, getCategories, getServices, getSpecialty, getUser, searchService, updateUser } from '../utils/firebase';
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
  const [category, setCategories] = useState(null);
  const [specialty, setSpecialty] = useState([]);
  const [specialtyAvailable, setAvailableS] = useState(true);
  const [search, setButtonSearch] = useState(true);
  const [searchOptions, setSearch] = useState({ categoryId: "", specialtyId: "" })
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
    const s = await getServices();
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
          <div className='container-fluid border bg-light pt-4 pb-4 ms-2 text-right'>
            {services.length > 0 ?
              <div className='row'>
                {
                  services.map(element => (
                    <div key={element.id} className='col-md-3 mb-2'>
                      <div className='row m-1 rounded shadow'>
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
                              <button className='btn btn-sm btn-gradient' data-bs-toggle="modal" data-bs-target="#modalGenerarCita">
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
        <div className="modal fade" id="modalGenerarCita" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Agenda una Cita</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form className='row g-3' onSubmit={handleSubmitService}>
                  <div className="col-md-8">
                    <label className="form-label">¿A qué nombre está el servicio? <b className='obligatorio'>*</b></label>
                    <input name='name' type="text" className="form-control" placeholder='Te reconocerán por este nombre' required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Edad <b className='obligatorio'>*</b></label>
                    <input name='age' type="number" className="form-control" required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Datos Importantes <b className='obligatorio'>*</b></label>
                    <textarea name='information' className="form-control" placeholder='Ingresa cualquier información relevante (alergias, ubicaciones, pedido especial)' maxLength={500}></textarea>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Selecciona la fecha y hora <b className='obligatorio'>*</b></label>
                    
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" className="btn btn-primary">Agendar</button>
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