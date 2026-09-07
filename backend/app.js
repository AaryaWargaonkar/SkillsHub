require("dotenv").config()
const express = require('express');
const cors = require('cors');
const router = require('./router/router');
const userRouter = require('./router/userRouter');
const { connectDB } = require('./db');
const enrollmentRouter = require('./router/enrollmentRouter');
const lessonRouter = require('./router/lessonRouter');
const reviewRouter = require('./router/reviewRouter');
const paymentRouter = require("./router/paymentRouter");
const quizRouter = require("./router/quizRouter");
const badgeRouter = require("./router/badgeRouter");
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/", router);
app.use("/user", userRouter);
app.use("/enrollment", enrollmentRouter);
app.use("/lesson", lessonRouter);
app.use("/review", reviewRouter);
app.use("/payment", paymentRouter);
app.use("/quiz", quizRouter)
app.use("/badge", badgeRouter)

app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
    console.log("running...");
});
