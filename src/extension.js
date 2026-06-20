const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const DEFAULT_DOC_PATHS = [
  "docs/repo-summary.md",
  "docs/architecture.md",
  "docs/current-work.md",
  "docs/refactor-roadmap.md",
  "docs/decisions.md",
];

const DEFAULT_CONFIG_PATH = ".vscode/ai-context.json";

const TEMPLATE_BUILDERS = {
  "repo-summary.md": (workspaceName) => `# Repo Summary

## What this project is
- Describe the product, tool, or system in 2-5 bullets.

## Who it is for
- Note the primary users, stakeholders, or internal consumers.

## Current goals
- List the most important outcomes this repo is trying to achieve right now.

## How to work in this repo
- Call out any conventions AI tools should know before making changes.

## Key links
- Add important docs, dashboards, issues, or references.
`,
  "architecture.md": () => `# Architecture

## System shape
- Describe the main layers, services, packages, or apps.

## Important directories
- Explain what lives where and how responsibilities are divided.

## Runtime flow
- Summarize the key request, data, or event flows.

## Integration points
- Note APIs, databases, queues, third-party services, and background jobs.

## Constraints
- Capture technical limitations, tradeoffs, and non-obvious patterns.
`,
  "current-work.md": () => `# Current Work

## In progress
- Describe what is actively being worked on now.

## Next up
- List the highest-priority next tasks.

## Known issues
- Note open bugs, edge cases, or rough spots.

## Active branches or PRs
- Link or describe any active implementation threads.
`,
  "refactor-roadmap.md": () => `# Refactor Roadmap

## Problem areas
- List the parts of the codebase that need cleanup or redesign.

## Planned improvements
- Describe the intended refactors and why they matter.

## Sequencing
- Capture the safest order for larger changes.

## Watchouts
- Record migration risks, compatibility concerns, or testing gaps.
`,
  "decisions.md": () => `# Decisions

## Decision log
- Date: YYYY-MM-DD
- Decision:
- Context:
- Consequences:

## Rejected options
- Record alternatives that were considered and intentionally not chosen.
`,
};

function activate(context) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = "codexSessionKit.showProjectMemoryStatus";
  context.subscriptions.push(statusBarItem);

  const refreshStatusBar = async () => {
    const workspaceFolder = getPrimaryWorkspaceFolder();
    if (!workspaceFolder) {
      statusBarItem.hide();
      return;
    }

    const projectMemory = await resolveProjectMemory(workspaceFolder);
    const existingCount = projectMemory.docs.filter((doc) => doc.exists).length;
    const totalCount = projectMemory.docs.length;

    statusBarItem.text = `$(book) Project Memory ${existingCount}/${totalCount}`;
    statusBarItem.tooltip = buildStatusTooltip(projectMemory.docs);
    statusBarItem.show();
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("codexSessionKit.initializeProjectMemoryDocs", async () => {
      const workspaceFolder = getPrimaryWorkspaceFolder();
      if (!workspaceFolder) {
        vscode.window.showWarningMessage("Open a folder or workspace before initializing project memory docs.");
        return;
      }

      const createdFiles = await initializeProjectMemory(workspaceFolder);
      await refreshStatusBar();

      if (createdFiles.length === 0) {
        vscode.window.showInformationMessage("Project memory docs already exist. Nothing new was created.");
        return;
      }

      const openDoc = "Open First New Doc";
      const choice = await vscode.window.showInformationMessage(
        `Created ${createdFiles.length} project memory doc${createdFiles.length === 1 ? "" : "s"}.`,
        openDoc
      );

      if (choice === openDoc) {
        const firstUri = vscode.Uri.file(createdFiles[0]);
        const document = await vscode.workspace.openTextDocument(firstUri);
        await vscode.window.showTextDocument(document);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codexSessionKit.startSessionFromProjectMemory", async () => {
      const workspaceFolder = getPrimaryWorkspaceFolder();
      if (!workspaceFolder) {
        vscode.window.showWarningMessage("Open a folder or workspace before starting a project-memory session.");
        return;
      }

      const projectMemory = await resolveProjectMemory(workspaceFolder);
      const prompt = buildStartPrompt(projectMemory.docs);
      await vscode.env.clipboard.writeText(prompt);
      await refreshStatusBar();
      vscode.window.showInformationMessage("Start-session prompt copied to clipboard.");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codexSessionKit.finishSessionAndUpdateProjectMemory", async () => {
      const workspaceFolder = getPrimaryWorkspaceFolder();
      if (!workspaceFolder) {
        vscode.window.showWarningMessage("Open a folder or workspace before finishing a project-memory session.");
        return;
      }

      const projectMemory = await resolveProjectMemory(workspaceFolder);
      const prompt = buildFinishPrompt(projectMemory.docs);
      await vscode.env.clipboard.writeText(prompt);
      await refreshStatusBar();
      vscode.window.showInformationMessage("Finish-session prompt copied to clipboard.");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codexSessionKit.showProjectMemoryStatus", async () => {
      const workspaceFolder = getPrimaryWorkspaceFolder();
      if (!workspaceFolder) {
        vscode.window.showWarningMessage("Open a folder or workspace to inspect project memory status.");
        return;
      }

      const projectMemory = await resolveProjectMemory(workspaceFolder);
      const lines = [
        `Config: ${projectMemory.configSource}`,
        "",
        ...projectMemory.docs.map((doc) => `${doc.exists ? "OK" : "MISSING"} ${doc.relativePath}`),
      ];

      const doc = await vscode.workspace.openTextDocument({
        language: "markdown",
        content: lines.join("\n"),
      });
      await vscode.window.showTextDocument(doc, { preview: true });
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(() => {
      refreshStatusBar();
    }),
    vscode.workspace.onDidCreateFiles(() => {
      refreshStatusBar();
    }),
    vscode.workspace.onDidDeleteFiles(() => {
      refreshStatusBar();
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      refreshStatusBar();
    })
  );

  refreshStatusBar();
}

function deactivate() {}

function getPrimaryWorkspaceFolder() {
  return vscode.workspace.workspaceFolders?.[0] ?? null;
}

async function initializeProjectMemory(workspaceFolder) {
  const projectMemory = await resolveProjectMemory(workspaceFolder);
  const createdFiles = [];

  await ensureDirectory(path.join(workspaceFolder.uri.fsPath, ".vscode"));

  if (!fs.existsSync(path.join(workspaceFolder.uri.fsPath, DEFAULT_CONFIG_PATH))) {
    const configBody = JSON.stringify({ docPaths: projectMemory.docPaths }, null, 2) + "\n";
    fs.writeFileSync(path.join(workspaceFolder.uri.fsPath, DEFAULT_CONFIG_PATH), configBody, "utf8");
  }

  for (const doc of projectMemory.docs) {
    if (doc.exists) {
      continue;
    }

    await ensureDirectory(path.dirname(doc.absolutePath));
    fs.writeFileSync(doc.absolutePath, buildTemplate(doc.relativePath, workspaceFolder.name), "utf8");
    createdFiles.push(doc.absolutePath);
  }

  return createdFiles;
}

async function resolveProjectMemory(workspaceFolder) {
  const workspaceRoot = workspaceFolder.uri.fsPath;
  const extensionConfig = vscode.workspace.getConfiguration("codexSessionKit", workspaceFolder.uri);
  const preferWorkspaceConfig = extensionConfig.get("preferWorkspaceConfig", true);
  const fallbackDocPaths = extensionConfig.get("docPaths", DEFAULT_DOC_PATHS);
  const configPath = path.join(workspaceRoot, DEFAULT_CONFIG_PATH);

  let docPaths = fallbackDocPaths;
  let configSource = "Extension settings";

  if (preferWorkspaceConfig && fs.existsSync(configPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (Array.isArray(parsed.docPaths) && parsed.docPaths.every((value) => typeof value === "string")) {
        docPaths = parsed.docPaths;
        configSource = ".vscode/ai-context.json";
      }
    } catch (error) {
      configSource = ".vscode/ai-context.json (invalid JSON, fell back to extension settings)";
    }
  }

  const uniqueDocPaths = Array.from(new Set(docPaths));
  const docs = uniqueDocPaths.map((relativePath) => {
    const absolutePath = path.join(workspaceRoot, relativePath);
    return {
      relativePath,
      absolutePath,
      exists: fs.existsSync(absolutePath),
    };
  });

  return {
    configSource,
    docPaths: uniqueDocPaths,
    docs,
  };
}

function buildStartPrompt(docs) {
  const lines = [
    "Before doing anything, read:",
    ...docs.map((doc) => `- ${doc.relativePath}`),
    "Use those as the primary source of truth. Only inspect implementation files when needed.",
  ];

  const missingDocs = docs.filter((doc) => !doc.exists);
  if (missingDocs.length > 0) {
    lines.push("");
    lines.push("If any of those files do not exist yet, call that out and continue with the existing docs.");
  }

  return lines.join("\n");
}

function buildFinishPrompt(docs) {
  return [
    "Review the changes made in this session.",
    `Update the relevant docs in /docs so future AI sessions understand the current state, architecture, decisions, and next work.`,
    `Relevant project memory files: ${docs.map((doc) => doc.relativePath).join(", ")}.`,
    "Only update the files that changed meaningfully during this session.",
  ].join("\n");
}

function buildTemplate(relativePath, workspaceName) {
  const fileName = path.basename(relativePath);
  const builder = TEMPLATE_BUILDERS[fileName];

  if (builder) {
    return builder(workspaceName);
  }

  return `# ${workspaceName}\n\nAdd durable project memory here.\n`;
}

function buildStatusTooltip(docs) {
  return docs.map((doc) => `${doc.exists ? "Exists" : "Missing"}: ${doc.relativePath}`).join("\n");
}

async function ensureDirectory(directoryPath) {
  await fs.promises.mkdir(directoryPath, { recursive: true });
}

module.exports = {
  activate,
  deactivate,
};
