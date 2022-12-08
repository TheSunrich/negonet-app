import React, { useState } from 'react'
import servicios from '../assets/imgs/servicios.png'
import cocinero from '../assets/imgs/cocinero.jpg'
import carpintero from '../assets/imgs/carpintero.jpg'
import electricista from '../assets/imgs/electricista1.png';
import maestra from '../assets/imgs/maestra.jpg'
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const ContainerIndex = () => {
    const [email, setEmail] = useState({ email: "", subject: "Correo desde la página principal", message: "" })
    function handleChange(e) {
        setEmail({
            ...email,
            [e.target.name]: e.target.value
        })
    }
    async function handleSubmitEmail(e) {
        e.preventDefault();
        emailjs.send("service_twzyttc", "template_l8iervk", {
            subject: email.subject,
            email: email.email,
            message: email.message,
        }, 'WYN-KBuNfBcx9Yi38').then(element => {
            Swal.fire({
                title: 'Correo Enviado',
                html: 'NegoNet ha recibido tu correo, te responderemos lo antes posible',
                icon: 'success'
            });
            setEmail({
                email: "",
                subject: "Correo desde la página principal",
                message: ""
            })
        })
    }
    return (
        <>
            <div className='mainbg'>
                <div className="container col-xxl-8 px-4 py-5">
                    <div className="row flex-lg-row-reverse text-light align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <img src={carpintero} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
                        </div>
                        <div className="col-lg-6 text-light">
                            <h1 className="display-5 fw-bold lh-1 mb-3 text-light">NegoNet al Alcance de un Clic</h1>
                            <p className="lead">¿Buscar algún servicio? únete a NegoNet y al igual que miles de usuarios, encuentra la oportunidad que resuelva tu problema de manera sencilla, NegoNet es una red de profesionistas y de clientes que buscan beneficiarse el uno al otro.</p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <Link to="/login" relative="path" className="btn btn-primary btn-lg px-4 me-md-2">Quiero Unirme</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container-fluid divbackwhite text-center'>
                    <div className='row fs-5'>
                        <div className="col-lg-4 p-5 contents animate__animated animate__backInLeft">
                            <svg xmlns="http://www.w3.org/2000/svg" width="140  " height="140 " fill="currentColor" className="bi bi-hammer icontext" viewBox="0 0 16 16">
                                <path d="M9.972 2.508a.5.5 0 0 0-.16-.556l-.178-.129a5.009 5.009 0 0 0-2.076-.783C6.215.862 4.504 1.229 2.84 3.133H1.786a.5.5 0 0 0-.354.147L.146 4.567a.5.5 0 0 0 0 .706l2.571 2.579a.5.5 0 0 0 .708 0l1.286-1.29a.5.5 0 0 0 .146-.353V5.57l8.387 8.873A.5.5 0 0 0 14 14.5l1.5-1.5a.5.5 0 0 0 .017-.689l-9.129-8.63c.747-.456 1.772-.839 3.112-.839a.5.5 0 0 0 .472-.334z" />
                            </svg>
                            <h2 className="fw-normal mt-3 icontext">Profesiones</h2>
                            <p>Encuentra cualquier profesión dentro de NegoNet y apoya la economía local</p>
                            <p><Link to="/login" relative="path" className="btn btn-secondary">Ver Especialistas</Link></p>
                        </div>
                        <div className="col-lg-4 p-5 contents animate__animated animate__backInLeft">
                            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="currentColor" className="bi bi-gear-wide-connected icontext" viewBox="0 0 16 16">
                                <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z" />
                            </svg>
                            <h2 className="fw-normal mt-3 icontext">Servicio</h2>
                            <p>Recibe reparaciones a domicilio de cualquier tipo de problemas</p>
                            <p><Link to="/login" relative="path" className="btn btn-secondary">Ver Especialistas</Link></p>
                        </div>
                        <div className="col-lg-4 p-5 contents animate__animated animate__backInLeft">
                            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="currentColor" className="bi bi-egg-fried icontext" viewBox="0 0 16 16">
                                <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z" />
                            </svg>
                            <h2 className="fw-normal mt-3 icontext">Cocina</h2>
                            <p>Agenda clases especializadas con profesionales dentro del area.</p>
                            <p><Link to="/login" relative="path" className="btn btn-secondary">Ver Especialistas</Link> </p>
                        </div>

                    </div>
                </div>
                <div id='contacto' className="container-fluid p-5 divbackwhite">
                    <div className="row align-items-center g-lg-5 py-5">
                        <div className="col-lg-7 ps-5 text-center text-lg-start">
                            <h1 className="display-4 fw-bold lh-1 mb-3">Envíanos un Mensaje</h1>
                            <p className="col-lg-10 fs-4">Para NegoNet es muy importante el recibir tus comentarios, este espacio es para ti, siéntete libre de escribir tus opiniones, recomendaciones y quejas.</p>
                        </div>
                        <div className="col-md-10 pe-5 mx-auto col-lg-5">
                            <form onSubmit={handleSubmitEmail} className="p-4 p-md-5 border rounded-3 bg-light">
                                <div className="form-floating mb-3">
                                    <input name='email' type="email" className="form-control" id="floatingInput" placeholder="nombre@example.com" required onChange={handleChange}/>
                                        <label htmlFor="floatingInput">Correo Electrónico</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input name='message' type="text" className="form-control" id="floatingPassword" placeholder="mensaje" required onChange={handleChange}/>
                                        <label htmlFor="floatingPassword">Mensaje</label>
                                </div>
                                <button className="w-100 btn btn-lg btn-primary" type="submit">Enviar Mensaje</button>
                                <hr className="my-4"/>
                                    <small className="text-muted">Al hacer clic en Enviar, aceptas nuestros términos y condiciones</small>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContainerIndex