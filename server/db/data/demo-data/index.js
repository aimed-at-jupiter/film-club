module.exports = {
  eventData: [
    {
      title: "Demo (screening)",
      date: "2026-01-01",
      start_time: "19:00:00",
      end_time: "22:00:00",
      location: "Demo Cinema",
      film_title: "Demo Film",
      film_director: "Jane Doe",
      film_year: 2020,
      film_img_url: "",
      event_type: "screening",
      price: 10,
      created_at: new Date(),
    },
    {
      title: "Demo (discussion)",
      date: "2026-01-01",
      start_time: "19:00:00",
      end_time: "20:00:00",
      location: "Demo Cinema",
      film_title: "Demo Film",
      film_director: "John Doe",
      film_year: 2020,
      film_img_url: "",
      event_type: "discussion",
      price: 10,
      created_at: new Date(),
    },
  ],
  userData: [
    {
      username: "demo_user",
      email: "demo_user@example.com",
      password: "password", // will be hashed in seed.js
      role: "user",
    },
    {
      username: "demo_staff",
      email: "demo_staff@example.com",
      password: "staffpassword",
      role: "staff",
    },
  ],
  signupData: [],
};
