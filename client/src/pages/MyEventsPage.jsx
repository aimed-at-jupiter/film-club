import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserSignups } from "../api/getUserSignups";
import EventCard from "../components/EventCard";

function MyEventsPage() {
  const { token, user } = useAuth();
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserSignups(token)
      .then((data) => {
        setSignups(data);
      })
      .catch((err) => {
        console.error("Error fetching user signups:", err);
        setError(err.msg || "Failed to load your events.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-center">
        {user ? `${user.username}'s events` : "My Events"}
      </h3>

      {signups.length === 0 ? (
        <p className="text-center text-muted">
          You haven’t signed up for any events yet.
        </p>
      ) : (
        <div className="row">
          {signups.map((signup) => (
            <div className="col-md-4 mb-4" key={signup.signup_id}>
              <EventCard event={signup} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEventsPage;
