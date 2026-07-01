// GET /api/preview?token=<firmado>&edit=1
// URL que arma el panel para el iframe del editor visual. Redirige a la home con
// el token de borrador en query; plugins/00.sms-content lo lee y pide el borrador.
// noindex + no-store para que nunca se cachee ni indexe la vista de borrador.
export default defineEventHandler((event) => {
  // Parseamos el query del req.url crudo: en el runtime serverless de Vercel
  // getQuery(event) a veces llega vacío para rutas /api/*.
  const raw = event.node.req.url || ""
  const qs = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : ""
  const params = new URLSearchParams(qs)
  const q = getQuery(event)
  const token = params.get("token") || (q.token as string) || ""
  const editVal = params.get("edit") || String(q.edit ?? "")
  const edit = editVal === "1" ? "1" : "0"

  setResponseHeader(event, "X-Robots-Tag", "noindex, nofollow")
  setResponseHeader(event, "Cache-Control", "no-store, max-age=0")
  return sendRedirect(event, `/?__smsPreview=${encodeURIComponent(token)}&edit=${edit}`, 302)
})
