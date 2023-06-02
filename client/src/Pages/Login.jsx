import React, { useContext, useState } from 'react'
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

const Login = () => {

  const [inputs, setInputs] = useState({
    username:"",
    email:"",
  }); 

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const {login} = useContext(AuthContext);

  // handle username,email,password inputs
  const handleChange = (e) => {
    // set multiple inputs at the same time
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
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

        <h1 style={{fontSize:"30px"}}>Login</h1>
        <StyledInput required type="text" placeholder='Username...' name='username' onChange={handleChange}/>
        <StyledInput required type="password" placeholder='Password...' name='password' onChange={handleChange} />
        <br/>
        <StyledButton onClick={handleSumbit}>Login</StyledButton>
        {err && <p>{err}</p>}
        <StyledSpan>Do you not have an account? <Link to="/register">Register Here</Link> </StyledSpan>
      </AuthForm>
    </div>
  )
}

export default Login
