import React from 'react'
import cocinero from '../assets/imgs/cocinero.jpg';
const ReservationPage = () => {
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

export default ReservationPage