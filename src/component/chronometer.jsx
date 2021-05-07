import React, { useEffect} from 'react'
import '../App.css'


const Chronometer = ({onOff, time, setTime}) => {
         
    useEffect(() => {
        let interval
        
        if(onOff==='on'){
             interval=  setInterval(() => {
                setTime(time=>time+1)
            }, 1000);
        }
     
        return () => {
            clearInterval(interval)
        }
    }, [onOff])

    



    return (
        <div className='chronometer'>
            <p>h:{Math.floor(time/3600)}  m:{Math.floor((time/60)%60)}  s:{time%60} </p>   
        </div>
    )
}

export default Chronometer
