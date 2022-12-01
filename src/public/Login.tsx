import React from 'react'
import logoimg from '../assets/imgs/servicios.png';
import googlelogo from '../assets/imgs/google.png';

function Login() {
    return (
        <>
            <div className='row container-fluid justify-content-center text-dark logincontainer'>
                <div className='row col-md-6 mt-5'>
                    <div className='col-md-6 rounded-start text-center align-self-center'>
                        <img src={logoimg} width="350"></img>
                    </div>
                    <div className='col-md-6 bg-light rounded   '>
                        <div className='mb-3 mt-3 text-center'>
                            <h4>Iniciar Sesión</h4>
                        </div>
                        <hr></hr>
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-person-circle"></i> Usuario <b className='obligatorio'>*</b></label>
                            <input type="email" className="form-control" placeholder="nombre@ejemplo.com" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-incognito"></i> Contraseña <b className='obligatorio'>*</b></label>
                            <input type="password" className="form-control" placeholder="********" />
                            <div id="emailHelp" className="form-text text-center textopregunta  ">Recuerda que NegoNet no pedirá en ningún momento tus credenciales de acceso.</div>
                        </div>
                        <div className=' text-center'>
                            <button className='btn btn-primary'>
                            <i className="bi bi-door-open-fill"></i> Iniciar Sesión
                            </button>
                        </div>
                        <div id="emailHelp" className="form-text text-center mt-3 mb-2 textopregunta">¿No tienes una cuenta?</div>
                        <div className='text-center mb-2'>
                            <button className='btn btn-light'>
                                <img src={googlelogo} width="20"></img> Ingresa con Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Login