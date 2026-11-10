import mongoose from "mongoose";
import Tournament from "../models/Tournament.js";
import Store from "../models/Store.js";

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

export const createTournament = async (req, res) => {
  try {
    const { name, game, date, maxPlayers, entryFee, store } = req.body ?? {};

    if (!mongoose.isValidObjectId(store)) {
      return res.status(400).json({ message: "Invalid Store ID format" });
    }

    const storeExists = await Store.exists({ _id: store });
    if (!storeExists) {
      return res.status(400).json({ message: "Store not found" });
    }

    const newTournament = await Tournament.create({
      name,
      game,
      date,
      maxPlayers,
      entryFee,
      store,
    });

    return res.status(201).json(newTournament);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
