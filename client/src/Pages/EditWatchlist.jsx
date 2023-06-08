import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import styled from 'styled-components';

const EditForm = styled.div`
  justify-content: center;
  // display: flex;
  background-color: black;
  color: white;
  align-items: center;
  text-align: center;
  border-radius: 15px;
  padding-top: 20px;
  paddinb-bottom: 20px;
  line-height: 2;
`

const InputLabel = styled.input`
  width: 90%;
  height: 30px;
`

export default function EditWatchlist() {

    const [formData, setFormData] = useState({
        movieName: "",
        language: "",
        year:"",
    });

    const location = useLocation();
    const navigate = useNavigate();
    const id = location.pathname.split("/")[2];

    const { movieName, language, year } = formData;

    const {currentUser, logout} = useContext(AuthContext);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleBackButtonClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watchlist/movie/` + String(id), {withCredentials:true});
                setFormData(res.data);

            } catch(err) {
                console.log(err);
            }
        };
    
        fetchData();
    }, [id]);

    const submitEdit = async (e) => {
        try {
          e.preventDefault();
      
          const token = localStorage.getItem('access_token');
          await Axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/update/watchlist/` + String(id),
            { ...formData},
            {
              headers: {
                Authorization: token,
              },
            }
          );
          navigate("/watchlist");
        } catch (err) {
          console.log(err);
        }
      };
    
    if (!currentUser) {
        navigate("/");
    }

    return (
        <div>
            <h2 style={{textAlign:"center"}}>Edit Movie</h2>
            <button onClick={handleBackButtonClick}>⬅ Go back</button>

            <div style={{paddingLeft:"30%",paddingRight:"30%"}}>
                <EditForm>
                    <form onSubmit={submitEdit}>
                    <div>
                        <label >Name:</label> <br/>
                        <InputLabel
                        type="text"
                        defaultValue={movieName}
                        onChange={onChange}
                        name="movieName"
                        />
                    </div>
                    <div>
                        <label>Language:</label><br/>
                        <InputLabel
                        defaultValue={language}
                        onChange={onChange}
                        name="language"
                        />
                    </div>
                    <div>
                        <label>Year:</label><br/>
                        <InputLabel
                        defaultValue={year}
                        onChange={onChange}
                        name="year"
                        />
                    </div>
                    <button type="submit">Update Movie</button>
                </form>
                </EditForm>
            </div>
        </div>
    )
}
