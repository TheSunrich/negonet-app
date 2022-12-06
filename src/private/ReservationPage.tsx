import React from 'react'

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
            <hr className='ms-2 me-2'/>
          </div>
        </div>
        {/*Citas Actuales y Por venir */}
        <div className='col-md-4 text-center'>
          <div className='bg-danger border bg-light'>
            <h5 className='mt-3'>Actuales y por Venir</h5>
            <hr className='ms-2 me-2'/>
          </div>
        </div>
        {/*Citas futuras*/}
        <div className='col-md-4 text-center'>
          <div className='bg-danger border bg-light'>
            <h5 className='mt-3'>Futuras</h5>
            <hr className='ms-2 me-2'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationPage