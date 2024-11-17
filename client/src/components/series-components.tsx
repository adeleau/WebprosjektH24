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

export const SeriesList: React.FC<{}> = () => {
  const { series_id } = useParams<{ series_id: string }>();
  const [angels, setAngels] = useState<Angel[]>([]);
  const [seriesName, setSeriesName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    // Fetch user from cookies
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie) as User;
      setUser(parsedUser);
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

          {/* Conditionally render button for admin users */}
          {user && user.role === "admin" ? (
            <button
              className="btn-create-angel"
              onClick={() => history.push(`/series/${series_id}/new`)}
            >
              New Sonny Angel
            </button>
          ) : (
            <></> // Render nothing when user is not admin
          )}
        </div>
      ) : (
        <p>Loading series information...</p>
      )}

      <Footer />
    </div>
  );
};
