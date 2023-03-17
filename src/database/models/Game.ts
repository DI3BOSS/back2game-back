import { model, Schema } from "mongoose";

const documentModelName = "Game";
const collectionName = "games";

const gameSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  platform: {
    type: String,
    required: true,
    minLength: 8,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 800,
  },
  price: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
  },
  owner: {
    type: String,
  },
});

const Game = model(documentModelName, gameSchema, collectionName);

export default Game;
