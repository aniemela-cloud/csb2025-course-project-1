const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app);

describe("api/users POST endpoint with one extant user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({
      username: "testuser",
      name: "Test Testerson",
      passwordHash,
    });
    await user.save();
  });

  test("adding a new user returns status 201", { todo: true }, async () => {
    const user_data = {
      username: "newuser",
      name: "New Userperson",
      password: "drowssap",
    };
    await api.post("/api/users").send(user_data).expect(201);
  });

  test("adding a new user returns JSON", { todo: true }, async () => {
    const user_data = {
      username: "newuser",
      name: "New Userperson",
      password: "drowssap",
    };
    await api
      .post("/api/users")
      .send(user_data)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test(
    "adding a new user returns the user's data and a value for 'id'",
    { todo: true },
    async () => {
      const user_data = {
        username: "newuser",
        name: "New Userperson",
        password: "drowssap",
      };
      const expected_data = {
        username: user_data.username,
        name: user_data.name,
      };
      post_result = await api.post("/api/users").send(user_data);
      assert.partialDeepStrictEqual(post_result.body, expected_data);
      assert.ok(post_result.body.id, "No property 'id' found in returned data");
    },
  );

  test(
    "attempting to add a user with a username shorter than 3 characters results in status 400",
    { todo: true },
    async () => {
      const user_data = {
        username: "ne",
        name: "New Userperson",
        password: "drowssap",
      };
      const post_result = await api
        .post("/api/users")
        .send(user_data)
        .expect(400);
      assert.match(post_result.body.error, /username too short/);
    },
  );
  test(
    "attempting to add a user with a password shorter than 3 characters results in status 400",
    { todo: true },
    async () => {
      const user_data = {
        username: "newuser",
        name: "New Userperson",
        password: "dr",
      };
      const post_result = await api
        .post("/api/users")
        .send(user_data)
        .expect(400);
      assert.match(post_result.body.error, /password too short/);
    },
  );
});

after(async () => {
  await mongoose.connection.close();
});
