const express = require("express");
const { mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");
const commentRouter = require("./routes/commentRoute");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

// middlewares
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

//image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "images");
  },
  filename: function (req, file, cb) {
    return cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("Image has been uploaded successfully");
});
app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`server is listening on port 5000`);
});
