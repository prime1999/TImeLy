import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-email", (req, res) => {
	const { title, message } = req.body;

	// Resend API call

	const resend = new Resend(process.env.RESEND_API_KEY);

	resend.emails.send({
		from: "onboarding@resend.dev",
		to: "codingprime23@gmail.com",
		subject: title,
		html: `<p>${message}</p>`,
	});

	res.json({ success: true, message: "Email sent successfully!" });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
