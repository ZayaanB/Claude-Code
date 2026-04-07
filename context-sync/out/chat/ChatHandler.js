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
exports.ChatHandler = void 0;
const vscode = __importStar(require("vscode"));
class ChatHandler {
    constructor(contextManager) {
        this.contextManager = contextManager;
    }
    // ── Send a message and get a response ────────────────────────────────────
    async sendMessage(session) {
        // Pick the best available Copilot model
        const models = await vscode.lm.selectChatModels({
            vendor: 'copilot',
            family: 'gpt-4o',
        });
        if (!models.length) {
            throw new Error('No Copilot model available. Make sure GitHub Copilot is installed and signed in.');
        }
        const model = models[0];
        const messages = this._buildMessages(session);
        const tokenSource = new vscode.CancellationTokenSource();
        const response = await model.sendRequest(messages, {}, tokenSource.token);
        // Collect streamed response
        let reply = '';
        for await (const chunk of response.text) {
            reply += chunk;
        }
        return reply;
    }
    // ── Build message array with context injected ─────────────────────────────
    _buildMessages(session) {
        const messages = [];
        // 1. System-level context from shared .md files
        const contextBlock = this.contextManager.buildContextBlock(session.messages.map((m) => m.content).join(' '));
        if (contextBlock) {
            messages.push(vscode.LanguageModelChatMessage.User(`You are a helpful coding assistant. Your team shares context via the following notes. ` +
                `Use them as background knowledge when answering — do not mention them unless directly relevant.\n\n` +
                `--- TEAM CONTEXT ---\n${contextBlock}\n--- END CONTEXT ---`), 
            // Dummy assistant ack so model doesn't treat context as a question
            vscode.LanguageModelChatMessage.Assistant('Understood. I have the team context loaded.'));
        }
        // 2. Conversation history
        for (const msg of session.messages) {
            if (msg.role === 'user') {
                messages.push(vscode.LanguageModelChatMessage.User(msg.content));
            }
            else {
                messages.push(vscode.LanguageModelChatMessage.Assistant(msg.content));
            }
        }
        return messages;
    }
}
exports.ChatHandler = ChatHandler;
//# sourceMappingURL=ChatHandler.js.map