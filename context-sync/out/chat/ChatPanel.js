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
exports.ChatPanel = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ChatHandler_1 = require("./ChatHandler");
const MarkdownExporter_1 = require("../markdown/MarkdownExporter");
class ChatPanel {
    // ── Static factory ────────────────────────────────────────────────────────
    static createOrShow(extensionUri, contextManager) {
        const column = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.One;
        if (ChatPanel.currentPanel) {
            ChatPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel('contextSyncChat', 'ContextSync Chat', column, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'src', 'webview')],
            retainContextWhenHidden: true,
        });
        ChatPanel.currentPanel = new ChatPanel(panel, extensionUri, contextManager);
    }
    // ── Constructor ───────────────────────────────────────────────────────────
    constructor(panel, extensionUri, contextManager) {
        this._disposables = [];
        this._panel = panel;
        this._handler = new ChatHandler_1.ChatHandler(contextManager);
        this._exporter = new MarkdownExporter_1.MarkdownExporter();
        this._session = this._createNewSession();
        // Set the webview HTML
        this._panel.webview.html = this._getHtml(extensionUri);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage((message) => this._handleWebviewMessage(message), null, this._disposables);
        // Clean up on close
        this._panel.onDidDispose(() => this._dispose(), null, this._disposables);
    }
    // ── Message handling ──────────────────────────────────────────────────────
    async _handleWebviewMessage(message) {
        if (message.type === 'sendMessage') {
            await this._handleUserMessage(message.content);
        }
    }
    async _handleUserMessage(content) {
        const config = vscode.workspace.getConfiguration('contextSync');
        const syncFolder = config.get('syncFolder') ?? '';
        // Add user message to session
        const userMsg = {
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
        };
        this._session.messages.push(userMsg);
        this._postMessage({ type: 'addMessage', message: userMsg });
        this._postMessage({ type: 'setLoading', loading: true });
        try {
            // Get AI response with context injected
            const reply = await this._handler.sendMessage(this._session);
            const assistantMsg = {
                role: 'assistant',
                content: reply,
                timestamp: new Date().toISOString(),
            };
            this._session.messages.push(assistantMsg);
            this._postMessage({ type: 'addMessage', message: assistantMsg });
            // Auto-export session to .md after each exchange
            if (syncFolder) {
                await this._exporter.exportSession(this._session, syncFolder);
                this._postMessage({
                    type: 'syncStatus',
                    status: 'Synced',
                    fileCount: this._handler.contextManager.fileCount,
                });
            }
        }
        catch (err) {
            vscode.window.showErrorMessage(`ContextSync: ${err}`);
        }
        finally {
            this._postMessage({ type: 'setLoading', loading: false });
        }
    }
    // ── Helpers ───────────────────────────────────────────────────────────────
    _postMessage(message) {
        this._panel.webview.postMessage(message);
    }
    _createNewSession() {
        const config = vscode.workspace.getConfiguration('contextSync');
        const username = config.get('username') || 'user';
        const date = new Date().toISOString().split('T')[0];
        const id = `${username}_${date}_${Date.now()}`;
        return {
            id,
            username,
            messages: [],
            startedAt: new Date().toISOString(),
        };
    }
    _getHtml(extensionUri) {
        const htmlPath = path.join(extensionUri.fsPath, 'src', 'webview', 'chat.html');
        return fs.readFileSync(htmlPath, 'utf-8');
    }
    _dispose() {
        ChatPanel.currentPanel = undefined;
        this._panel.dispose();
        this._disposables.forEach((d) => d.dispose());
    }
}
exports.ChatPanel = ChatPanel;
//# sourceMappingURL=ChatPanel.js.map