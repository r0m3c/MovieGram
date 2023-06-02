import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import UserImg from '../assets/user_image.png'

import { AuthContext } from '../context/authContext';
import styled from 'styled-components';
import { faFilm, faEdit, faTrash, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MovieContainer = styled.div`
    padding-left: 10%;
    padding-right: 10%;
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
    border: 2px solid white;
    // margin: 0 auto;
    
`

const MovieUserName = styled.p`
    text-align: center;
    float:left;
    color: white;
`

const ImageContainer = styled.div`
    text-align: center;
    width: 100%;
    // border: '2px solid white'
`

const UserIMG = styled.img`
    // width: 75%;
    // height: 400px;
    width: 250px;
    height: 350px;
    border-radius: 20px;
    // border: '2px solid white'
`

const EditDeleteButton = styled.button`
    width: 50px;
    color: black;
    background-color: white;
    // border: none;
    // background: none;
    font-size: 12px;
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

export default function Home() {

    const [movie,setMovie] = useState([]);
    const [stateMovie,setStateMovie] = useState({});
    const [comments,setComments] = useState({});
    const [img, setImg] = useState(null);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
    const [showDeleteConfirmationComment, setShowDeleteConfirmationComment] = useState(null);

    const {currentUser, logout} = useContext(AuthContext);

    const navigate = useNavigate();

    const handleEdit = (e) => {
        navigate("/edit_movie/" + String(e), {withCredentials:true});
    }

    // original
    // const handleDelete = async (movieId) => {
    //     try {
    //         await Axios.delete("http://localhost:2030/api/delete/"+String(movieId), {withCredentials:true});
            
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }

    // new
    const handleDelete = async (movieId) => {
        try {
          const token = localStorage.getItem("access_token");
          await Axios.delete("http://localhost:2030/api/delete/" + String(movieId), {
            headers: {
              Authorization: token,
            },
          });
          setMovie(prevMovies => prevMovies.filter(movie => movie.id !== movieId));

          setShowDeleteConfirmation(null);
        } catch (err) {
          console.log(err);
        }
      };
      

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Axios.get("http://localhost:2030/api/movies");
                setMovie(res.data);
            } catch(err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const fetchComments = async (movieId) => {
        try {
            const res = await Axios.get("http://localhost:2030/api/comments/" + String(movieId));
            setComments({ ...comments, [movieId]: res.data });
        } catch(err) {
            console.log(err);
        }
    };

    const upload = async() => {
        try {
          const formData = new FormData();
          formData.append("file",img);
          const res = await Axios.post("http://localhost:2030/api/upload", formData);
          return res.data;
        } catch (err) {
          console.log(err);
        }
    };

    const addComment = async (movieId, user_id, description) => {
        try {
            let imgURL;
            if (img) {
                imgURL = await upload();
                console.log(imgURL);
            }
            // const imgURL = await upload();
            // console.log(imgURL);
            await Axios.post("http://localhost:2030/api/add/comments/" + String(movieId), { user_id, description, imgURL })
        } catch(err) {
            console.log(err);
        }
    };

    // original
    // const handleCommentDelete = async (commentId) => {
    //     try {
    //         await Axios.delete("http://localhost:2030/api/comment/delete/"+String(commentId), {withCredentials:true});
    //     } catch(err) {
    //         console.log(err);
    //     }
    // };

    // new
    const handleCommentDelete = async (commentId) => {
        try {
          const token = localStorage.getItem('access_token');
          await Axios.delete("http://localhost:2030/api/comment/delete/" + String(commentId), {
            headers: {
              Authorization: token,
            }
          });

        //   setComments(comment => comment.filter(comm => comm.id !== commentId));

          setShowDeleteConfirmationComment(null);
        } catch(err) {
          console.log(err);
        }
      };
      

    const handleCommentEdit = (e) => {
        navigate("/edit_comment/" + String(e), {withCredentials:true});
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${month}/${day}/${year}`;
    };

    const handleMovieDeletePopup = (movieId) => {
        setShowDeleteConfirmation(movieId);
    };

    const handleMovieCommentDeletePopup = (commentId) => {
        setShowDeleteConfirmationComment(commentId);
    };

    return (
        <div>
            {currentUser && (
                <ButtonContainer>
                    <FontAwesomeIcon onClick={() => navigate("/movie")} icon={faFilm} style={{ color: 'white',fontSize:"80px" }} />
                </ButtonContainer>
            )}
            

            <h2 style={{textAlign:"center"}}>MovieGram Posts</h2>

            {/* <div style={{paddingLeft:"20%", paddingRight:"20%"}}>
                {movie.map((mov) => (
                    
                    <div>
                        <MovieContainer key={mov.id}>
                            <UserContainer>
                                <Link to={"/profile/" + String(mov.uid)}>
                                    <MovieUserImg src={"./uploads/" + String(mov.userImg)}  />
                                    <MovieUserName>{mov.username}</MovieUserName>
                                </Link>
                            </UserContainer>
                            {currentUser && (
                                <div style={{float:"right",textAlign:"center",justifyContent:"center", alignItems:"center"}}>
                                    <Link to={"/report/post/" + String(mov.id)} style={{color:"white"}}><b>...</b></Link>
                                </div>
                            )}
                            <br/>
                            <br/>
                            <br/>
                            <h2 style={{textAlign: "center"}}>{mov.movieName}</h2>

                            <ImageContainer>
                                {mov.img && <UserIMG src={"./uploads/" + String(mov.img)} />}
                            </ImageContainer>

                            <p> <b>Review:</b> {mov.movieReview}</p>
                            <p><b>Rating:</b> {mov.rating}</p>
                            <p><b>Director:</b> {mov.director}</p>
                            <p><b>Language:</b> {mov.language}</p>
                            <p><b>Category:</b> {mov.category}</p>
                            <p ><b>Posted:</b> {formatDate(mov.date)}</p>

                            {currentUser ? currentUser.id === mov.uid && (
                                <div style={{float:"right"}}>
                                    <FontAwesomeIcon onClick={() => handleEdit(mov.id)} icon={faEdit} style={{ color: 'gray' }} /> &nbsp;
                                    <FontAwesomeIcon onClick={() => handleMovieDeletePopup(mov.id)} icon={faTrash} style={{ color: 'red' }} />
                                </div>
                            ) : ""}

                            <h2>Comments</h2>
                            
                            <p style={{color:"gray"}} onClick={() => fetchComments(mov.id)}>See All Comments</p>

                            {comments[mov.id] && (
                                <div style={{paddingLeft:"20px"}}>
                                    {comments[mov.id].map(comment => (
                                        <div key={comment.id}>
                                            <MovieUserImg src={"./uploads/" + String(comment.userImg)}  />

                                            <MovieUserName> <Link to={"/profile/" + String(comment.user_id)}>{comment.username}</Link></MovieUserName> 
                                            
                                            <br/><br/>

                                            <p style={{paddingTop:"6px"}}>{comment.description}</p>
                                            {comment.img && <img src={"./uploads/" + String(comment.img)} style={{width: "100px", borderRadius: "15px"}} />}
                                            <p >Posted: {formatDate(comment.date)}</p>
                                            {currentUser ? currentUser.id === comment.user_id && (
                                                <div>
                                                    <FontAwesomeIcon onClick={() => handleCommentEdit(comment.id)} icon={faEdit} style={{ color: 'gray' }} /> &nbsp;
                                                    <FontAwesomeIcon onClick={() => handleMovieCommentDeletePopup(comment.id)} icon={faTrash} style={{ color: 'red' }} />
                                                </div>
                                            ) : ""}
                                            <hr style={{borderColor:"white"}}/>
                                        </div>
                                    ))}

                                </div>
                            )}

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const user_id = currentUser.id;
                                const description = e.target.elements.description.value;
                                addComment(mov.id, user_id, description);
                                e.target.reset();
                            }}>
                                <br />
                                {currentUser ? <div>
                                    <label placeholder='Comment here' htmlFor="comment">Comment: </label>
                                    <input type="text" name="description" />
                                    <br />
                                    <input type="file" onChange={(e) => {
                                        setImg(e.target.files[0]);
                                    }} /> <br/>
                                    <EditDeleteButton type="submit">Post</EditDeleteButton> 
                                </div>
                                : ""}
                            </form>

                            <br/>
                        </MovieContainer>
                        <br/>
                    </div>
                ))}
            </div> */}

            <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
                {movie.map((mov) => (
                    <div key={mov.id}>
                        <MovieContainer>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Link to={"/profile/" + String(mov.uid)}>
                                        <MovieUserImg src={"./uploads/" + String(mov.userImg)} />
                                        <MovieUserName><b>{mov.username}</b></MovieUserName>
                                    </Link>
                                </div>
                                {currentUser && (
                                    <div style={{ textAlign: "right" }}>
                                        {/* <FontAwesomeIcon icon={faEllipsisH} style={{ color: "gray" }} /> */}
                                        <Link to={"/report/post/" + String(mov.id)} style={{color:"white"}}><b>...</b></Link>
                                    </div>
                                )}
                            </div>
                            <br />
                            <br />
                            <h2 style={{ textAlign: "center" }}>{mov.movieName}</h2>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ flex: "1 0 100px" }}>
                                    <ImageContainer>
                                        {mov.img && <UserIMG style={{border: '2px solid white'}} src={"./uploads/" + String(mov.img)} />}
                                    </ImageContainer>
                                </div>
                                <div style={{ flex: "1" }}>
                                    <p><b>Review:</b> {mov.movieReview}</p>
                                    <p><b>Rating:</b> {mov.rating}/10</p>
                                    <p><b>Director:</b> {mov.director}</p>
                                    <p><b>Language:</b> {mov.language}</p>
                                    <p><b>Category:</b> {mov.category}</p>
                                    <p><b>Posted:</b> {formatDate(mov.date)}</p>
                                </div>
                            </div>

                            {currentUser ? currentUser.id === mov.uid && (
                                <div style={{ textAlign: "right" }}>
                                <FontAwesomeIcon onClick={() => handleEdit(mov.id)} icon={faEdit} style={{ color: "gray", marginRight: "10px" }} />
                                <FontAwesomeIcon onClick={() => handleMovieDeletePopup(mov.id)} icon={faTrash} style={{ color: "red" }} />
                                </div>
                            ) : ""}

                            <h2>Comments</h2>
                            <p style={{ color: "gray" }} onClick={() => fetchComments(mov.id)}>See All Comments</p>

                            {comments[mov.id] && (
                                    <div style={{paddingLeft:"20px"}}>
                                        {comments[mov.id].map(comment => (
                                            // <div key={comment.id}>
                                            //     <MovieUserImg src={"./uploads/" + String(comment.userImg)}  />

                                            //     <MovieUserName> <Link to={"/profile/" + String(comment.user_id)}>{comment.username}</Link></MovieUserName> 
                                                
                                            //     <br/><br/>

                                            //     <p style={{paddingTop:"6px"}}>{comment.description}</p>
                                            //     {comment.img && <img src={"./uploads/" + String(comment.img)} style={{width: "200px", borderRadius: "15px"}} />}
                                            //     <p >Posted: {formatDate(comment.date)}</p>
                                            //     {currentUser ? currentUser.id === comment.user_id && (
                                            //         <div>
                                            //             <FontAwesomeIcon onClick={() => handleCommentEdit(comment.id)} icon={faEdit} style={{ color: 'gray' }} /> &nbsp;
                                            //             <FontAwesomeIcon onClick={() => handleMovieCommentDeletePopup(comment.id)} icon={faTrash} style={{ color: 'red' }} />
                                            //         </div>
                                            //     ) : ""}
                                            //     <hr style={{borderColor:"white"}}/>
                                            // </div>
                                            <div key={comment.id}>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <MovieUserImg src={"./uploads/" + String(comment.userImg)} />
                                                    <MovieUserName>
                                                    <Link style={{color:"white"}} to={"/profile/" + String(comment.user_id)}><b>{comment.username}</b></Link>
                                                    </MovieUserName>
                                                </div>

                                                {/* <br /> */}

                                                <div>
                                                    <p style={{ paddingTop: "6px" }}>{comment.description}</p>
                                                    {comment.img && (
                                                    <img src={"./uploads/" + String(comment.img)} style={{ width: "200px", borderRadius: "15px", border: '2px solid white' }} />
                                                    )}
                                                </div>

                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <p style={{ float: "left", color:"#C0C0C0", fontSize: "13px"}}> {formatDate(comment.date)}</p>
                                                    {currentUser && currentUser.id === comment.user_id && (
                                                    <div style={{ float: "right" }}>
                                                        <FontAwesomeIcon onClick={() => handleCommentEdit(comment.id)} icon={faEdit} style={{ color: "gray" }} /> &nbsp;
                                                        <FontAwesomeIcon
                                                        onClick={() => handleMovieCommentDeletePopup(comment.id)}
                                                        icon={faTrash}
                                                        style={{ color: "red" }}
                                                        />
                                                    </div>
                                                    )}
                                                </div>

                                                <hr style={{ borderColor: "white" }} />
                                            </div>

                                        ))}

                                    </div>
                                )}

                                {/* <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const user_id = currentUser.id;
                                    const description = e.target.elements.description.value;
                                    addComment(mov.id, user_id, description);
                                    e.target.reset();
                                }}>
                                    <br />
                                    {currentUser ? <div>
                                        <input placeholder='Add a comment...' type="text" name="description" style={{"width":"100%"}}/>
                                        <br />
                                        <input type="file" onChange={(e) => {
                                            setImg(e.target.files[0]);
                                        }} /> <br/>
                                        <EditDeleteButton type="submit">Submit</EditDeleteButton> 
                                    </div>
                                    : ""}
                                </form> */}
                                
                                <form>
                                    <br />
                                    {currentUser && (
                                        <div>
                                        <input
                                            placeholder="Add a comment..."
                                            type="text"
                                            name="description"
                                            style={{ width: "100%" }}
                                            onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                const user_id = currentUser.id;
                                                const description = e.target.value;
                                                addComment(mov.id, user_id, description);
                                                e.target.value = "";
                                                const fileInput = document.querySelector('input[type="file"]');
                                            if (fileInput) {
                                            fileInput.value = null;
                                            }
                                            }
                                            }}
                                        />
                                        <br />
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                            setImg(e.target.files[0]);
                                            }}
                                        />{" "}
                                        <br />
                                        </div>
                                    )}
                                </form>


                                <br/>
                        </MovieContainer>
                        <br/>
                    </div>
                ))}
                </div>

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

            {showDeleteConfirmationComment && (
            <div>
                <div style={{position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: "9999",}} />
                <DeletePopup >
                <p>Are you sure you want to delete this comment?</p>
                <button onClick={() => handleCommentDelete(showDeleteConfirmationComment)}>Yes</button>
                <button onClick={() => setShowDeleteConfirmationComment(null)}>No</button>
                </DeletePopup>
            </div>
            )}

            {/* <div>
                {movie.map((mov) => (
                    <div key={mov.id}>
                        <hr/>
                        <Link to={"/profile/" + String(mov.uid)}>
                             <img src={"./uploads/" + String(mov.userImg)} style={{width: "100px"}} />
                            <p>{mov.username}</p>
                        </Link>
                        <p>{mov.category}</p>
                        <p>{mov.date}</p>
                        <h3>{mov.movieName}</h3>
                        <p>{mov.movieReview}</p>
                        <p>{mov.director}</p>
                        <p>{mov.language}</p>
                        <p>{mov.rating}</p>
                        {mov.img && <img src={"./uploads/" + String(mov.img)} style={{width: "200px"}} />}
                        {currentUser ? currentUser.id === mov.uid && (
                            <div>
                                <button onClick={() => handleEdit(mov.id)}>Edit</button>
                                <button onClick={() => handleDelete(mov.id)}>Delete</button>
                            </div>
                        ) : ""}

                        <div style={{paddingLeft:"20px"}}>
                            <p onClick={() => fetchComments(mov.id)}>See All Comments</p>
                            <hr style={{borderColor:"red"}}/>
                            {comments[mov.id] && (
                                <div style={{paddingLeft:"20px"}}>
                                    {comments[mov.id].map(comment => (
                                        <div key={comment.id}>
                                            <hr style={{borderColor:"red"}}/>
                                            <p>{comment.description}</p>
                                            {comment.img && <img src={"./uploads/" + String(comment.img)} style={{width: "100px"}} />}
                                            <p>By user: {comment.username}</p>
                                            <p>Posted: {comment.date}</p>
                                            {currentUser ? currentUser.id === comment.user_id && (
                                                <div>
                                                    <button onClick={() => handleCommentEdit(comment.id)}>Edit</button>
                                                    <button onClick={() => handleCommentDelete(comment.id)}>Delete</button>
                                                </div>
                                            ) : ""}
                                            <hr style={{borderColor:"red"}}/>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const user_id = currentUser.id;
                                const description = e.target.elements.description.value;
                                addComment(mov.id, user_id, description);
                                e.target.reset();
                            }}>
                                <br />
                                {currentUser ? <div>
                                    <label htmlFor="comment">Comment: </label>
                                    <input type="text" name="description" />
                                    <br />
                                    <input type="file" onChange={(e) => {
                                        setImg(e.target.files[0]);
                                    }} /> <br/>
                                    <button type="submit">Add Comment</button> 
                                </div>
                                : ""}
                            </form>

                            <hr style={{borderColor:"red"}}/>
                        </div>
                        <hr/>
                    </div>
                    
                ))}
            </div> */}
        </div>
    )
}
