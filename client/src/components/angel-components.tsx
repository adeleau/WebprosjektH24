import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
import { createHashHistory } from 'history';

import AngelService from "../services/angel-service";
import type { Angel } from "../services/angel-service";
import AngelCommentService from "../services/angelcomment-service";
import type { AngelComment } from "../services/angelcomment-service";

import SeriesService from "../services/series-service";
import type { Series } from "../services/series-service";

// import UserService from "../services/user-service";
// import type { User } from "../services/user-service";

import { Navbar, Leftbar, Footer } from "./other-components";
const history = createHashHistory();

export const MasterList: React.FC = () => {
    const [angels, setAngels] = useState<Angel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
    useEffect(() => {
      AngelService.getAll()
        .then((data) => setAngels(data))
        .catch((err) => setError(`Error fetching angels: ${err.message}`));
    }, []);
  
    // Group angels by their starting letter
    const groupedAngels = angels.reduce((acc: { [key: string]: Angel[] }, angel) => {
      const firstLetter = angel.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(angel);
      return acc;
    }, {});
  
    const handleScrollToSection = (letter: string) => {
      const section = sectionRefs.current[letter];
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };
  
    return (
      <>
        <Navbar />
        <Leftbar />
    
        <div className="angel-master-list">
          <h2>Angel Master List</h2>
          <hr className="masterlist-divider" />
    
          {error && <div className="error-message">{error}</div>}
    
          {/* Alphabet Links */}
          <div className="alphabet-links">
            {Object.keys(groupedAngels)
              .sort()
              .map((letter) => (
                <button 
                  key={letter}
                  onClick={() => handleScrollToSection(letter)}
                  className="alphabet-link"
                >
                  {letter}
                </button>
              ))}
          </div>
    
          {/* List of Angels by Alphabet */}
          <div className="angel-list">
            {Object.keys(groupedAngels)
              .sort()
              .map((letter) => (
                <div
                  key={letter}
                  id={letter}
                  className="angel-group"
                  ref={(el) => (sectionRefs.current[letter] = el)}
                >
                  <h2>{letter}</h2>
                  <ul>
                    {groupedAngels[letter].map((angel) => (
                      <li key={angel.angel_id}>
                        <Link to={`/angels/${angel.angel_id}`} className="angel-link">
                          {angel.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
        <Footer></Footer>
      </>
    );
};

//bruker vi?
// export const AngelList: React.FC<{}> = () => {
//     const [angels, setAngels] = useState<Array<Angel>>([]);
//     const [error, setError] = useState<string | null>(null);
  
//     useEffect(() => {
//       AngelService.getAll()
//         .then((data) => {setAngels(data)})
//         .catch((err) => setError('Error getting angels: ' + err.message));
//     }, []);
  
//     return (
//       <>
//         {error && <div className="danger">{error}</div>}
//         <div title="Sonny Angel Collection">
//           {angels.map((angel) => (
//             <ul key={angel.angel_id}>
//               <li>
//                 <Link to={`/angels/${angel.angel_id}`}>{angel.name}</Link>
//               </li>
//             </ul>
//           ))}
//         </div>
        
//       </>
//     );
// };

export const AngelDetails: React.FC<{}> = () => {
  const { angel_id } = useParams<{ angel_id: string }>();
  const history = useHistory();
    
  const [angel, setAngel] = useState<Angel>(); 
  const [series, setSeries] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const [content, setContent] = useState('');
  const [user_id, setUserId] = useState(0);

  const currentUser = useParams<{ user_id: string}>();

  const [comment, setComment] = useState<AngelComment>({
    angelcomment_id: 0,
    angel_id: 0,
    user_id: 0,
    content: '',
    created_at: new Date(),
    updated_at: new Date(),
  });
  
    useEffect(() => {
      // Fetch angel details by angel_id
      AngelService.get(Number(angel_id))
        .then((data) => {
          setAngel(data);
          // Fetch the series name using angel.series_id
          SeriesService.getName(data.series_id)
            .then((name) => setSeries(name))
            .catch((err) => setError('Error getting series name: ' + err.message));
        })
        .catch((err) => setError('Error getting angel: ' + err.message));
    }, [angel_id]);
  
    //View count 
    useEffect(() => {
      if(angel) {
        let tempAngel: Angel = angel;
        tempAngel.views = tempAngel.views + 1;
        AngelService.updateAngel(tempAngel);
        setAngel(tempAngel);
      }
    },  [angel])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setComment((prevComment) => ({
          ...prevComment,
          [name]: value
        }));
    };

    const handlePostComment = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!comment.content || !comment.content.trim()) {
        setError("Comment cannot be empty.");
        return;
      }

      const angel_id = angel?.angel_id;  // Replace with actual angel ID from the state
      if (!angel_id) {
        setError("Angel not found.");
        return;
      }

     const userId = Number(currentUser);  // Assuming currentUser is correctly available
      if (!userId) {
        setError("User not logged in.");
        return;
      }

      AngelCommentService
        .addAngelComment(angel_id, userId, comment.content)
        .then((angelcomment_id) => {
          console.log("Comment added successfully with ID:", angelcomment_id);
          history.push(`/angels/${angel_id}`);
        })
        .catch((error) => {
          console.error("Error adding comment:", error);
          setError("Failed to post comment.");
        });
      
    }; 

    return (
    <>
      <Navbar/>
      <Leftbar/>
  
      {/* "Go to Masterlist" button on the far left, outside the post */}
      <button className="back-button" onClick={() => history.push('/masterlist')}>View all angels</button>
  
      {angel ? (
        <div className="angel-details">
          {/* Floating Edit button in the top right corner */}
          <button
            className="edit-button-top-right"
            onClick={() => history.push(`/angels/${angel.angel_id}/edit`)}
          >
            Edit
          </button>
          { /* Send-knapp */ }
           {/* <a href="mailto:example@gmail.com? subject=Look%20at%20this%20Sonny%20Angel!&body=LINKEN">
            <button className="send-button">Send</button>  
           </a> */}
            
    
          {error && <div className="error-message">{error}</div>}
  
          <div className="header-container">
            <h2 className="angel-header">{angel.name}</h2>
          </div>
  
          <div className="header-separator"></div>
  
          <div className="details-content">
            {/* Text details (left) */}
            <div className="details-text">
              <div className="detail-row series-row">
                <strong>Series: </strong>
                <Link to={`/series/${angel.series_id}`} className="series-link">
                  {series}
                </Link>
              </div>
              <div className="detail-row">
                <strong>Description: </strong><span>{angel.description}</span>
              </div>
              <div className="detail-row">
                <strong>Release year: </strong><span>{angel.release_year}</span>
              </div>
            </div>
  
            {/* Enlarged, square image (right) */}
            {angel.image && (
              <div className="image-container">
                <img
                  src={angel.image}
                  alt={angel.name}
                  className="angel-image"
                />
              </div>
            )}
          </div>
  
          {/* Views, created at, updated at and history row */}
          <div className="info-row">
            <span className="info-item">Views: {angel.views}</span>
            <span className="info-item">Created at: {angel.created_at}</span>
            <span className="info-item">Last updated at: {angel.updated_at}</span>
            <button className="history-button" onClick={() => history.push(angel_id+'/history')}>History</button>
          </div>
  
          {/* Comment Section */}
          <div className="comment-section">
            <h2>Comments</h2>
            <div className="comments">
              her skal alle comments listes
            </div>
            <div className="comment-input">
              <div className="form-group">
                <input
                  type="text"
                  placeholder = "Post a comment..."
                  value={comment.content}
                  className="form-control"
                  id="comment-input"
                  name="comment-input"
                  onChange={handleInputChange}
                />
              </div>
              <button className="post-button" onClick={handlePostComment}>Post</button>
            </div>
          </div>
        </div>
      ) : null}
  
      <Footer/>
    </>
  );  
}

export const AngelNew: React.FC<{}> = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [release_year, setReleaseYear] = useState(0);
  const [user_id, setUserId] = useState(0);
  const [series_id, setSeriesId] = useState(0);

  //const series: Series = ;
  const angel: Angel = ({
    angel_id: 0,
    name: '',
    description: '',
    image: '',
    release_year: 0,
    views: 0,
    user_id: 0,
    created_at: new Date(),
    updated_at: new Date(),
    series_id: 0,
  });
  // DETTE FUNKER ETTER VI HAR LAGT TIL USER-SERVICE
  // const { user_id: routeUserId } = useParams<{ user_id: string }>();
  // const [userList, setUserList] = useState<Users[]>([]);
  // const [selectedUserId, setSelectedUserId] = useState<number>(Number(routeUserId));
  // useEffect(() => {
  //   // Hent alle serier fra databasen ved å bruke SeriesService
  //   UserService.getAll()
  //     .then((data) => {
  //       setUserList(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching users:", error);
  //     });
  // }, []);

  const { series_id: routeSeriesId } = useParams<{ series_id: string }>();
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number>(Number(routeSeriesId));
  useEffect(() => {
    // Hent alle serier fra databasen ved å bruke SeriesService
    SeriesService.getAll()
      .then((data) => {
        setSeriesList(data);
      })
      .catch((error) => {
        console.error("Error fetching series:", error);
      });
  }, []);
  const [error, setError] = useState<string | null>(null);

  const history = useHistory();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'description') {
      setDescription(value);
    } else if (name === 'image') {
      setImage(value);
    } else if (name === 'release_year') {
      setReleaseYear(Number(value));
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'user_id') {
      setUserId(Number(value));
      // BYTT TIL DENNE ETTER Å HA LAGT TIL USER-SERVICE
      // setSelectedUserId(Number(value));
    } else if (name === 'series_id') {
      setSelectedSeriesId(Number(value));
    }
  };

  const handleCreateAngel = () => {
    const created_at = new Date().toISOString().slice(0,19).replace('T',' '); // vet ikke om denne kanskje lagrer dato for når bruker trykker på create post istedet for post
    const newAngel: Angel = {
      name: name,
      description: description,
      image: image,
      release_year: release_year,
      views: 0, 
      user_id: user_id, //endre til selectedUserId etterpå
      created_at: new Date(),
      series_id: selectedSeriesId,
    };
    console.log('Attempting to create angel with:'+ newAngel, ); //legger inn dette for å finne feilen
    AngelService                                                //skal legge til et annet format for tid, siden dette kan være en av årsakene til at den ikke vil create og update
      .createAngel(newAngel)
      .then((angel_id) => {
        history.push(`/angels/${angel_id}`); // Redirect to the new post page
      })
      .catch((error) => setError('Error creating angel: ' + error.message));
  };

  return (
    <>
      <Navbar/>
      <Leftbar/>
      <div className="card">
        {error && <div className="error-message">{error}</div>}

        <h2>New Angel</h2>
        
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="user_id">By:</label>
          <select
            id="user_id"
            name="user_id"
            value={user_id/*selectedUserId - bytt til denne etterpå*/}
            onChange={handleSelectChange}
            className="form-control"
          >
            <option value="">Select a user</option>
            <option value="2">Jub</option>
            {/* BYTT TIL DETTE ETTERPÅ
            {userList.map((users) => {
              return (
                <option
                  key={users.user_id}
                  value={users.user_id}
                >
                  {users.username}
                </option>
              )
            })} */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="series_id">Series:</label>
          <select
            id="series_id"
            name="series_id"
            value={selectedSeriesId}
            onChange={handleSelectChange}
            className="form-control"
          >
            {seriesList.map((series) => {
              return (
                <option
                  key={series.series_id}
                  value={series.series_id}                >
                  {series.name}
                </option>
              )
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            rows={10}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="release_year">Release year:</label>
          <textarea
            id="release_year"
            name="release_year"
            value={Number(release_year)}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="img">Image URL:</label>
          <textarea
            id="image" //endrer begge fra img til image for å prøve å endre bilde på edit
            name="image"
            value={image}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <button 
          className="btn btn-create" 
          onClick={handleCreateAngel}
        >
          Create Angel
        </button>
      </div>
      <Footer/>
    </>
  );
};

export const AngelEdit: React.FC<{}> = () => {
    const [angel, setAngel] = useState<Angel>({
     angel_id: 0,
     name: '',
     description: '',
     image: '',
     release_year: 0,
     views: 0,
     user_id: 0,
     created_at: new Date(),
     updated_at: new Date(),
     series_id: 0
   });
   const [error, setError] = useState<string | null>(null);
   const { angel_id } = useParams<{ angel_id: string }>();
   const history = useHistory();
 
   useEffect(() => {
     AngelService
       .get(Number(angel_id))
       .then((fetchedAngel) => setAngel(fetchedAngel))
       .catch((err) => setError('Error getting angel: ' + err.message));
   }, [angel_id]);
 
   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = event.target;
     setAngel((prevAngel) => ({
       ...prevAngel,
       [name]: value
     }));
   };
 
   const handleSave = () => {
    //  const updated_at = new Date().toISOString().slice(0,19).replace('T',' '); // samme som jeg gjorde med create post, gjør samme med tid her også
    //  const newAngel: Angel = {
    //   angel_id: 0, 
    //   name: angelName,
    //   description: description,
    //   image: image,
    //   release_year: release_year,
    //   views: 0,
    //   user_id: user_id, //endre til selectedUserId
    //   created_at: created_at,
    //   updated_at: new Date(),
    //   series_id: selectedSeriesId,
    // };
     AngelService
       .updateAngel(angel)
       .then(() => {
         history.push('/angels/' + angel.angel_id);
       })
       .catch((error) => setError('Error updating angel: ' + error.message));
   };
 
   const handleDelete = () => {
      const seriesId = angel.series_id;
     AngelService
       .deleteAngel(angel.angel_id)
       .then(() => {
         history.push('/series/' + seriesId); // Redirect to angel list after deletion
       })
       .catch((error) => setError('Error deleting angel: ' + error.message));
   };
 
   return (
     <>
     <Navbar/>
     <Leftbar/>  
     <div className="card">
       {error && <div className="error-message">{error}</div>}
 
       <h2>Edit angel</h2>
 
       <div className="form-group">
         <label htmlFor="name">Name:</label>
         <input
           id="name"
           name="name"
           type="text"
           value={angel.name}
           onChange={handleInputChange}
           className="form-control"
         />
       </div>
 
       <div className="form-group">
         <label htmlFor="description">Descripton:</label>
         <textarea
           id="descripton"
           name="description"
           value={angel.description}
           onChange={handleInputChange}
           rows={10}
           className="form-control"
         />
       </div>

       <div className="form-group">
         <label htmlFor="release_year">Release year:</label>
         <textarea
           id="release_year"
           name="release_year"
           value={angel.release_year}
           onChange={handleInputChange}
           rows={10}
           className="form-control"
         />
       </div>

      <div className="form-group">
        <label htmlFor="img">Image URL:</label>
        <textarea
          id="image" //endrer begge fra img til image for å prøve å endre bilde på edit
          name="image"
          value={angel.image}
          onChange={handleInputChange}
          rows={10}
          className="form-control"
        />
      </div>
 
       <div className="form-actions">
         <button className="btn btn-success" onClick={handleSave}>
           Save
         </button>
         <button className="btn btn-danger" onClick={handleDelete}>
           Delete
         </button>
       </div>
     </div>
     <Footer/>
     </>
   );
}
