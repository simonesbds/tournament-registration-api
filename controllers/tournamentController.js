import mongoose from "mongoose";
import Tournament from "../models/Tournament.js";
import Store from "../models/Store.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

export const getTournaments = async (req, res) => {
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

  const tournaments = await Tournament.find(query)
    .populate("store", "name city address")
    .sort("date")
    .lean();

  res.json(tournaments);
};

export const getTournamentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new BadRequestError("Invalid Tournament ID format");
  }

  const tournament = await Tournament.findById(id)
    .populate("store", "name city address")
    .lean();

  if (!tournament) {
    throw new NotFoundError("Tournament not found");
  }

  res.json(tournament);
};

export const createTournament = async (req, res) => {
  const { name, game, date, maxPlayers, entryFee, store } = req.body ?? {};

  if (!mongoose.isValidObjectId(store)) {
    throw new BadRequestError("Invalid Store ID format");
  }

  const storeExists = await Store.exists({ _id: store });
  if (!storeExists) {
    throw new BadRequestError("Store not found");
  }

  const newTournament = await Tournament.create({
    name,
    game,
    date,
    maxPlayers,
    entryFee,
    store,
  });

  res.status(201).json(newTournament);
};

export const updateTournament = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new BadRequestError("Invalid Tournament ID format");
  }

  const body = req.body ?? {};
  const allowedFields = [
    "name",
    "game",
    "date",
    "maxPlayers",
    "entryFee",
    "store",
  ];
  const updates = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError("No valid updates");
  }

  if (updates.store !== undefined) {
    if (!mongoose.isValidObjectId(updates.store)) {
      throw new BadRequestError("Invalid Store ID format");
    }

    const storeExists = await Store.exists({ _id: updates.store });
    if (!storeExists) {
      throw new BadRequestError("Store not found");
    }
  }

  const updatedTournament = await Tournament.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate("store", "name city address");

  if (!updatedTournament) {
    throw new NotFoundError("Tournament not found");
  }

  res.json(updatedTournament);
};
