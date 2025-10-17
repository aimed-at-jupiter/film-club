import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postSignup } from "../api/postSignup";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  const eventId = searchParams.get("event_id");

  useEffect(() => {
    if (eventId && token) {
      postSignup(eventId, token)
        .then(() => {
          console.log("User automatically signed up for event", eventId);
        })
        .catch((err) => {
          console.error("Auto-signup after payment failed:", err);
        });
    }
  }, [eventId, token]);

  return (
    <div className="container text-center mt-5">
      <h3>Payment successful!</h3>
      <p>Thank you for supporting Film Club.</p>
      {eventId && <p>You’ve been signed up for this screening.</p>}
    </div>
  );
}
