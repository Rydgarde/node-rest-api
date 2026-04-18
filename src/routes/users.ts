import { Router } from "express"
import { z } from "zod"

export const userRouter = Router()

const UserSchema = z.object({
  name:  z.string().min(1).max(100),
  email: z.string().email(),
  role:  z.enum(["admin","editor","viewer"]).default("viewer"),
})

const db = new Map<string, z.infer<typeof UserSchema> & { id: string }>()

userRouter.get("/", (_, res) => res.json([...db.values()]))

userRouter.post("/", (req, res) => {
  const r = UserSchema.safeParse(req.body)
  if (!r.success) { res.status(400).json({ errors: r.error.flatten() }); return }
  const user = { id: crypto.randomUUID(), ...r.data }
  db.set(user.id, user)
  res.status(201).json(user)
})

userRouter.delete("/:id", (req, res) => {
  if (!db.delete(req.params.id)) { res.status(404).json({ error: "not found" }); return }
  res.status(204).end()
})
