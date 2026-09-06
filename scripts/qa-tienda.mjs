// QA end-to-end de la tienda de Imoberdorf con Playwright (chrome del sistema).
// Fase A (tienda APAGADA, sitio real): listado, filtros, orden, búsqueda, ficha,
// carrito vacío, mobile + cajón de filtros, header.
// Fase B (tienda PRENDIDA, servicio claude-test): agregar al carrito, aviso,
// contador, ficha con stock, carrito con totales, "Continuar compra" → sesión
// de checkout en la plataforma → checkout hosteado en soldemayosoft.com.
//
// Uso: node qa-tienda.mjs [--fase=A|B|AB] [--a=http://localhost:3210] [--b=http://localhost:3211]
// Los servers los levanta el launch.json de la sesión (3210 = sitio real con la
// tienda apagada, 3211 = .env.test apuntando al servicio de prueba claude-test).
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Este repo no depende de Playwright: se toma prestado el del monorepo de la
// plataforma (o el que haya instalado, o el que indique PLAYWRIGHT_FROM).
const CANDIDATOS = [
  import.meta.url,
  process.env.PLAYWRIGHT_FROM,
  "E:/codigo/soldemayosoft/package.json",
].filter(Boolean);
let chromium;
for (const desde of CANDIDATOS) {
  try {
    const req = createRequire(desde);
    ({ chromium } = req("playwright-core"));
    console.log("playwright-core", req("playwright-core/package.json").version, "←", desde);
    break;
  } catch {
    /* probamos el siguiente */
  }
}
if (!chromium) {
  console.error("[qa] no encontré playwright-core. Instalalo o pasá PLAYWRIGHT_FROM=<ruta a un package.json que lo tenga>.");
  process.exit(1);
}

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const FASE = args.fase || "AB";
const A = args.a || "http://localhost:3210";
const B = args.b || "http://localhost:3211";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "qa");
mkdirSync(OUT, { recursive: true });

const fallas = [];
const ok = (cond, msg) => {
  if (cond) console.log("  ✓", msg);
  else {
    console.log("  ✗", msg);
    fallas.push(msg);
  }
};
const shot = (page, name, opts = {}) => page.screenshot({ path: resolve(OUT, `${name}.png`), ...opts });
const visible = (loc) => loc.filter({ visible: true }).first();

function vigilar(page, etiqueta) {
  const problemas = [];
  page.on("console", (m) => {
    const t = m.type();
    const txt = m.text();
    // Las clases aos-init/aos-animate las agrega el plugin AOS del sitio (home/empresa)
    // antes de hidratar: es un desajuste preexistente ajeno a la tienda.
    if (/aos-init|aos-animate|Hydration completed but contains mismatches/.test(txt)) return;
    if (t === "error" || (t === "warning" && /hydration|mismatch|\[Vue warn\]/i.test(txt))) {
      problemas.push(`${t}: ${txt.slice(0, 300)}`);
    }
  });
  page.on("pageerror", (e) => problemas.push(`pageerror: ${String(e).slice(0, 300)}`));
  page.on("response", (r) => {
    if (r.status() >= 400 && !/favicon/.test(r.url())) problemas.push(`http ${r.status()}: ${r.url().slice(0, 160)}`);
  });
  return () => {
    ok(problemas.length === 0, `${etiqueta}: sin errores de consola/red/hidratación${problemas.length ? " → " + problemas.join(" | ") : ""}`);
    problemas.length = 0;
  };
}

/** Captura el cuerpo de la respuesta del POST checkout-sessions antes de que la página navegue. */
async function capturarCheckout(page) {
  const capturado = { status: 0, body: {} };
  await page.route("**/shop/checkout-sessions", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    const r = await route.fetch();
    const text = await r.text();
    capturado.status = r.status();
    try {
      capturado.body = JSON.parse(text);
    } catch {
      capturado.body = { raw: text.slice(0, 200) };
    }
    await route.fulfill({ response: r, body: text });
  });
  return capturado;
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const W21 = "fa01d954-8c7e-4c78-a756-08ab4f3c97c7";

try {
  if (FASE.includes("A")) {
    console.log("\n== FASE A · tienda apagada (sitio real) ==", A);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "es-AR" });
    const page = await ctx.newPage();
    const revisar = vigilar(page, "desktop");

    await page.goto(`${A}/Productos`, { waitUntil: "networkidle" });
    ok((await page.locator("h1").first().textContent())?.trim() === "Productos", "h1 = Productos");
    ok(await visible(page.getByText("38 resultados")).isVisible(), "38 resultados");
    ok((await page.locator("article.t-card").count()) === 16, "16 tarjetas en la página 1");
    ok((await page.locator('a[href="/Productos/carrito"]').count()) === 0, "sin ícono de carrito (tienda apagada)");
    await shot(page, "A-listado-desktop");
    await shot(page, "A-listado-desktop-full", { fullPage: true });

    // Mega-menú del header
    await page.getByRole("link", { name: "PRODUCTOS", exact: true }).hover();
    await page.waitForTimeout(400);
    ok(await page.getByRole("link", { name: /Ver todos los productos/ }).isVisible(), "mega-menú: Ver todos los productos");
    await shot(page, "A-megamenu-desktop");
    await page.mouse.move(10, 500);

    // Filtro por categoría
    await page.locator("aside").getByRole("link", { name: /^Drives/ }).click();
    await page.waitForURL(/categoria=drives/);
    await page.waitForLoadState("networkidle");
    ok(await visible(page.getByText("13 resultados")).isVisible(), "Drives → 13 resultados");
    ok((await page.locator("h1").first().textContent())?.trim() === "Drives", "h1 = Drives");
    await shot(page, "A-categoria-drives");

    // Orden por nombre
    await page.locator("select").last().selectOption("nombre");
    await page.waitForURL(/orden=nombre/);
    await page.waitForLoadState("networkidle");
    const primero = (await page.locator("article.t-card h2").first().textContent())?.trim();
    ok(primero === "Arrancadores Directos", `orden A-Z → primero "${primero}"`);

    // Grilla por defecto (4 columnas) y lista como alternativa
    ok((await page.locator("ol.grid").count()) === 1, "grilla por defecto");
    ok((await page.locator("article.t-card button, article.t-card a.t-btn").count()) === 0, "grilla: tarjetas sin botones (como ML)");
    await shot(page, "A-grilla-drives");
    await page.getByRole("link", { name: "Ver en lista" }).click();
    await page.waitForURL(/vista=lista/);
    await page.waitForLoadState("networkidle");
    ok((await page.locator('section[aria-label="Resultados"] > ol.flex').count()) === 1, "vista lista con ?vista=lista");
    await shot(page, "A-lista-drives");

    // Búsqueda
    await page.goto(`${A}/Productos`, { waitUntil: "networkidle" });
    await page.fill("#tienda-buscar", "bomba");
    await page.press("#tienda-buscar", "Enter");
    await page.waitForURL(/q=bomba/);
    await page.waitForLoadState("networkidle");
    const nRes = Number(((await visible(page.getByText(/\d+ resultados?/)).textContent()) || "").match(/\d+/)?.[0]);
    const primeroQ = (await page.locator("article.t-card h2").first().textContent())?.trim() || "";
    ok(nRes >= 5, `búsqueda "bomba" → ${nRes} resultados`);
    ok(/^Bombas/.test(primeroQ), `primer resultado por nombre: "${primeroQ}"`);
    await shot(page, "A-busqueda-bomba");

    // Paginación
    await page.goto(`${A}/Productos`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Siguiente" }).click();
    await page.waitForURL(/pagina=2/);
    await page.waitForLoadState("networkidle");
    ok((await page.locator("article.t-card").count()) === 16, "página 2 → 16 tarjetas");
    await page.getByRole("link", { name: "3", exact: true }).click();
    await page.waitForURL(/pagina=3/);
    await page.waitForLoadState("networkidle");
    ok((await page.locator("article.t-card").count()) === 6, "página 3 → 6 tarjetas");

    // Ficha
    await page.goto(`${A}/Productos/${W21}`, { waitUntil: "networkidle" });
    ok((await page.locator("h1").first().textContent())?.trim() === "Línea W21", "ficha: h1 Línea W21");
    ok(await visible(page.getByText("Consultar precio")).isVisible(), "ficha: Consultar precio");
    const wsp = await page.getByRole("link", { name: /Consultar por WhatsApp/ }).first().getAttribute("href");
    ok(!!wsp && wsp.includes("wa.me/5493492573782") && wsp.includes("W21"), "ficha: WhatsApp pre-cargado con el producto");
    ok((await page.locator("#relacionados-titulo ~ ul article").count()) === 4, "ficha: 4 relacionados");
    ok(await visible(page.getByText("Descripción")).isVisible(), "ficha: Descripción");
    await shot(page, "A-ficha-desktop");
    await shot(page, "A-ficha-desktop-full", { fullPage: true });

    // Carrito vacío
    await page.goto(`${A}/Productos/carrito`, { waitUntil: "networkidle" });
    ok(await page.getByText("Tu carrito está vacío").isVisible(), "carrito vacío (tienda apagada)");
    await shot(page, "A-carrito-vacio");
    revisar();
    await ctx.close();

    // Mobile
    const mctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      locale: "es-AR",
    });
    const m = await mctx.newPage();
    const revisarM = vigilar(m, "mobile");
    await m.goto(`${A}/Productos`, { waitUntil: "networkidle" });
    ok(await visible(m.getByText("38 resultados")).isVisible(), "mobile: 38 resultados");
    ok(await m.locator(".fixed.bottom-7").isVisible(), "mobile listado: FAB WhatsApp visible");
    await shot(m, "A-mobile-listado");
    await m.getByRole("button", { name: /Filtrar/ }).click();
    await m.waitForTimeout(400);
    ok(await m.getByRole("dialog").isVisible(), "mobile: cajón de filtros abierto");
    await shot(m, "A-mobile-filtros");
    await m.getByRole("dialog").getByRole("link", { name: /^Bombas de Agua/ }).click();
    await m.waitForURL(/categoria=bombas-de-agua/);
    await m.waitForLoadState("networkidle");
    await m.waitForTimeout(400);
    ok((await m.getByRole("dialog").count()) === 0, "mobile: el cajón se cierra al filtrar");
    ok(await visible(m.getByText("5 resultados")).isVisible(), "mobile: Bombas de Agua → 5 resultados");
    await shot(m, "A-mobile-bombas");

    await m.goto(`${A}/Productos/${W21}`, { waitUntil: "networkidle" });
    ok(await m.locator(".fixed.bottom-0").getByRole("link", { name: /Consultar/ }).isVisible(), "mobile ficha: barra inferior con Consultar");
    ok(!(await m.locator(".fixed.bottom-7").isVisible()), "mobile ficha: FAB WhatsApp oculto (no tapa la barra)");
    await shot(m, "A-mobile-ficha");
    await shot(m, "A-mobile-ficha-full", { fullPage: true });
    revisarM();

    // Menú mobile: PRODUCTOS + flecha (en el home; sus avisos de AOS se ignoran)
    await m.goto(`${A}/`, { waitUntil: "networkidle" });
    await m.locator("nav svg").first().click();
    await m.waitForTimeout(300);
    await m.getByRole("button", { name: "Ver categorías de productos" }).click();
    await m.waitForTimeout(300);
    ok(await m.getByRole("button", { name: /Ver todos los productos/ }).isVisible(), "mobile menú: Ver todos los productos");
    await shot(m, "A-mobile-menu");
    await mctx.close();
  }

  if (FASE.includes("B")) {
    console.log("\n== FASE B · tienda prendida (servicio claude-test) ==", B);
    const CORTE = "2b7d171f-87c3-4fb7-8669-46ac1225704c";
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "es-AR" });
    const page = await ctx.newPage();
    const revisar = vigilar(page, "B desktop");
    const checkout = await capturarCheckout(page);

    await page.goto(`${B}/Productos`, { waitUntil: "networkidle" });
    ok((await page.locator('a[href="/Productos/carrito"]').count()) >= 1, "header: ícono de carrito visible (tienda prendida)");
    const cardCorte = page.locator("article.t-card", { hasText: "Corte premium" });
    ok(await cardCorte.getByText("$ 12.500").isVisible(), "tarjeta: precio $ 12.500");
    ok(await cardCorte.getByText(/Comprá online/).isVisible(), "tarjeta: Comprá online");
    ok(await page.locator("article.t-card", { hasText: "Color a medida" }).getByText("Consultar precio").isVisible(), "tarjeta sin precio: Consultar precio");
    await shot(page, "B-listado-desktop");
    ok((await cardCorte.getByRole("button").count()) === 0, "grilla: la tarjeta con precio tampoco tiene botones (como ML)");

    // El agregado rápido vive en la vista lista (la grilla es solo link, como ML).
    await page.goto(`${B}/Productos?vista=lista`, { waitUntil: "networkidle" });
    await shot(page, "B-lista-desktop");
    await cardCorte.getByRole("button", { name: /Agregar al carrito/ }).click();
    await page.waitForTimeout(300);
    ok(await page.getByRole("status").getByText(/Agregaste Corte premium/).isVisible(), "aviso: Agregaste Corte premium al carrito");
    const badge = page.locator('a[href="/Productos/carrito"] span').first();
    ok((await badge.textContent())?.trim() === "1", "contador del carrito = 1");
    await shot(page, "B-agregado-aviso");

    // Ficha con stock + cantidad
    await page.goto(`${B}/Productos/${CORTE}`, { waitUntil: "networkidle" });
    ok(await page.getByText("(10 disponibles)").isVisible(), "ficha: (10 disponibles)");
    await page.getByRole("button", { name: "Agregar una unidad" }).click();
    await page.getByRole("button", { name: "Agregar una unidad" }).click();
    ok((await page.getByRole("group", { name: "Cantidad" }).locator("span").textContent())?.trim() === "3", "cantidad = 3");
    await page.getByRole("button", { name: /Agregar al carrito/ }).first().click();
    await page.waitForTimeout(300);
    ok((await badge.textContent())?.trim() === "4", "contador del carrito = 4");
    await shot(page, "B-ficha-desktop");

    // Carrito
    await page.goto(`${B}/Productos/carrito`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    ok(await page.getByText("Productos (4)").isVisible(), "carrito: Productos (4)");
    const totales = await page.locator("aside").getByText("$ 50.000").count();
    ok(totales >= 2, "carrito: subtotal y total $ 50.000");
    await shot(page, "B-carrito-desktop");

    await page.getByRole("button", { name: "Continuar compra" }).first().click();
    await page.waitForURL(/soldemayosoft\.com\/tienda\/checkout\//, { timeout: 30000 });
    ok(checkout.status === 200 && typeof checkout.body.checkout_url === "string", `POST checkout-sessions → ${checkout.status} ${checkout.body.checkout_url || JSON.stringify(checkout.body)}`);
    await page.waitForLoadState("networkidle");
    ok(/Finalizar compra/.test(await page.title()), `checkout hosteado: "${await page.title()}"`);
    ok(await page.getByText("Corte premium").first().isVisible(), "checkout hosteado: muestra Corte premium");
    await shot(page, "B-checkout-hosteado");
    console.log("  token:", checkout.body.token);

    // Al volver, el carrito quedó vacío (viajó a la plataforma)
    await page.goto(`${B}/Productos/carrito`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    ok(await page.getByText("Tu carrito está vacío").isVisible(), "carrito vacío después del checkout");

    // Comprar ahora (ficha) → sesión con ese producto solo
    await page.goto(`${B}/Productos/${CORTE}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Comprar ahora" }).click();
    await page.waitForURL(/soldemayosoft\.com\/tienda\/checkout\//, { timeout: 30000 });
    ok(checkout.status === 200 && !!checkout.body.checkout_url, `Comprar ahora → ${checkout.status}`);
    console.log("  token:", checkout.body.token);
    revisar();
    await ctx.close();

    const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "es-AR" });
    const m = await mctx.newPage();
    const revisarM = vigilar(m, "B mobile");
    await m.goto(`${B}/Productos/${CORTE}`, { waitUntil: "networkidle" });
    ok(await m.locator(".fixed.bottom-0").getByRole("button", { name: /Agregar al carrito/ }).isVisible(), "mobile ficha: barra inferior con Agregar al carrito");
    await m.locator(".fixed.bottom-0").getByRole("button", { name: /Agregar al carrito/ }).click();
    await m.waitForTimeout(300);
    ok((await m.locator('a[href="/Productos/carrito"] span').first().textContent())?.trim() === "1", "mobile: contador = 1");
    await shot(m, "B-mobile-ficha");
    await m.goto(`${B}/Productos/carrito`, { waitUntil: "networkidle" });
    await m.waitForTimeout(300);
    await shot(m, "B-mobile-carrito");
    await shot(m, "B-mobile-carrito-full", { fullPage: true });
    revisarM();
    await mctx.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${fallas.length ? "FALLAS: " + fallas.length : "TODO OK"}`);
for (const f of fallas) console.log(" -", f);
process.exit(fallas.length ? 1 : 0);
