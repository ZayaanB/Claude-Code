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
exports.ContextManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ContextManager {
    constructor() {
        this._files = new Map();
    }
    get fileCount() {
        return this._files.size;
    }
    // ── Load all .md files from the sync folder ───────────────────────────────
    async loadFromFolder(folderPath) {
        if (!fs.existsSync(folderPath)) {
            throw new Error(`Sync folder not found: ${folderPath}`);
        }
        const entries = fs.readdirSync(folderPath).filter((f) => f.endsWith('.md'));
        this._files.clear();
        for (const filename of entries) {
            const filePath = path.join(folderPath, filename);
            const parsed = this._parseMarkdownFile(filePath, filename);
            if (parsed) {
                this._files.set(filename, parsed);
            }
        }
    }
    // ── Update a single file (called by FileWatcher) ──────────────────────────
    updateFile(filePath, filename) {
        const parsed = this._parseMarkdownFile(filePath, filename);
        if (parsed) {
            this._files.set(filename, parsed);
        }
    }
    removeFile(filename) {
        this._files.delete(filename);
    }
    // ── Build a context string to inject into a chat request ─────────────────
    //   Simple strategy: sort by recency, take top N files.
    //   Future: embed and rank by semantic similarity to the query.
    buildContextBlock(query) {
        if (this._files.size === 0) {
            return '';
        }
        const maxFiles = 5; // TODO: read from config
        const sorted = [...this._files.values()].sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
        const top = sorted.slice(0, maxFiles);
        return top
            .map((f) => {
            const lines = [
                `### ${f.filename}`,
                `**Author:** ${f.username}  **Topic:** ${f.topic}`,
                `**Tags:** ${f.tags.join(', ')}`,
                '',
                `**Summary:** ${f.summary}`,
                '',
            ];
            if (f.keyDecisions.length) {
                lines.push('**Key Decisions:**');
                f.keyDecisions.forEach((d) => lines.push(`- ${d}`));
                lines.push('');
            }
            if (f.links.length) {
                lines.push(`**Related:** ${f.links.join(', ')}`);
            }
            return lines.join('\n');
        })
            .join('\n\n---\n\n');
    }
    // ── Parse a .md file into a ContextFile ───────────────────────────────────
    _parseMarkdownFile(filePath, filename) {
        try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const stats = fs.statSync(filePath);
            // Parse YAML frontmatter between --- delimiters
            const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/);
            if (!frontmatterMatch)
                return null;
            const fm = this._parseFrontmatter(frontmatterMatch[1]);
            const body = raw.slice(frontmatterMatch[0].length).trim();
            // Extract sections from body
            const summary = this._extractSection(body, 'Summary');
            const keyDecisions = this._extractList(body, 'Key Decisions');
            const links = this._extractWikilinks(body);
            return {
                filename,
                username: fm['author'] ?? 'unknown',
                topic: fm['topic'] ?? '',
                tags: this._parseArray(fm['tags'] ?? ''),
                summary,
                keyDecisions,
                links,
                modifiedAt: stats.mtime,
                rawContent: raw,
            };
        }
        catch {
            return null;
        }
    }
    // ── Frontmatter helpers ───────────────────────────────────────────────────
    _parseFrontmatter(block) {
        const result = {};
        for (const line of block.split('\n')) {
            const idx = line.indexOf(':');
            if (idx === -1)
                continue;
            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim();
            result[key] = value;
        }
        return result;
    }
    _parseArray(value) {
        // Handles both "[a, b, c]" and "a, b, c"
        return value
            .replace(/[\[\]]/g, '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }
    _extractSection(body, heading) {
        const regex = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`);
        return body.match(regex)?.[1]?.trim() ?? '';
    }
    _extractList(body, heading) {
        const section = this._extractSection(body, heading);
        return section
            .split('\n')
            .filter((l) => l.startsWith('- '))
            .map((l) => l.slice(2).trim());
    }
    _extractWikilinks(body) {
        const matches = body.match(/\[\[([^\]]+)\]\]/g) ?? [];
        return matches.map((m) => m.replace(/\[\[|\]\]/g, ''));
    }
}
exports.ContextManager = ContextManager;
//# sourceMappingURL=ContextManager.js.map