// Builds a portfolio board from every PROJECT.md below a folder.
//
//   npx tsx scripts/board.ts <folder>          markdown table
//   npx tsx scripts/board.ts <folder> --json   raw data

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

interface Step {
  readonly number: string;
  readonly title: string;
  readonly status: string;
}

interface Project {
  readonly path: string;
  readonly name: string;
  readonly status: string;
  readonly due: string;
  readonly steps: readonly Step[];
  readonly openQuestions: readonly string[];
  readonly lastLog: string;
}

const IGNORED_DIRS = new Set([".git", "node_modules"]);
const STATUS_ORDER = ["waiting", "active", "paused", "done"];
// The step that needs attention first: a result waiting for a check beats everything else.
const STEP_ATTENTION = ["review", "blocked", "out", "open"];

function findProjectFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !IGNORED_DIRS.has(entry.name)) {
      found.push(...findProjectFiles(join(dir, entry.name)));
    } else if (entry.isFile() && entry.name === "PROJECT.md") {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

function splitSections(lines: readonly string[]): Map<string, string[]> {
  const sections = new Map<string, string[]>();
  let current = "";
  sections.set(current, []);
  for (const line of lines) {
    if (line.startsWith("## ")) {
      current = line.slice(3).trim().toLowerCase();
      sections.set(current, []);
    } else {
      sections.get(current)?.push(line);
    }
  }
  return sections;
}

function readField(lines: readonly string[], field: string): string {
  const prefix = `- ${field.toLowerCase()}:`;
  const line = lines.find((candidate) => candidate.trim().toLowerCase().startsWith(prefix));
  return line ? line.trim().slice(prefix.length).trim() : "";
}

function bullets(lines: readonly string[]): string[] {
  return lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function parseSteps(lines: readonly string[]): Step[] {
  const rows = lines.map((line) => line.trim()).filter((line) => line.startsWith("|"));
  // First row is the header, second the |---| separator.
  return rows.slice(2).map((row) => {
    const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
    return { number: cells[0] ?? "", title: cells[1] ?? "", status: (cells[2] ?? "").toLowerCase() };
  });
}

function parseProject(file: string, root: string): Project {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const sections = splitSections(lines);
  const header = sections.get("") ?? [];
  const title = header.find((line) => line.startsWith("# "));
  const questions = bullets(sections.get("open questions") ?? []).filter(
    (question) => question.toLowerCase() !== "none",
  );
  const log = bullets(sections.get("log") ?? []);

  return {
    path: relative(root, file),
    name: title ? title.slice(2).trim() : relative(root, file),
    status: readField(header, "Status").toLowerCase() || "active",
    due: readField(header, "Due"),
    steps: parseSteps(sections.get("steps") ?? []),
    openQuestions: questions,
    lastLog: log.at(-1) ?? "",
  };
}

function currentStep(project: Project): Step | undefined {
  for (const status of STEP_ATTENTION) {
    const step = project.steps.find((candidate) => candidate.status === status);
    if (step) {
      return step;
    }
  }
  return undefined;
}

function formatDue(project: Project, today: string): string {
  if (!project.due) {
    return "";
  }
  return project.status !== "done" && project.due < today ? `${project.due} (overdue)` : project.due;
}

function rank(status: string): number {
  const index = STATUS_ORDER.indexOf(status);
  return index === -1 ? STATUS_ORDER.length : index;
}

function compareProjects(a: Project, b: Project): number {
  const byStatus = rank(a.status) - rank(b.status);
  if (byStatus !== 0) {
    return byStatus;
  }
  return (a.due || "9999").localeCompare(b.due || "9999");
}

function cell(text: string): string {
  return text.replaceAll("|", "\\|");
}

function renderBoard(projects: readonly Project[], today: string): string {
  const rows = projects.map((project) => {
    const checked = project.steps.filter((step) => step.status === "checked").length;
    const step = currentStep(project);
    return [
      project.name,
      project.status,
      `${checked}/${project.steps.length}`,
      step ? `#${step.number} ${step.title} (${step.status})` : "",
      formatDue(project, today),
      String(project.openQuestions.length),
      project.lastLog,
    ].map(cell);
  });
  const header = ["Project", "Status", "Checked", "Current step", "Due", "Questions", "Last log"];
  const lines = [header, header.map(() => "---"), ...rows].map((row) => `| ${row.join(" | ")} |`);

  const questions = projects.flatMap((project) =>
    project.openQuestions.map((question) => `- ${project.name}: ${question}`),
  );
  if (questions.length > 0) {
    lines.push("", "Open questions", "", ...questions);
  }
  return lines.join("\n");
}

function main(): void {
  const args = process.argv.slice(2);
  const root = args.find((arg) => !arg.startsWith("--")) ?? ".";
  if (!existsSync(root)) {
    process.stderr.write(`Folder not found: ${root}\n`);
    process.exitCode = 1;
    return;
  }
  const projects = findProjectFiles(root)
    .map((file) => parseProject(file, root))
    .toSorted(compareProjects);

  if (projects.length === 0) {
    process.stderr.write(`No PROJECT.md found below ${root}\n`);
    process.exitCode = 1;
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const output = args.includes("--json") ? JSON.stringify(projects, undefined, 2) : renderBoard(projects, today);
  process.stdout.write(`${output}\n`);
}

main();
