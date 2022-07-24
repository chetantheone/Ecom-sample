"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Cart_1 = __importDefault(require("../controllers/Cart"));
const router = express_1.default.Router();
router.post('/create', Cart_1.default.createCart);
router.get('/current', Cart_1.default.getCurrentActiveCart);
exports.default = router;
