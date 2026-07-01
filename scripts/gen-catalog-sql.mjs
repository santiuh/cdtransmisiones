// Genera el SQL para poblar el widget Catálogo (catalog_categories + catalog_items)
// del service de Imoberdorf en Supabase, a partir de data/categories.js.
// Aplana la taxonomía 3 niveles → 2 (categoría principal → producto). `position`
// = número de ruta original (1..38) para poder mapear redirects 301 de las URLs
// viejas /Productos/N → /Productos/<uuid>.
//
// Uso:  node scripts/gen-catalog-sql.mjs > ../../scratchpad/catalog.sql
import { readFileSync } from "node:fs";

const SVC = "b4fcde24-d4f5-4db2-87d7-522aa26f544a";
const IMG_BASE = "https://www.imoberdorfhnos.com.ar/img/Productos/";

const src = readFileSync(new URL("../data/categories.js", import.meta.url), "utf8");
const categories = new Function(src.replace(/export\s+const\s+categories\s*=/, "return"))();

const rows = [];
for (const cat of categories) {
  for (const sub of cat.subcategories || []) {
    if (Array.isArray(sub.items) && sub.items.length) {
      for (const it of sub.items) {
        rows.push({ cat: cat.name, name: it.name, desc: it.descripcion || "", img: it.imagen, route: Number(it.route) });
      }
    } else if (sub.route) {
      rows.push({ cat: cat.name, name: sub.name, desc: sub.descripcion || "", img: sub.imagen, route: Number(sub.route) });
    }
  }
}

const catNames = [...new Set(rows.map((r) => r.cat))];
const q = (s) => `$sms$${String(s ?? "")}$sms$`;

let out = "";
out += `-- Migración de catálogo Imoberdorf → widget (service ${SVC})\n`;
out += `delete from catalog_items where service_id = '${SVC}';\n`;
out += `delete from catalog_categories where service_id = '${SVC}';\n\n`;

out += `insert into catalog_categories (service_id, name, position) values\n`;
out += catNames.map((n, i) => `  ('${SVC}', ${q(n)}, ${i})`).join(",\n") + ";\n\n";

out += `with cats as (select id, name from catalog_categories where service_id = '${SVC}')\n`;
out += `insert into catalog_items (service_id, category_id, name, description, photo_url, price_ars, position, featured, active)\n`;
out += `select '${SVC}', cats.id, v.name, v.description, v.photo, null, v.pos, false, true\n`;
out += `from (values\n`;
out += rows
  .map((r) => `  (${q(r.cat)}, ${q(r.name)}, ${q(r.desc)}, ${q(IMG_BASE + r.img)}, ${r.route})`)
  .join(",\n");
out += `\n) as v(catname, name, description, photo, pos)\n`;
out += `join cats on cats.name = v.catname;\n\n`;

out += `-- activar el módulo catálogo\n`;
out += `update services set features = coalesce(features, '{}'::jsonb) || jsonb_build_object('catalogo', jsonb_build_object('enabled', true)) where id = '${SVC}';\n`;

process.stdout.write(out);
process.stderr.write(`\n[gen] ${catNames.length} categorías, ${rows.length} productos\n`);
