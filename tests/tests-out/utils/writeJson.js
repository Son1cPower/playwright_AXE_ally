"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function writeJsonToFile(_reportResult, jsonFileName = "axe-core-report.json") {
    const data = JSON.stringify(_reportResult, null, 2);
    (0, fs_1.writeFileSync)(jsonFileName, data, (err) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log("File created successfully");
    });
}
exports.default = writeJsonToFile;
//# sourceMappingURL=writeJson.js.map