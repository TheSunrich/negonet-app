import React from 'react'
import servicios from '../assets/imgs/servicios.png'
import cocinero from '../assets/imgs/cocinero.jpg'
import carpintero from '../assets/imgs/carpintero.png'
import electricista from '../assets/imgs/electricista1.png';
import maestra from '../assets/imgs/maestra.jpg'

const ContainerIndex = () => {
    return (
        <>
            <div className='mainbg'>
                <div className='container-fluid containerbg'>
                    <div className='row'>
                        <div className='col-md-4 text-center'>

                        </div>
                        <div className='col-md-8 text-center animate__animated animate__headShake formbusqueda'>
                            <div>
                                <h1 className='mt-5 titulosearch'>Encuentra tu servicio y genera una cita</h1>
                                <div className='container w-75 mt-2 rounded bg-light border mt-4 p-3'>
                                    <form>
                                        <div className='row'>
                                            <div className='col'>
                                                <label className='form-label'>Categoría</label>
                                            </div>
                                            <div className='col'>
                                                <label className='form-label'>Especialidad</label>
                                            </div>
                                            <div className='col'>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col'>
                                                <select className="form-select notrounded" aria-label="Default select example">
                                                    <option>Seleccionar Categoría</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className='col'>
                                                <select className="form-select notrounded" aria-label="Default select example">
                                                    <option>Seleccionar Especialidad</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className='col text-center align-items-center justify-content-center'>
                                                <div className="d-grid gap-2">
                                                    <button className="btn btn-primary notrounded" type="button">Buscar Servicio</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container-fluid containertext divinclinado text-center'>
                    <div className='row divtextinclinado fs-5'>
                        <div className="col-lg-4 p-5 contents animate__animated animate__backInLeft">
                            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="currentColor" className="bi bi-bandaid-fill icontext" viewBox="0 0 16 16">
                                <path d="m2.68 7.676 6.49-6.504a4 4 0 0 1 5.66 5.653l-1.477 1.529-5.006 5.006-1.523 1.472a4 4 0 0 1-5.653-5.66l.001-.002 1.505-1.492.001-.002Zm5.71-2.858a.5.5 0 1 0-.708.707.5.5 0 0 0 .707-.707ZM6.974 6.939a.5.5 0 1 0-.707-.707.5.5 0 0 0 .707.707ZM5.56 8.354a.5.5 0 1 0-.707-.708.5.5 0 0 0 .707.708Zm2.828 2.828a.5.5 0 1 0-.707-.707.5.5 0 0 0 .707.707Zm1.414-2.121a.5.5 0 1 0-.707.707.5.5 0 0 0 .707-.707Zm1.414-.707a.5.5 0 1 0-.706-.708.5.5 0 0 0 .707.708Zm-4.242.707a.5.5 0 1 0-.707.707.5.5 0 0 0 .707-.707Zm1.414-.707a.5.5 0 1 0-.707-.708.5.5 0 0 0 .707.708Zm1.414-2.122a.5.5 0 1 0-.707.707.5.5 0 0 0 .707-.707ZM8.646 3.354l4 4 .708-.708-4-4-.708.708Zm-1.292 9.292-4-4-.708.708 4 4 .708-.708Z" />
                            </svg>
                            <h2 className="fw-normal mt-3 icontext">Salud</h2>
                            <p>Contacta a los mejores especialistas de salud dentro de la aplicación</p>
                            <p><a className="btn btn-secondary" href="#">Ver especiaistas</a></p>
                        </div>
                        <div className="col-lg-4 p-5 contents animate__animated animate__backInLeft">
                            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="currentColor" className="bi bi-gear-wide-connected icontext" viewBox="0 0 16 16">
                                <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z" />
                            </svg>
                            <h2 className="fw-normal mt-3 icontext">Servicio</h2>
                            <p>Recibe reparaciones a domicilio de cualquier tipo de problemas</p>
                            <p><a className="btn btn-secondary" href="#">Ver especialistas</a></p>
                        </div>
                        <div className="col-lg-4 p-5 contents animate__animated animate__backInLeft">
                            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="currentColor" className="bi bi-egg-fried icontext" viewBox="0 0 16 16">
                                <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z" />
                            </svg>
                            <h2 className="fw-normal mt-3 icontext">Cocina</h2>
                            <p>Agenda clases especializadas con profesionales dentro del area.</p>
                            <p><a className="btn btn-secondary" href="#">Ver especialistas</a></p>
                        </div>

                    </div>
                </div>
                <div className='container-fluid containerwhite text-center'>
                    <div className='container-fluid contenttext'>
                        <div className='row'>
                            <div className='col mh-100 justify-content-center align-self-center'>
                                <img src={carpintero} width="550"></img>
                            </div>
                            <div className='col me-5 text-light mh-100'>
                                <h1 className='me-2 text-end'>Contrata Cualquier Servicio</h1>
                                <div className='justifytext container-fluid fs-4'>
                                    <br />
                                    Desde un educador privado hasta un especialista certificado que te ayude a resolver tu inconveniente o dar asesorias, la necesidad que tengas la encuentras aquí, en NegoNet.
                                    <br />
                                    <br />
                                    Te brindamos la herramienta necesaria para que estés en contacto con personas y equipos de trabajo altamente capacitados, de esta forma, encontrar el servicio que necesites al alcance.
                                </div>
                                <div className='container-fluid text-start'>
                                    <button className='btn btn-lg btn-light mt-5'>
                                        Quiero saber cómo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container-fluid containercolor divinclinado2 text-center'>

                </div>
                <div className='container-fluid containerfinal text-center'>
                    bb
                </div>
            </div>
        </>
    )
}

export default ContainerIndex