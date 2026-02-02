import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_ROOT = path.join(PROJECT_ROOT, 'src');
const TEST_ROOT = path.join(PROJECT_ROOT, 'test');

const ROOT_PREFIXES = ['modules/', 'common/', 'config/', 'database/'] as const;

function isSubpathOf(parent: string, child: string): boolean {
  const rel = path.relative(parent, child);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.ts') && !fullPath.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function tryResolveImportToAbsPath(moduleSpecifier: string): string | null {
  const absWithoutExt = path.join(SRC_ROOT, moduleSpecifier);

  const candidates = [
    `${absWithoutExt}.ts`,
    `${absWithoutExt}.tsx`,
    `${absWithoutExt}.js`,
    path.join(absWithoutExt, 'index.ts'),
    path.join(absWithoutExt, 'index.tsx'),
    path.join(absWithoutExt, 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

function stripKnownExt(p: string): string {
  return p.replace(/\.(ts|tsx|js)$/, '');
}

function shouldRewrite(moduleSpecifier: string): boolean {
  return ROOT_PREFIXES.some((prefix) => moduleSpecifier.startsWith(prefix));
}

type Replacement = { start: number; end: number; newText: string };

function processFile(filePath: string): { changed: boolean; warnings: string[]; replacements: number } {
  const original = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, original, ts.ScriptTarget.Latest, true);

  const replacements: Replacement[] = [];
  const warnings: string[] = [];

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const spec = node.moduleSpecifier;
      if (spec && ts.isStringLiteral(spec)) {
        const moduleText = spec.text;

        if (shouldRewrite(moduleText)) {
          const resolvedAbs = tryResolveImportToAbsPath(moduleText);
          if (!resolvedAbs) {
            warnings.push(`Unresolved import in ${filePath}: '${moduleText}'`);
            return;
          }

          // Safety: only rewrite imports that point inside src/
          if (!isSubpathOf(SRC_ROOT, resolvedAbs)) {
            warnings.push(`Refusing to rewrite import outside src in ${filePath}: '${moduleText}'`);
            return;
          }

          const relToFile = path.relative(path.dirname(filePath), resolvedAbs);
          let newSpecifier = stripKnownExt(toPosix(relToFile));
          if (!newSpecifier.startsWith('.')) {
            newSpecifier = `./${newSpecifier}`;
          }

          // Replace only the contents inside the quotes
          const start = spec.getStart(sourceFile) + 1;
          const end = spec.getEnd() - 1;
          replacements.push({ start, end, newText: newSpecifier });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (replacements.length === 0) {
    return { changed: false, warnings, replacements: 0 };
  }

  // Apply from end to start so offsets remain valid
  replacements.sort((a, b) => b.start - a.start);
  let updated = original;
  for (const r of replacements) {
    updated = `${updated.slice(0, r.start)}${r.newText}${updated.slice(r.end)}`;
  }

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return { changed: true, warnings, replacements: replacements.length };
  }

  return { changed: false, warnings, replacements: 0 };
}

function main(): void {
  const files = [...walk(SRC_ROOT), ...walk(TEST_ROOT)];

  let changedFiles = 0;
  let totalReplacements = 0;
  const warnings: string[] = [];

  for (const file of files) {
    const result = processFile(file);
    if (result.changed) changedFiles += 1;
    totalReplacements += result.replacements;
    warnings.push(...result.warnings);
  }

  // eslint-disable-next-line no-console
  console.log(`Updated ${changedFiles} file(s), rewrote ${totalReplacements} import(s).`);

  if (warnings.length) {
    // eslint-disable-next-line no-console
    console.warn(`Warnings (${warnings.length}):`);
    for (const w of warnings) {
      // eslint-disable-next-line no-console
      console.warn(`- ${w}`);
    }
    process.exitCode = 1;
  }
}

main();
