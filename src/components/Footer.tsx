import React from 'react'

function Footer() {
    return (
        <div className="container">
            <footer className="py-5">
                <div className="row">
                    <div className="col-6 col-md-2 mb-3">
                        <h5>Contacto</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Teléfonos</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Correos</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">FAQs</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Sobre NegoNet</a></li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-2 mb-3">
                        <h5>Apartados</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Mi Perfil</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Mis Citas</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Servicios</a></li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-2 mb-3">
                        <h5>Información</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Visión</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Misión</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Valores</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Objetivos</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Quiénes Somos</a></li>
                        </ul>
                    </div>

                    <div className="col-md-5 offset-md-1 mb-3">
                        <form>
                            <h5>Suscríbete a nuestro boletín informativo.</h5>
                            <p>Entérate antes que nadie de lo nuevo que hay en NegoNet.</p>
                            <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                                <label className="visually-hidden">Correo Electrónico</label>
                                <input type="text" className="form-control" placeholder="Email address"/>
                                    <button className="btn btn-primary" type="button">Suscribirse</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                    <p>© 2022 Company, Inc. All rights reserved.</p>
                    <ul className="list-unstyled d-flex">
                        <li className="ms-3"><a className="link-dark" href="#"><i className="bi bi-twitter"></i></a></li>
                        <li className="ms-3"><a className="link-dark" href="#"><i className="bi bi-instagram"></i></a></li>
                        <li className="ms-3"><a className="link-dark" href="#"><i className="bi bi-facebook"></i></a></li>
                    </ul>
                </div>
            </footer>
        </div>
    )
}

export default Footer