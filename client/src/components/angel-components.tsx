import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
import { createHashHistory } from 'history';

import AngelService from "../services/angel-service";
import type { Angel } from "../services/angel-service";
import AngelCommentService from "../services/angelcomment-service";
import type { AngelComment } from "../services/angelcomment-service";

import SeriesService from "../services/series-service";

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

export const AngelList: React.FC<{}> = () => {
    const [angels, setAngels] = useState<Array<Angel>>([]);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      AngelService.getAll()
        .then((data) => {setAngels(data)})
        .catch((err) => setError('Error getting angels: ' + err.message));
    }, []);
  
    return (
      <>
        {error && <div className="danger">{error}</div>}
        <div title="Sonny Angel Collection">
          {angels.map((angel) => (
            <ul key={angel.angel_id}>
              <li>
                <Link to={`/angels/${angel.angel_id}`}>{angel.name}</Link>
              </li>
            </ul>
          ))}
        </div>
        <button className="button-success" onClick={() => history.push('/angels/new')}>
          New Sonny Angel
        </button>
      </>
    );
};

export const AngelDetails: React.FC<{}> = () => {
    const { angel_id } = useParams<{ angel_id: string }>();
    const history = useHistory();
    
    const [angel, setAngel] = useState<Angel>();
    const [series, setSeries] = useState<string>();
    const [error, setError] = useState<string | null>(null);

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

    const handlePostComment = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const updated_at = new Date().toISOString().slice(0,19).replace('T',' '); // samme som jeg gjorde med create post, gjør samme med tid her også
        AngelCommentService
            .addAngelComment(comment)
            .then(() => {
                history.push('/angels/' + angel.angel_id);
        })
        .catch((error) => setError('Error updating angel: ' + error.message));
   };
  
    return (
      <>
  
  <Navbar></Navbar>
  <Leftbar></Leftbar>
        <button className="back-button" onClick={() => history.push('/masterlist')}>Go to Masterlist</button>
        {angel ? (

          <div className="angel-details">
            {error && <div className="error-message">{error}</div>}
            
              <div className="header-container">
              <h2 className="angel-header">{angel.name}</h2>
              <button
                className="edit-button"
                onClick={() => history.push(`/angels/${angel.angel_id}/edit`)} 
                >Edit
              </button>
            </div>
            
            <div className="header-separator"></div>
  
  
            <div className="details-content">
              
              {/* Text details (left) */}
              <div className="details-text">
                <div className="detail-row">
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
                <div className="angel-info">
                    <div className="detail-row">
                        <strong>Views: </strong><span>{angel.views}</span>
                    </div>
                    <div className="detail-row">
                        {/* <strong>User: </strong><span>{AngelService.getUsername(angel.user_id)}</span> */}
                    </div>
                    <div className="detail-row">
                        <strong>Created at: </strong><span>{angel.created_at}</span>
                    </div>
                </div>
              </div>
              
              {/* Image (right) */}
              {angel.image && (
                <div className="image-container">
                  <img
                    src={angel.image}
                    alt={angel.name}
                    className="angel-image"
                    style={{maxHeight: 200}}
                  />
                </div>
              )}
            </div>
            <div className="comment-section">
            <h2>Comments</h2>
                <div className="comments">

                </div>
                <div className="comment-input">
                    <div className="form-group">
                        <input
                            id="comment-input"
                            name="comment-input"
                            type="text"
                            placeholder="Post a comment..."
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                    <button className="post-button" onClick={handlePostComment}>Post</button>
                </div> 
            </div>
          </div>
        ) : null}
        <Footer></Footer>
  
      </>
    );
}

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
     const updated_at = new Date().toISOString().slice(0,19).replace('T',' '); // samme som jeg gjorde med create post, gjør samme med tid her også
     AngelService
       .updateAngel(angel)
       .then(() => {
         history.push('/angels/' + angel.angel_id);
       })
       .catch((error) => setError('Error updating angel: ' + error.message));
   };
 
   const handleDelete = () => {
     AngelService
       .deleteAngel(angel.angel_id)
       .then(() => {
         history.push('/angels'); // Redirect to angel list after deletion
       })
       .catch((error) => setError('Error deleting angel: ' + error.message));
   };
 
   return (
     <>
     <Navbar></Navbar>
     <Leftbar></Leftbar>
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
         <label htmlFor="image">Image URL:</label>
         <textarea
           id="image"
           name="image"
           value={angel.image}
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
 
       <div className="form-actions">
         <button className="btn btn-success" onClick={handleSave}>
           Save
         </button>
         <button className="btn btn-danger" onClick={handleDelete}>
           Delete
         </button>
       </div>
     </div>
     </>
   );
}
  