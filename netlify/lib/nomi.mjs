// Stesso filtro dei nomi usato dentro Saltamondo (saltamondo/index.html): tenerli uguali.
// ---------- nomi: niente parolacce, e ogni nome è di un giocatore solo ----------
// Le parole sono confrontate sullo "scheletro" del nome: minuscole, senza accenti né simboli,
// 4→a, 3→e, k→c..., lettere doppie ridotte a una. Così "C4ZZ0" e "kazzzo" diventano "cazo".
const NOMI_VIETATI = {
  // vietate ovunque nel nome
  ovunque: ['cazzo', 'cazzi', 'cazza', 'minchia', 'minchie', 'merda', 'merde', 'stronzo', 'stronza', 'stronzi', 'puttana', 'puttane',
    'troia', 'troie', 'vaffanculo', 'fanculo', 'coglione', 'coglioni', 'bastardo', 'bastarda', 'porcodio', 'porcoddio', 'dioporco',
    'diocane', 'dioboia', 'porcamadonna', 'madonnaputtana', 'bocchino', 'pompino', 'ricchione', 'frocio', 'froci', 'mignotta',
    'zoccola', 'sborra', 'segaiolo', 'culattone', 'inculo', 'inculata', 'rottinculo', 'culo', 'scopata', 'scopami', 'pirla',
    'figlio di puttana', 'testa di cazzo', 'leccaculo', 'puttaniere', 'cornuto', 'stupro', 'stuprat', 'pedofilo', 'suicidio',
    'hitler', 'nazista', 'mussolini', 'fuck', 'fucker', 'shit', 'bitch', 'cunt', 'pussy', 'whore', 'slut', 'asshole', 'motherf',
    'penis', 'vagina', 'porno', 'porn', 'sexy', 'fvck', 'dickhead', 'cocksucker', 'nigger', 'nigga', 'faggot', 'dildo', 'wank', 'bastard'],
  // vietate all'inizio del nome (in mezzo sono spesso nomi normali: Magnifica, Benedict...)
  inizio: ['fica', 'fich', 'figa', 'tette', 'tetta', 'negro', 'negra', 'tits', 'puta', 'sex'],
  // vietate solo come nome intero
  intero: ['pene', 'sega', 'dick', 'cock', 'ano', 'anal', 'cum', 'nazi', 'kkk', 'wc', 'cesso', 'rutto', 'scoreggia']
};
function nomeChiave(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
function nomeScheletro(s) {
  const leet = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', '@': 'a', '$': 's', '!': 'i', '|': 'i', '€': 'e', '+': 't', k: 'c', y: 'i', j: 'i', q: 'c' };
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[0-9@$!|€+kyjq]/g, c => leet[c] || '').replace(/[^a-z]/g, '').replace(/(.)\1+/g, '$1');
}
const NOMI_SCHELETRI = Object.fromEntries(Object.entries(NOMI_VIETATI).map(([k, a]) => [k, [...new Set(a.map(nomeScheletro))]]));
function nomeBrutto(s) {
  const sk = nomeScheletro(s);
  return NOMI_SCHELETRI.ovunque.some(w => sk.includes(w)) || NOMI_SCHELETRI.inizio.some(w => sk.startsWith(w)) || NOMI_SCHELETRI.intero.includes(sk);
}

export { nomeChiave, nomeBrutto };
