import React,{useState,useRef,useEffect} from 'react'
import Chronometer from './chronometer'

import '../App.css'

const Table = () => {

    const [table, setTable]= useState([])
    const [size,setSize] = useState(10)
    const [qty_mines, setQty_mines]= useState(10)
    const [count, setCount] = useState(0)
    const [chronometer ,setChronometer]= useState('off')
    const [result, setResult]=useState('')
    const [time,setTime]=useState(0)
  
    useEffect(() => handle_create_table(),[])   

    const input = useRef()
    let array= []
    

    const handle_change_size = (e)=>{
       setSize(e.target.value)
       let t= parseInt(e.target.value)
       setQty_mines(t*t/2)
    }
    
    const handle_change_qty_mines = (e)=>{
        setQty_mines(parseInt(e.target.value))
    }

         
    const table_click =(e)=>{
        e.preventDefault() 
        
        if(count<qty_mines && count !==-1){
            if(chronometer==='off')setChronometer('on')
            
            array=[...table]
            array.map((i,indexV)=>i.map((itemV,indexH)=>{
            
                if(itemV.id===parseInt(e.target.id)){
                    if(e.type==='contextmenu'){
                        if(itemV.look=== 'flag'){
                            itemV.look='covered' 
                            itemV.open=false 
                            if(itemV.contents==='M')setCount(count-1)
                        } else if(itemV.look==='covered'){
                            itemV.look='flag'
                            itemV.open=true
                            if(itemV.contents==='M')setCount(count+1)
                        }    
                    }

                    if(e.type=== 'click'&& itemV.open===false){
                        if(itemV.contents==='M'){
                            setCount(-1)
                            explosion(indexV,indexH)
                            setChronometer(false)
                           
                        } else {
                            itemV.open= true
                            itemV.look= 'open'
                            itemV.contentsVisible=itemV.contents
                            open_around(indexV,indexH)
                        }
                    }
                }
            }))

            setCount((count)=>{
                if(qty_mines===count){
                    winner()
                    setChronometer('off')  
                }
                return count
            })
            setTable(array)
        }
    }  
       

  
    const explosion=(p1,p2)=>{
        array=[...table]
        setResult('TE EXPLOTASTE')
        array.map((v,pV)=>v.map((h,pH)=>{
            if(array[pV][pH].contents==='M'&&  array[pV][pH].look==='covered') array[pV][pH].look='mines'       
        }))
        array[p1][p2].look='explosion'
        setTable(array)
    }

    const winner=()=>{
        setResult( 'GANASTE')
    }
 
    const open_around=(p1,p2)=>{
        array= [...table]
       
        for(let v=-1;v<=1;v++){
            for(let h = -1;h<=1; h++){
                try{
                    if(array[p1][p2].contents===''){
                        if(array[p1+v][p2+h].open===false && array[p1+v][p2+h].contents!=='M'){
                            array[p1+v][p2+h].open=true
                            array[p1+v][p2+h].contentsVisible= array[p1+v][p2+h].contents
                            array[p1+v][p2+h].look='open'
                            if(array[p1+v][p2+h].contents=== ''){
                                open_around(p1+v,p2+h)
                            } 
                        }
                    } 
                }catch(error){}
            }
        } 
        setTable(array)
    }
                
    const mines =()=>{        
        let v= '', h= ''
        for(let i = 0; i<qty_mines; i++){
            do{
               v= Math.floor(Math.random()*size)
               h= Math.floor(Math.random()*size)
            }while(array[v][h].contents)
            array[v][h].contents='M'
        }
        count_mines()
    }
    
    const handle_create_table = ()=>{
        let id =0
        for(let i = 0; i<size; i++){
            array.push([])
            for(let o = 0; o<size; o++){
                array[i].push({
                    id, 
                    contents:'',
                    open:false, 
                    look:'covered',
                    contentsVisible:''
                })

                id++
            }  
        }
        mines()
    }

    

    const edit = table.map((i,index)=>{
        return(
            <div key={index} className='table' >
                {table[index].map((item)=>
                <div 
                    key ={item.id} 
                    id={item.id} 
                    className={item.look} 
                    onClick={table_click}
                    onContextMenu={table_click}
                    >
                    {item.contentsVisible}
                </div>)}
            </div>      
        )
    })
       
    
    const count_mines =()=>{
        for (let i= 0; i<size; i++){
            for (let item= 0; item<size; item++){
                let enumerate=0
                if(array[i][item].contents===''){
                    for(let v=-1;v<=1;v++){
                        for(let h = -1;h<=1; h++){
                            try{
                                if(array[i+v][item+h].contents === 'M')enumerate++   
                            } catch(error){}
                        }
                    } 
                    enumerate === 0?array[i][item].contents='':array[i][item].contents = enumerate
                } 

                starting(array)
            }          
        }      
    } 

    const starting=(array)=>{
        setTable(array)
        setCount(0)
        setTime(0)
        setChronometer('off')
        setResult('')    
    }
                   
    return (
        <div>
            <Chronometer onOff={chronometer} time={time} setTime={setTime}/>
            <h1> {result}</h1>
            <div> {edit} </div>
            <input 
                type='range' 
                ref= {input} 
                defaultValue={size} 
                min='4'
                max='20' 
                step='2' 
                onChange={handle_change_size}
                >
            </input>
            <label>size:{size*size}</label>
            
            <input 
                type='range'  
                defaultValue={qty_mines} 
                min='4' 
                max={parseInt(size*size/1.3)} 
                step='4' onChange={handle_change_qty_mines}
            >
            </input>
            <label>Minas:{qty_mines} </label>
            <button onClick={handle_create_table}>Crear tablero</button>
        
        </div>
    )
}
export default Table
   

