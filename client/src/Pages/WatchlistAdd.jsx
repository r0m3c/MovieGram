import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/authContext';
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

const StyledInput = styled.input`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #f2f2f2;
  font-size: 16px;
  margin-bottom: 10px;
  width: 300px;
`;

export default function WatchlistAdd() {

    const [movieName, setMovieName] = useState();
    let [language, setLanguage] = useState();
    const [year, setYear] = useState();
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const {currentUser, logout} = useContext(AuthContext);

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate(-1);
    }

    // const submitWatchlist = async (e) => {
    //     e.preventDefault();
    
    //     try {
    //       language = language.charAt(0).toUpperCase() + language.slice(1);
    //     //   const token = localStorage.getItem('access_token'); // added
    //       await Axios.post("http://localhost:2030/api/watchlist/add", {
    //         movieName: movieName,
    //         year:year,
    //         language:language,
    //         date: formattedDate,
    //       }, {withCredentials:true});
    //         navigate("/watchlist");
    //     } catch(err) {
    //         console.log(err);
    //     }

    // } 
    const submitWatchlist = async (e) => {
      e.preventDefault();
    
      try {
        language = language.charAt(0).toUpperCase() + language.slice(1);
        console.log(language);
        const token = localStorage.getItem('access_token');
    
        await Axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/watchlist/add`, {
          movieName: movieName,
          year: year,
          language: language,
          date: formattedDate,
        }, {
          headers: {
            Authorization: token
          }
        });
    
        navigate("/watchlist");
      } catch (err) {
        console.log(err);
      }
    }
    

    if (!currentUser) {
        navigate("/");
    }

    return (
        <div>
            <h2 style={{textAlign:"center"}}>Add a New Movie to Your Watchlist</h2>
            <button onClick={handleBackButtonClick}>⬅ Go back</button>

            <div style={{paddingLeft:"30%",paddingRight:"30%"}}>
                <MovieForm>
                <form >
                    <StyledInput placeholder='Movie Name...'
                    type="text"
                    onChange={(e) => setMovieName(e.target.value)}
                    /> <br/>
                    <StyledInput
                    type="text" placeholder='Year movie came out...'
                    onChange={(e) => setYear(e.target.value)}
                    /> <br/>
                    <StyledInput
                    type="text" placeholder='Movie Language...'
                    onChange={(e) => setLanguage(e.target.value)}
                    /> <br/>
                    
                    <button onClick={submitWatchlist} type="submit">Submit</button>
                </form>
                </MovieForm>
            </div>

            <br/> <br/> <br/> <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    )
}
