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
            "id",
            "title",
            "date",
            "start_time",
            "end_time",
            "location",
            "film_title",
            "film_director",
            "film_year",
            "film_img_url",
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
describe("GET /api/events/:id", () => {
  test("200: responds with a single event object when given a valid ID", () => {
    return request(app)
      .get("/api/events/1")
      .expect(200)
      .then(({ body }) => {
        const { event } = body;
        expect(body.event).toHaveProperty("id");
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
  test("201: adds a signup and responds with the signup object", () => {
    return request(app)
      .post("/api/signups")
      .send({ user_id: 1, event_id: 1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.signup).toHaveProperty("id");
        expect(body.signup.user_id).toBe(1);
        expect(body.signup.event_id).toBe(1);
      });
  });

  test("400: responds with bad request if body is missing fields", () => {
    return request(app)
      .post("/api/signups")
      .send({ user_id: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: missing user_id or event_id");
      });
  });

  test("404: responds with not found if user_id or event_id doesn’t exist", () => {
    return request(app)
      .post("/api/signups")
      .send({ user_id: 999, event_id: 1 })
      .expect(404);
  });

  test("409: responds with conflict if signup already exists", () => {
    return request(app)
      .post("/api/signups")
      .send({ user_id: 1, event_id: 1 })
      .then(() => {
        return request(app)
          .post("/api/signups")
          .send({ user_id: 1, event_id: 1 })
          .expect(409)
          .then(({ body }) => {
            expect(body.msg).toBe("Already signed up");
          });
      });
  });
});
