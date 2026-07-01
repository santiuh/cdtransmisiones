// POST /api/revalidate  (header x-revalidate-token)
// Webhook de rebuild on-demand — FALLBACK. El camino principal es la API de Vercel
// del panel (services.vercel_project_id). Sólo hace algo si están seteados
// REVALIDATE_TOKEN + VERCEL_DEPLOY_HOOK_URL en el proyecto.
export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const token = getHeader(event, 'x-revalidate-token') || ''
  if (!cfg.revalidateToken || token !== cfg.revalidateToken) {
    throw createError({ statusCode: 401, statusMessage: 'Token de revalidación inválido' })
  }
  let triggered = false
  const hook = cfg.vercelDeployHook as string
  if (hook) {
    try {
      await $fetch(hook, { method: 'POST' })
      triggered = true
    } catch (e) {
      console.warn('[revalidate] deploy hook falló:', (e as Error)?.message)
    }
  }
  return { ok: true, triggered }
})
