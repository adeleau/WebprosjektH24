import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { createHashHistory } from "history";
import SeriesService from "../services/series-service";
import AngelService from "../services/angel-service";
import type { Angel } from "../services/angel-service";
import { Navbar, Leftbar, Footer } from "./other-components";
import Cookies from "js-cookie";
import { User } from "../services/user-service";

const history = createHashHistory();

//samme oppsett som for både register og login
//Joshi,G.(03.2023), Building a System for User Registration and Login using TypeScript (Part 2 ), Building by learning: https://gauravjoshi.hashnode.dev/building-a-system-for-user-registration-and-login-using-typescript-part-2
export const SeriesList: React.FC<{}> = () => {
  const { series_id } = useParams<{ series_id: string }>();
  const [angels, setAngels] = useState<Angel[]>([]);
  const [seriesName, setSeriesName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [angelCount, setAngelCount] = useState<number | null>(null);
  useEffect(() => {
    if (!series_id) return;

    // Fetch angels in the series
    AngelService.getBySeries(Number(series_id))
      .then((data) => {
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setAngels(sortedData);
      })
      .catch((err) => setError("Error getting angels: " + err.message));

    // Fetch series name
    SeriesService.getName(Number(series_id))
      .then((name) => setSeriesName(name))
      .catch((err) => setError("Error getting series name: " + err.message));

    // Fetch angel count
    AngelService.getAngelCount(Number(series_id))
      .then((count) => setAngelCount(count))
      .catch((err) => setError("Error getting angel count: " + err.message));
    
      // Fetch user from cookies
      //Bruker Cookies for å se hvem som er logget inn og begrense brukertilgang til kun admin
      //ref src: 6,7
    const userCookie = Cookies.get("user");
    try {
      if (userCookie && userCookie.startsWith("{") && userCookie.endsWith("}")) {
        const parsedUser = JSON.parse(userCookie) as User;
        setUser(parsedUser);
      } else {
        setUser(null); // No valid user data in cookies
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setUser(null); // Treat as not logged in if parsing fails
    }
  }, [series_id]);

  const handleDeleteSeries = () => {
    if (!series_id) return;

    if (!user || user.role !== "admin") {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${seriesName}"?`)) {
      return;
    }

    SeriesService.deleteSeries(Number(series_id))
      .then(() => {
        history.push("/"); // Redirect to the home page after deletion
      })
      .catch((err) => {
        console.error("Error deleting series:", err.message);
        setError("Error deleting series: " + err.message);
      });
  };

  //we have been using the same setup for every file with the navbar
  return (
    <div>
      <Navbar />
      <Leftbar />

      {error && <div className="error-message">{error}</div>}

      {seriesName ? (
        <div className="series-page">
          <h1>{seriesName}</h1>
          <div className="angel-cards">
            {angels.length > 0 ? (
              angels.map((angel) => (
                <div key={angel.angel_id} className="angel-card">
                  <Link
                    to={`/angels/${angel.angel_id}`}
                    className="angel-card-link"
                  >
                    <img
                      src={angel.image}
                      alt={angel.name}
                      className="angel-card-image"
                    />
                    <h3>{angel.name}</h3>
                  </Link>
                </div>
              ))
            ) : (
              <p>No angels found in this series.</p>
            )}
          </div>

          {/* Conditionally render buttons for admin users */}
          {user && user.role === "admin" ? (
            <div className="admin-actions">
              <button
                className="btn-create-angel" 
                onClick={() => history.push(`/series/${series_id}/new`)}
              >
                New Sonny Angel
              </button>
              <button
                className="btn-delete-series"
                onClick={handleDeleteSeries}
              >
                Delete Series
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <p>Loading series information...</p>
      )}
      <p className="number-of-angels">
        Number of angels in {seriesName}: {angelCount}
      </p>
      <Footer />
    </div>
  );
};