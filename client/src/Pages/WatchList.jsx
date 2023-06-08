import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/authContext';
import styled from 'styled-components';
import { faEdit, faTrash, faFilm, faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const MovieForm = styled.div`
//   justify-content: center;
//   background-color: black;
//   color: white;
//   align-items: center;
//   text-align: center;
//   border-radius: 15px;
//   padding-top: 20px;
//   padding-bottom: 20px;
//   line-height: 2;
// `;

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

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: gray;
  padding: 20px;
  border-radius: 50%;
  box-shadow: 0 6px 30px rgba(0, 0.8, 0, 0.9);
`;


export default function WatchList() {
  const { currentUser } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);

  const [totalWatchlist,setTotalWatchlist] = useState(0);
  const [count_watchlist_watched,set_Count_watchlist_watched] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/your/watchlist/${currentUser.id}`, {
          params: {
            search: searchQuery,
          },
        });
        setMovies(res.data);

        const watchlistTotal = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watched/total/movies/` + String(currentUser.id));
          setTotalWatchlist(watchlistTotal.data);

        const watched_count = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watchlist/watched_count/` + String(currentUser.id));
        set_Count_watchlist_watched(watched_count.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [currentUser.id, searchQuery]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const handleWatchedChange = async (movieId) => {
    try {
      const updatedMovies = movies.map(movie => {
        if (movie.id === movieId) {
          return { ...movie, watched: !movie.watched };
        }
        return movie;
      });
      setMovies(updatedMovies);

      await Axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/watchlist/update/watched/`+String(movieId), { watched: !movies.find(movie => movie.id === movieId).watched });

      const watchlistTotal = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watched/total/movies/` + String(currentUser.id));
          setTotalWatchlist(watchlistTotal.data);

      const watched_count = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watchlist/watched_count/` + String(currentUser.id));
      set_Count_watchlist_watched(watched_count.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDownloadClickExcel = async () => {
    try {
      const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movie-watchlist-data/` + String(currentUser.id), { responseType: 'blob' });
  
      // Create a blob URL for the Excel file
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  
      // Create a temporary link element to download the file
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'MovieGram_Watchlist.xlsx');
      document.body.appendChild(link);
  
      // Click the link to download the file and remove the link element
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  }

  const handleWatchlistMovieDelete = async (movieId) => {
    try {
      const token = localStorage.getItem('access_token');
      await Axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/watchlist/delete/` + String(movieId), {
        headers: {
          Authorization: token,
        }
      });

      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));

      setShowDeleteConfirmation(null);
    } catch(err) {
      console.log(err);
    }
  };

  const handleWatchlistMovieDeletePopup = (movieId) => {
    // Show the delete confirmation popup
    setShowDeleteConfirmation(movieId);
  };

  const handleEdit = (movieId) => {
    navigate("/edit_watchlist/" + String(movieId));
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Watchlist</h2>

      <MovieForm>
        <SearchIcon>
          <FontAwesomeIcon icon={faSearch} />
        </SearchIcon>
        <InputLabel
          type="text"
          placeholder="Search by Movie Name, Year, or Language"
          value={searchQuery}
          onChange={handleSearch}
        />
      </MovieForm>

      <ButtonContainer>
        <FontAwesomeIcon onClick={() => navigate("/watchlist/add")} icon={faFilm} style={{ color: 'white',fontSize:"80px" }} />
      </ButtonContainer>

      <br/>

      {movies.length > 0 ?
      
      <div>
        <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:".4%", paddingBottom: ".6%"}}>
          <h3 style={{textAlign:"center"}}>Download Your Movies Watchlist (By date)</h3>
          {/* <button onClick={handleDownloadClickExcel}>Download Watchlist (excel)</button> */}
          <FontAwesomeIcon onClick={handleDownloadClickExcel} icon={faDownload} style={{ color: 'white',fontSize:"30px" }} />
        </div>

        <br/>

        <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:".4%", paddingBottom: ".6%"}}>
          <h4>Watched/Total Movies: {count_watchlist_watched}/{totalWatchlist}</h4>
        </div>

        <br/>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                  <TableHeader>#</TableHeader>
                  <TableHeader>Movie</TableHeader>
                  <TableHeader>Year</TableHeader>
                  <TableHeader>Language</TableHeader>
                  <TableHeader>Date Added</TableHeader>
                  <TableHeader>Watched</TableHeader>
                  <TableHeader>Edit/delete</TableHeader>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie,index) => (
                <tr key={movie.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{movie.movieName}</TableCell>
                  <TableCell>{movie.year}</TableCell>
                  <TableCell>{movie.language}</TableCell>
                  <TableCell>{formatDate(movie.date)}</TableCell>
                  <TableCell>
                    <input type="checkbox" checked={movie.watched} onChange={() => handleWatchedChange(movie.id)} />
                  </TableCell>
                  <TableCell>
                    <FontAwesomeIcon onClick={() => handleEdit(movie.id)} icon={faEdit} style={{ color: 'gray' }} /> &nbsp;
                    <FontAwesomeIcon onClick={() => handleWatchlistMovieDeletePopup(movie.id)} icon={faTrash} style={{ color: 'red' }} />
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
              <button onClick={() => handleWatchlistMovieDelete(showDeleteConfirmation)}>Yes</button>
              <button onClick={() => setShowDeleteConfirmation(null)}>No</button>
            </DeletePopup>
          </div>
        )}
      </div>
      
      :

      <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
        <h2 style={{textAlign:"center"}}>Add a movie to your watchlist</h2>
      </div>
    
      }
      
      </div>
)
}
