import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

export function useGoogleCalendar() {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  const [tokenClient, setTokenClient] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Load Google API client and GIS OAuth2 client
  useEffect(() => {
    function initializeGapiClient() {
      gapi.client
        .init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        })
        .then(() => {
          console.log("Google API client initialized");
        })
        .catch((err) => console.error("Error initializing GAPI client:", err));
    }

    gapi.load("client", initializeGapiClient);

    // Initialize GIS OAuth2 token client
    const tokenClientInstance = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          console.error("Token error:", tokenResponse.error);
          return;
        }
        console.log("Received access token");
        setAccessToken(tokenResponse.access_token);
      },
    });

    setTokenClient(tokenClientInstance);
  }, [API_KEY, CLIENT_ID]);

  // Request a token (prompts user if needed)
  const ensureAccessToken = () =>
    new Promise((resolve, reject) => {
      if (accessToken) {
        resolve(accessToken);
        return;
      }

      if (!tokenClient) {
        reject("Token client not initialized yet.");
        return;
      }

      tokenClient.callback = (resp) => {
        if (resp.error) {
          console.error("Token error:", resp.error);
          reject(resp.error);
        } else {
          console.log("Token obtained:");
          setAccessToken(resp.access_token);
          resolve(resp.access_token);
        }
      };

      tokenClient.requestAccessToken({ prompt: "" }); // silent if already granted
    });

  // Add event to Google Calendar
  function addEventToCalendar(event) {
    return ensureAccessToken()
      .then(() => {
        return gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });
      })
      .then((response) => {
        console.log("Event successfully created:", response);
        return response;
      })
      .catch((error) => {
        console.error("Error creating event:", error);
        throw error;
      });
  }

  return { addEventToCalendar };
}
