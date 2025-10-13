import { useEffect } from "react";
import { gapi } from "gapi-script";

const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export function useGoogleCalendar() {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          console.log("Google API client initialized");
        })
        .catch((err) => {
          console.error("Error initializing Google API", err);
        });
    }

    gapi.load("client:auth2", start);
  }, [API_KEY, CLIENT_ID]);

  function signIn() {
    const auth = gapi.auth2.getAuthInstance();
    if (!auth.isSignedIn.get()) {
      return auth.signIn();
    }
    return Promise.resolve();
  }

  function addEventToCalendar(event) {
    return signIn()
      .then(() => {
        return gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });
      })
      .then((response) => {
        console.log("Event created:", response);
        return response;
      })
      .catch((error) => {
        console.error("Error creating event:", error);
        throw error;
      });
  }

  return { addEventToCalendar };
}
