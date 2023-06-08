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

export default function EditComment() {

    const [formData, setFormData] = useState({
        description: "",
        img: "",
    });

    const location = useLocation();
    const navigate = useNavigate();
    const id = location.pathname.split("/")[2];
    const [newImg, setImg] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    const {description,img} = formData;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comment/get/` + String(id), {withCredentials:true});
                setFormData(res.data);
                console.log(res.data);
            } catch(err) {
                console.log(err);
            }
        };
    
        fetchData();
    }, [id]);

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
    //     try {
    //       e.preventDefault();
    //       const imgURL = await upload();
    //     // let imgURL;
    //     // if (img) {
    //     //     imgURL = await upload();
    //     //     console.log(imgURL);
    //     // }
    
    //       await Axios.put("http://localhost:2030/api/comment/update/" + String(id), { ...formData, img: newImg ? imgURL : "" }, {withCredentials:true});
    //       navigate("/");
    //     } catch(err) {
    //       console.log(err);
    //     }
    // };

    // new
    const submitEdit = async (e) => {
        try {
          e.preventDefault();
          const imgURL = await upload();
          const token = localStorage.getItem('access_token');
          await Axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/comment/update/` + String(id),
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
            <h2 style={{textAlign:"center"}}>Edit Comment</h2>
            <button onClick={handleBackButtonClick}>⬅ Go back</button>

            <div style={{paddingLeft:"30%",paddingRight:"30%"}}>
                <EditForm>
                    <form onSubmit={submitEdit}>
                        <div>
                            <label >comment:</label>
                            <InputLabel
                                type="text"
                                defaultValue={description}
                                onChange={onChange}
                                name="description"
                            />
                        </div>
                    
                        <div>
                            <label >Img:</label> <br/>
                            <img
                                src={"../uploads/" + String(img)} style={{width: "200px", borderRadius:"15px"}}
                            /> <br/>
                            <input type="file" onChange={(e) => {
                                setImg(e.target.files[0]);
                                setPreviewURL(URL.createObjectURL(e.target.files[0]));
                            }} /> <br/>
                            <label>Preview (new):</label> <br/>
                            {previewURL && (
                                <img src={previewURL} alt="File preview" style={{width: "200px", borderRadius:"15px"}} />
                            )} <br/>
                        </div>

                        <button type="submit">Update Comment</button>
                    </form>
                </EditForm>
            </div>
        </div>
    )
}
