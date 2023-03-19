import { type Request } from "express";

export interface GameStructure extends Request {
  title: string;
  platform: string;
  genre: string;
  description: string;
  price: string;
  cover: string;
  owner: string;
}

export type GamesStructure = GameStructure[];

export interface UserStructure {
  username: string;
  password: string;
  email: string;
  games: string[];
}

export type UsersStructure = UserStructure[];

export type UserCredentials = Pick<UserStructure, "username" | "password">;

export type CustomRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;

export interface CustomAuthRequest extends Request {
  postedBy: string;
}

export interface CustomCreateGameAuthRequest extends GameStructure {
  postedBy: string;
}
