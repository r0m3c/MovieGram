// MovieApiPage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import styled from 'styled-components';

const RowContainer = styled.div`
  img {
    border-radius: 15px;
    border-width: thin;
    border-color: red;
  }
`

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [popularMovie, setPopularMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [adventureMovies, setAdventureMovies] = useState([]);
  const [animationMovies, setAnimationyMovies] = useState([]);
  const [crimeMovies, setCrimeMovies] = useState([]);
  const [documentaryMovies, setDocumentaryMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [familyMovies, setFamilyMovies] = useState([]);
  const [fantasyMovies, setFantasyMovies] = useState([]);
  const [historyMovies, setHistoryMovies] = useState([]);
  const [horrorMovies, setHorroMovies] = useState([]);
  const [musicMovies, setMusicMovies] = useState([]);
  const [mystaryMovies, setMystetryMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [scifiMovies, setScifiMovies] = useState([]);
  const [thrillerMovies, setThrillerMovies] = useState([]);
  const [warMovies, setWarMovies] = useState([]);
  const [westernMovies, setWesternMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalPages = 5;
        let nowPlaying = [];
        for (let page = 1; page <= totalPages; page++) {
          const response = await Axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            params: {
              api_key: '7d0128a4c74e6616838bbcd8178bbb94', 
              language: 'en-US',
              page: page
            }
          });

          const playing = response.data.results; 
          nowPlaying = nowPlaying.concat(playing);
        }
        
        setMovies(nowPlaying);

        const totalPages3 = 5;
        let popular = [];
        for (let page = 1; page <= totalPages3; page++) {
          const response = await Axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: {
              api_key: '7d0128a4c74e6616838bbcd8178bbb94', 
              language: 'en-US',
              page: page
            }
          });

          const pop = response.data.results;
          popular = popular.concat(pop);
        }

        setPopularMovies(popular)

        //
        const totalPages2 = 5;
        let all = [];
        for (let page = 1; page <= totalPages2; page ++) {
          const allMoviesResponse = await Axios.get('https://api.themoviedb.org/3/movie/top_rated', {
            params: {
              api_key: '7d0128a4c74e6616838bbcd8178bbb94', 
              language: 'en-US',
              page: page
            }
          }); 

          const allMovies = allMoviesResponse.data.results;
          all = all.concat(allMovies);
        }
        
        
        setAllMovies(all);

        const filteredActionMovies = all.filter(movie => movie.genre_ids.includes(28)); 
        setActionMovies(filteredActionMovies);

        const filteredAdventureMovies = all.filter(movie => movie.genre_ids.includes(35)); 
        setAdventureMovies(filteredAdventureMovies);

        const filteredAnimationMovies = all.filter(movie => movie.genre_ids.includes(16)); 
        setAnimationyMovies(filteredAnimationMovies);

        const filteredComedyMovies = all.filter(movie => movie.genre_ids.includes(12)); 
        setComedyMovies(filteredComedyMovies);

        const filteredCrimeMovies = all.filter(movie => movie.genre_ids.includes(80)); 
        setCrimeMovies(filteredCrimeMovies);

        const filteredDocumentaryMovies = all.filter(movie => movie.genre_ids.includes(99)); 
        setDocumentaryMovies(filteredDocumentaryMovies);

        const filteredDramaMovies = all.filter(movie => movie.genre_ids.includes(18)); 
        setDramaMovies(filteredDramaMovies);

        const filteredFamilyMovies = all.filter(movie => movie.genre_ids.includes(10751)); 
        setFamilyMovies(filteredFamilyMovies);

        const filteredFantasyMovies = all.filter(movie => movie.genre_ids.includes(14)); 
        setFantasyMovies(filteredFantasyMovies);

        const filteredHistoryMovies = all.filter(movie => movie.genre_ids.includes(36)); 
        setHistoryMovies(filteredHistoryMovies);

        const filteredHorrorMovies = all.filter(movie => movie.genre_ids.includes(27)); 
        setHorroMovies(filteredHorrorMovies);

        const filteredMusicMovies = all.filter(movie => movie.genre_ids.includes(10402)); 
        setMusicMovies(filteredMusicMovies);

        const filteredMysteryMovies = all.filter(movie => movie.genre_ids.includes(9648)); 
        setMystetryMovies(filteredMysteryMovies);

        const filteredRomanceMovies = all.filter(movie => movie.genre_ids.includes(10749)); 
        setRomanceMovies(filteredRomanceMovies);

        const filteredScifiMovies = all.filter(movie => movie.genre_ids.includes(878)); 
        setScifiMovies(filteredScifiMovies);

        const filteredThrillerMovies = all.filter(movie => movie.genre_ids.includes(53)); 
        setThrillerMovies(filteredThrillerMovies);

        const filteredWarMovies = all.filter(movie => movie.genre_ids.includes(10752)); 
        setWarMovies(filteredWarMovies);

        const filteredWesternMovies = all.filter(movie => movie.genre_ids.includes(37)); 
        setWesternMovies(filteredWesternMovies);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Movies</h2>

      <RowContainer>
        <h2>Now Playing</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {movies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>All movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {allMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Popular Movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {popularMovie.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Action Movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",
          }}>
          {actionMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Adventure movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {adventureMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Animation movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {animationMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Comedy Movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",
          }}>
          {comedyMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Crime Movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",
          }}>
          {crimeMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>
          
      {documentaryMovies.length > 0 ? 
        <RowContainer>
        <h2>Documentary movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {documentaryMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>
      : <p></p>}

      <RowContainer>
        <h2>Drama movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {dramaMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Family movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {familyMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Fantasy movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {fantasyMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>History movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {historyMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Horror movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {horrorMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Music movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {musicMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Mystery movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {mystaryMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Romance movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {romanceMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>SciFi movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {scifiMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>Thriller movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {thrillerMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

      <RowContainer>
        <h2>War movies</h2>
        <div style={{
            display: 'flex',
            overflowX: 'scroll',
            width: "100%",

          }}>
          {warMovies.map(movie => (
            <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
              <div style={{ margin: '0 10px' }}>
                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </RowContainer>

        {westernMovies.length > 0 ? 
          <RowContainer>
            <h2>Western movies</h2>
            <div style={{
                display: 'flex',
                overflowX: 'scroll',
                width: "100%",

              }}>
              {westernMovies.map(movie => (
                <Link key={movie.id} to={`/movie/api/${movie.id}`} style={{ margin: '0 6px' }}>
                  <div style={{ margin: '0 10px' }}>
                    <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ width: '200px' }} />
                    <p>{movie.title}</p>
                  </div>
                </Link>
              ))}
            </div>  
          </RowContainer>  
        : <p></p>}
        
    </div>
  );
};

export default Movies;

