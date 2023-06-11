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

const EditMovie = (props) => {
  //
  const [formData, setFormData] = useState({
    movieName: "",
    movieReview: "",
    img:"",
    rating: "",
    director:"",
    language:"",
    category: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split("/")[2];
  const [newImg, setImg] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movie/` + String(id), {withCredentials:true});
            setFormData(res.data);
            // console.log(res.data);
            // setImagePreview(URL.createObjectURL(res.data.img));
        } catch(err) {
            console.log(err);
        }
    };

    fetchData();
    // let imgURL = upload();
    // setFormData({...formData, img: newImg ? imgURL : "" });
  }, [id]);

  const { movieName, movieReview, img, rating, director,language, category } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const upload = async() => {
    try {
      const form = new FormData();
      form.append("file",newImg);
      const res = await Axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, form);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  // original
  // const submitEdit = async (e) => {
  //   try {
  //     e.preventDefault();
  //     // const imgURL = await upload();
  //     let imgURL;
  //     if (img) {
  //         imgURL = await upload();
  //         console.log(imgURL);
  //     }

  //     await Axios.put("http://localhost:2030/api/update/" + String(id), { ...formData, img: newImg ? imgURL : "" }, {withCredentials:true});
  //     navigate("/");
  //   } catch(err) {
  //     console.log(err);
  //   }
  // };

  //new
  const submitEdit = async (e) => {
    try {
      e.preventDefault();
      // const imgURL = await upload();
      let imgURL;
      if (img) {
        imgURL = await upload();
        console.log(imgURL);
      }
  
      const token = localStorage.getItem('access_token');
      await Axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/update/` + String(id),
        { ...formData, img: newImg ? imgURL : "" },
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
  

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  
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
                <label>Review:</label><br/>
                <InputLabel
                  defaultValue={movieReview}
                  onChange={onChange}
                  name="movieReview"
                />
              </div>
              <div>
                <label>Director:</label><br/>
                <InputLabel
                  defaultValue={director}
                  onChange={onChange}
                  name="director"
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
                <label >Rating:</label><br/>
                <InputLabel
                  type="number"
                  name="rating"
                  min="0"
                  max="10"
                  step="0.1"
                  defaultValue={rating}
                  onChange={onChange}
                />
              </div>
              <div>
                <label>Category:</label><br/>
                <select
                  defaultValue={category}
                  onChange={onChange}
                  name="category"
                >
                  <option value="Drama">Drama</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Horror">Horror</option>
                  <option value="BioEpic">BioEpic</option>
                </select>
              </div>
              <div>
                <label >Img:</label> <br/>
                <img
                  src={img} style={{width: "200px", borderRadius: "15px"}}
                /> <br/>
                <input type="file" onChange={(e) => {
                  setImg(e.target.files[0]);
                  setPreviewURL(URL.createObjectURL(e.target.files[0]));
              }} /> <br/>
                <label>Preview (new):</label> <br/>
                {previewURL && (
                  <img src={previewURL} alt="File preview" style={{width: "200px", borderRadius: "15px"}} />
                )} <br/>
              </div>
            <button type="submit">Update Movie</button>
          </form>
        </EditForm>
      </div>
    </div>
  );
};

export default EditMovie;
