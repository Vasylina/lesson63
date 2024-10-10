import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();

const fakeUser = {
  id: "123",
  username: "admin",
  password: "password",
};

const sessionOptions = {
  secret: "secret_key",
  resave: false,
  saveUninitialized: false,
};

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log("username:", username);
    console.log("password:", password);
    if (username === fakeUser.username && password === fakeUser.password) {
      return done(null, fakeUser);
    } else {
      return done(null, false, { message: "Невірні дані" });
    }
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  if (id === fakeUser.id) {
    done(null, fakeUser);
  } else {
    done(new Error("Невірний ID користувача"));
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("Аутентифікація пройшла успішно");
});

app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Це захищена сторінка");
  } else {
    res.status(401).send("Недостатньо прав для доступу");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
