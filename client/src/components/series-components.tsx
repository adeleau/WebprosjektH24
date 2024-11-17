import { Link, useParams } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import { createHashHistory } from "history";
import SeriesService from "../services/series-service";
import AngelService from "../services/angel-service";
import type { Angel } from "../services/angel-service";
import { Navbar, Leftbar, Footer } from "./other-components";
import Cookies from "js-cookie"; // Import js-cookie
import { User } from "../services/user-service";

const history = createHashHistory();

export const SeriesList: React.FC<{}> = () => {
  const { series_id } = useParams<{ series_id: string }>();
  const [angels, setAngels] = useState<Angel[]>([]);
  const [seriesName, setSeriesName] = useState<string | null>(null);
  const [user, setUser] = useState<User>(); // State to store user info
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    // Fetch user from cookies (New Code)
    const userCookie = Cookies.get("user"); // Get the user cookie
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie) as User; // Parse the cookie value
      setUser(parsedUser); // Set user state
    }
  }, [series_id]);

  return (
    <div>
      <Navbar />
      <Leftbar />

      {error && <div className="error-message">{error}</div>}

      {seriesName ? (
        <div className="series-page">
          <h1>{seriesName}</h1>
          <div className="angel-cards">
            {angels.map((angel) => (
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
            ))}
          </div>
          {/* Conditionally render button for admin users (New Code) */}
          {user && user.role === "admin" && (
            <button
              className="btn-create-angel"
              onClick={() => history.push(`/series/${series_id}/new`)}
            >
              New Sonny Angel
            </button>
          )}
        </div>
      ) : null}

      <Footer></Footer>
    </div>
  );
};
