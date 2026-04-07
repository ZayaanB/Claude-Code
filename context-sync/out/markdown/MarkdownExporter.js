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
exports.MarkdownExporter = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class MarkdownExporter {
    // ── Main export entry point ───────────────────────────────────────────────
    async exportSession(session, syncFolder) {
        // Don't export if there's nothing meaningful yet
        if (session.messages.length < 2) {
            return null;
        }
        const transcript = this._buildTranscript(session);
        // Step 1: Ask the LLM if this conversation is worth saving
        const isWorthSaving = await this._qualityGate(transcript);
        if (!isWorthSaving) {
            console.log('ContextSync: Skipping export — conversation not technically useful yet.');
            return null;
        }
        // Step 2: Ask the LLM to extract structured metadata
        const metadata = await this._extractMetadata(transcript);
        if (!metadata) {
            return null;
        }
        // Step 3: Find related files by matching tags
        const relatedLinks = this._findRelatedFiles(metadata.tags, syncFolder, session.id);
        // Step 4: Write the .md file
        const filename = `chat_${session.id}.md`;
        const filePath = path.join(syncFolder, filename);
        const content = this._buildMarkdown(session, metadata, relatedLinks);
        fs.writeFileSync(filePath, content, 'utf-8');
        return filePath;
    }
    // ── Quality gate: ask LLM if conversation is worth saving ─────────────────
    async _qualityGate(transcript) {
        const prompt = `You are a technical context filter for a software development team.\n` +
            `Review this conversation and answer only "yes" or "no":\n` +
            `Is this conversation technically useful enough to save as shared team context?\n` +
            `It should only be saved if it contains decisions, solutions, code discussions, ` +
            `architecture choices, or debugging insights. Greetings, small talk, or vague ` +
            `questions with no resolution should return "no".\n\n` +
            `Conversation:\n${transcript}`;
        const response = await this._callLLM(prompt, 10);
        return response.toLowerCase().includes('yes');
    }
    // ── Metadata extraction: one LLM call generates everything ────────────────
    async _extractMetadata(transcript) {
        const prompt = `You are a technical knowledge extractor for a software development team.\n` +
            `Analyse this conversation and respond ONLY with a JSON object — no markdown, no explanation.\n\n` +
            `Required format:\n` +
            `{\n` +
            `  "topic": "one concise sentence describing what this conversation is about",\n` +
            `  "tags": ["tag1", "tag2"],\n` +
            `  "summary": "2-3 sentences capturing the outcome and key context",\n` +
            `  "keyDecisions": ["decision 1", "decision 2"],\n` +
            `  "keyQuestions": ["question that was asked and resolved"],\n` +
            `  "codeReferences": ["file paths or function names mentioned"]\n` +
            `}\n\n` +
            `Rules:\n` +
            `- tags: lowercase, technical, 2-6 tags (e.g. auth, jwt, refactor, typescript)\n` +
            `- keyDecisions: only concrete decisions made, not observations\n` +
            `- keyQuestions: only questions that were actually answered\n` +
            `- codeReferences: only if explicitly mentioned, otherwise empty array\n\n` +
            `Conversation:\n${transcript}`;
        const response = await this._callLLM(prompt, 500);
        try {
            const cleaned = response.replace(/```json|```/g, '').trim();
            return JSON.parse(cleaned);
        }
        catch {
            console.error('ContextSync: Failed to parse metadata JSON', response);
            return null;
        }
    }
    // ── Find related files by matching tags ───────────────────────────────────
    _findRelatedFiles(tags, syncFolder, currentSessionId) {
        if (!fs.existsSync(syncFolder))
            return [];
        const files = fs.readdirSync(syncFolder).filter((f) => f.endsWith('.md'));
        const related = [];
        for (const filename of files) {
            if (filename.includes(currentSessionId))
                continue;
            const filePath = path.join(syncFolder, filename);
            const content = fs.readFileSync(filePath, 'utf-8');
            const tagsMatch = content.match(/^tags:\s*\[([^\]]*)\]/m);
            if (!tagsMatch)
                continue;
            const fileTags = tagsMatch[1]
                .split(',')
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean);
            const sharedTags = tags.filter((t) => fileTags.includes(t));
            if (sharedTags.length > 0) {
                related.push({ filename: filename.replace('.md', ''), matches: sharedTags.length });
            }
        }
        return related
            .sort((a, b) => b.matches - a.matches)
            .slice(0, 3)
            .map((r) => r.filename);
    }
    // ── Build the final .md content ───────────────────────────────────────────
    _buildMarkdown(session, metadata, relatedLinks) {
        const lines = [
            '---',
            `id: ${session.id}`,
            `author: ${session.username}`,
            `topic: "${metadata.topic}"`,
            `tags: [${metadata.tags.join(', ')}]`,
            `created: ${session.startedAt}`,
            `updated: ${new Date().toISOString()}`,
            '---',
            '',
            '## Summary',
            metadata.summary,
            '',
        ];
        if (metadata.keyDecisions.length) {
            lines.push('## Key Decisions');
            metadata.keyDecisions.forEach((d) => lines.push(`- ${d}`));
            lines.push('');
        }
        if (metadata.keyQuestions.length) {
            lines.push('## Key Questions');
            metadata.keyQuestions.forEach((q) => lines.push(`- ${q}`));
            lines.push('');
        }
        if (metadata.codeReferences.length) {
            lines.push('## Code References');
            metadata.codeReferences.forEach((r) => lines.push(`- ${r}`));
            lines.push('');
        }
        if (relatedLinks.length) {
            lines.push('## Related Conversations');
            relatedLinks.forEach((l) => lines.push(`- [[${l}]]`));
            lines.push('');
        }
        return lines.join('\n');
    }
    // ── Build a plain transcript string to feed to the LLM ───────────────────
    _buildTranscript(session) {
        return session.messages
            .map((m) => `${m.role === 'user' ? session.username : 'AI'}: ${m.content}`)
            .join('\n\n');
    }
    // ── Shared LLM caller (uses Copilot model) ────────────────────────────────
    async _callLLM(prompt, maxTokens) {
        const models = await vscode.lm.selectChatModels({
            vendor: 'copilot',
            family: 'gpt-4o',
        });
        if (!models.length) {
            throw new Error('No Copilot model available for export.');
        }
        const model = models[0];
        const messages = [vscode.LanguageModelChatMessage.User(prompt)];
        const tokenSource = new vscode.CancellationTokenSource();
        const response = await model.sendRequest(messages, {}, tokenSource.token);
        let result = '';
        for await (const chunk of response.text) {
            result += chunk;
        }
        return result;
    }
}
exports.MarkdownExporter = MarkdownExporter;
//# sourceMappingURL=MarkdownExporter.js.map