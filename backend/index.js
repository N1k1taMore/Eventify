const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const path=require("path")
const cookieParser=require('cookie-parser')
const userRoute=require('./routes/users');
const eventRoute=require('./routes/Event')
const ticketRoute = require('./routes/Ticket');

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:5173",
   })
);
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGO_URL);

const fs = require('fs');

if (!fs.existsSync('images')) {
   fs.mkdirSync('images');
}

const storage = multer.diskStorage({
   destination: (req, file, fn) => {
     fn(null, "images");
   },
   filename: (req, file, fn) => {
     const filename = req.body.image || `${Date.now()}-${file.originalname}`;
     fn(null, filename);
   }
 });
 

const upload=multer({storage:storage})
app.post("/upload", upload.single("file"), (req, res) => {
   res.status(200).json("Image has been uploaded successfully!");
 });
 


app.use("/user",userRoute);
app.use("/event",eventRoute);
app.use("/ticket",ticketRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
