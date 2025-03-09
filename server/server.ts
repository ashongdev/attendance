import cors from "cors";
import { config } from "dotenv";
import express from "express";
// import { createServer } from "node:http";
// import { Socket } from "socket.io";
import { pool } from "./db";
import lecturerRoutes from "./routes/lecturerRoutes";
import studentRoutes from "./routes/studentRoutes";

config();

// const socketIo = require("socket.io");
const app = express();

// const server = createServer(app);

// const io = socketIo(server, {
// 	cors: {
// 		origin: [
// 			"http://localhost:5173",
// 			"https://record-attendance.onrender.com",
// 		],
// 	},
// });

const corsOptions = {
	origin: [
		// "http://localhost:5173",
		"https://attendance-two-tawny.vercel.app",
	],
	methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE", "PUT"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
// app.use((req, res, next) => {
// 	console.log(req.path, req.method);

// 	next();
// });

app.use(lecturerRoutes);
app.use(studentRoutes);

const PORT = process.env.PORT || 4003;

pool.connect()
	.then((client) => {
		// server.listen(PORT, () => {
		// 	console.log(
		// 		"Connected to the database successfully and Listening to PORT ",
		// 		PORT
		// 	);
		// });
		app.listen(PORT, () => {
			console.log(
				"Connected to the database successfully and Listening to PORT ",
				PORT
			);
		});

		client.release();
	})
	.catch((err) => {
		console.error("Error connecting to the database:", err);
	});
