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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ChatPanel_1 = require("./chat/ChatPanel");
const ContextManager_1 = require("./context/ContextManager");
const FileWatcher_1 = require("./context/FileWatcher");
let fileWatcher;
function activate(context) {
    console.log('ContextSync is active');
    const contextManager = new ContextManager_1.ContextManager();
    fileWatcher = new FileWatcher_1.FileWatcher(contextManager);
    // Start watching the sync folder if configured
    const syncFolder = vscode.workspace
        .getConfiguration('contextSync')
        .get('syncFolder');
    if (syncFolder) {
        fileWatcher.start(syncFolder);
    }
    // Re-start watcher if config changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('contextSync.syncFolder')) {
            const newFolder = vscode.workspace
                .getConfiguration('contextSync')
                .get('syncFolder');
            if (newFolder) {
                fileWatcher?.start(newFolder);
            }
        }
    }));
    // Command: open chat panel
    context.subscriptions.push(vscode.commands.registerCommand('contextSync.openChat', () => {
        ChatPanel_1.ChatPanel.createOrShow(context.extensionUri, contextManager);
    }));
    // Command: manual sync trigger
    context.subscriptions.push(vscode.commands.registerCommand('contextSync.syncNow', async () => {
        const folder = vscode.workspace
            .getConfiguration('contextSync')
            .get('syncFolder');
        if (!folder) {
            vscode.window.showErrorMessage('ContextSync: No sync folder configured. Set contextSync.syncFolder in Settings.');
            return;
        }
        await contextManager.loadFromFolder(folder);
        vscode.window.showInformationMessage(`ContextSync: Loaded ${contextManager.fileCount} context files.`);
    }));
}
function deactivate() {
    fileWatcher?.stop();
}
//# sourceMappingURL=extension.js.map