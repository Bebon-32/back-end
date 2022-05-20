import React, { useRef, useState } from 'react'
import style from "./MyTicket.module.css";
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServerError from './../UI/ServerError';


const imgUrl =' http://localhost:5000/';

export default function SpecificTicket(props) {
  const [allowReply, setAllowReply] = useState(false);
  const [errorServer, setErrorServer] = useState(false);
  const { ticketData } = props;
  const navigate = useNavigate();
  // const [errorApiResponce , setErrorApiResponce] = useState([]);


  const { _id, description, title, priorty, status, department, attachment, solve, audioRecord,
    reply } = ticketData;
    console.log(audioRecord);
  const replyRef = useRef();
  const feedbackRef = useRef();

  
  

  const sendResponce = async (e) => {
    e.preventDefault();
    const userReply = replyRef.current.value;
    const {data} = await axios.patch(`http://localhost:5000/replyTicket/${_id}`, {  reply : userReply}).catch(err=>
    {
      setErrorServer(true);
      console.log(err)
    }
    )
    console.log(data)
    // if(result.value.reply != ''){
    // setErrorServer(false);
    // navigate('/HomeUser');
    // }else{
    // setErrorServer(true);
    // }
    // setErrorServer(false);
  }

  const allowdToReply = (e)=>{
     if(status === 'In-progress'){
      setAllowReply(false);
     } if (status === 'User-Reply' && solve){
       setAllowReply(true);
     }
  }
  
  useEffect(()=>{
    allowdToReply();
  },[])
  return (
    <div
      className="position-sticky"
    >
      <div
        className="container d-flex flex-column align-items-center"
      >
        <p className="h2 py-4" style={{letterSpacing : '8px'  ,fontWeight: 'bold', fontSize: '50px' }}
        > Ticket Information </p>
        <table className="table table-light table-hover">
          <tbody>

            <tr>
              <th className={style["specific-row"]} scope="row">
                id
              </th>
              <td>{_id}</td>
            </tr>
            <tr>
              <th className={style["specific-row"]} scope="row">
                Title
              </th>
              <td>{title}</td>
            </tr>
            <tr>
              <th className={style["specific-row"]} scope="row">
                Department
              </th>
              <td>{department}</td>
            </tr>
            <tr>
              <th className={style["specific-row"]} scope="row">
                Priority
              </th>
              <td>{priorty}</td>
            </tr>
            <tr>
              <th className={style["specific-row"]} scope="row">
                Status
              </th>
              <td>{status}</td>
            </tr>
            <tr>
              <th className={style["specific-row"]} scope="row">
                Description
              </th>
              <td className={style['tdbreak']} style={{ textAlign: 'justify' }}>
                {description}
              </td>
            </tr>
            {
              audioRecord ? (
                <tr>
                  <th className={style["specific-row"]} scope="row">
                    Audio Description
                  </th>
                  <td>
                    <AudioPlayer
                      autoPlay={false}
                      loop={false}
                      src={audioRecord}
                    // other props here
                    />
                  </td>
                </tr>

              ) : ( 
       <></>
             )
            }
            <tr>
              <th className={style["specific-row"]} scope="row">
                attacchment files
              </th>
              <td>
                {
                  attachment.map(e => {
                    return (
                      <>
                        <img className='w-25' src={imgUrl + e.filePath} alt="" />
                      </>
                    )
                  })
                }
              </td>
            </tr>
            {
              solve && (
                <tr>
                  <th className={style["specific-row"]} scope="row">
                    Agent responce
                  </th>
                  <td>
                    {solve}
                  </td>
                </tr>
              )
            }
            {
              reply && (
                <tr>
                  <th className={style["specific-row"]} scope="row">
                    My responce
                  </th>
                  <td>
                    {reply}
                  </td>
                </tr>
              )
            }


          </tbody>
        </table>
        {allowReply ?
          (<div className="my-2 w-100">
            <form action="">
              <label htmlFor="responce" className="form-label">Write your Responce</label>
              <textarea className="form-control" id="responce" rows="3" ref={replyRef}></textarea>
              <button className="btn btn-dark my-3" onClick={sendResponce}>Send</button>
            </form>
          </div>) : (
            <p style={{ fontSize: '24px', color: 'red' }}>You aren't allowed to reply to the ticket yet</p>)}
          {
            errorServer?    (
              <ServerError/>
            )  : (
            ''
            )
          }
      </div>
    </div>
  )
}
