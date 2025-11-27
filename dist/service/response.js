"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalPages = void 0;
const calculateTotalPages = (totalRecords, pageSize) => {
    return Math.ceil(totalRecords / pageSize);
};
exports.calculateTotalPages = calculateTotalPages;
