import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from 'mysql';
import mysql2 from 'mysql2';
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import exceljs from "exceljs";
import dotenv from "dotenv"

dotenv.config();

const app = express(); 

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://movie-gram.vercel.app", "https://moviegram-backend-production.up.railway.app");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Making Local Changes
// const corsOptions = {
//     origin: 'http://127.0.0.1:5173',
//     credentials: true,
//     exposedHeaders: 'Access-Control-Allow-Credentials',
// };

// Launching website
const corsOptions = {
  origin: 'https://movie-gram.vercel.app',
  credentials: true,
  // exposedHeaders: 'Access-Control-Allow-Credentials',
  optionSuccessStatus:200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
//

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://movie-gram.vercel.app, https://moviegram-backend-production.up.railway.app");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://movie-gram.vercel.app", "https://moviegram-backend-production.up.railway.app");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


// MySQL db connection: MySQLWorkBench
// const db = mysql2.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Leocool99!',
//     database: 'MovieGram'
// });

// Railway DB Connection
const urlDB = "mysql://root:OZNryeJgHmlKQgo30S49@containers-us-west-143.railway.app:7964/railway";
const db = mysql2.createConnection(urlDB);


// const db = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: 'Leocool99!',
//   database: 'MovieGram'
// });

// Register
app.post("/api/register", (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const img = req.body.img;
    const date = new Date();
    const created_at = date.toISOString().slice(0, 19).replace('T', ' ');
    const bio = req.body.bio;

    // check that all this info is never empty
    if (!email || !password || !username || !bio || !img) {
        return res.status(400).json("Missing required fields!");
    }

    // check if a user exists
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
    // print
    console.log(email);
    console.log(password);

    db.query(q,[email,username], (err,data) => {
        // if there is an error -> return error message
        console.log(err);
        if (err) {
            return res.json(err);
        }

        console.log(email);
        console.log(password);

        // if there is data -> return message saying user exists
        if (data.length > 0) {
            return res.status(409).json("User already exists!");
        }

        // hash password and create a user
        const salt = bycrypt.genSaltSync(10);
        const hash = bycrypt.hashSync(password, salt);
        const values = [
            username,
            email,
            hash,
            img,
            bio,
            created_at,
        ]

        const q = "INSERT INTO users(username, email, password, img, bio, created_at) VALUES (?)";
        db.query(q, [values], (err,data) => {
            // if there is an errro -> return error message
            if (err) {
                return res.json(err);
            }

            return res.status(200).json("User has been created");
        });
    });
});

// get all movies - home page
app.get("/api/movies", (req,res) => {
    // const q = "SELECT movie.id, movie.movieName,movie.uid, movie.director, movie.language, movie.movieReview, movie.rating, movie.img, movie.category, users.username, movie.date FROM movie INNER JOIN users ON movie.uid = users.id"
    const q = "SELECT movie.id, movie.movieName,movie.uid, movie.director, movie.language, movie.movieReview, movie.rating, movie.img, movie.category, users.username, users.img AS userImg, movie.date FROM movie INNER JOIN users ON movie.uid = users.id ORDER BY movie.date DESC";

    db.query(q, (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data);
    });
});

// get all single movie - edit page
app.get("/api/movie/:movieId", (req,res) => {
    const movieId = req.params.movieId;

    const q = "SELECT movie.*, users.username FROM movie JOIN users ON movie.uid = users.id WHERE movie.id = ?";

    db.query(q,[movieId], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data[0]);
    });
});

// login user (original - using coockies)
// app.post("/api/login", (req,res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     const q = "SELECT * from users WHERE username = ?";

//     db.query(q,[username],(err,data) => {
//          // if there is an error -> return error message
//          if (err) {
//             return res.json(err);
//         }

//         // if there is no data -> return message saying user not found
//         if (data.length === 0) {
//             return res.status(404).json("User not found!");
//         }

//         // check if password is the correct one
//         const isPasswordCorrect = bycrypt.compareSync(password, data[0].password);

//         if (!isPasswordCorrect) {
//             return res.status(400).json("Wrong username or password");
//         }

//         const token = jwt.sign({id:data[0].id}, "jwtkey");
//         console.log(token);
//         const {pass, ...other} = data[0]; // mayber error?
        
//         // res.cookie("access_token",token, {
//         //     httpOnly:false,
//         // }).status(200).json(other);
//         res.cookie("access_token", token, {
//             httpOnly: true,
//             secure: true,
//             domain: "127.0.0.1",
//             path: "/",
//             // other options
//           }).status(200).json(other);
//     });
// });

// login user (new using storage)
app.post("/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    const q = "SELECT * from users WHERE username = ?";
  
    db.query(q, [username], (err, data) => {
      // if there is an error -> return error message
      if (err) {
        return res.json(err);
      }
  
      // if there is no data -> return message saying user not found
      if (data.length === 0) {
        return res.status(404).json("User not found!");
      }
  
      // check if password is the correct one
      const isPasswordCorrect = bycrypt.compareSync(password, data[0].password);
  
      if (!isPasswordCorrect) {
        return res.status(400).json("Wrong username or password");
      }
  
      const token = jwt.sign({ id: data[0].id }, "jwtkey");
      console.log(token);
      const { password: _, ...other } = data[0]; // Exclude password from response
  
      // Send the token as part of the response data
      res.status(200).json({ ...other, token });
    });
  });
  

// logout user
// app.post("/api/logout", (req,res) => {
//     res.clearCookie("access_token", {
//         sameSite:"none",
//         secure:true,
//     }).status(200).json("User has logged out");
// });

// logout user (new - using storage)
app.post("/api/logout", (req,res) => {
    res.status(200).json("User has logged out");
});

// image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname);
    }
})

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    return res.status(200).json(file.filename);
});

//

// add movie (original)
// app.post("/api/add", (req,res) => {
//     const token = req.cookies.access_token;
    
//     if (!token) {
//         return res.status(401).json("Not authenticated");
//     }

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (err) {
//             return res.status(403).json("Token is not valid");
//         }

//         const q = "INSERT INTO movie(movieName,movieReview,img,rating,director,language,uid,date,category) VALUES (?)";

//         const values = [
//             req.body.movieName,
//             req.body.movieReview,
//             req.body.img,
//             req.body.rating,
//             req.body.director,
//             req.body.language,
//             userInfo.id,
//             req.body.date,
//             req.body.category,
//         ];

//         db.query(q,[values], (err,data) => {
//             if(err) {
//                 return res.status(500).json(err);
//             }

//             return res.json("Movie has been created");
//         });
//     });
// });

// add movie (new - using local storage)
app.post("/api/add", (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json("Not authenticated");
    }
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
  
      const q = "INSERT INTO movie(movieName, movieReview, img, rating, director, language, uid, date, category) VALUES (?)";
  
      const values = [
        req.body.movieName,
        req.body.movieReview,
        req.body.img,
        req.body.rating,
        req.body.director,
        req.body.language,
        userInfo.id,
        req.body.date,
        req.body.category,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }
  
        return res.json("Movie has been created");
      });
    });
  });
  

// update a movie (original)
// app.put("/api/update/:movieId", (req,res) => {
//     const token = req.cookies.access_token;
    
//     if (!token) {
//         return res.status(401).json("Not authenticated");
//     }
//     const movieId = req.params.movieId;

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (err) {
//             return res.status(403).json("Token is not valid");
//         }
//         const {movieName, movieReview, img, rating,director,language,category} = req.body;
        
//         // const q = "UPDATE movie SET movieName = ?, movieReview = ?, rating = ?, director = ?, language = ?, category = ? WHERE id = ? AND uid = ?";

//         let q = "UPDATE movie SET"
//         let values = []

//         if (movieName) {
//             q += " movieName = ?,";
//             values.push(movieName)
//         }

//         if (movieReview) {
//             q += " movieReview = ?,";
//             values.push(movieReview);
//         }

//         if (img) {
//             q += " img = ?,";
//             values.push(img);
//         }

//         if (rating) {
//             q += " rating = ?,";
//             values.push(rating);
//         }

//         if (director) {
//             q += " director = ?,";
//             values.push(director);
//         }

//         if (language) {
//             q += " language = ?,";
//             values.push(language);
//         }

//         if (category) {
//             q += " category = ?,";
//             values.push(category);
//         }

//         q = q.slice(0,-1);

//         q += " WHERE id = ? AND uid = ?";

//         // const values = [
//         //     req.body.movieName,
//         //     req.body.movieReview,
//         //     req.body.rating,
//         //     req.body.director,
//         //     req.body.language,
//         //     req.body.category,
//         // ];
//         console.log(img);
//         values.push(movieId);
//         values.push(userInfo.id);

//         db.query(q,[...values], (err,data) => {
//             if(err) {
//                 return res.status(500).json(err);
//             }
//             console.log("hiii")
//             return res.json("Movie has been Updated");
//         });
//     });
// });

// update a movie (new)
app.put("/api/update/:movieId", (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json("Not authenticated");
    }
    
    const movieId = req.params.movieId;
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      
      const { movieName, movieReview, img, rating, director, language, category } = req.body;
      
      let q = "UPDATE movie SET";
      let values = [];
  
      if (movieName) {
        q += " movieName = ?,";
        values.push(movieName);
      }
  
      if (movieReview) {
        q += " movieReview = ?,";
        values.push(movieReview);
      }
  
      if (img) {
        q += " img = ?,";
        values.push(img);
      }
  
      if (rating) {
        q += " rating = ?,";
        values.push(rating);
      }
  
      if (director) {
        q += " director = ?,";
        values.push(director);
      }
  
      if (language) {
        q += " language = ?,";
        values.push(language);
      }
  
      if (category) {
        q += " category = ?,";
        values.push(category);
      }
  
      q = q.slice(0, -1);
  
      q += " WHERE id = ? AND uid = ?";
  
      values.push(movieId);
      values.push(userInfo.id);
  
      db.query(q, [...values], (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }
        
        console.log("hiii");
        return res.json("Movie has been updated");
      });
    });
  });
  

// delete single post (original)
// app.delete("/api/delete/:movieId", (req,res) => {
//     const token = req.cookies.access_token;
    
//     if (!token) {
//         return res.status(401).json("Not authenticated");
//     }

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (err) {
//             return res.status(403).json("Token is not valid");
//         }
//         const movieId = req.params.movieId;
//         // const movieId = req.params.movieName;
//         const q = "DELETE FROM movie WHERE id = ? AND uid = ?";

//         db.query(q,[movieId,userInfo.id], (err,data) => {
//             if(err) {
//                 return res.status(403).json("You can only delete your movies");
//             }

//             return res.json("Movie has been deleted");
//         });
//     });
// });

// delete signle post (new)
app.delete("/api/delete/:movieId", (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json("Not authenticated");
    }
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
  
      const movieId = req.params.movieId;
      // const movieId = req.params.movieName;
      const q = "DELETE FROM movie WHERE id = ? AND uid = ?";
  
      db.query(q, [movieId, userInfo.id], (err, data) => {
        if (err) {
          return res.status(403).json("You can only delete your movies");
        }
  
        return res.json("Movie has been deleted");
      });
    });
  });
  

// get movie for user based on category
// app.get("/api/lists", (req,res) => {
//     const token = req.cookies.access_token;
//     console.log(token);
    
//     if (!token) {
//         return res.status(401).json("Not authenticated");
//     }

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (err) {
//             return res.status(403).json("Token is not valid");
//         }

//         const q = "SELECT * FROM movie WHERE uid = ?";

//         db.query(q, userInfo, (err,data) => {
//             if(err) {
//                 return res.status(500).json(err);
//             }

//             return res.json("Movie has been created");
//         });
//     });
// });

// get all single movie - edit page
app.get("/api/lists/:uid", (req,res) => {
  const userId = req.params.uid;
  const searchQuery = req.query.search;

  let query = `
    SELECT * 
    FROM movie 
    WHERE uid = ?`;
  
  const values = [userId];

  if (searchQuery) {
    query += `
      AND (movieName LIKE ? OR director LIKE ? OR language LIKE ? OR category LIKE ?)`;
    values.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
  }

  query += `ORDER BY rating DESC`;

  console.log(searchQuery);
  console.log(values);

  // const q = "SELECT movie.*, users.username, users.img AS userImg FROM movie JOIN users ON movie.uid = users.id WHERE movie.uid = ? ORDER BY movie.date DESC";

  db.query(query,values, (err,data) => {
      if (err) {
          return res.status(500).json(err);
      }

      return res.status(200).json(data);
  });
});

// get user information
app.get("/api/user/:id", (req,res) => {
    const id = req.params.id;
    // console.log(id)

    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data[0]);
    });
});

// update a user info (original)
// app.put("/api/update/user/:id", (req,res) => {
//     const token = req.cookies.access_token;
    
//     if (!token) {
//         return res.status(401).json("Not authenticated");
//     }
//     const id = req.params.id;

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (err) {
//             return res.status(403).json("Token is not valid");
//         }
//         const {username, bio, img} = req.body;
        
//         let q = "UPDATE users SET"
//         let values = []

//         if (username) {
//             q += " username = ?,";
//             values.push(username)
//         }

//         if (bio) {
//             q += " bio = ?,";
//             values.push(bio);
//         }

//         if (img) {
//             q += " img = ?,";
//             values.push(img);
//         }

//         q = q.slice(0,-1);

//         q += " WHERE id = ?";

//         // console.log(img);
//         values.push(id);

//         db.query(q,[...values], (err,data) => {
//             if(err) {
//                 return res.status(500).json(err);
//             }
//             // console.log("hiii")
//             return res.json("Movie has been Updated");
//         });
//     });
// });

// update a user info (new)
app.put("/api/update/user/:id", (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json("Not authenticated");
    }
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      const id = req.params.id;
      const { username, bio, img } = req.body;
  
      let q = "UPDATE users SET";
      let values = [];
  
      if (username) {
        q += " username = ?,";
        values.push(username);
      }
  
      if (bio) {
        q += " bio = ?,";
        values.push(bio);
      }
  
      if (img) {
        q += " img = ?,";
        values.push(img);
      }
  
      q = q.slice(0, -1);
  
      q += " WHERE id = ?";
  
      values.push(id);
  
      db.query(q, [...values], (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }
  
        return res.json("User has been updated");
      });
    });
  });
  

// get comments for a movie
app.get("/api/comments/:id", (req,res) => {
    const movie_id = req.params.id;

    // const q = "SELECT * FROM comments WHERE movie_id = ?";

    const q = "SELECT c.id, c.description, c.user_id, c.img, c.date, c.movie_id, u.username, u.img as userImg FROM comments c JOIN users u ON c.user_id = u.id WHERE c.movie_id = ?";

    db.query(q,[movie_id], (err,data) => {
        if (err) {
            console.log("hi");
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
});

// add comments to a movie
app.post('/api/add/comments/:id', (req, res) => {
    const movie_id = req.params.id;
    const user_id = req.body.user_id;
    const description = req.body.description;
    const img = req.body.imgURL;
    // console.log(img);
    const date = new Date();
    const created_at = date.toISOString().slice(0, 19).replace('T', ' ');

    const query = `INSERT INTO Comments (user_id, movie_id, img, date, description) VALUES (?)`;
    const values = [
        user_id,
        movie_id,
        img,
        created_at,
        description,
    ];
    // console.log(values);
    db.query(query,[values], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(data);
    });
});

// delete single comment (original)
// app.delete("/api/comment/delete/:id", (req,res) => {
//     const token = req.cookies.access_token;
    
//     if (!token) {
//         return res.status(401).json("Not authenticated");
//     }

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (err) {
//             return res.status(403).json("Token is not valid");
//         }
//         const commentId = req.params.id;
//         const q = "DELETE FROM comments WHERE id = ? AND user_id = ?";

//         db.query(q,[commentId,userInfo.id], (err,data) => {
//             if(err) {
//                 return res.status(403).json("You can only delete your comments");
//             }

//             return res.json("Comment has been deleted");
//         });
//     });
// });

// delete single comment (new)
app.delete("/api/comment/delete/:id", (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json("Not authenticated");
    }
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      const commentId = req.params.id;
      const q = "DELETE FROM comments WHERE id = ? AND user_id = ?";
  
      db.query(q, [commentId, userInfo.id], (err, data) => {
        if (err) {
          return res.status(403).json("You can only delete your comments");
        }
  
        return res.json("Comment has been deleted");
      });
    });
  });
  

// get single comment information
app.get("/api/comment/get/:id", (req,res) => {
    const id = req.params.id;

    const q = `
        SELECT comments.*, users.username, users.img AS userImg 
        FROM comments 
        JOIN users ON comments.user_id = users.id 
        WHERE comments.id = ?`;
    
        // const q = `
        // SELECT comments.*, users.username, users.img AS useImg 
        // FROM comments 
        // JOIN users ON comments.user_id = users.id 
        // WHERE comments.id = ?`;

    // const q = "SELECT comments.*, users.username, users.img AS userImg FROM comments JOIN users ON comments.user_id = users.id WHERE comments.movie_id = ?";

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data[0]);
    });
});

// update a comment info (original)
// app.put("/api/comment/update/:id", (req,res) => {
//     const token = req.cookies.access_token;
    
//     if (!token) {
//         return res.status(401).json("Not authenticated");
//     }
//     const id = req.params.id;

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (err) {
//             return res.status(403).json("Token is not valid");
//         }
//         const {description, img} = req.body;
        
//         let q = "UPDATE comments SET"
//         let values = []

//         if (description) {
//             q += " description = ?,";
//             values.push(description)
//         }

//         if (img) {
//             q += " img = ?,";
//             values.push(img);
//         }

//         q = q.slice(0,-1);

//         q += " WHERE id = ?";

//         values.push(id);

//         db.query(q,[...values], (err,data) => {
//             if(err) {
//                 return res.status(500).json(err);
//             }
            
//             return res.json("Comment has been Updated");
//         });
//     });
// });

// update a comment (new)
app.put("/api/comment/update/:id", (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json("Not authenticated");
    }
    const id = req.params.id;
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      const { description, img } = req.body;
  
      let q = "UPDATE comments SET";
      let values = [];
  
      if (description) {
        q += " description = ?,";
        values.push(description);
      }
  
      if (img) {
        q += " img = ?,";
        values.push(img);
      }
  
      q = q.slice(0, -1);
  
      q += " WHERE id = ?";
  
      values.push(id);
  
      db.query(q, [...values], (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }
  
        return res.json("Comment has been Updated");
      });
    });
  });
  

// get total movies watched by one user
app.get("/api/total/movies/:id", (req,res) => {
    const id = req.params.id;
    // console.log(id)

    const q = "SELECT COUNT(*) AS totalMoviesWatched from movie WHERE uid = ?";

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }

        // const totalMoviesWatched = data[0].totalMoviesWatched;

        return res.status(200).json(data[0].totalMoviesWatched);
    });
});

// get avg movies watched by one user
app.get("/api/avg/movies/:id", (req,res) => {
    const id = req.params.id;
    // console.log(id)

    const q = "SELECT AVG(rating) AS avgRating from movie WHERE uid = ?";

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }

        // const totalMoviesWatched = data[0].totalMoviesWatched;

        return res.status(200).json(data[0].avgRating);
    });
});

// get movie count for each category watched by one user
app.get("/api/count/category/movies/:id", (req,res) => {
    const id = req.params.id;
    // console.log(id)

    const q = "SELECT category, COUNT(*) AS count from movie WHERE uid = ? GROUP BY category";

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }

        // const totalMoviesWatched = data[0].totalMoviesWatched;
        
        return res.status(200).json(data);
    });
});

// get movie count for each language watched by one user
app.get("/api/count/language/movies/:id", (req,res) => {
    const id = req.params.id;
    // console.log(id)

    const q = "SELECT language, COUNT(*) AS lan from movie WHERE uid = ? GROUP BY language";

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }

        // const totalMoviesWatched = data[0].totalMoviesWatched;
        
        return res.status(200).json(data);
    });
});

// post a report  (original)
// app.post('/api/report/post/:id', (req, res) => {
//     const token = req.cookies.access_token;

//     jwt.verify(token, "jwtkey", (err,userInfo) => {

//         const report_movie_id = req.params.id;
//         // console.log(report_movie_id)
//         const description = req.body.description;
//         const type = req.body.type;
        
//         const date = new Date();
//         const report_date = date.toISOString().slice(0, 19).replace('T', ' ');

//         const query = `INSERT INTO reportPost (description,type,report_user_id, report_movie_id,report_date) VALUES (?)`;
//         const values = [
//             description,
//             type,
//             userInfo.id,
//             report_movie_id,
//             report_date,
//         ];

//         console.log(values);

//         db.query(query,[values], (err, data) => {
//             if (err) {
//                 return res.status(500).json(err);
//             }
    
//             res.status(200).json(data);
//         });
//     }); 
// });

// post a report (new)
app.post('/api/report/post/:id', (req, res) => {
    const token = req.headers.authorization;
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
  
      const report_movie_id = req.params.id;
      const description = req.body.description;
      const type = req.body.type;
  
      const date = new Date();
      const report_date = date.toISOString().slice(0, 19).replace('T', ' ');
  
      const query = `INSERT INTO reportPost (description,type,report_user_id, report_movie_id,report_date) VALUES (?)`;
      const values = [
        description,
        type,
        userInfo.id,
        report_movie_id,
        report_date,
      ];
  
      db.query(query, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }
  
        res.status(200).json(data);
      });
    });
  });
  

// get the reports that the currently signed in user has made
app.get("/api/current/reports/:id", (req,res) => {
    const id = req.params.id;
    // console.log(id);

    const q = "SELECT r.*, m.movieName, m.img AS movieImg, u1.username AS reporter_username, u2.username AS reported_username, u2.id AS id_reported FROM reportPost r JOIN users u1 on r.report_user_id = u1.id JOIN movie m ON r.report_movie_id = m.id JOIN users u2 on m.uid = u2.id  WHERE r.report_user_id = ? ORDER BY r.id DESC"

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }
        
        return res.status(200).json(data);
    });
});

// get the reports of the posts that the currently signed in user has against them
app.get("/api/your/reported/:id", (req,res) => {
    const id = req.params.id;
    // console.log(id);

    const q = "SELECT r.*, u.username AS reporter_username, mu.username AS reported_udername, m.movieName, m.img AS movieImg FROM reportPost r JOIN users u on r.report_user_id = u.id JOIN movie m ON r.report_movie_id = m.id JOIN users mu ON m.uid = mu.id WHERE mu.id = ? ORDER BY r.id DESC"

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }
        
        return res.status(200).json(data);
    });
});

// add feedback (original)
// app.post("/api/feedback", (req,res) => {
//     const token = req.cookies.access_token;
    
//     if (!token) {
//         return res.status(401).json("Not authenticated");
//     }

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (err) {
//             return res.status(403).json("Token is not valid");
//         }

//         const q = "INSERT INTO feedback (description, type, feedback_user_id, feedback_date) VALUES (?)";

//         const values = [
//             req.body.description,
//             req.body.type,
//             userInfo.id,
//             req.body.date,
//         ];

//         db.query(q,[values], (err,data) => {
//             if(err) {
//                 return res.status(500).json(err);
//             }

//             return res.json("Feedback has been submitted");
//         });
//     });
// });

// add feedback (new)
app.post("/api/feedback", (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json("Not authenticated");
    }
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
  
      const q = "INSERT INTO feedback (description, type, feedback_user_id, feedback_date) VALUES (?)";
  
      const values = [
        req.body.description,
        req.body.type,
        userInfo.id,
        req.body.date,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }
  
        return res.json("Feedback has been submitted");
      });
    });
  });
  

// fetch feedback data
app.get("/api/your/feedback/:id", (req,res) => {
    const id = req.params.id;

    const q = "SELECT * FROM feedback WHERE feedback_user_id = ?"

    db.query(q,[id], (err,data) => {
        if (err) {
            return res.status(500).json(err);
        }
        
        return res.status(200).json(data);
    });
});

// add Movie data into excel file
app.get('/api/movie-dataa/:id', (req, res) => {
    const id = req.params.id;
  
    const q = 'SELECT * FROM movie WHERE uid = ? ORDER BY rating DESC';
  
    // Fetch data from database
    db.query(q, [id], (error, data) => {
        if (error) throw error;
        let movieData = [['Movie Name', 'Director', 'Rating', 'Movie Review', 'Language', 'Category', 'Date']];
        data.forEach((row, index) => {
            movieData.push([`${index + 1}) ${row.movieName}`, row.director, row.rating, row.movieReview, row.language, row.category, row.date]);
        });
  
        // Create workbook and worksheet
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Movie Data');
    
        // Set header row style
        const headerStyle = {
            font: {
            bold: true,
            },
            alignment: {
            horizontal: 'center',
            vertical: 'middle',
            },
        };
        const headerRow = worksheet.addRow(movieData[0]);
        headerRow.eachCell((cell) => {
            cell.font = headerStyle.font;
            cell.alignment = headerStyle.alignment;
        });
  
        // Add data rows
        movieData.slice(1).forEach((row) => {
            worksheet.addRow(row);
        });
    
        worksheet.getColumn(1).width = 35;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(3).width = 15;
        worksheet.getColumn(4).width = 40;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 15;
        worksheet.getColumn(7).width = 15;
  
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=MovieGram.xlsx');
    
        // Send workbook as response
        workbook.xlsx.write(res).then(() => {
            res.end();
        });
    });
});
  
  // post a watchlist movie (original)
// app.post('/api/watchlist/add', (req, res) => {
//     const token = req.cookies.access_token;

//     jwt.verify(token, "jwtkey", (err,userInfo) => {
//         if (!token) {
//             console.log(err);
//             return res.status(401).json("Not authenticated");
//         }
//         console.log(req.cookies);
//         console.log(token);

//         const movieName = req.body.movieName;
//         console.log(userInfo);
//         const language = req.body.language;
//         const year = req.body.year;
//         console.log(year);
//         const ndate = new Date();
//         const date = ndate.toISOString().slice(0, 19).replace('T', ' ');

//         const query = `INSERT INTO watchlist (movieName,u_id,date, language, year) VALUES (?)`;
//         const values = [
//             movieName,
//             userInfo.id,
//             date,
//             language,
//             year,
//         ];

//         console.log(values);

//         db.query(query,[values], (err, data) => {
//             if (err) {
//                 return res.status(500).json(err);
//             }
    
//             res.status(200).json(data);
//         });
//     }); 
// });

// new post a watchlist movie
app.post('/api/watchlist/add', (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json("Not authenticated");
    }
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        console.log(err);
        return res.status(401).json("Invalid token");
      }
  
      const movieName = req.body.movieName;
      const language = req.body.language;
      const year = req.body.year;
      const ndate = new Date();
      const date = ndate.toISOString().slice(0, 19).replace('T', ' ');
  
      const query = `INSERT INTO watchlist (movieName, u_id, date, language, year) VALUES (?)`;
      const values = [
        movieName,
        userInfo.id,
        date,
        language,
        year,
      ];
  
      db.query(query, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err);
        }
  
        res.status(200).json(data);
      });
    });
});
  
// get all watchlist movies for a user
// app.get("/api/your/watchlist/:id", (req,res) => {
//     const id = req.params.id;

//     const q = "SELECT * FROM watchlist WHERE u_id = ?"

//     db.query(q,[id], (err,data) => {
//         if (err) {
//             return res.status(500).json(err);
//         }
        
//         return res.status(200).json(data);
//     });
// });

// get all watchlist movies for a user (with search query)
app.get("/api/your/watchlist/:id", (req, res) => {
  const userId = req.params.id;
  const searchQuery = req.query.search; // Retrieve the search query parameter

  let query = `
    SELECT * 
    FROM watchlist 
    WHERE u_id = ?`;
  
  const values = [userId];

  if (searchQuery) {
    query += `
      AND (movieName LIKE ? OR year LIKE ? OR language LIKE ?)`;
    values.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
  }

  query += `ORDER BY date ASC`;

  db.query(query, values, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(data);
  });
});

// update watchlist movie to watched/unwatched
app.put('/api/watchlist/update/watched/:id', (req, res) => {
  const id = req.params.id;
  const watched = req.body.watched;

  const q = 'UPDATE watchlist SET watched = ? WHERE id = ?';

  db.query(q, [watched, id], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.json('Watched status has been updated');
  });
});

// add Movie data into excel file
app.get('/api/movie-watchlist-data/:id', (req, res) => {
  const id = req.params.id;

  const q = 'SELECT * FROM watchlist WHERE u_id = ? ORDER BY date ASC';

  // Fetch data from database
  db.query(q, [id], (error, data) => {
      if (error) throw error;
      let movieData = [['Movie Name', 'Year', 'Language', 'Date Added', 'Watched']];
      data.forEach((row, index) => {
          movieData.push([`${index + 1}) ${row.movieName}`, row.year, row.language, row.date, row.watched]);
      });

      // Create workbook and worksheet
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Movie Watchlist');
  
      // Set header row style
      const headerStyle = {
          font: {
          bold: true,
          },
          alignment: {
          horizontal: 'center',
          vertical: 'middle',
          },
      };
      const headerRow = worksheet.addRow(movieData[0]);
      headerRow.eachCell((cell) => {
          cell.font = headerStyle.font;
          cell.alignment = headerStyle.alignment;
      });

      // Add data rows
      movieData.slice(1).forEach((row) => {
          worksheet.addRow(row);
      });
  
      worksheet.getColumn(1).width = 35;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 15;
      worksheet.getColumn(4).width = 40;
      worksheet.getColumn(5).width = 15;

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=MovieGram.xlsx');
  
      // Send workbook as response
      workbook.xlsx.write(res).then(() => {
          res.end();
      });
  });
});

// delete watchlist movie
app.delete("/api/watchlist/delete/:id", (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json("Not authenticated");
  }

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }

    const movieId = req.params.id;
    // const movieId = req.params.movieName;
    const q = "DELETE FROM watchlist WHERE id = ? AND u_id = ?";

    db.query(q, [movieId, userInfo.id], (err, data) => {
      if (err) {
        return res.status(403).json("You can only delete your movies");
      }

      return res.json("Movie has been deleted");
    });
  });
});

// get single watchlist data
app.get("/api/watchlist/movie/:id", (req,res) => {
  const movieId = req.params.id;

  const q = "SELECT watchlist.*, users.username FROM watchlist JOIN users ON watchlist.u_id = users.id WHERE watchlist.id = ?";

  db.query(q,[movieId], (err,data) => {
      if (err) {
          return res.status(500).json(err);
      }

      return res.status(200).json(data[0]);
  });
});

// update a watchlist movie 
app.put("/api/update/watchlist/:id", (req, res) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json("Not authenticated");
  }

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }
    const id = req.params.id;
    const { movieName, language, year } = req.body;
    console.log(movieName)

    let q = "UPDATE watchlist SET";
    let values = [];

    if (movieName) {
      q += " movieName = ?,";
      values.push(movieName);
    }

    if (language) {
      q += " language = ?,";
      values.push(language);
    }

    if (year) {
      q += " year = ?,";
      values.push(year);
    }

    q = q.slice(0, -1);

    q += " WHERE id = ?";

    values.push(id);

    db.query(q, [...values], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res.json("User has been updated");
    });
  });
});

// get total movies in watchlist by one user
app.get("/api/watched/total/movies/:id", (req,res) => {
  const id = req.params.id;
  // console.log(id)

  const q = "SELECT COUNT(*) AS watchedTotal from watchlist WHERE u_id = ?";

  db.query(q,[id], (err,data) => {
      if (err) {
          return res.status(500).json(err);
      }


      return res.status(200).json(data[0].watchedTotal);
  });
});

// get movie count for each language in watchlist of a user
app.get("/api/count/language/watched/movies/:id", (req,res) => {
  const id = req.params.id;
  // console.log(id)

  const q = "SELECT language, COUNT(*) AS count from watchlist WHERE u_id = ? GROUP BY language";

  db.query(q,[id], (err,data) => {
      if (err) {
          return res.status(500).json(err);
      }

      // const totalMoviesWatched = data[0].totalMoviesWatched;
      
      return res.status(200).json(data);
  });
});

// get number of watched movies (1) from the watchlist table
app.get("/api/watchlist/watched_count/:id", (req,res) => {
  const id = req.params.id;
  // console.log(id)

  const q = "SELECT COUNT(*) AS watched_count from watchlist WHERE u_id = ? AND watched = 1";
  console.log(id);

  db.query(q,[id], (err,data) => {
      if (err) {
          return res.status(500).json(err);
      }

      // const totalMoviesWatched = data[0].totalMoviesWatched;
      
      return res.status(200).json(data[0].watched_count);
  });
});

// run when working locally
// app.listen(2030, () => {
//     console.log("running on port 2030");
// })
