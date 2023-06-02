import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../context/authContext';
import TempLogo from '../assets/temp_logo.jpeg'
import UserImg from '../assets/user_image.png'
import { Link, useNavigate } from 'react-router-dom';


const LogoImg = styled.img`
    border-radius: 50%;
    width: 50px;
    border: 2px solid gray; 
`

const Container = styled.div`
    display: flex;
    justify-content: space-between;
`

const Logo = styled.img`
    width: 50px;
`

const Links = styled.div`
    display: flex;
    gap: 10px;

    .link {
        text-decoration: none;
        color: inherit;
    }
`

const Dropdown = styled.div`
    position: relative;
    display: inline-block;
`

const DropdownInside = styled.div`
    position: absolute;
    top: 40px; 
    left: -20px;
    background-color: black;
    color: white;
    padding: 10px;
    border-radius: 10px;
    text-align: center;
    border-color: gray;
    border: 3px solid gray; 
    z-index: 10;
`

// export default function Navbar() {

//     const {currentUser, logout} = useContext(AuthContext);

//     const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage the dropdown visibility

//     const handleUserImgClick = () => {
//         setIsDropdownOpen(!isDropdownOpen); // Toggle the dropdown visibility
//     };

//     return (
//         <div>
//             {/* <NavBar> */}
//                 <Container >
//                     <div >
//                         <Link to="/">
//                             <Logo src={TempLogo} alt="" />
//                         </Link>
//                     </div>

//                     <Links >
//                         <Link to="/movies" className="link">Movies</Link>

//                         {currentUser ? <Link to="/lists" className="link">Watched</Link> : ""}
//                         {currentUser ? <Link to="/watchlist" className="link">Watchlist</Link> : ""}

//                         <Link to="/movie/news" className="link">News</Link>

//                         <Dropdown>
//                             {currentUser && currentUser.img ? <LogoImg className='logoImg' src={"./uploads/" + String(currentUser.img)} onClick={handleUserImgClick}/>: <LogoImg className='logoImg' onClick={handleUserImgClick} src={UserImg} />} <br/>

//                             {isDropdownOpen && (
                                
//                                 <DropdownInside >
//                                     {currentUser ? <Link to={"/profile/" + String(currentUser.id)} className="link">{currentUser.username}</Link> : ""}
//                                     {currentUser ? <button><Link to="/movie">Add Movie</Link></button> : ""}
//                                     {currentUser ? <button><Link to="/watchlist/add">Add Watchlist</Link></button> : ""}

//                                     {currentUser ? <Link onClick={logout} className="link">Logout</Link> : <Link className="link" to="/login">Login</Link>}
//                                 </DropdownInside>
//                             )}
//                         </Dropdown>
//                     </Links>
//                 </Container>
//             {/* </NavBar> */}
//         </div>
//     )
// }

export default function Navbar() {
    const { currentUser, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage the dropdown visibility
  
    const handleUserImgClick = () => {
      setIsDropdownOpen(!isDropdownOpen); // Toggle the dropdown visibility
    };

    const handleOptionClick = () => {
      setIsDropdownOpen(false); // Close the dropdown
    };

    const handleLogout = () => {
      setIsDropdownOpen(false); // Close the dropdown
      // navigate("/login");
      logout(); 
      navigate("/login");
    };
  
    return (
      <div>
        <Container>
          <div>
            <Link to="/">
              <Logo src={TempLogo} alt="" />
            </Link>
          </div>
  
          <LinksContainer>
            <Links>
              <Link to="/movies" className="link">Movies</Link>
              {currentUser ? <Link to="/lists" className="link">Watched</Link> : ""}
              {currentUser ? <Link to="/watchlist" className="link">Watchlist</Link> : ""}
              <Link to="/movie/news" className="link">News</Link>
            </Links>
            &nbsp;&nbsp;
            <Dropdown>
              {currentUser && currentUser.img ? (
                <LogoImg
                  className="logoImg"
                  src={"./uploads/" + String(currentUser.img)}
                  onClick={handleUserImgClick}
                />
              ) : (
                <LogoImg
                  className="logoImg"
                  onClick={handleUserImgClick}
                  src={UserImg}
                />
              )}
              <br />
  
              {isDropdownOpen && (
                <DropdownInside>
                  {currentUser ? (
                    <>
                      <Link onClick={handleOptionClick} style={{color:"white"}} to={"/profile/" + String(currentUser.id)} className="link">{currentUser.username}&nbsp;&nbsp;➡</Link>
                      <br/>
                      <br/>
                    </>
                    
                  ) : (
                    ""
                  )}
                  
                  {currentUser ? (
                    <button onClick={handleOptionClick} style={{borderRadius:"5px"}}><Link style={{color:"black"}} to="/movie">Add Watched</Link></button>
                  ) : (
                    ""
                  )}
                  {currentUser ? (
                    <>
                      <button onClick={handleOptionClick} style={{borderRadius:"5px"}}><Link style={{color:"black"}} to="/watchlist/add">Add Watchlist</Link></button>
                      <br/>
                      <br/>
                    </>
                  ) : (
                    ""
                  )}
                  {currentUser ? (
                    <Link style={{color:"white"}} onClick={handleLogout} className="link">Logout ⛔️</Link>
                  ) : (
                    // <Link className="link" to="/login">Login</Link>
                    <button onClick={handleOptionClick}><Link to="/login">Login</Link></button>
                  )}
                </DropdownInside>
              )}
            </Dropdown>
          </LinksContainer>
        </Container>
      </div>
    );
  }
  
  const LinksContainer = styled.div`
    display: flex;
    align-items: center;
  `;
  
  // Rest of the code remains the same
  