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
