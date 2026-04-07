"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWatcher = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class FileWatcher {
    constructor(contextManager) {
        this._contextManager = contextManager;
    }
    start(folderPath) {
        // Stop any existing watcher
        this.stop();
        // Do an initial full load
        this._contextManager.loadFromFolder(folderPath).catch(console.error);
        // Watch for .md changes inside the sync folder
        const pattern = new vscode.RelativePattern(folderPath, '*.md');
        this._watcher = vscode.workspace.createFileSystemWatcher(pattern);
        this._watcher.onDidCreate((uri) => {
            const filename = path.basename(uri.fsPath);
            this._contextManager.updateFile(uri.fsPath, filename);
        });
        this._watcher.onDidChange((uri) => {
            const filename = path.basename(uri.fsPath);
            this._contextManager.updateFile(uri.fsPath, filename);
        });
        this._watcher.onDidDelete((uri) => {
            const filename = path.basename(uri.fsPath);
            this._contextManager.removeFile(filename);
        });
    }
    stop() {
        this._watcher?.dispose();
        this._watcher = undefined;
    }
}
exports.FileWatcher = FileWatcher;
//# sourceMappingURL=FileWatcher.js.map