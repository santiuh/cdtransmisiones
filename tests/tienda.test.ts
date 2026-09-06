// Tests de la lógica pura de la tienda. Correr con `npm test`
// (node:test + tsx; no requiere Nuxt ni navegador).
import { test } from "node:test";
import assert from "node:assert/strict";
import type { CatalogGroup } from "../utils/catalog";
import {
  aplanar,
  armarQuery,
  buscar,
  categorias,
  filtrarCategoria,
  filtrarPrecio,
  limpiarHtml,
  maximoUnidades,
  ordenar,
  paginar,
  parseOrden,
  parsePagina,
  parsePrecio,
  parseVista,
  puedeComprar,
  rangoPaginas,
  rangosDePrecio,
  resumir,
  sinHtml,
  slug,
  whatsappNumero,
} from "../utils/tienda";

const grupos: CatalogGroup[] = [
  {
    category: { id: "c1", name: "Motores Eléctricos", position: 0, active: true },
    items: [
      { id: "i1", category_id: "c1", name: "Línea W21", description: "Motor de <b>aluminio</b> multimontaje", price_ars: null, photo_url: null, position: 1, featured: false, active: true, stock: null },
      { id: "i2", category_id: "c1", name: "W22 IE3", description: "Trifásico de alta eficiencia", price_ars: 250000, photo_url: null, position: 2, featured: true, active: true, stock: 3 },
    ],
  },
  {
    category: { id: "c2", name: "Bombas de Agua", position: 1, active: true },
    items: [
      { id: "i3", category_id: "c2", name: "Bombas Solares", description: "Energía del sol", price_ars: 90000, photo_url: null, position: 3, featured: false, active: true, stock: 0 },
      { id: "i4", category_id: "c2", name: "Bombas Sumergibles", description: "Para aguas sucias", price_ars: 120000, photo_url: null, position: 4, featured: false, active: true, stock: null },
    ],
  },
  {
    category: { id: "c3", name: "Bombas de agua", position: 2, active: true },
    items: [
      { id: "i5", category_id: "c3", name: "Repuesto", description: null, price_ars: 40000, photo_url: null, position: 5, featured: false, active: true },
    ],
  },
  {
    category: null,
    items: [
      { id: "i6", category_id: null, name: "Suelto", description: null, price_ars: null, photo_url: null, position: 6, featured: false, active: true },
    ],
  },
];
const items = aplanar(grupos);
const ids = (arr: Array<{ id: string }>) => arr.map((i) => i.id);

test("aplanar: categoría, slug único y huérfanos", () => {
  assert.equal(items.length, 6);
  assert.equal(items[0]!.categoria_slug, "motores-electricos");
  assert.equal(items[2]!.categoria_slug, "bombas-de-agua");
  assert.equal(items[4]!.categoria_slug, "bombas-de-agua-2");
  assert.equal(items[5]!.categoria, null);
  assert.equal(items[5]!.categoria_slug, null);
});

test("categorias: conteo en orden de aparición", () => {
  const cats = categorias(items);
  assert.deepEqual(
    cats.map((c) => [c.slug, c.cantidad]),
    [["motores-electricos", 2], ["bombas-de-agua", 2], ["bombas-de-agua-2", 1]],
  );
  assert.deepEqual(ids(filtrarCategoria(items, "bombas-de-agua")), ["i3", "i4"]);
  assert.deepEqual(ids(filtrarCategoria(items, null)), ids(items));
});

test("buscar: todos los términos, sin acentos, en nombre/categoría/descripción", () => {
  assert.deepEqual(ids(buscar(items, "bomba sumerg")), ["i4"]);
  assert.deepEqual(ids(buscar(items, "aluminio")), ["i1"]);
  assert.deepEqual(ids(buscar(items, "electricos")), ["i1", "i2"]);
  assert.deepEqual(ids(buscar(items, "w22 solar")), []);
  assert.deepEqual(ids(buscar(items, "  ")), ids(items));
});

test("ordenar: relevancia con búsqueda, destacados, precio con nulls al final, nombre", () => {
  assert.equal(ordenar(buscar(items, "bombas"), "relevantes", "bombas")[0]!.id, "i3");
  assert.deepEqual(ids(ordenar(items, "relevantes")), ["i2", "i1", "i3", "i4", "i5", "i6"]);
  assert.deepEqual(ids(ordenar(items, "menor-precio")), ["i5", "i3", "i4", "i2", "i1", "i6"]);
  assert.deepEqual(ids(ordenar(items, "mayor-precio")), ["i2", "i4", "i3", "i5", "i1", "i6"]);
  assert.deepEqual(ids(ordenar(items, "nombre")), ["i3", "i4", "i1", "i5", "i6", "i2"]);
  assert.equal(ordenar(items, "nombre").length, items.length, "no muta la cantidad");
});

test("paginar + rangoPaginas", () => {
  const p2 = paginar(items, 2, 4);
  assert.deepEqual(ids(p2.items), ["i5", "i6"]);
  assert.deepEqual([p2.pagina, p2.paginas, p2.total, p2.desde, p2.hasta], [2, 2, 6, 5, 6]);
  assert.equal(paginar(items, 99, 4).pagina, 2, "clampa al último");
  assert.equal(paginar(items, 0, 4).pagina, 1);
  assert.deepEqual(paginar([], 3, 4).desde, 0);
  assert.deepEqual(rangoPaginas(1, 3), [1, 2, 3]);
  assert.deepEqual(rangoPaginas(5, 10), [1, "…", 4, 5, 6, "…", 10]);
  assert.deepEqual(rangoPaginas(2, 10), [1, 2, 3, "…", 10]);
  assert.deepEqual(rangoPaginas(10, 10), [1, "…", 9, 10]);
});

test("precio: rangos estilo ML, parseo y filtro", () => {
  // Terciles 90000 y 120000 redondeados a números "lindos" (pasos de medio orden
  // de magnitud): 90000 queda, 120000 → 100000.
  const rangos = rangosDePrecio(items);
  assert.deepEqual(rangos.map((r) => r.valor), ["-90000", "90000-100000", "100000-"]);
  assert.match(rangos[0]!.etiqueta, /^Hasta/);
  assert.match(rangos[2]!.etiqueta, /^Más de/);
  assert.deepEqual(rangosDePrecio(items.slice(0, 3)), [], "con menos de 4 precios no hay rangos");

  assert.deepEqual(parsePrecio("-50000"), { min: null, max: 50000 });
  assert.deepEqual(parsePrecio("50000-150000"), { min: 50000, max: 150000 });
  assert.deepEqual(parsePrecio("150000-"), { min: 150000, max: null });
  assert.equal(parsePrecio("abc"), null);
  assert.equal(parsePrecio("-"), null);
  assert.equal(parsePrecio("200-100"), null);
  assert.equal(parsePrecio(undefined), null);

  assert.deepEqual(ids(filtrarPrecio(items, 50000, 130000)), ["i3", "i4"], "excluye sin precio y fuera de rango");
  assert.deepEqual(ids(filtrarPrecio(items, null, null)), ids(items));
});

test("armarQuery: conserva claves conocidas, borra nulls y vuelve a página 1", () => {
  assert.deepEqual(armarQuery({ q: "x", pagina: "3", categoria: "a", ajeno: "z" }, { categoria: "b" }), { q: "x", categoria: "b" });
  assert.deepEqual(armarQuery({ q: "x", pagina: "3" }, { pagina: "2" }), { q: "x", pagina: "2" });
  assert.deepEqual(armarQuery({ q: "x", orden: "nombre" }, { q: null }), { orden: "nombre" });
  assert.deepEqual(armarQuery({ q: ["a", "b"] }, {}), {}, "ignora valores no string");
});

test("parseOrden / parsePagina / parseVista", () => {
  assert.equal(parseOrden("mayor-precio"), "mayor-precio");
  assert.equal(parseOrden("lo-que-sea"), "relevantes");
  assert.equal(parsePagina("3"), 3);
  assert.equal(parsePagina("0"), 1);
  assert.equal(parsePagina("abc"), 1);
  assert.equal(parseVista("lista"), "lista");
  assert.equal(parseVista("grilla"), "grilla");
  assert.equal(parseVista("x"), "grilla", "la grilla es la vista por defecto");
  assert.equal(parseVista(undefined), "grilla");
});

test("puedeComprar / maximoUnidades", () => {
  const ok = { price_ars: 100, stock: null, active: true };
  assert.equal(puedeComprar(ok, true), true);
  assert.equal(puedeComprar(ok, false), false, "tienda apagada");
  assert.equal(puedeComprar({ ...ok, price_ars: null }, true), false, "a consultar");
  assert.equal(puedeComprar({ ...ok, stock: 0 }, true), false, "agotado");
  assert.equal(puedeComprar({ ...ok, stock: 2 }, true), true);
  assert.equal(puedeComprar({ ...ok, active: false }, true), false);
  assert.equal(maximoUnidades({ stock: null }), 99);
  assert.equal(maximoUnidades({ stock: 3 }), 3);
  assert.equal(maximoUnidades({ stock: 500 }), 99);
});

test("texto: limpiarHtml, sinHtml, resumir, slug", () => {
  assert.equal(
    limpiarHtml('<p onclick="x()">Hola <script>alert(1)</script><b style="a">mundo</b><img src=x></p><br/>'),
    "<p>Hola <b>mundo</b></p><br>",
  );
  assert.equal(sinHtml("a<br>b &amp; c<p>d</p>"), "a b & c d");
  const largo = "una palabra ".repeat(30).trim();
  const corto = resumir(largo, 50);
  assert.ok(corto.length <= 51 && corto.endsWith("…"));
  assert.ok(!corto.slice(0, -1).endsWith(" "), "sin espacio antes de los puntos");
  assert.equal(resumir("corto", 50), "corto");
  assert.equal(slug("Motores Eléctricos / Ñandú"), "motores-electricos-nandu");
});

test("whatsappNumero: normaliza a 549 + área + número", () => {
  assert.equal(whatsappNumero("+54 9 3492 57-3782"), "5493492573782");
  assert.equal(whatsappNumero("3492 573782"), "5493492573782");
  assert.equal(whatsappNumero("0 3492 573782"), "5493492573782");
  assert.equal(whatsappNumero("00 54 9 3492 573782"), "5493492573782");
  assert.equal(whatsappNumero(""), "");
  assert.equal(whatsappNumero("123"), "");
  assert.equal(whatsappNumero(undefined), "");
});
