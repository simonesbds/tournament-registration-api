import mongoose from "mongoose";
import Tournament from "../models/Tournament.js";

export const getTournaments = async (req, res) => {
  try {
    const { name, game } = req.query;
    const query = {};

    if (typeof name === "string" && name.trim()) {
      query.name = {
        $regex: RegExp.escape(name.trim()),
        $options: "i",
      };
    }

    if (typeof game === "string" && game.trim()) {
      query.game = {
        $regex: `^${RegExp.escape(game.trim())}$`,
        $options: "i",
      };
    }

    const tournaments = await Tournament.find(query).sort("date").lean();
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Tournament ID format" });
    }

    const tournament = await Tournament.findById(id).lean();

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    res.json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
