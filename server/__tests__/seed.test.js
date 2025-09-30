const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Database seeding", () => {
  test("events table is seeded", () => {
    return db.query("SELECT * FROM events;").then(({ rows }) => {
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0]).toHaveProperty("title");
      expect(rows[0]).toHaveProperty("event_type");
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
