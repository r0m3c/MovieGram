import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';

const NewsContainer = styled.div`
  padding-left: 15%;
  padding-right: 15%;
  background-color: black;
  padding-top: 3%;
  padding-bottom: 3%;
  // display: flex;
  border-radius: 15px;

  img {
    width: 100%;
  }
`

const MovieNews = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchMovieNews = async () => {
        try {
          const response = await Axios.get('https://newsapi.org/v2/everything?q=movies&apiKey=b26276a1dddd4be38a0904788ca1deb4');
          setArticles(response.data.articles);
        } catch (err) {
          console.log(err);
        }
    };
  
    fetchMovieNews();
  }, []);

  // Render movie news articles on the page
  return (
    <div style={{paddingLeft:"15%", paddingRight:"15%"}}>
      <h2 style={{textAlign:"center"}}>Movie News</h2>

      {articles.map(article => (
          <div>
            <NewsContainer key={article.title}>
              <h3 style={{color:"white"}}>{article.title}</h3>
              {article.urlToImage && (
                <img style={{borderRadius: "15px", borderColor: "white", borderWidth: "3px"}} src={article.urlToImage} alt={article.title} />
              )}
              <p style={{color:"white", fontSize: '10px'}}>{article.description}</p>
              <a style={{fontSize: "12px"}} href={article.url} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
              
            </NewsContainer>

            <br/>
          </div>
          
      ))}
    </div>
  );
};

export default MovieNews;
