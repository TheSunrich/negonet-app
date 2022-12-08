import React from 'react'
import cocinero from '../assets/imgs/cocinero.jpg';

const AppointmentPage = () => {
  return (
    <div className='container-fluid'>
      <h3 className='m-3'>Servicios de la Comunidad</h3>
      <div className='row mb-3 justify-content-end'>
        <div className='col-auto text-center'>
          <form className="row g-3 pb-3 rounded">
            <div className="col-md-7">
              <label htmlFor="inputEmail4" className="form-label">Servicio</label>
              <select name='categoryId' className="form-select form-select-sm" required>
                <option value="">Seleccionar una opción...</option>
                {
                  /*Aquí van los servicios desplegados */
                }
              </select>
            </div>
            <div className="col-md-5 align-midle d-flex align-items-center mt-5">
              <button type="submit" className="btn btn-sm btn-primary text-light">Filtrar por Servicio</button>
            </div>
          </form>
        </div>
      </div>
      <div className='container-fluid border bg-light pt-4 pb-4 ms-2 text-right servicescontainer'>
        {1 > 0 ?
          <div className='row'>
            {

              <div className='col-3 p-3'>
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
      <div className='container-fluid border bg-light pt-4 pb-4 text-right'>

      </div>
    </div>
  )
}

export default AppointmentPage