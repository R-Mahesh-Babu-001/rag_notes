import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(import.meta.dirname, '..', 'dist');
const rootHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const routes = [
  { route: 'search', title: 'Search — The Process of RAG' },
  ...Array.from({ length: 8 }).map((_, i) => {
    const slug = String(i + 1).padStart(2, '0');
    return { route: `step/${slug}`, title: `Stage ${slug} — The Process of RAG` };
  }),
];

for (const { route, title } of routes) {
  const adjusted = rootHtml.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  const targetDir = path.join(distDir, route);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), adjusted, 'utf8');
}
