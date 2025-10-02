const db = require("../connection");
const bcrypt = require("bcrypt");
const format = require("pg-format");

const saltRounds = 10;

const seed = ({ eventData, userData, signupData }) => {
  return (
    db
      .query(`DROP TABLE IF EXISTS signups;`)
      .then(() => db.query(`DROP TABLE IF EXISTS users;`))
      .then(() => db.query(`DROP TABLE IF EXISTS events;`))
      .then(() => {
        return db.query(`
        CREATE TABLE events (
          event_id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          location TEXT NOT NULL,
          film_title TEXT NOT NULL,
          film_director TEXT,
          film_year INT,
          film_img_url TEXT,
          event_type TEXT CHECK (event_type IN ('discussion', 'screening')) NOT NULL,
          price NUMERIC(6,2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT CHECK (role IN ('user', 'staff')) DEFAULT 'user'
        );
      `);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE signups (
          signup_id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
          event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id, event_id)
        );
      `);
      })
      // Insert events
      .then(() => {
        const formattedEventValues = eventData.map(
          ({
            title,
            date,
            start_time,
            end_time,
            location,
            film_title,
            film_director,
            film_year,
            film_img_url,
            event_type,
            price,
            created_at,
          }) => [
            title,
            date,
            start_time,
            end_time,
            location,
            film_title,
            film_director,
            film_year,
            film_img_url,
            event_type,
            price,
            created_at,
          ]
        );

        const eventSqlString = format(
          `INSERT INTO events 
          (title, date, start_time, end_time, location, film_title, film_director, film_year, film_img_url, event_type, price, created_at)
          VALUES %L RETURNING *;`,
          formattedEventValues
        );

        return db.query(eventSqlString);
      })
      // Insert users
      .then(() => {
        // Hash passwords first
        const hashedUserPromises = userData.map((user) => {
          return bcrypt
            .hash(user.password, saltRounds)
            .then((hashedPassword) => {
              return [user.username, user.email, hashedPassword, user.role];
            });
        });

        return Promise.all(hashedUserPromises).then((formattedUserValues) => {
          const userSqlString = format(
            `INSERT INTO users (username, email, password, role) VALUES %L RETURNING *;`,
            formattedUserValues
          );
          return db.query(userSqlString);
        });
      })
      // Insert signups
      .then(() => {
        const formattedSignupValues = signupData.map(
          ({ user_id, event_id }) => [user_id, event_id]
        );

        const signupSqlString = format(
          `INSERT INTO signups (user_id, event_id) VALUES %L RETURNING *;`,
          formattedSignupValues
        );

        return db.query(signupSqlString);
      })
  );
};

module.exports = seed;
