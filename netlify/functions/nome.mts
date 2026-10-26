import { getStore } from "@netlify/blobs"
import type { Config } from "@netlify/functions"
import { nomeBrutto, nomeChiave } from "../lib/nomi.mjs"

// Registro dei nomi di Saltamondo: ogni nome appartiene a un solo giocatore.
// Il giocatore è riconosciuto da un id casuale (pid) che il gioco salva nel suo browser.
// POST { name, pid, old? } → 200 ok | 409 preso | 400 brutto o richiesta sbagliata.
const risposta = (status: number, esito: string) => Response.json({ esito }, { status })

export default async (req: Request) => {
  let body: { name?: unknown; pid?: unknown; old?: unknown }
  try {
    body = await req.json()
  } catch {
    return risposta(400, "richiesta")
  }
  const name = String(body?.name ?? "").trim()
  const pid = String(body?.pid ?? "")
  const key = nomeChiave(name)
  if (!/^[a-z0-9]{16,40}$/.test(pid) || name.length > 12) return risposta(400, "richiesta")
  if (!key || nomeBrutto(name)) return risposta(400, "brutto")

  const nomi = getStore({ name: "saltamondo-nomi", consistency: "strong" })
  const nuovo = { pid, name, at: Date.now() }
  const { modified } = await nomi.setJSON(key, nuovo, { onlyIfNew: true })
  if (!modified) {
    const chi = await nomi.get(key, { type: "json" })
    if (chi && chi.pid !== pid) return risposta(409, "preso")
    if (!chi) await nomi.setJSON(key, nuovo)
  }

  // il vecchio nome torna libero, ma solo se era di questo giocatore
  const vecchio = nomeChiave(String(body?.old ?? ""))
  if (vecchio && vecchio !== key) {
    const chi = await nomi.get(vecchio, { type: "json" })
    if (chi && chi.pid === pid) await nomi.delete(vecchio)
  }
  return risposta(200, "ok")
}

export const config: Config = { path: "/api/nome", method: "POST" }
