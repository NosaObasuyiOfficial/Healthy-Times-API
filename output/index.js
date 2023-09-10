"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_index_1 = require("./dbconnection/db_index");
const dbconfig_1 = __importDefault(require("./dbconnection/dbconfig"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const { PORT } = dbconfig_1.default;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/user', user_route_1.default);
app.use('/post', post_route_1.default);
db_index_1.db.sync()
    .then(() => {
    console.log('Database is connected');
})
    .catch((error) => {
    console.error(error);
});
const port = PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
