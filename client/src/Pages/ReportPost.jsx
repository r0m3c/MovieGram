import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MovieForm = styled.div`
  justify-content: center;
  // display: flex;
  background-color: black;
  color: white;
  align-items: center;
  text-align: center;
  border-radius: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
  line-height: 2;
`

const InputLabel = styled.input`
  width: 90%;
  height: 30px;
`

export default function ReportPost() {

    const navigate = useNavigate();
    const location = useLocation();
    const id = location.pathname.split("/")[3];

    const [description,setDescription] = useState();
    const [type,setType] = useState();

    const handleBackButtonClick = () => {
        navigate(-1);
    };
    // console.log(id);
    // original
    // const submitReport = async (e) => {
    //     e.preventDefault();
    
    //     try {
    //       await Axios.post("http://localhost:2030/api/report/post/" + String(id), {
    //         description: description,
    //         type: type,
    //       }, {withCredentials:true});
    //       navigate("/");
    //     } catch(err) {
    //         console.log(err);
    //     }
    
    //   }

    // new
    const submitReport = async (e) => {
      e.preventDefault();
    
      try {
        const token = localStorage.getItem('access_token');
        await Axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/report/post/` + String(id), {
          description: description,
          type: type,
        }, {
          headers: {
            Authorization: token
          }
        });
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
    

    return (
        <div>

            <h2 style={{textAlign:"center"}}>Report Post</h2>
            <button onClick={handleBackButtonClick}>⬅ Go back</button>

            <div style={{paddingLeft:"30%",paddingRight:"30%"}}>
                <MovieForm>
                    <p>Please be detailed in your report</p>
                    <form>
                        <select
                        name="type"
                        onChange={(e) => setType(e.target.value)}
                        required
                        >
                            <option value="Harassment">Harassment</option>
                            <option value="Violation">Violation</option>
                            <option value="Spam">Spam</option>
                            <option value="Image">Innapropriate Image</option>
                        </select> <br/>
                        <InputLabel placeholder='More details on report...'
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        /> <br/>
                        <button onClick={submitReport}>Submit</button>
                    </form>
                </MovieForm>
            </div>
        </div>
    )
}
