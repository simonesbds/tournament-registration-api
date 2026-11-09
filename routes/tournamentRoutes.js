import express from "express";
import {
  getTournaments,
  getTournamentById,
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/", getTournaments);
router.get("/:id", getTournamentById);

export default router;
