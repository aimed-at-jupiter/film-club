const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/events", () => {
  test("200: Reponds with an object with the key of events and the value of an array of all event objects", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        const { events } = body;
        expect(Array.isArray(events)).toBe(true);
        expect(events.length).toBeGreaterThan(0);
        events.forEach((event) => {
          expect(Object.keys(event)).toEqual([
            "event_id",
            "title",
            "date",
            "start_time",
            "end_time",
            "location",
            "film_title",
            "film_director",
            "film_year",
            "film_img_url",
            "film_writer",
            "film_plot",
            "film_genre",
            "film_actors",
            "film_runtime",
            "film_country",
            "film_language",
            "film_imdb_id",
            "event_type",
            "price",
            "created_at",
          ]);
          expect(typeof event.title).toBe("string");
          expect(typeof event.date).toBe("string");
          expect(typeof event.start_time).toBe("string");
          expect(typeof event.end_time).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.film_title).toBe("string");
          expect(typeof event.film_director).toBe("string");
          expect(typeof event.film_year).toBe("number");
          expect(typeof event.film_img_url).toBe("string");
          expect(typeof event.event_type).toBe("string");
          expect(typeof event.price).toBe("string");
          expect(typeof event.created_at).toBe("string");

          for (let i = 1; i < events.length; i++) {
            const prevDate = new Date(events[i - 1].date);
            const currDate = new Date(events[i].date);
            expect(prevDate <= currDate).toBe(true);

            events.forEach((event) => {
              expect(["discussion", "screening"]).toContain(event.event_type);
              expect(Number(event.price)).toBeGreaterThanOrEqual(0);
            });
          }
        });
      });
  });
});
describe("GET /api/events/:event_id", () => {
  test("200: responds with a single event object when given a valid ID", () => {
    return request(app)
      .get("/api/events/1")
      .expect(200)
      .then(({ body }) => {
        const { event } = body;
        expect(body.event).toHaveProperty("event_id");
        expect(body.event).toHaveProperty("title");
        expect(event.title).toBe("Drive (discussion)");
        expect(event.date).toBe("2026-01-03T00:00:00.000Z");
        expect(event.start_time).toBe("19:00:00");
        expect(event.end_time).toBe("20:00:00");
        expect(event.location).toBe("The Rising Sun");
        expect(event.film_title).toBe("Drive");
        expect(event.film_director).toBe("Nicolas Winding Refn");
        expect(event.film_year).toBe(2011);
      });
  });

  test("404: responds with not found for non-existent event ID", () => {
    return request(app)
      .get("/api/events/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });

  test("400: responds with bad request for invalid ID type", () => {
    return request(app)
      .get("/api/events/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("POST /api/signups", () => {
  let userToken;

  beforeEach(() => {
    return request(app)
      .post("/api/auth/login")
      .send({ email: "olive@example.com", password: "olive123" })
      .expect(200)
      .then(({ body }) => {
        userToken = body.token;
      });
  });

  test("401: responds with Unauthorized if no token provided", () => {
    return request(app)
      .post("/api/signups")
      .send({ event_id: 4 })
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Unauthorized");
      });
  });

  test("201: adds a signup and responds with the signup object", () => {
    return request(app)
      .post("/api/signups")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ event_id: 4 })
      .expect(201)
      .then(({ body }) => {
        expect(body.signup).toHaveProperty("signup_id", expect.any(Number));
        expect(body.signup.user_id).toBe(2);
        expect(body.signup.event_id).toBe(4);
      });
  });

  test("400: responds with bad request if body is missing fields", () => {
    return request(app)
      .post("/api/signups")
      .set("Authorization", `Bearer ${userToken}`)
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: missing event_id");
      });
  });

  test("404: responds with not found if event_id doesn’t exist", () => {
    return request(app)
      .post("/api/signups")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ event_id: 999 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User or event not found");
      });
  });

  test("409: responds with conflict if signup already exists", () => {
    return request(app)
      .post("/api/signups")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ event_id: 4 })
      .then(() => {
        return request(app)
          .post("/api/signups")
          .set("Authorization", `Bearer ${userToken}`)
          .send({ event_id: 4 })
          .expect(409)
          .then(({ body }) => {
            expect(body.msg).toBe("Already signed up");
          });
      });
  });
});

describe("POST /api/events", () => {
  let staffToken;

  beforeAll(() => {
    return request(app)
      .post("/api/auth/login")
      .send({ email: "admin@filmclub.com", password: "admin123" })
      .then(({ body }) => {
        staffToken = body.token;
      });
  });

  test("201: creates a new event, auto-generates title, and responds with the event object", () => {
    const newEvent = {
      date: "2026-06-15",
      start_time: "19:00",
      end_time: "22:00",
      location: "Cube Microplex",
      film_title: "Test Film",
      film_director: "Jane Doe",
      film_year: 2020,
      film_img_url: "",
      event_type: "screening",
      price: 10,
    };

    return request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(newEvent)
      .expect(201)
      .then(({ body }) => {
        const { event } = body;

        expect(event.title).toBe("Test Film (screening)");
        expect(event.date).toContain("2026-06-15");
        expect(event.start_time.startsWith("19:00")).toBe(true);
        expect(event.end_time.startsWith("22:00")).toBe(true);
        expect(event.location).toBe("Cube Microplex");
        expect(event.film_title).toBe("Test Film");
        expect(event.film_director).toBe("Jane Doe");
        expect(event.film_year).toBe(2020);
        expect(event.event_type).toBe("screening");
        expect(Number(event.price)).toBe(10);

        expect(event).toHaveProperty("event_id", expect.any(Number));
        expect(event).toHaveProperty("created_at", expect.any(String));
      });
  });

  test("400: responds with error when required fields are missing", () => {
    const badEvent = {
      location: "Cube Microplex",
      film_title: "Test Film",
      film_director: "Jane Doe",
      film_year: 2020,
      event_type: "screening",
      price: 10,
    };

    return request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(badEvent)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });

  test("400: responds with error for invalid event_type", () => {
    const badEvent = {
      date: "2026-07-01",
      start_time: "19:00",
      end_time: "20:00",
      location: "The Rising Sun",
      film_title: "Fake Film",
      film_director: "John Smith",
      film_year: 2020,
      film_img_url: "",
      event_type: "party", // invalid
      price: 0,
    };

    return request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(badEvent)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid event type");
      });
  });

  test("400: responds with error for invalid film_year", () => {
    const badEvent = {
      date: "2026-07-01",
      start_time: "19:00",
      end_time: "22:00",
      location: "Watershed",
      film_title: "Time Machine",
      film_director: "Future Director",
      film_year: 3000, // invalid year
      film_img_url: "",
      event_type: "screening",
      price: 10,
    };

    return request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(badEvent)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid film year");
      });
  });

  test("401: rejects event creation without a token", () => {
    const newEvent = {
      date: "2026-06-15",
      start_time: "19:00",
      end_time: "22:00",
      location: "Cube Microplex",
      film_title: "Unauthorized Film",
      film_director: "No One",
      film_year: 2020,
      event_type: "screening",
      price: 10,
    };

    return request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Unauthorized");
      });
  });
});

describe("POST /api/auth/register", () => {
  test("201: registers a new user and returns a JWT", () => {
    const newUser = {
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
    };

    return request(app)
      .post("/api/auth/register")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("token");
        expect(typeof body.token).toBe("string");
      });
  });

  test("400: responds with generic message if email already exists", () => {
    const duplicate = {
      username: "olive2",
      email: "olive@example.com",
      password: "duplicate123",
    };

    return request(app)
      .post("/api/auth/register")
      .send(duplicate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
});
