import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    game: {
      type: String,
      required: true,
      trim: true,
      enum: ["Magic", "Pokemon", "Yu-Gi-Oh", "One Piece"],
    },
    date: { type: Date, required: true },
    storeName: { type: String, required: true, trim: true },
    maxPlayers: { type: Number, required: true, min: 2 },
    entryFee: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true },
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;
