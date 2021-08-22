import cors from "cors";

if (process.env.NODE_ENV === "development") {
	app.use(cors({ origin: "http://localhost:3000" }));
}

export default app;
