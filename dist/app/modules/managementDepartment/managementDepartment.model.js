"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementDepartment = void 0;
const mongoose_1 = require("mongoose");
const ManagementDepartmentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.ManagementDepartment = (0, mongoose_1.model)('ManagementDepartment', ManagementDepartmentSchema);
