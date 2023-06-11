import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/authContext';
import styled from 'styled-components';
import { faEdit, faTrash, faFilm, faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MovieContainer = styled.div`
    padding-left: 20%;
    padding-right: 20%;
    background-color: black;
    color: white;
    padding-top: 3%;
    padding-bottom: 3%;
    // display: flex;
    border-radius: 15px;
`

const UserContainer = styled.div`
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
`

const MovieUserImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
    float: left;
    // margin: 0 auto;
    
`

const MovieForm = styled.div`
  position: relative;
  display: flex;
  background-color: black;
  color: white;
  align-items: center;
  text-align: center;
  border-radius: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
  // justify-content: center;
  line-height: 2;
`;

const InputLabel = styled.input`
  width: 90%;
  height: 30px;
  padding-left: 30px; 
  background-color: transparent; /* Set the input background to transparent */
  border: none; 
  color: white; 
  ::placeholder {
    color: white;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  color: white; 
`;

const MovieUserName = styled.p`
    text-align: center;
    float:left;
`

const ImageContainer = styled.div`
    text-align: center;
    width: 100%;
`

const UserIMG = styled.img`
    // width: 75%;
    width: 50%;
    height: 70px;
    border-radius: 10px;
`

const EditDeleteButton = styled.button`
    width: 50px;
    color: black;
    background-color: white;
    // border: none;
    // background: none;
    font-size: 12px;
`

const DeletePopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  text-align: center;
`

const TableContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Table = styled.table`
  width: 90%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: center;
  padding: 10px;
  background-color: #333;
  color: white;
`;

const TableCell = styled.td`
  text-align: center;
  padding: 10px;
  border: 1px solid #ccc;
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: gray;
  padding: 20px;
  border-radius: 50%;
  box-shadow: 0 6px 30px rgba(0, 0.8, 0, 0.9);
`;

export default function Lists() {

  const [movies, setMovies] = useState([]);
  // const [filteredMovies, setFilteredMovies] = useState([]);
  // const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);

  const {currentUser} = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/lists/` + String(currentUser.id), {
          params: {
            search: searchQuery,
          },
        });
        setMovies(res.data);
        // setFilteredMovies(res.data);
      } catch(err) {
        console.log(err);
      }
    };
    fetchData();
  }, [currentUser.id, searchQuery]);

  // const handleTabClick = (category) => {
  //   setActiveTab(category);

  //   if (category === "all") {
  //     setFilteredMovies(movies);
  //   } else {
  //     const filtered = movies.filter((movie) => movie.category === category);
  //     setFilteredMovies(filtered);
  //   }
  // };

  const handleDelete = async (movieId) => {
    try {
        const token = localStorage.getItem('access_token');
        await Axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/delete/`+String(movieId), {
          headers: {
            Authorization: token,
          }
        });

        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
      
        setShowDeleteConfirmation(null);
        
    } catch(err) {
        console.log(err);
    }
  }

  const handleWatchlistMovieDeletePopup = (movieId) => {
    // Show the delete confirmation popup
    setShowDeleteConfirmation(movieId);
  };

  const handleEdit = (e) => {
    navigate("/edit_movie/" + String(e), {withCredentials:true});
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDownloadClickExcel = async () => {
    try {
      const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movie-dataa/` + String(currentUser.id), { responseType: 'blob' });
  
      // Create a blob URL for the Excel file
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  
      // Create a temporary link element to download the file
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'MovieGram_Watched.xlsx');
      document.body.appendChild(link);
  
      // Click the link to download the file and remove the link element
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  }

  if (!currentUser) {
    navigate("/")
  }

  return (
    <div>

      <h2 style={{textAlign:"center"}}>Watched</h2>

      <ButtonContainer>
        <FontAwesomeIcon onClick={() => navigate("/movie")} icon={faFilm} style={{ color: 'white',fontSize:"80px" }} />
      </ButtonContainer>

      <MovieForm>
        <SearchIcon>
          <FontAwesomeIcon icon={faSearch} />
        </SearchIcon>
        <InputLabel
          type="text"
          placeholder="Search by Movie Name, Director, Category, or Language"
          value={searchQuery}
          onChange={handleSearch}
        />
      </MovieForm>

      <br/>

      {movies.length > 0 
      ?

      <>

<div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:".4%", paddingBottom: ".6%"}}>
        <h3 style={{textAlign:"center"}}>Download Your Movies List (By highest ratings)</h3>
        {/* <button onClick={handleDownloadClickExcel}>Download Movie (excel)</button> */}
        <FontAwesomeIcon onClick={handleDownloadClickExcel} icon={faDownload} style={{ color: 'white',fontSize:"30px" }} />
      </div>

      <br/>

      <TableContainer>
          <Table>
            <thead>
              <tr>
                  <TableHeader>#</TableHeader>
                  <TableHeader>Img</TableHeader>
                  <TableHeader>Movie</TableHeader>
                  <TableHeader>Review</TableHeader>
                  <TableHeader>Rating</TableHeader>
                  <TableHeader>Director</TableHeader>
                  <TableHeader>Language</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Edit/delete</TableHeader>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie,index) => (
                <tr key={movie.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>
                    <ImageContainer>
                      {movie.img && <UserIMG src={movie.img} />}
                    </ImageContainer>
                  </TableCell>
                  <TableCell>{movie.movieName}</TableCell>
                  <TableCell>{movie.movieReview}</TableCell>
                  <TableCell>{movie.rating}</TableCell>
                  <TableCell>{movie.director}</TableCell>
                  <TableCell>{movie.language}</TableCell>
                  <TableCell>{formatDate(movie.date)}</TableCell>
                  <TableCell>{movie.category}</TableCell>
                  <TableCell>

                    {currentUser ? currentUser.id === movie.uid && (
                        <div >
                            {/* <EditDeleteButton onClick={() => handleEdit(movie.id)}>Edit</EditDeleteButton>
                            <EditDeleteButton onClick={() => handleDelete(movie.id)}>Delete</EditDeleteButton> */}
                            <FontAwesomeIcon onClick={() => handleEdit(movie.id)} icon={faEdit} style={{ color: 'gray' }} /> &nbsp;
                            <FontAwesomeIcon onClick={() => handleWatchlistMovieDeletePopup(movie.id)} icon={faTrash} style={{ color: 'red' }} />
                        </div>
                    ) : ""}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {showDeleteConfirmation && (
          <div>
            <div style={{position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: "9999",}} />
            <DeletePopup >
              <p>Are you sure you want to delete this movie?</p>
              <button onClick={() => handleDelete(showDeleteConfirmation)}>Yes</button>
              <button onClick={() => setShowDeleteConfirmation(null)}>No</button>
            </DeletePopup>
          </div>
        )}
      
      </>
    
      :

      <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
        <h2 style={{textAlign:"center"}}>Add a movie you Watched</h2>
      </div>
      
      }

      
      
    </div>
  )
}
