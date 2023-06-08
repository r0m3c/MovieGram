import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
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

export default function Movie() {

  const [movieName, setMovieName] = useState();
  const [movieReview, setMovieReview] = useState();
  const [director, setDirector] = useState();
  let [language, setLanguage] = useState();
  const [rating, setRating] = useState();
  const [category, setMovieCategory] = useState();
  const [img, setImg] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const navigate = useNavigate();
  const {currentUser, logout} = useContext(AuthContext);

    // const navigate = useNavigate();

  const upload = async() => {
    try {
      const formData = new FormData();
      formData.append("file",img);
      const res = await Axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  
  // original
  // const submitMovie = async (e) => {
  //   e.preventDefault();
  //   let imgURL;
  //   if (img) {
  //       imgURL = await upload();
  //       console.log(imgURL);
  //   }

  //   try {
  //     language = language.charAt(0).toUpperCase() + language.slice(1);
  //     await Axios.post("http://localhost:2030/api/add", {
  //       movieName: movieName,
  //       movieReview: movieReview,
  //       director:director,
  //       language:language,
  //       rating:rating,
  //       category:category,
  //       date: formattedDate,
  //       img: img ? imgURL : "",
  //     }, {withCredentials:true});
  //     navigate("/");
  //   } catch(err) {
  //       console.log(err);
  //   }
  // }
  
  // new
  const submitMovie = async (e) => {
    e.preventDefault();
    let imgURL;
    if (img) {
      imgURL = await upload();
      console.log(imgURL);
    }
  
    try {
      language = language.charAt(0).toUpperCase() + language.slice(1);
      const token = localStorage.getItem('access_token');
      await Axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/add`, {
        movieName: movieName,
        movieReview: movieReview,
        director: director,
        language: language,
        rating: rating,
        category: category,
        date: formattedDate,
        img: img ? imgURL : "",
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
  

  const handleBackButtonClick = () => {
    navigate(-1);
  }

  if (!currentUser) {
    navigate("/");
  }

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Add a New Movie</h2>
      <button onClick={handleBackButtonClick}>⬅ Go back</button>

      <div style={{paddingLeft:"30%",paddingRight:"30%"}}>
        <MovieForm>
          <form >
            <StyledInput placeholder='Movie Name...'
              type="text"
              onChange={(e) => setMovieName(e.target.value)}
            /> <br/>
            <StyledInput
              type="text" placeholder='Movie Review...'
              onChange={(e) => setMovieReview(e.target.value)}
            /> <br/>
            <StyledInput
              type="text" placeholder='Movie Director...'
              onChange={(e) => setDirector(e.target.value)}
            /> <br/>
            <StyledInput
              type="text" placeholder='Movie Language...'
              onChange={(e) => setLanguage(e.target.value)}
            /> <br/>
            <StyledInput placeholder='Movie Rating (0 - 10)...'
              type= "number" min="0" max="10" step="0.1" pattern="[0-9]+(\.[0-9]{1})?"
              onChange={(e) => setRating(e.target.value)}
            /> <br/>
            <select
              name="movieCategory"
              onChange={(e) => setMovieCategory(e.target.value)}
              required
            >
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Animation">Animation</option>
              <option value="BioEpic">BioEpic</option>
              <option value="Comedy">Comedy</option>
              <option value="Crime">Crime</option>
              <option value="Documentary">Documentary</option>
              <option value="Drama">Drama</option>
              <option value="Family">Family</option>
              <option value="Fantasy">Fantasy</option>
              <option value="History">History</option>
              <option value="Horror">Horror</option>
              <option value="Music">Music</option>
              <option value="Mystery">Mystery</option>
              <option value="Noir">Noir</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Slasher">Slasher</option>
              <option value="Sports">Sports</option>
              <option value="Thriller">Thriller</option>
              <option value="War">War</option>
              <option value="Western">Western</option>
            </select> <br/>
            <input type="file" onChange={(e) => {
                setImg(e.target.files[0]);
                setPreviewURL(URL.createObjectURL(e.target.files[0]));
            }} /> <br/>
            {previewURL && (
              <img src={previewURL} alt="File preview" style={{width: "250px", borderRadius:"15px", border: '2px solid white'}} />
            )} <br/>
            <button onClick={submitMovie} type="submit">Submit</button>
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
