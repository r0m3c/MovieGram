import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components"
import Axios from "axios";
import { AuthContext } from '../context/authContext';
import TempLogo from '../assets/temp_logo.jpeg'


const AuthForm = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    flex-direction: column;

    h1 {
        font-size: 20px;
        color: black;
        // margin-bottom: 20px;
    }

    button {
        cursor: pointer;
    }

    p {
        color: black;
    }
`;

const LogoImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100vh;

  img {
    max-width: 30%;
    height: auto;
  }
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

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const StyledSpan = styled.span`
  font-size: 14px;
  color: #999999;
  margin-top: 10px;
  display: block;
`;

const FileInputContainer = styled.div`
  margin-bottom: 10px;
`;

const FileInputLabel = styled.label`
  font-weight: bold;
`;

const FileInput = styled.input`
  margin-top: 5px;
`;

const PreviewImage = styled.img`
  width: 200px;
  margin-top: 10px;
`;

const Register = () => {

  const [inputs, setInputs] = useState({
    username:"",
    email:"",
    password:"",
    img:"",
    bio:"",
  }); 

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const [newImg, setImg] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  // handle username,email,password inputs
  const handleChange = (e) => {
    // set multiple inputs at the same time
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const upload = async() => {
    try {
      const formData = new FormData();
      formData.append("file",newImg);
      // const res = await Axios.post("http://localhost:2030/api/upload", formData);
      const res = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const imgURL = await upload();
      
      // await Axios.post("http://localhost:2030/api/register", { ...inputs, img: newImg ? imgURL : "" });
      await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, { ...inputs, img: newImg ? imgURL : "" });
      navigate("/login");
    } catch(err) {
        setErr(err.response.data);
    }
  }

  return (
    <div >
      <AuthForm >

        <Link to="/">
          <LogoImgContainer >
              <img src={TempLogo} alt="Project Logo"/>          
          </LogoImgContainer>
        </Link>

        <h1 style={{fontSize:"30px"}}>Register</h1>
        <StyledInput required type="text" placeholder='Username...' name='username' onChange={handleChange}/>
        <StyledInput required type="email" placeholder='Email...' name='email' onChange={handleChange}/>
        <StyledInput required type="password" placeholder='Password...' name='password' onChange={handleChange} />
        <StyledInput required type="text" placeholder='Bio...' name='bio' onChange={handleChange}/>

        <FileInputContainer>
          <FileInputLabel >Img:</FileInputLabel>
          <br/>
          <FileInput type="file" onChange={(e) => {
            setImg(e.target.files[0]);
            setPreviewURL(URL.createObjectURL(e.target.files[0]));
        }} /> <br/>
          <FileInputLabel>Preview (new):</FileInputLabel>
          {previewURL && (
            <PreviewImage src={previewURL} alt="File preview" style={{width: "200px"}} />
          )} <br/>
        </FileInputContainer>
        <StyledButton onClick={handleSumbit}>Register</StyledButton>
        {err && <p>{err}</p>}
        <StyledSpan>Do you have an account? <Link to="/login">Login Here</Link> </StyledSpan>
      </AuthForm>
    </div>
  )
}

export default Register
