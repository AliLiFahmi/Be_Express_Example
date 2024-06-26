const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');

// connect ke database
const { connect } = require("./conn");

// file migration
const runMigrations = require('./migrate');

// file middleware
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// file router
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

// middleware
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// router
app.use("/", indexRouter);
app.use("/api/add/users", usersRouter);
app.use("/api/add/auth", authRouter);

// middleware error handler
app.use(notFound)
app.use(errorHandler)

// start port express
const port = process.env.PORT || 3900;
app.listen(port, () => {
    console.log(`Server connect http://localhost:${port}`)
})

async function running() {
    // menjalankan migtarion database
    await runMigrations();
    
    // mengkoneksikan database
	connect();

    // menjalankan server express
    const port = process.env.PORT || 3900;
    app.listen(port, () => {
        console.log(`Server connect http://localhost:${port}`)
    })
}
