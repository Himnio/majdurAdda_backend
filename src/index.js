import dotenv from "dotenv";
import dbConnection from "./db/connection.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 8585, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED !!!", err);
  });
