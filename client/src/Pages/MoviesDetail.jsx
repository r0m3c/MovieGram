// MovieDetailsPage.js

import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const MoviesDetail = ({ match }) => {
  const [movie, setMovie] = useState(null);
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("https://api.themoviedb.org/3/movie/" + String(id), {
            params: {
                api_key: '7d0128a4c74e6616838bbcd8178bbb94', 
                append_to_response: 'credits',
            },
        });
        const movieData = response.data; 
        setMovie(movieData);
        setCast(movieData.credits.cast)
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div >
        <h1 style={{textAlign: "center"}}>{movie.title}</h1>
        <div style={{display:"flex", justifyContent:"center"}}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{ width: '20%', justifyContent:"center", borderRadius:"20px" }} />
        </div>
        
        <h2>Description</h2>
        <p>{movie.overview}</p>
        {/* Render other movie details as needed */}
        <h2>Cast</h2>
        <div
            style={{
            display: 'flex',
            overflowX: 'scroll',
            }}
        >
            {cast.map(actor => (
                <div key={actor.id} style={{ margin: '0 10px' }}>
                    {actor.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} style={{ width: '200px' }} />
                    ) : (
                        <div>No Image Available</div> // Display a placeholder image or a message when no image is available
                    )}
                    <p>{actor.name}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default MoviesDetail;
