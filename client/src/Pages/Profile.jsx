import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import UserImg from '../assets/user_image.png'

import { faDownload, faEdit, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Profile(props) {
    const [user, setUser] = useState({});
    const [totalMoviesWatched, setTotalMoviesWatched] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [moviesByCategory, setMoviesByCategory] = useState([]);
    const [moviesByLanguage, setMoviesByLanguage] = useState([]);
    const [reports,setReports] = useState([]);
    const [yourReported,setYourReported] = useState([]);
    const [yourFeedback,setYourFeedback] = useState([]);
    const [activeSection, setActiveSection] = useState('reports');
    const [activeSectionMovie, setActiveSectionMovie] = useState('watched');
    const [activeSectionMovieWatchlist, setActiveSectionMovieWatchlist] = useState('watched_stats');
    const [totalWatchlist,setTotalWatchlist] = useState(0);
    const [moviesByLanguageWatchlist, setMoviesByLanguageWatchlist] = useState([]);
    const [count_watchlist_watched,set_Count_watchlist_watched] = useState(0);

    const location = useLocation();
    const id = location.pathname.split("/")[2];

    const {currentUser} = useContext(AuthContext);
    // const {currentUser, logout} = useContext(AuthContext);

    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await Axios.get("http://localhost:2030/api/user/" + String(id));
          setUser(res.data);

          const totalWatched = await Axios.get("http://localhost:2030/api/total/movies/" + String(id));
          setTotalMoviesWatched(totalWatched.data);
          
          const ratingAvg = await Axios.get("http://localhost:2030/api/avg/movies/" + String(id));
          setAvgRating(ratingAvg.data);

          const countCategory = await Axios.get("http://localhost:2030/api/count/category/movies/" + String(id));
          setMoviesByCategory(countCategory.data);

          const countLanguage = await Axios.get("http://localhost:2030/api/count/language/movies/" + String(id));
          setMoviesByLanguage(countLanguage.data);

          const currentReports = await Axios.get("http://localhost:2030/api/current/reports/" + String(id));
          setReports(currentReports.data);

          const yourReport = await Axios.get("http://localhost:2030/api/your/reported/"+String(id));
          setYourReported(yourReport.data);

          const yourFeedback = await Axios.get("http://localhost:2030/api/your/feedback/"+String(id));
          setYourFeedback(yourFeedback.data);

          const watchlistTotal = await Axios.get("http://localhost:2030/api/watched/total/movies/" + String(id));
          setTotalWatchlist(watchlistTotal.data);

          const countWatchlistLanguage = await Axios.get("http://localhost:2030/api/count/language/watched/movies/" + String(id));
          setMoviesByLanguageWatchlist(countWatchlistLanguage.data)

          const watched_count = await Axios.get("http://localhost:2030/api/watchlist/watched_count/" + String(id));
          set_Count_watchlist_watched(watched_count.data);

        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    }, [id]);

    // if (!currentUser) {
    //   navigate("/")
    // }
    
    const handleSectionChange = (section) => {
      setActiveSection(section);
    };

    const handleSectionChangeMovie = (section) => {
      setActiveSectionMovie(section);
    };

    const handleSectionChangeMovieWatchlist = (section) => {
      setActiveSectionMovieWatchlist(section);
    };

    const handleDownloadClickExcel = async () => {
      try {
        const response = await Axios.get("http://localhost:2030/api/movie-dataa/" + String(id), { responseType: 'blob' });
    
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

    const handleDownloadClickExcelWatchlist = async () => {
      try {
        const response = await Axios.get("http://localhost:2030/api/movie-watchlist-data/" + String(currentUser.id), { responseType: 'blob' });
    
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
    

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${day}/${year}`;
    };

    const navigateProfileEdit = () =>{
      navigate("/edit_profile/" + String(user.id));
    }

    const navigateWatchlist = () =>{
      navigate("/watchlist");
    }

    const navigateWatched = () =>{
      navigate("/lists");
    }
  
    return (
      <div style={{paddingLeft:"15%", paddingRight:"15%"}}>
        <h2 style={{textAlign:"center"}}>Profile</h2>
        <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
          <h2 >{user.username}</h2>
          {user.img ? <img src={"../uploads/" + String(user.img)} style={{width: "100px", height: "100px", borderRadius: "50%", border: '2px solid white'}} /> : <img style={{width: "100px", height: "100px", borderRadius: "50%", border: '2px solid white'}} src={UserImg}/>}
          <p><b>Bio:</b> {user.bio}</p>
          <p><b>Account created on:</b> {formatDate(user.created_at)}</p>
          {currentUser ? currentUser.id === user.id && (
          <div>
              {/* <Link to={"/edit_profile/" + String(user.id)}>Edit Profile</Link> */}
              <FontAwesomeIcon onClick={navigateProfileEdit} icon={faEdit} style={{ color: 'gray',fontSize:"30px" }} />
              {/* <button onClick={() => handleDelete(mov.id)}>Delete</button> */}
          </div>
          ) : ""}
        </div>

        <br/>
        
        {currentUser ? currentUser.id === user.id && (
          <div style={{textAlign:"center"}}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', backgroundColor: 'black', borderRadius: '20px', color: 'white', paddingTop: '3%', paddingBottom: '3%', width: '30%', margin: '0 auto' }}>
                <h2>Your Movies Watched</h2>
                {/* <Link to={"/lists"}>See your Watched Movies</Link> */}
                <FontAwesomeIcon style={{ fontSize: '30px' }} onClick={navigateWatched} icon={faArrowAltCircleRight} />
              </div>
              <br />
              <div style={{ textAlign: 'center', backgroundColor: 'black', borderRadius: '20px', color: 'white', paddingTop: '3%', paddingBottom: '3%', width: '30%', margin: '0 auto' }}>
                <h2>Your Watchlist</h2>
                {/* <Link to={"/watchlist"}>See your Watchlist</Link> */}
                <FontAwesomeIcon style={{ fontSize: '30px' }} onClick={navigateWatchlist} icon={faArrowAltCircleRight} />
              </div>
            </div>

              {/* <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"30%", margin: '0 auto'}}>
                <h2>Your Movies Watched</h2>
                <FontAwesomeIcon style={{"fontSize":"30px"}} onClick={navigateWatched} icon={faArrowAltCircleRight}/>
              </div>
              <br/>  

              <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"30%", margin: '0 auto'}}>
                <h2>Your Watchlist</h2>
                <FontAwesomeIcon style={{"fontSize":"30px"}} onClick={navigateWatchlist} icon={faArrowAltCircleRight}/>
              </div> */}
              <br/> 

              {/* <h1 style={{ textAlign: 'center' }}>Downloads</h1> */}
              <h1 style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '10px', width: '100%' }}>Downloads</h1>


              <nav style={{ textAlign: 'center', backgroundColor: 'gray', borderRadius: '20px', color: 'white', paddingTop: '3%', paddingBottom: '3%', width: "95%", margin: "0 auto" }}>
                <ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', padding: 0, flex: '1 1 auto'  }}>
                  <li style={{ marginRight: '20px' }}>
                    <button
                      onClick={() => handleSectionChangeMovie('watched')}
                      style={{
                        backgroundColor: activeSectionMovie === 'watched' ? 'black' : 'gray',
                        color: activeSectionMovie === 'watched' ? 'white' : 'black',
                        border: 'none',
                        cursor: 'pointer',
                        padding: "10px 50px",
                        borderRadius: "10px"
                      }}
                    >
                      Watched
                    </button>
                  </li>
                  <li style={{ marginRight: '20px' }}>
                    <button
                      onClick={() => handleSectionChangeMovie('watchlist')}
                      style={{
                        backgroundColor: activeSectionMovie === 'watchlist' ? 'black' : 'gray',
                        color: activeSectionMovie === 'watchlist' ? 'white' : 'black',
                        border: 'none',
                        cursor: 'pointer',
                        padding: "10px 50px",
                        borderRadius: "10px"
                      }}
                    >
                      Watchlist
                    </button>
                  </li>
                </ul>
              </nav>

              {activeSectionMovie === 'watched' && (
                <>
                  {totalMoviesWatched > 0 ?

                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                    <h2 style={{textAlign:"center"}}>Download Movies Watched (By highest ratings)</h2>
                    {/* <button onClick={handleDownloadClickExcel}>Download Movie (excel)</button> */}
                    <FontAwesomeIcon onClick={handleDownloadClickExcel} icon={faDownload} style={{ color: 'white',fontSize:"30px" }} />
                  </div>
                  : 
                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                    <h2 style={{textAlign:"center"}}>Download Movies Watched (By highest ratings)</h2>
                    <p>Add in at least a movie to download your Movies Watched</p>
                  </div>
                  }
                  {/* <br/> */}
                </>
              )}
              {/* <br/> */}

              {activeSectionMovie === 'watchlist' && (
                <>
                
                {totalMoviesWatched > 0 ?

                <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                  <h2 style={{textAlign:"center"}}>Download Your Movies Watchlist (By date)</h2>
                  {/* <button onClick={handleDownloadClickExcelWatchlist}>Download Watchlist (excel)</button> */}
                  <FontAwesomeIcon onClick={handleDownloadClickExcelWatchlist} icon={faDownload} style={{ color: 'white',fontSize:"30px" }} />
                </div>
                : 
                <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                  <h2 style={{textAlign:"center"}}>Download Your Movies Watchlist (By date)</h2>
                  <p>Add in at least a movie to your watchlist to download your list</p>
                </div>
                }

                </>
              )}
              <br/>

              <h1 style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '10px', width: '100%' }}>Stats</h1>


              <nav style={{ textAlign: 'center', backgroundColor: 'gray', borderRadius: '20px', color: 'white', paddingTop: '3%', paddingBottom: '3%', width: "95%", margin: "0 auto" }}>
                <ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', padding: 0, flex: '1 1 auto'  }}>
                  <li style={{ marginRight: '20px' }}>
                    <button
                      onClick={() => handleSectionChangeMovieWatchlist('watched_stats')}
                      style={{
                        backgroundColor: activeSectionMovieWatchlist === 'watched_stats' ? 'black' : 'gray',
                        color: activeSectionMovieWatchlist === 'watched_stats' ? 'white' : 'black',
                        border: 'none',
                        cursor: 'pointer',
                        padding: "10px 50px",
                        borderRadius: "10px"
                      }}
                    >
                      Watched Stats
                    </button>
                  </li>
                  <li style={{ marginRight: '20px' }}>
                    <button
                      onClick={() => handleSectionChangeMovieWatchlist('watchlist_stats')}
                      style={{
                        backgroundColor: activeSectionMovieWatchlist === 'watchlist_stats' ? 'black' : 'gray',
                        color: activeSectionMovieWatchlist === 'watchlist_stats' ? 'white' : 'black',
                        border: 'none',
                        cursor: 'pointer',
                        padding: "10px 50px",
                        borderRadius: "10px"
                      }}
                    >
                      Watchlist Stats
                    </button>
                  </li>
                </ul>
              </nav>

              {activeSectionMovieWatchlist === 'watched_stats' && (
                <>
                  {totalMoviesWatched > 0 ?

                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                    <h2 style={{textAlign:"center"}}>Your Stats (Movies Watched)</h2>
                    <p>Total # of movies watched: {totalMoviesWatched}</p>
                    <p>Avg Rating of movies: {avgRating}</p>
                    <p>Movie Count by Category:</p>
                    {moviesByCategory.map((category) => (
                      <li key={category.category}>{category.category}: {category.count}</li>
                    ))}
                    <p>Movie Count by Language:</p>

                    {moviesByLanguage.map((language) => (
                      <li key={language.language}>{language.language}: {language.lan}</li>
                    ))}
                  </div>
                  : 
                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                    <h2 style={{textAlign:"center"}}>Your Stats (Movies Watched)</h2>
                    <p>Add in at least a movie to see your stats</p>
                  </div>
                  }
                </>
              )}

              
              {/* <br/> */}

              {activeSectionMovieWatchlist === 'watchlist_stats' && (
                <>
                  {totalWatchlist > 0 ?

                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                    <h2 style={{textAlign:"center"}}>Your Stats (Watchlist Movies)</h2>
                    <p>Total # of movies watched: {totalWatchlist}</p>
                    <p>Movie Count by Language:</p>

                      {moviesByLanguageWatchlist.map((language) => (
                        <li key={language.language}>{language.language}: {language.count}</li>
                      ))}
                      <p>Watched/Total Movies: {count_watchlist_watched}/{totalWatchlist}</p>
                  </div>
                  : 
                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                    <h2 style={{textAlign:"center"}}>Your Stats (Movies Watched)</h2>
                    <p>Add in at least a movie to see your stats</p>
                  </div>
                  }
                </>
              )}
              <br/>

              {/* {reports.length > 0 
              ?
              
              <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
                <h2>Reports You Have Made</h2>
                <hr />

                {reports.map((report) => (
                    <div key={report.id}>
                      <p><b>User reported:</b> <Link to={"/profile/" + String(report.id_reported)}>{report.reported_username}</Link> </p>
                      <p><b> {report.movieName}</b></p>
                      <img src={"../uploads/" + String(report.movieImg)} style={{width: "100px", height: "100px", borderRadius: "15px"}}/>
                      <p><b>Reported for:</b> {report.description}</p>
                      <p><b>Type of report:</b> {report.type}</p>
                      <hr />
                    </div>
                ))}
                <br/>
              </div>

              :

              <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
                <h2>Reports You Have Made</h2>
                <p>You have made no reports</p>
              </div>

              }
              <br/>
              
              {yourReported.length > 0
              ?

              <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
                <h2>Posts of Yours that Have been Reported</h2>
                <hr />
                
                {yourReported.map((report) => (
                    <div key={report.id}>
                      <p><b>{report.movieName}</b></p>
                      <img src={"../uploads/" + String(report.movieImg)} style={{width: "100px", height: "100px", borderRadius: "15px"}}/>
                      <p><b>Reported for:</b> {report.description}</p>
                      <p><b>Type of report:</b> {report.type}</p>
                      <hr />
                    </div>
                ))}
              </div>
            
              :
              
              <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
                <h2>Posts of Yours that Have been Reported</h2>
                <p>None of your posts have been reported</p>
              </div>

              }

              <br/>

              {console.log(yourFeedback)}

              {yourFeedback.length > 0
              ?

              <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
                <h2>Feedback that you have submitted</h2>
                <hr />
                
                {yourFeedback.map((feedback) => (
                    <div key={feedback.id}>
                      <p><b>Feedback for:</b> {feedback.description}</p>
                      <p><b>Type of feedback:</b> {feedback.type}</p>
                      <p><b>Date submitted:</b> {formatDate(feedback.feedback_date)}</p>
                      <hr />
                    </div>
                ))}
              </div>
            
              :
              
              <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%"}}>
                <h2>Feedback that you have submitted</h2>
                <p>You haven't submitted any feedback, yet...</p>
              </div>

              } */}

            <h1 style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '10px', width: '100%' }}>Reports/Feedback</h1>


            <div>
            <nav style={{ textAlign: 'center', backgroundColor: 'gray', borderRadius: '20px', color: 'white', paddingTop: '3%', paddingBottom: '3%', width: "95%", margin: "0 auto" }}>
              <ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', padding: 0, flex: '1 1 auto'  }}>
                <li style={{ marginRight: '20px' }}>
                  <button
                    onClick={() => handleSectionChange('reports')}
                    style={{
                      backgroundColor: activeSection === 'reports' ? 'black' : 'gray',
                      color: activeSection === 'reports' ? 'white' : 'black',
                      border: 'none',
                      cursor: 'pointer',
                      padding: "10px 50px",
                      borderRadius: "10px"
                    }}
                  >
                    Reports You Made
                  </button>
                </li>
                <li style={{ marginRight: '20px' }}>
                  <button
                    onClick={() => handleSectionChange('reported')}
                    style={{
                      backgroundColor: activeSection === 'reported' ? 'black' : 'gray',
                      color: activeSection === 'reported' ? 'white' : 'black',
                      border: 'none',
                      cursor: 'pointer',
                      padding: "10px 50px",
                      borderRadius: "10px"
                    }}
                  >
                    Posts Reported
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange('feedback')}
                    style={{
                      backgroundColor: activeSection === 'feedback' ? 'black' : 'gray',
                      color: activeSection === 'feedback' ? 'white' : 'black',
                      border: 'none',
                      cursor: 'pointer',
                      padding: "10px 50px",
                      borderRadius: "10px"
                    }}
                  >
                    Feedback Submitted
                  </button>
                </li>
              </ul>
            </nav>

            {/* <br/> */}

            {activeSection === 'reports' && (
              <>
                {reports.length > 0 ? (
                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                    <h2>Reports You Have Made</h2>
                    <hr />

                    {reports.map((report) => (
                        <div key={report.id}>
                          {/* <hr /> */}
                          <p><b>User reported:</b> <Link to={"/profile/" + String(report.id_reported)}>{report.reported_username}</Link> </p>
                          <p><b> {report.movieName}</b></p>
                          <img src={"../uploads/" + String(report.movieImg)} style={{width: "100px", height: "100px", borderRadius: "15px"}}/>
                          <p><b>Reported for:</b> {report.description}</p>
                          <p><b>Type of report:</b> {report.type}</p>
                          <hr />
                        </div>
                    ))}
                    <br/>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', backgroundColor: 'black', borderRadius: '20px', color: 'white', paddingTop: '3%', paddingBottom: '3%', width:"90%", margin: '0 auto' }}>
                    <h2>Reports You Have Made</h2>
                    <p>You have made no reports</p>
                  </div>
                )}
              </>
            )}

            {activeSection === 'reported' && (
              <>
                {yourReported.length > 0 ? (
                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                    <h2>Posts of Yours that Have been Reported</h2>
                    <hr />
                    
                    {yourReported.map((report) => (
                        <div key={report.id}>
                          {/* <hr /> */}
                          {/* <p><b>User whose post was reported:</b> <Link to={"/profile/" + String(report.id_reported)}>{report.reported_username}</Link> </p> */}
                          <p><b>{report.movieName}</b></p>
                          <img src={"../uploads/" + String(report.movieImg)} style={{width: "100px", height: "100px", borderRadius: "15px"}}/>
                          <p><b>Reported for:</b> {report.description}</p>
                          <p><b>Type of report:</b> {report.type}</p>
                          <hr />
                        </div>
                    ))}
                </div>
                ) : (
                  <div style={{ textAlign: 'center', backgroundColor: 'black', borderRadius: '20px', color: 'white', paddingTop: '3%', paddingBottom: '3%', width:"90%", margin: '0 auto' }}>
                    <h2>Posts of Yours that Have been Reported</h2>
                    <p>None of your posts have been reported</p>
                  </div>
                )}
              </>
            )}

            {activeSection === 'feedback' && (
              <>
                {yourFeedback.length > 0 ? (
                  <div style={{textAlign: "center",backgroundColor:"black", borderRadius:"20px", color:"white", paddingTop:"3%", paddingBottom: "3%", width:"90%", margin: '0 auto'}}>
                  <h2>Feedback that you have submitted</h2>
                  <hr />
                  
                  {yourFeedback.map((feedback) => (
                      <div key={feedback.id}>
                        {/* <hr /> */}
                        {/* <p><b>User whose post was reported:</b> <Link to={"/profile/" + String(report.id_reported)}>{report.reported_username}</Link> </p> */}
                        <p><b>Feedback for:</b> {feedback.description}</p>
                        <p><b>Type of feedback:</b> {feedback.type}</p>
                        <p><b>Date submitted:</b> {formatDate(feedback.feedback_date)}</p>
                        <hr />
                      </div>
                  ))}
                </div>
                ) : (
                  <div style={{ textAlign: 'center', backgroundColor: 'black', borderRadius: '20px', color: 'white', paddingTop: '3%', paddingBottom: '3%', width:"90%", margin: '0 auto' }}>
                    <h2>Feedback that you have submitted</h2>
                    <p>You haven't submitted any feedback, yet...</p>
                  </div>
                )}
              </>
            )}
          </div>

          </div>
          ) : ""}

          {/*  */}
          
          

          {/*  */}
  
        
      </div>
    );
  }