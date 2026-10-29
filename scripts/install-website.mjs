// Install the website and the example workspaces imported by its pages.
import {readdirSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';

const examples = new Set();
function scan(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (/\.(?:js|jsx|ts|tsx|mdx)$/.test(entry.name)) {
      const source = readFileSync(path, 'utf8');
      for (const match of source.matchAll(/website-examples\/([\w-]+)\//g)) {
        examples.add(match[1]);
      }
    }
  }
}
scan('website/src');
const args = ['ci', '--workspace', 'website'];
for (const example of [...examples].sort()) {
  args.push('--workspace', `examples/${example}`);
}
const result = spawnSync('npm', args, {stdio: 'inherit'});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
