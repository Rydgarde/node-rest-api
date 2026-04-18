import express from "express"
import pino   from "pino"
import { userRouter } from "./routes/users.js"

const log = pino({ level: process.env.LOG_LEVEL ?? "info" })
const app = express()
app.use(express.json())
app.get("/health", (_, res) => res.json({ ok: true }))
app.use("/api/v1/users", userRouter)
app.listen(3000, () => log.info("listening on :3000"))
