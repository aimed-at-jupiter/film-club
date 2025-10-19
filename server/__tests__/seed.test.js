const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Database seeding", () => {
  test("events table is seeded with all fields", () => {
    return db.query("SELECT * FROM events;").then(({ rows }) => {
      expect(rows.length).toBeGreaterThan(0);

      const event = rows[0];

      // Basic fields
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("event_type");
      expect(event).toHaveProperty("date");
      expect(event).toHaveProperty("start_time");
      expect(event).toHaveProperty("end_time");
      expect(event).toHaveProperty("location");
      expect(event).toHaveProperty("film_title");
      expect(event).toHaveProperty("film_director");
      expect(event).toHaveProperty("film_year");
      expect(event).toHaveProperty("film_img_url");
      expect(event).toHaveProperty("price");
      expect(event).toHaveProperty("created_at");

      // OMDb fields
      expect(event).toHaveProperty("film_writer");
      expect(event).toHaveProperty("film_plot");
      expect(event).toHaveProperty("film_genre");
      expect(event).toHaveProperty("film_actors");
      expect(event).toHaveProperty("film_runtime");
      expect(event).toHaveProperty("film_country");
      expect(event).toHaveProperty("film_language");
      expect(event).toHaveProperty("film_imdb_id");
    });
  });

  test("users table is seeded", () => {
    return db.query("SELECT * FROM users;").then(({ rows }) => {
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0]).toHaveProperty("email");
      expect(rows[0]).toHaveProperty("role");
    });
  });

  test("signups table is seeded", () => {
    return db.query("SELECT * FROM signups;").then(({ rows }) => {
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0]).toHaveProperty("user_id");
      expect(rows[0]).toHaveProperty("event_id");
    });
  });
});
