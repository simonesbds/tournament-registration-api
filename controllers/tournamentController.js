import Tournament from "../models/Tournament.js";

export const getTournaments = async (req, res) => {
  try {
    const { name } = req.query;
    const query = {};

    if (typeof name === "string" && name.trim()) {
      query.name = {
        $regex: name.trim(),
        $options: "i",
      };
    }

    const tournaments = await Tournament.find(query).sort("date");
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
