import express from "express";
import { getTournaments } from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/", getTournaments);

export default router;
