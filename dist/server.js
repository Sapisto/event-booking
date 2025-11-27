"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const PORT = process.env.PORT || 3000;
config_1.sequelize
    .sync()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`\x1b[32m%s\x1b[0m`, `=================================`);
        console.log(`\x1b[32m%s\x1b[0m`, `Server is running on port ${PORT}`);
        console.log(`\x1b[32m%s\x1b[0m`, `=================================`);
    });
})
    .catch((error) => {
    console.error("Unable to connect to the database:", error);
});
