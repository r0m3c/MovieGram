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

export default function Feedback() {
    const navigate = useNavigate();
    
    const [description, setDescription] = useState();
    const [type,setType] = useState();
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;


    const handleBackButtonClick = () => {
        navigate(-1);
    };

    // original
    // const submitFeedback = async (e) => {
    //     e.preventDefault();
    
    //     try {
    //       await Axios.post("http://localhost:2030/api/feedback", {
    //         description: description,
    //         type: type,
    //         date: formattedDate,
    //       }, {withCredentials:true});
    //       navigate("/");
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }

    // new
    const submitFeedback = async (e) => {
        e.preventDefault();
      
        try {
          const token = localStorage.getItem('access_token');
          await Axios.post(
            "http://localhost:2030/api/feedback",
            {
              description: description,
              type: type,
              date: formattedDate,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          navigate("/");
        } catch (err) {
          console.log(err);
        }
      };
      

    return (
        <div>
            <h2 style={{textAlign:"center"}}>Website Feedback</h2>
            <button onClick={handleBackButtonClick}>⬅ Go back</button>
        
            <div style={{paddingLeft:"30%",paddingRight:"30%"}}>
                <MovieForm>
                    <p>Please be detailed in your feedback</p>
                    <form>
                        <select
                        name="type"
                        onChange={(e) => setType(e.target.value)}
                        required
                        >
                            <option value="Feature">Feature</option>
                            <option value="Bug">Bug</option>
                            <option value="Design">Design</option>
                            <option value="Performance">Performance</option>
                        </select> <br/>
                        <InputLabel placeholder='More details on feedback...'
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        /> <br/>
                        <button onClick={submitFeedback}>Submit</button>
                    </form>
                </MovieForm>
            </div>
        </div>
    )
}
