import React, { useState } from 'react'
import axiosInstance from '../../axiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const accessToken = localStorage.getItem('accessToken')
    const [ticker, setTicker] = useState('')
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [plot, setPlot] = useState()
    const [ma100, setMA100] = useState()
    const [predictPlot, setPredictPlot] = useState()
    const [mse, setMse] = useState()
    const [rmse, setRmse] = useState()
    const [r2, setR2] = useState()

    const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      try {
        const response = await axiosInstance.post('/predict/', {
          ticker: ticker
        });
        console.log(response.data);
        if(response.data.error){
          setError(response.data.error)
        }else{
          setError('')
          // Set plot
          const backendRoot = import.meta.env.VITE_BACKEND_ROOT
          const plotUrl = `${backendRoot}${response.data.plot_img}`
          const ma100Url = `${backendRoot}${response.data.plot_100_dma}`
          const predictUrl = `${backendRoot}${response.data.plot_prediction}`
          setPlot(plotUrl)
          setMA100(ma100Url)
          setPredictPlot(predictUrl)
          setMse(response.data.mse)
          setRmse(response.data.rmse)
          setR2(response.data.r2)
        }
      } catch (error) {
        console.error(error)
      }finally{
        setLoading(false)
      }
    }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 mx-auto'>
          <form onSubmit={handleSubmit}>
            <input type='text' className='form-control' placeholder='Enter stock Ticker'
            onChange={(e) => setTicker(e.target.value)} required
            ></input>
            <small>{error && <div className='text-danger'>{error}</div>}</small>
            <button type='submit' className='btn btn-info mt-3'>
              {loading ? <span><FontAwesomeIcon icon={faSpinner} spin />Please wait...</span>:'See Prediction'}</button>
          </form>
        </div>

        {/* Print prediction plots */}
        {predictPlot && (
                <div className="prediction mt-5">
                    <div className="p-3">
                      {plot && (
                        <img src={plot} style={{ maxWidth: '100%' }}/>
                      )}
                    </div>
                    <div className="p-3">
                      {ma100 && (
                        <img src={ma100} style={{ maxWidth: '100%' }}/>
                      )}
                    </div>
                    <div className="p-3">
                      {predictPlot && (
                        <img src={predictPlot} style={{ maxWidth: '100%' }}/>
                      )}
                    </div>
        
                    <div className="text-light p-3">
                      <h4>Model Evalution</h4>
                      <p>Mean Squared Error (MSE): {mse}</p>
                      <p>Root Mean Squared Error (RMSE): {rmse}</p>
                      <p>R-Squared: {r2}</p>
                    </div>
                </div>
            )}
          </div>
    </div>
  )
}

export default Dashboard