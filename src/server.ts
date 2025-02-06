import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { sequelize } from "./config";

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\x1b[32m%s\x1b[0m`, `=================================`);
      console.log(`\x1b[32m%s\x1b[0m`, `Server is running on port ${PORT}`);
      console.log(`\x1b[32m%s\x1b[0m`, `=================================`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
