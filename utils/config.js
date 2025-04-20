// This file is used to load environment variables from a .env file

require("dotenv").config();

const { JWT_SECRET = "dev=key" } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

module.exports = {
  JWT_SECRET,
};
