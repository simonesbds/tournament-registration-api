import express from "express";
import {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/", getTournaments);
router.get("/:id", getTournamentById);
router.post("/", createTournament);
router.patch("/:id", updateTournament);

export default router;
