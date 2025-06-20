require("dotenv").config();
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./src/middlewares/auth.middleware")
const adminMiddleware = require("./src/middlewares/admin.middleware")

// Route Imports
const authRoutes = require("./src/routes/auth.routes")
const userRoutes = require("./src/routes/user.routes")
const totoRoutes = require("./src/routes/todo.routes")

const app = express();
// Middlewares
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", authMiddleware, adminMiddleware, userRoutes);
app.use("/api/todo", authMiddleware, totoRoutes);


const port = process.env.PORT || 8080
app.listen(port, () => console.log("Server is running on: ", port))