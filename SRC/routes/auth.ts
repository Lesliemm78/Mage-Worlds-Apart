import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../modules/db";
import bcrypt from "bcryptjs";

export const router = express.Router();

const secret = String(process.env.passwordSecret);

router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const user = await prisma.user.create({
    data: { email, name, password },
    select: {
      email: true,
      name: true,
    },
  });
  res.status(200).send({ user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) return res.status(404).send("No user found.");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).send("Password is incorrect.");

  const token = jwt.sign({ id: user.id }, secret, { expiresIn: 86400 });
  res.status(200).send({ auth: true, token });
});
