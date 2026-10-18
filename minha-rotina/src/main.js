import { createClient } from '@supabase/supabase-js';
import DATA from './agenda.json';
import './style.css';


const AREAS = {
  trabalho: { nome: 'Trabalho', cor: 'var(--c-trabalho)' },
  treino: { nome: 'Treino', cor: 'var(--c-treino)' },
  familia: { nome: 'Família', cor: 'var(--c-familia)' },
  fe: { nome: 'Espiritualidade', cor: 'var(--c-fe)' },
  cuidado: { nome: 'Saúde e descanso', cor: 'var(--c-cuidado)' },
  casa: { nome: 'Organização', cor: 'var(--c-casa)' },
};
const CAT = { 'Trabalho': 'var(--c-trabalho)', 'Deslocamento': 'var(--c-trajeto)', 'Treino': 'var(--c-treino)', 'Refeição': 'var(--c-refeicao)', 'Família': 'var(--c-familia)', 'Espiritualidade': 'var(--c-fe)', 'Cuidados pessoais': 'var(--c-cuidado)', 'Sono': 'var(--c-sono)' };
const CAT_ORDER = Object.keys(CAT);
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const PERIODOS = ['Manhã', 'Tarde', 'Noite', 'Durante o dia'];
const SEMANA_ORD = [1, 2, 3, 4, 5, 6, 0]; // segunda..domingo

// ---------- rotina padrão do checklist ----------
const T = (id, hora, titulo, area, periodo) => ({ id, hora, titulo, area, periodo });
const agua = () => T('agua', '', 'Beber 2 litros de água ao longo do dia', 'cuidado', 'Durante o dia');
function diaUtil(treino, extras) {
  return [
    T('acordar', '05:30', 'Acordar às 05h30', 'cuidado', 'Manhã'),
    T('mochila', '05:40', 'Mochila pronta: marmita, computador e roupa da academia', 'casa', 'Manhã'),
    T('oracao', '06:30', 'Oração no início do trajeto', 'fe', 'Manhã'),
    T('roleta', '08:10', 'Participar da roleta de vendas', 'trabalho', 'Manhã'),
    T('cafe', '08:45', 'Tomar café da manhã', 'cuidado', 'Manhã'),
    T('planilha', '09:00', 'Organizar a planilha de clientes e definir prioridades', 'trabalho', 'Manhã'),
    T('treino', '10:30', 'Treino: ' + treino, 'treino', 'Manhã'),
    T('almoco', '11:45', 'Almoçar', 'cuidado', 'Manhã'),
    T('ligacoes', '13:00', 'Ligar para os clientes da base', 'trabalho', 'Tarde'),
    T('leads', '14:30', 'Trabalhar a carteira de leads', 'trabalho', 'Tarde'),
    T('oferta', '16:00', 'Fazer oferta ativa', 'trabalho', 'Tarde'),
    T('pap', '17:30', 'Preparar material para o PAP', 'trabalho', 'Tarde'),
    T('atualizar', '18:30', 'Atualizar a planilha de clientes', 'trabalho', 'Tarde'),
    T('leitura', '19:00', 'Ler ou ouvir um podcast na volta para casa', 'fe', 'Noite'),
    T('jantar', '21:30', 'Jantar', 'cuidado', 'Noite'),
    ...extras,
    T('celular', '22:15', 'Deixar o celular de lado', 'cuidado', 'Noite'),
    T('dormir', '22:30', 'Dormir às 22h30', 'cuidado', 'Noite'),
    agua(),
  ];
}
const orgAmanha = (t) => T('organizar', '22:00', t, 'casa', 'Noite');
function rotinaPadrao(dow) {
  switch (dow) {
    case 1: return diaUtil('peito, ombros e tríceps', [orgAmanha('Organizar as coisas do dia seguinte')]);
    case 2: return diaUtil('costas e bíceps', [orgAmanha('Organizar as coisas do dia seguinte')]);
    case 3: return [
      T('acordar', '05:30', 'Acordar às 05h30', 'cuidado', 'Manhã'),
      T('mochila', '05:40', 'Mochila pronta para o dia', 'casa', 'Manhã'),
      T('oracao', '06:30', 'Oração no início do trajeto', 'fe', 'Manhã'),
      T('roleta', '08:10', 'Participar da roleta de vendas', 'trabalho', 'Manhã'),
      T('cafe', '08:45', 'Tomar café da manhã', 'cuidado', 'Manhã'),
      T('planilha', '09:00', 'Atualizar a planilha e definir prioridades', 'trabalho', 'Manhã'),
      T('treino', '10:30', 'Treino: pernas', 'treino', 'Manhã'),
      T('almoco', '11:45', 'Almoçar', 'cuidado', 'Manhã'),
      T('ligacoes', '13:00', 'Ligações e acompanhamentos urgentes', 'trabalho', 'Tarde'),
      T('sair', '15:00', 'Sair às 15h para encontrar a Catarina', 'familia', 'Tarde'),
      T('catarina', '16:30', 'Tempo de qualidade com a Catarina, sem celular', 'familia', 'Tarde'),
      T('jantarfam', '19:30', 'Jantar junto com ela', 'familia', 'Noite'),
      T('organizar', '21:00', 'Organizar o essencial para quinta-feira', 'casa', 'Noite'),
      T('celular', '22:15', 'Deixar o celular de lado', 'cuidado', 'Noite'),
      T('dormir', '22:30', 'Dormir às 22h30', 'cuidado', 'Noite'),
      agua(),
    ];
    case 4: return [
      T('acordar', '08:30', 'Acordar às 08h30', 'cuidado', 'Manhã'),
      T('baba', '08:40', 'Levar a Catarina à babá', 'familia', 'Manhã'),
      T('cafe', '09:00', 'Tomar café da manhã', 'cuidado', 'Manhã'),
      T('treino', '09:30', 'Treino perto de casa', 'treino', 'Manhã'),
      T('posTreino', '10:45', 'Banho e refeição pós-treino', 'cuidado', 'Manhã'),
      T('mochila', '11:15', 'Mochila pronta para o trabalho', 'casa', 'Manhã'),
      T('oracao', '11:30', 'Oração no início do trajeto', 'fe', 'Manhã'),
      T('planilha', '13:00', 'Organizar a planilha e revisar pendências', 'trabalho', 'Tarde'),
      T('almoco', '14:00', 'Almoçar', 'cuidado', 'Tarde'),
      T('ligacoes', '15:30', 'Ligar para os clientes da base', 'trabalho', 'Tarde'),
      T('leads', '16:30', 'Trabalhar a carteira de leads', 'trabalho', 'Tarde'),
      T('oferta', '17:30', 'Fazer oferta ativa', 'trabalho', 'Tarde'),
      T('pap', '18:30', 'Preparar material para o PAP', 'trabalho', 'Tarde'),
      T('atualizar', '19:30', 'Atualizar a planilha de clientes', 'trabalho', 'Tarde'),
      T('leitura', '20:00', 'Ler ou ouvir um podcast na volta para casa', 'fe', 'Noite'),
      T('jantar', '22:30', 'Jantar leve', 'cuidado', 'Noite'),
      T('organizar', '22:40', 'Organizar as coisas para sexta-feira', 'casa', 'Noite'),
      T('dormir', '23:00', 'Dormir às 23h', 'cuidado', 'Noite'),
      agua(),
    ];
    case 5: return diaUtil('musculação, se o corpo estiver recuperado', [orgAmanha('Organizar as coisas para sábado')]);
    case 6: return diaUtil('musculação', [
      T('roupaTerreiro', '21:50', 'Separar a roupa e os itens do terreiro', 'fe', 'Noite'),
      T('ervas', '22:05', 'Tomar o banho de ervas', 'fe', 'Noite'),
    ]);
    default: return [
      T('acordar', '05:30', 'Acordar às 05h30', 'cuidado', 'Manhã'),
      T('mochila', '05:40', 'Deixar a mochila de segunda já pronta', 'casa', 'Manhã'),
      T('oracao', '06:30', 'Oração no início do trajeto', 'fe', 'Manhã'),
      T('roleta', '08:10', 'Participar da roleta de vendas', 'trabalho', 'Manhã'),
      T('cafe', '08:45', 'Tomar café da manhã', 'cuidado', 'Manhã'),
      T('planilha', '09:00', 'Organizar a planilha de clientes', 'trabalho', 'Manhã'),
      T('semana', '11:00', 'Planejar as prioridades da próxima semana', 'trabalho', 'Manhã'),
      T('almoco', '13:00', 'Almoçar', 'cuidado', 'Tarde'),
      T('terreiro', '14:00', 'Terreiro: dedicação à fé', 'fe', 'Tarde'),
      T('banho', '23:00', 'Banho e refeição leve, se necessário', 'cuidado', 'Noite'),
      T('dormir', '23:30', 'Dormir até 23h30', 'cuidado', 'Noite'),
      agua(),
    ];
  }
}

// ---------- datas ----------
const pad = (n) => String(n).padStart(2, '0');
const keyOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const fromKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = fromKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
const todayKey = () => keyOf(new Date());
const toMin = (h) => { if (!h) return null; const [a, b] = h.split(':').map(Number); return a * 60 + b; };
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const nowH = () => nowMin() / 60;
const fh = (x) => (Math.round(x * 10) / 10).toLocaleString('pt-BR');
const fi = (x) => Math.round(x).toLocaleString('pt-BR');
const hh = (h) => h.replace(':', 'h');

// ---------- dados: cópia no aparelho + Supabase ----------
const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
const sb = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
let user = null;
const store = {};
function resetStore() {
  Object.assign(store, { dias: {}, rotina: {}, rotinaU: {}, fila: { dias: {}, rotina: {} }, backupEm: null, ultimaSync: null });
}
resetStore();
const cacheKey = () => 'minha-rotina:' + (user ? user.id : 'anon');
function load() {
  resetStore();
  try {
    const raw = localStorage.getItem(cacheKey());
    if (raw) { const o = JSON.parse(raw); Object.assign(store, o); store.fila = Object.assign({ dias: {}, rotina: {} }, o.fila); store.rotinaU = o.rotinaU || {}; }
  } catch (e) { /* sem cópia local: o app busca tudo no Supabase */ }
}
let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try { localStorage.setItem(cacheKey(), JSON.stringify(store)); } catch (e) { /* cópia local é só um atalho */ } }, 200);
}
const alertEl = document.getElementById('alert');
function showAlert(t) { alertEl.textContent = t; alertEl.hidden = false; }
function hideAlert() { alertEl.hidden = true; }

// ----- sincronização -----
const agoraISO = () => new Date().toISOString();
const pendentes = () => Object.keys(store.fila.dias).length + Object.keys(store.fila.rotina).length;
const syncBtn = document.getElementById('sync');
const syncTxt = document.getElementById('syncTxt');
function setSync(s) {
  const p = pendentes();
  const txt = { ok: 'Sincronizado', saving: 'Salvando…', offline: p ? 'Sem internet · ' + p + ' para enviar' : 'Sem internet', error: 'Erro ao sincronizar · tocar' }[s];
  syncBtn.dataset.s = s; syncTxt.textContent = txt;
}
let syncTimer = null, syncing = false, syncAgain = false;
function scheduleSync(ms = 800) { clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, ms); }
async function syncNow() {
  if (!sb || !user) return;
  if (syncing) { syncAgain = true; return; }
  if (!navigator.onLine) { setSync('offline'); return; }
  syncing = true; setSync('saving');
  try {
    await push();
    await pull();
    store.ultimaSync = agoraISO(); save();
    setSync(pendentes() ? 'saving' : 'ok');
    renderSeguro();
  } catch (e) {
    console.error('Sincronização:', e);
    setSync(navigator.onLine ? 'error' : 'offline');
    if (e && (e.code === '42P01' || /relation .* does not exist/i.test(e.message || ''))) {
      showAlert('As tabelas ainda não existem no Supabase. Rode o arquivo supabase/schema.sql no SQL Editor, como explica o guia.');
    }
  }
  syncing = false;
  if (syncAgain) { syncAgain = false; scheduleSync(300); }
}
async function push() {
  const keys = Object.keys(store.fila.dias);
  for (let i = 0; i < keys.length; i += 300) {
    const parte = keys.slice(i, i + 300), snap = {};
    const rows = parte.map((k) => {
      const r = store.dias[k] || { feitos: [], n: 0, total: 0, u: agoraISO() };
      snap[k] = r.u;
      return { user_id: user.id, data: k, feitos: r.feitos || [], n: r.n || 0, total: r.total || 0, updated_at: r.u || agoraISO() };
    });
    const { error } = await sb.from('dias').upsert(rows, { onConflict: 'user_id,data' });
    if (error) throw error;
    for (const k of parte) if (!store.dias[k] || store.dias[k].u === snap[k]) delete store.fila.dias[k];
    save();
  }
  for (const dow of Object.keys(store.fila.rotina)) {
    const u = store.rotinaU[dow];
    if (store.rotina[dow]) {
      const { error } = await sb.from('rotina').upsert({ user_id: user.id, dow: Number(dow), tarefas: store.rotina[dow], updated_at: u || agoraISO() }, { onConflict: 'user_id,dow' });
      if (error) throw error;
    } else {
      const { error } = await sb.from('rotina').delete().eq('user_id', user.id).eq('dow', Number(dow));
      if (error) throw error;
    }
    if (store.rotinaU[dow] === u) delete store.fila.rotina[dow];
    save();
  }
}
function aplicarDia(r) {
  const k = String(r.data).slice(0, 10);
  if (store.fila.dias[k]) return; // este aparelho tem uma marcação mais nova esperando envio
  const cur = store.dias[k];
  if (cur && cur.u && r.updated_at && new Date(cur.u) > new Date(r.updated_at)) return;
  store.dias[k] = { feitos: r.feitos || [], n: r.n || 0, total: r.total || 0, u: r.updated_at };
}
async function pull() {
  const desde = addDays(todayKey(), -400);
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from('dias').select('data,feitos,n,total,updated_at').gte('data', desde).order('data').range(from, from + 999);
    if (error) throw error;
    data.forEach(aplicarDia);
    if (data.length < 1000) break;
  }
  const { data: rot, error } = await sb.from('rotina').select('dow,tarefas,updated_at');
  if (error) throw error;
  const vistos = new Set();
  for (const r of rot) {
    const d = String(r.dow); vistos.add(d);
    if (store.fila.rotina[d]) continue;
    store.rotina[d] = r.tarefas; store.rotinaU[d] = r.updated_at;
  }
  for (const d of Object.keys(store.rotina)) if (!vistos.has(d) && !store.fila.rotina[d]) { delete store.rotina[d]; delete store.rotinaU[d]; }
  save();
}
function marcarDia(k) { store.dias[k].u = agoraISO(); store.fila.dias[k] = true; save(); setSync(navigator.onLine ? 'saving' : 'offline'); scheduleSync(); }
function marcarRotina(dow) { store.rotinaU[dow] = agoraISO(); store.fila.rotina[dow] = true; save(); setSync(navigator.onLine ? 'saving' : 'offline'); scheduleSync(1500); }
let canal = null;
function ouvirMudancas() {
  if (canal) sb.removeChannel(canal);
  canal = sb.channel('rotina-' + user.id)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'dias', filter: 'user_id=eq.' + user.id }, (p) => {
      if (p.new && p.new.data) { aplicarDia(p.new); save(); renderSeguro(); }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rotina', filter: 'user_id=eq.' + user.id }, () => scheduleSync(300))
    .subscribe();
}
syncBtn.addEventListener('click', () => syncNow());
window.addEventListener('online', () => scheduleSync(0));
window.addEventListener('offline', () => setSync('offline'));

const tasksForDow = (dow) => store.rotina[dow] || rotinaPadrao(dow);
const tasksFor = (k) => tasksForDow(fromKey(k).getDay());
const doneSet = (k) => new Set((store.dias[k] && store.dias[k].feitos) || []);
function liveScore(k) {
  const t = tasksFor(k), d = doneSet(k);
  const n = t.filter((x) => d.has(x.id)).length;
  return { n, total: t.length, p: t.length ? n / t.length : 0 };
}
// para o histórico usamos o que ficou registrado no dia (não muda se a rotina for editada depois)
function histScore(k) {
  const r = store.dias[k];
  if (!r) return { n: 0, total: tasksFor(k).length, p: 0, has: false };
  if (typeof r.n === 'number' && r.total) return { n: r.n, total: r.total, p: r.n / r.total, has: r.n > 0 };
  const s = liveScore(k); return Object.assign(s, { has: s.n > 0 });
}

// ---------- navegação ----------
const state = { view: 'hoje', sel: todayKey(), cat: null, agDow: new Date().getDay(), edDow: new Date().getDay() };
function showView(v) {
  state.view = v;
  document.querySelectorAll('.view').forEach((el) => { el.hidden = el.id !== 'view-' + v; });
  try { history.replaceState(null, '', v === 'hoje' ? '/' : '/' + v); } catch (e) { /* ok */ }
  document.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === v)));
  window.scrollTo(0, 0);
  render();
}
document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

// =============== HOJE ===============
const CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="var(--surface)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function toggle(id) {
  const k = state.sel; if (k > todayKey()) return;
  const d = doneSet(k); d.has(id) ? d.delete(id) : d.add(id);
  store.dias[k] = { feitos: [...d] };
  const s = liveScore(k); store.dias[k].n = s.n; store.dias[k].total = s.total;
  marcarDia(k); render();
}
function mensagem(p, n, isToday) {
  if (n === 0) return isToday ? 'Um item de cada vez. Comece pelo próximo.' : 'Nenhuma atividade marcada neste dia.';
  if (p < 0.34) return 'Bom começo. O importante é não parar.';
  if (p < 0.67) return 'Metade do caminho. Mantenha o ritmo.';
  if (p < 0.8) return 'Quase lá. Mais algumas e o dia conta na sequência.';
  if (p < 1) return 'O dia já conta na sequência. Falta pouco para fechar 100%.';
  return 'Todas as atividades concluídas.';
}
function proxima(k) {
  if (k !== todayKey()) return null;
  const d = doneSet(k), m = nowMin();
  const pend = tasksFor(k).filter((x) => !d.has(x.id) && x.hora).sort((a, b) => toMin(a.hora) - toMin(b.hora));
  return { prox: pend.find((x) => toMin(x.hora) >= m - 30) || null, atras: pend.filter((x) => toMin(x.hora) < m - 30).length, pend: pend.length };
}
function renderHoje() {
  const k = state.sel, t = todayKey(), d = fromKey(k);
  const tag = k === t ? 'Hoje' : k === addDays(t, -1) ? 'Ontem' : k === addDays(t, 1) ? 'Amanhã' : DIAS[d.getDay()];
  document.getElementById('dayTag').textContent = tag + ' · ' + d.getDate() + ' de ' + MESES[d.getMonth()];
  document.getElementById('dayTitle').textContent = DIAS[d.getDay()];
  document.getElementById('today').disabled = k === t;
  document.getElementById('next').disabled = k >= addDays(t, 1);
  document.getElementById('prev').disabled = k <= addDays(t, -365);
  const { n, total, p } = liveScore(k);
  document.getElementById('ringBar').setAttribute('stroke-dashoffset', String(326.73 * (1 - p)));
  document.getElementById('pct').textContent = Math.round(p * 100) + '%';
  document.getElementById('sub').textContent = n + ' de ' + total + ' concluídas' + (k > t ? ' · o dia ainda não chegou' : '');
  document.getElementById('msg').textContent = k > t ? 'Veja o que vem pela frente.' : mensagem(p, n, k === t);
  document.getElementById('score').classList.toggle('full', p >= 1);
  const nb = document.getElementById('nextBox'); nb.hidden = true; nb.replaceChildren();
  const px = proxima(k);
  if (px && px.prox) {
    const b = el('b', null, px.prox.titulo);
    nb.append('Próxima: ', b, ' às ' + hh(px.prox.hora));
    if (px.atras) nb.append(' · ' + px.atras + (px.atras === 1 ? ' pendente de antes' : ' pendentes de antes'));
    nb.hidden = false;
  } else if (px && px.pend) { nb.textContent = px.pend + (px.pend === 1 ? ' atividade ficou pendente hoje.' : ' atividades ficaram pendentes hoje.'); nb.hidden = false; }
  const cur = px && px.prox ? px.prox.id : null;
  const host = document.getElementById('blocks'); host.replaceChildren();
  const done = doneSet(k), fut = k > t;
  const tasks = tasksFor(k).slice().sort((a, b) => (toMin(a.hora) ?? 9999) - (toMin(b.hora) ?? 9999));
  if (!tasks.length) { const e = el('div', 'card empty', 'Nenhuma atividade para este dia. Adicione na aba Rotina.'); host.append(e); return; }
  for (const per of PERIODOS) {
    const items = tasks.filter((x) => x.periodo === per);
    if (!items.length) continue;
    const sec = el('section', 'block');
    const h = el('div', 'block-h'); h.append(el('h2', null, per), el('span', 'count num', items.filter((x) => done.has(x.id)).length + '/' + items.length));
    const list = el('div', 'list'); list.setAttribute('role', 'group'); list.setAttribute('aria-label', per);
    for (const x of items) {
      const b = el('button', 'task' + (x.id === cur ? ' now' : '')); b.type = 'button';
      b.setAttribute('role', 'checkbox'); b.setAttribute('aria-checked', String(done.has(x.id))); b.disabled = fut;
      const box = el('span', 'box'); box.innerHTML = CHECK;
      const mid = el('span'); mid.style.minWidth = '0';
      const meta = el('div', 't-meta'); const dot = el('span', 'dot'); const ar = AREAS[x.area] || AREAS.casa; dot.style.background = ar.cor; meta.append(dot, ar.nome);
      mid.append(el('div', 't-title', x.titulo), meta);
      b.append(box, mid, el('span', 't-time num', x.hora ? hh(x.hora) : ''));
      b.addEventListener('click', () => toggle(x.id));
      list.append(b);
    }
    sec.append(h, list); host.append(sec);
  }
}
document.getElementById('prev').addEventListener('click', () => { state.sel = addDays(state.sel, -1); render(); });
document.getElementById('next').addEventListener('click', () => { state.sel = addDays(state.sel, 1); render(); });
document.getElementById('today').addEventListener('click', () => { state.sel = todayKey(); render(); });
const openDay = (k) => { state.sel = k; showView('hoje'); };

// =============== EVOLUÇÃO ===============
function streaks() {
  const t = todayKey(), ok = (k) => histScore(k).p >= 0.8;
  let cur = 0, k = ok(t) ? t : addDays(t, -1);
  while (store.dias[k] && ok(k)) { cur++; k = addDays(k, -1); }
  let best = 0, run = 0, prev = null, perfect = 0;
  for (const kk of Object.keys(store.dias).sort()) {
    const r = histScore(kk);
    if (r.p >= 1) perfect++;
    if (r.p >= 0.8) { run = prev && addDays(prev, 1) === kk ? run + 1 : 1; best = Math.max(best, run); prev = kk; } else { run = 0; prev = null; }
  }
  return { cur, best: Math.max(best, cur), perfect };
}
function renderEvolucao() {
  const s = streaks();
  document.getElementById('streak').textContent = s.cur;
  document.getElementById('best').textContent = s.best;
  document.getElementById('perfect').textContent = s.perfect;
  const t = todayKey();
  const wk = document.getElementById('week'); wk.replaceChildren(); let sum = 0;
  for (let i = 6; i >= 0; i--) {
    const k = addDays(t, -i), { p } = histScore(k); sum += p;
    const c = el('button', 'wcol'); c.type = 'button'; c.setAttribute('aria-label', DIAS[fromKey(k).getDay()] + ': ' + Math.round(p * 100) + '%');
    const bar = el('span', 'wbar' + (p < 0.8 ? ' low' : '')); bar.style.height = Math.max(3, p * 92) + 'px';
    c.append(el('span', 'p num', Math.round(p * 100) + '%'), bar, el('span', 'd', i === 0 ? 'Hoje' : CURTO[fromKey(k).getDay()]));
    c.addEventListener('click', () => openDay(k)); wk.append(c);
  }
  document.getElementById('weekAvg').textContent = 'média ' + Math.round((sum / 7) * 100) + '%';
  const agg = {}, m = nowMin();
  for (let i = 0; i < 7; i++) {
    const k = addDays(t, -i), done = doneSet(k);
    for (const x of tasksFor(k)) {
      if (i === 0 && x.hora && toMin(x.hora) > m && !done.has(x.id)) continue;
      const a = agg[x.area] || (agg[x.area] = { n: 0, total: 0 }); a.total++; if (done.has(x.id)) a.n++;
    }
  }
  const ah = document.getElementById('areas'); ah.replaceChildren();
  for (const id of Object.keys(AREAS)) {
    const a = agg[id]; if (!a || !a.total) continue;
    ah.append(hbar(AREAS[id].nome, a.n / a.total, AREAS[id].cor, Math.round((a.n / a.total) * 100) + '%'));
  }
  const ht = document.getElementById('heat'); ht.replaceChildren();
  const dow = (fromKey(t).getDay() + 6) % 7, start = addDays(t, -dow - 77);
  ht.style.gridTemplateColumns = 'repeat(12, minmax(14px, 1fr))';
  for (let i = 0; i < 84; i++) {
    const k = addDays(start, i), d = fromKey(k), c = el('button', 'cell'); c.type = 'button';
    if (k > t) { c.classList.add('fut'); c.disabled = true; }
    else {
      const r = histScore(k);
      c.style.background = !r.has ? 'var(--line)' : r.p >= 0.8 ? 'var(--accent)' : r.p >= 0.5 ? 'color-mix(in srgb,var(--accent) 60%,var(--line))' : 'color-mix(in srgb,var(--accent) 30%,var(--line))';
      c.title = d.getDate() + '/' + (d.getMonth() + 1) + ' · ' + Math.round(r.p * 100) + '%';
      c.setAttribute('aria-label', DIAS[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ': ' + Math.round(r.p * 100) + '%');
      c.addEventListener('click', () => openDay(k));
    }
    if (k === t) c.classList.add('today');
    ht.append(c);
  }
  const bi = document.getElementById('backupInfo');
  const nd = Object.keys(store.dias).length;
  bi.textContent = nd + (nd === 1 ? ' dia registrado' : ' dias registrados') + (store.backupEm ? ' · última cópia em ' + new Date(store.backupEm).toLocaleDateString('pt-BR') : '');
  document.getElementById('contaInfo').textContent = (user ? 'Conectado como ' + user.email : '') + (store.ultimaSync ? ' · última sincronização ' + new Date(store.ultimaSync).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '');
}
function hbar(nome, p, cor, txt, onClick, dim) {
  const r = el('div', 'hbar' + (onClick ? ' click' : '') + (dim ? ' dim' : ''));
  const tr = el('span', 'track'), f = el('span', 'fill'); f.style.width = Math.round(Math.min(1, p) * 100) + '%'; f.style.background = cor; tr.append(f);
  const nm = el('span', 'nm'); const dt = el('span', 'dot'); dt.style.background = cor; nm.append(dt, el('span', null, nome));
  r.append(nm, tr, el('span', 'v num', txt));
  if (onClick) { r.setAttribute('role', 'button'); r.tabIndex = 0; r.addEventListener('click', onClick); r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }); }
  return r;
}
document.getElementById('exportBtn').addEventListener('click', () => {
  store.backupEm = new Date().toISOString(); save();
  const dias = {}; for (const [k, r] of Object.entries(store.dias)) dias[k] = { feitos: r.feitos, n: r.n, total: r.total };
  const blob = new Blob([JSON.stringify({ app: 'minha-rotina', versao: 1, dias, rotina: store.rotina, backupEm: store.backupEm }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'minha-rotina-backup-' + todayKey() + '.json';
  document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  renderEvolucao();
});
document.getElementById('importFile').addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const o = JSON.parse(rd.result);
      if (!o || o.app !== 'minha-rotina' || typeof o.dias !== 'object') throw new Error('formato');
      for (const [k, r] of Object.entries(o.dias)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !r || !Array.isArray(r.feitos)) continue;
        store.dias[k] = { feitos: r.feitos.map(String), n: Number(r.n) || 0, total: Number(r.total) || 0 };
        marcarDia(k);
      }
      for (const [d, l] of Object.entries(o.rotina || {})) { if (Array.isArray(l)) { store.rotina[d] = l; marcarRotina(d); } }
      showAlert('Cópia restaurada: ' + Object.keys(o.dias).length + ' dias de histórico. Enviando para a sua conta…'); render();
    } catch (err) { showAlert('Esse arquivo não é uma cópia de segurança deste checklist. Escolha o arquivo que começa com "minha-rotina-backup".'); }
    e.target.value = '';
  };
  rd.readAsText(f);
});

// =============== SEMANA (agenda planejada) ===============
const BL = DATA.blocos.map(([o, i, f, c, a]) => ({ o, dow: o % 7, i, f, h: (toMin(f) - toMin(i)) / 60, c, a }));
const SONO = DATA.sono.map(([o, noite, dormir, acordar, horas]) => ({ o, dow: o % 7, noite, dormir, acordar, horas }));
const porCat = (() => {
  const m = {}; for (const b of BL) { const x = m[b.c] || (m[b.c] = { h: 0, n: 0 }); x.h += b.h; x.n++; }
  m['Sono'] = { h: SONO.reduce((a, s) => a + s.horas, 0), n: SONO.length };
  return m;
})();
function renderAgora() {
  const dow = new Date().getDay(), t = nowMin(), d = new Date();
  document.getElementById('agoraKick').textContent = 'Agora · ' + DIAS[dow].toLowerCase() + ', ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  const rows = BL.filter((b) => b.dow === dow).sort((a, b) => toMin(a.i) - toMin(b.i));
  const cur = rows.find((b) => toMin(b.i) <= t && t < toMin(b.f));
  let nx = rows.find((b) => toMin(b.i) > t), nd = dow;
  if (!nx) { nd = (dow + 1) % 7; nx = BL.filter((b) => b.dow === nd).sort((a, b) => toMin(a.i) - toMin(b.i))[0]; }
  const bar = document.getElementById('agoraBar');
  if (cur) {
    document.getElementById('agoraNow').textContent = cur.a;
    document.getElementById('agoraSub').textContent = cur.c + ' · até ' + hh(cur.f);
    bar.style.width = Math.round(((t - toMin(cur.i)) / (toMin(cur.f) - toMin(cur.i))) * 100) + '%'; bar.style.background = CAT[cur.c];
  } else { document.getElementById('agoraNow').textContent = 'Hora de descansar'; document.getElementById('agoraSub').textContent = 'Fora dos blocos da agenda.'; bar.style.width = '0'; }
  document.getElementById('agoraNext').textContent = nx ? 'Depois: ' + nx.a + ' às ' + hh(nx.i) + (nd !== dow ? ' (' + DIAS[nd].toLowerCase() + ')' : '') : '';
}
function renderSemStats() {
  const g = (c) => porCat[c] || { h: 0, n: 0 };
  const sh = SONO.map((s) => s.horas), media = sh.reduce((a, b) => a + b, 0) / sh.length, abaixo = sh.filter((x) => x < 7).length;
  const host = document.getElementById('semStats'); host.replaceChildren();
  const items = [[fh(g('Trabalho').h) + ' h', 'de trabalho na semana'], [String(g('Treino').n), 'treinos na semana'], [fh(g('Família').h) + ' h', 'com a Catarina'], [fh(g('Espiritualidade').h) + ' h', 'de espiritualidade'], [fh(media) + ' h', 'de sono por noite · ' + abaixo + ' abaixo de 7 h'], [fh(g('Deslocamento').h) + ' h', 'de trajeto para ouvir e ler']];
  for (const [v, k] of items) { const s = el('div', 'stat'); s.append(el('div', 'v num', v), el('div', 'k', k)); host.append(s); }
}
function renderChips() {
  const host = document.getElementById('areaChips'); host.replaceChildren();
  for (const c of CAT_ORDER) {
    const b = el('button', 'chip'); b.type = 'button'; b.setAttribute('aria-pressed', String(state.cat === c));
    const d = el('span', 'dot'); d.style.background = CAT[c]; d.style.marginRight = '6px'; b.append(d, c);
    b.addEventListener('click', () => { state.cat = state.cat === c ? null : c; renderSemana(); }); host.append(b);
  }
}
const SVGNS = 'http://www.w3.org/2000/svg';
const sv = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
function renderGrid() {
  const box = document.getElementById('gridChart'), card = document.getElementById('gridCard'), tip = document.getElementById('gridTip');
  const W = Math.max(300, box.clientWidth || 600), H = Math.round(Math.max(420, Math.min(640, W * 0.75)));
  const m = { t: 26, r: 2, b: 4, l: 34 }, cw = (W - m.l - m.r) / 7, gap = Math.min(8, cw * 0.12), bw = cw - gap;
  const y = (h) => m.t + ((h - 5) / 19) * (H - m.t - m.b);
  const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Agenda da semana hora a hora' });
  for (let h = 6; h <= 24; h += 2) {
    sv('line', { x1: m.l, x2: W - m.r, y1: y(h), y2: y(h), stroke: 'var(--line)' }, svg);
    const tx = sv('text', { x: m.l - 6, y: y(h), dy: '0.32em', 'text-anchor': 'end', fill: 'var(--muted)', 'font-size': 11 }, svg); tx.textContent = pad(h % 24) + 'h';
  }
  const hoje = new Date().getDay();
  SEMANA_ORD.forEach((dow, idx) => {
    const x = m.l + idx * cw + gap / 2;
    if (dow === state.agDow) sv('rect', { x: x - 3, y: 2, width: bw + 6, height: H - 4, rx: 6, fill: 'var(--ink)', opacity: 0.06 }, svg);
    const lab = sv('text', { x: x + bw / 2, y: 14, 'text-anchor': 'middle', fill: dow === hoje ? 'var(--ink)' : 'var(--muted)', 'font-size': 12, 'font-weight': dow === hoje ? 600 : 400, style: 'cursor:pointer' }, svg);
    lab.textContent = bw > 70 ? DIAS[dow] : CURTO[dow];
    lab.addEventListener('click', () => { state.agDow = dow; renderSemana(); });
    for (const b of BL.filter((q) => q.dow === dow)) {
      const y1 = y(toMin(b.i) / 60), y2 = y(toMin(b.f) / 60);
      const r = sv('rect', { x, y: y1 + 0.5, width: bw, height: Math.max(1.5, y2 - y1 - 1), rx: 3, fill: CAT[b.c], opacity: state.cat && state.cat !== b.c ? 0.12 : 0.9, style: 'cursor:pointer' }, svg);
      const show = (ev) => {
        tip.replaceChildren(el('div', 'h', DIAS[b.dow] + ' · ' + hh(b.i) + '–' + hh(b.f)), el('div', null, b.a), el('div', 'h', b.c + ' · ' + fh(b.h) + ' h'));
        tip.hidden = false;
        const cr = card.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
        let lx = ev.clientX - cr.left + 12, ly = ev.clientY - cr.top + 12;
        if (lx + tw > cr.width - 8) lx = ev.clientX - cr.left - tw - 12;
        if (ly + th > cr.height - 8) ly = ev.clientY - cr.top - th - 12;
        tip.style.left = Math.max(8, lx) + 'px'; tip.style.top = Math.max(8, ly) + 'px';
      };
      r.addEventListener('mousemove', show); r.addEventListener('mouseleave', () => { tip.hidden = true; });
      r.addEventListener('click', (ev) => { show(ev); state.agDow = dow; renderAgenda(); });
      if (bw > 92 && y2 - y1 >= 18 && !(state.cat && state.cat !== b.c)) {
        const max = Math.floor((bw - 10) / 6.2);
        const tx = sv('text', { x: x + 6, y: y1 + 13, fill: 'var(--surface)', 'font-size': 11, 'pointer-events': 'none' }, svg);
        tx.textContent = b.a.length > max ? b.a.slice(0, max - 1) + '…' : b.a;
      }
    }
  });
  const th = nowH();
  if (th >= 5) {
    const idx = SEMANA_ORD.indexOf(hoje), x = m.l + idx * cw + gap / 2;
    sv('line', { x1: x - 3, x2: x + bw + 3, y1: y(th), y2: y(th), stroke: 'var(--bad)', 'stroke-width': 2, 'stroke-linecap': 'round', 'pointer-events': 'none' }, svg);
    sv('circle', { cx: x - 3, cy: y(th), r: 4, fill: 'var(--bad)', 'pointer-events': 'none' }, svg);
  }
  box.replaceChildren(svg);
}
function renderHoras() {
  const host = document.getElementById('horasArea'); host.replaceChildren();
  const rows = CAT_ORDER.filter((c) => porCat[c]).sort((a, b) => porCat[b].h - porCat[a].h);
  const max = porCat[rows[0]].h;
  for (const c of rows) host.append(hbar(c, porCat[c].h / max, CAT[c], fh(porCat[c].h) + ' h', () => { state.cat = state.cat === c ? null : c; renderSemana(); }, state.cat && state.cat !== c));
}
function renderSono() {
  const box = document.getElementById('sonoChart');
  const W = Math.max(280, box.clientWidth || 400), H = 210, m = { t: 20, r: 2, b: 22, l: 24 };
  const cw = (W - m.l - m.r) / 7, bw = Math.min(32, cw * 0.6), ymax = 11;
  const y = (v) => m.t + (1 - v / ymax) * (H - m.t - m.b);
  const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Horas de sono por noite' });
  for (const v of [0, 3, 6, 9]) { sv('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), stroke: 'var(--line)' }, svg); const t = sv('text', { x: m.l - 6, y: y(v), dy: '0.32em', 'text-anchor': 'end', fill: 'var(--muted)', 'font-size': 11 }, svg); t.textContent = v; }
  SEMANA_ORD.forEach((dow, i) => {
    const s = SONO.find((q) => q.dow === dow); if (!s) return;
    const cx = m.l + i * cw + cw / 2, low = s.horas < 7;
    const r = sv('rect', { x: cx - bw / 2, y: y(s.horas), width: bw, height: y(0) - y(s.horas), rx: 4, fill: low ? 'var(--bad)' : 'var(--c-sono)' }, svg);
    const ti = sv('title', {}, r); ti.textContent = 'Noite ' + s.noite + ': dormir ' + hh(s.dormir) + ', acordar ' + hh(s.acordar);
    const v = sv('text', { x: cx, y: y(s.horas) - 5, 'text-anchor': 'middle', fill: 'var(--ink)', 'font-size': 12 }, svg); v.textContent = fh(s.horas);
    const d = sv('text', { x: cx, y: H - 6, 'text-anchor': 'middle', fill: 'var(--muted)', 'font-size': 11 }, svg); d.textContent = CURTO[dow];
  });
  sv('line', { x1: m.l, x2: W - m.r, y1: y(7), y2: y(7), stroke: 'var(--muted)', 'stroke-dasharray': '4 3' }, svg);
  const lt = sv('text', { x: m.l + 2, y: y(7) + 13, 'text-anchor': 'start', fill: 'var(--muted)', 'font-size': 11 }, svg); lt.textContent = 'meta 7 h';
  box.replaceChildren(svg);
}
function renderAgenda() {
  const dow = state.agDow;
  document.getElementById('agTitle').textContent = 'Agenda de ' + DIAS[dow].toLowerCase() + (dow === new Date().getDay() ? ' (hoje)' : '');
  const ch = document.getElementById('agDays'); ch.replaceChildren();
  for (const d of SEMANA_ORD) { const b = el('button', 'chip', CURTO[d]); b.type = 'button'; b.setAttribute('aria-pressed', String(d === dow)); b.addEventListener('click', () => { state.agDow = d; renderSemana(); }); ch.append(b); }
  const tb = document.querySelector('#agTable tbody'); tb.replaceChildren();
  const isHoje = dow === new Date().getDay(), t = nowMin();
  for (const b of BL.filter((q) => q.dow === dow).sort((a, c) => toMin(a.i) - toMin(c.i))) {
    const tr = el('tr'); if (state.cat && state.cat !== b.c) tr.className = 'dim';
    if (isHoje && toMin(b.i) <= t && t < toMin(b.f)) tr.classList.add('cur');
    const c3 = el('td'); const dt = el('span', 'dot'); dt.style.background = CAT[b.c]; dt.style.marginRight = '6px'; c3.append(dt, b.c);
    tr.append(el('td', null, hh(b.i) + '–' + hh(b.f)), el('td', null, b.a), c3); tb.append(tr);
  }
}
function renderAno() {
  const g = (c) => porCat[c] || { h: 0, n: 0 };
  const items = [['Treinos de musculação', g('Treino').n * 52, 'treinos', 'var(--c-treino)'], ['Horas com a Catarina', g('Família').h * 52, 'h', 'var(--c-familia)'], ['Horas de espiritualidade', g('Espiritualidade').h * 52, 'h', 'var(--c-fe)'], ['Horas de trajeto para ouvir e ler', g('Deslocamento').h * 52, 'h', 'var(--c-trajeto)']];
  const host = document.getElementById('ano'); host.replaceChildren();
  const max = Math.max(...items.map((x) => x[1]));
  for (const [n, v, u, c] of items) host.append(hbar(n, v / max, c, fi(v) + (u === 'h' ? ' h' : '')));
}
function renderSemana() { renderAgora(); renderSemStats(); renderChips(); renderGrid(); renderHoras(); renderSono(); renderAgenda(); renderAno(); }

// =============== ROTINA (editor) ===============
let edTimer = null;
function edCommit(dow, list) { store.rotina[dow] = list; clearTimeout(edTimer); edTimer = setTimeout(() => marcarRotina(dow), 500); }
function renderEditor() {
  const dow = state.edDow, list = tasksForDow(dow).map((x) => Object.assign({}, x));
  const ch = document.getElementById('edDays'); ch.replaceChildren();
  for (const d of SEMANA_ORD) { const b = el('button', 'chip', DIAS[d]); b.type = 'button'; b.setAttribute('aria-pressed', String(d === dow)); b.addEventListener('click', () => { state.edDow = d; document.getElementById('edConfirm').hidden = true; renderEditor(); }); ch.append(b); }
  document.getElementById('edTitle').textContent = DIAS[dow];
  document.getElementById('edCount').textContent = list.length + ' atividades' + (store.rotina[dow] ? ' · editado' : '');
  const host = document.getElementById('edList'); host.replaceChildren();
  list.sort((a, b) => (toMin(a.hora) ?? 9999) - (toMin(b.hora) ?? 9999));
  list.forEach((x, i) => {
    const row = el('div', 'erow');
    const tm = el('input', 'field num'); tm.type = 'time'; tm.value = x.hora || ''; tm.id = 'ed-h-' + x.id; tm.setAttribute('aria-label', 'Horário');
    const tt = el('input', 'field'); tt.type = 'text'; tt.value = x.titulo; tt.id = 'ed-t-' + x.id; tt.setAttribute('aria-label', 'Atividade'); tt.maxLength = 120;
    const del = el('button', 'btn icon danger', '×'); del.type = 'button'; del.setAttribute('aria-label', 'Remover ' + x.titulo);
    const sub = el('div', 'sub2');
    const sa = el('select', 'field sel'); sa.id = 'ed-a-' + x.id; sa.setAttribute('aria-label', 'Área');
    for (const k of Object.keys(AREAS)) { const o = new Option(AREAS[k].nome, k); o.selected = k === x.area; sa.append(o); }
    const sp = el('select', 'field sel'); sp.id = 'ed-p-' + x.id; sp.setAttribute('aria-label', 'Período');
    for (const p of PERIODOS) { const o = new Option(p, p); o.selected = p === x.periodo; sp.append(o); }
    sub.append(sa, sp);
    const upd = () => { x.hora = tm.value; x.titulo = tt.value.trim() || 'Atividade'; x.area = sa.value; x.periodo = sp.value; edCommit(dow, list); document.getElementById('edCount').textContent = list.length + ' atividades · editado'; };
    tm.addEventListener('change', () => { upd(); renderEditor(); });
    tt.addEventListener('input', upd); sa.addEventListener('change', upd); sp.addEventListener('change', upd);
    del.addEventListener('click', () => { list.splice(list.indexOf(x), 1); edCommit(dow, list); renderEditor(); });
    row.append(tm, tt, del, sub); host.append(row);
  });
  if (!list.length) host.append(el('div', 'empty', 'Nenhuma atividade neste dia.'));
}
document.getElementById('edAdd').addEventListener('click', () => {
  const dow = state.edDow, list = tasksForDow(dow).map((x) => Object.assign({}, x));
  const id = 'u' + Date.now().toString(36);
  list.push(T(id, '12:00', 'Nova atividade', 'casa', 'Tarde'));
  edCommit(dow, list); renderEditor();
  const f = document.getElementById('ed-t-' + id); if (f) { f.focus(); f.select(); }
});
document.getElementById('edReset').addEventListener('click', () => { document.getElementById('edConfirm').hidden = false; });
document.getElementById('edResetNo').addEventListener('click', () => { document.getElementById('edConfirm').hidden = true; });
document.getElementById('edResetYes').addEventListener('click', () => { delete store.rotina[state.edDow]; marcarRotina(state.edDow); document.getElementById('edConfirm').hidden = true; renderEditor(); });

// =============== ciclo ===============
function render() {
  if (state.view === 'hoje') renderHoje();
  else if (state.view === 'evolucao') renderEvolucao();
  else if (state.view === 'semana') renderSemana();
  else if (state.view === 'rotina') renderEditor();
}
function renderSeguro() { if (user && state.view !== 'rotina') render(); }

// =============== login ===============
const $ = (id) => document.getElementById(id);
let modo = 'entrar';
function mostrarApp(on) {
  $('boot').hidden = true;
  $('view-login').hidden = on; $('topbar').hidden = !on; $('tabs').hidden = !on;
  if (!on) document.querySelectorAll('.view').forEach((v) => { v.hidden = true; });
}
function setModo(m) {
  modo = m;
  $('loginTitle').textContent = m === 'entrar' ? 'Entrar' : 'Criar conta';
  $('loginSubmit').textContent = m === 'entrar' ? 'Entrar' : 'Criar conta';
  $('loginToggle').textContent = m === 'entrar' ? 'Primeiro acesso? Criar conta' : 'Já tenho conta. Entrar';
  $('loginPass').autocomplete = m === 'entrar' ? 'current-password' : 'new-password';
  $('loginMsg').textContent = ''; $('loginMsg').className = 'msg';
}
$('loginToggle').addEventListener('click', () => setModo(modo === 'entrar' ? 'criar' : 'entrar'));
function traduzErro(e) {
  const m = (e && e.message) || '';
  if (/invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
  if (/email not confirmed/i.test(m)) return 'Confirme o e-mail pelo link que enviamos e tente de novo.';
  if (/already registered|already exists/i.test(m)) return 'Esse e-mail já tem conta. Use "Entrar".';
  if (/password/i.test(m) && /6/.test(m)) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (/signups not allowed|signup is disabled/i.test(m)) return 'A criação de novas contas está desativada neste app.';
  if (/rate limit/i.test(m)) return 'Muitas tentativas seguidas. Espere um minuto e tente de novo.';
  if (/fetch|network/i.test(m)) return 'Sem conexão com a internet. Conecte e tente de novo.';
  return 'Não deu certo: ' + m;
}
$('loginForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const email = $('loginEmail').value.trim(), password = $('loginPass').value;
  const msg = $('loginMsg'); msg.className = 'msg';
  if (!/^\S+@\S+\.\S+$/.test(email)) { msg.className = 'msg err'; msg.textContent = 'Digite um e-mail válido.'; return; }
  if (password.length < 6) { msg.className = 'msg err'; msg.textContent = 'A senha precisa ter pelo menos 6 caracteres.'; return; }
  $('loginSubmit').disabled = true; msg.textContent = modo === 'entrar' ? 'Entrando…' : 'Criando a conta…';
  try {
    if (modo === 'entrar') {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } else {
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin } });
      if (error) throw error;
      if (!data.session) { setModo('entrar'); msg.textContent = 'Conta criada. Abra o e-mail de confirmação que enviamos e depois entre aqui.'; }
    }
  } catch (e) { msg.className = 'msg err'; msg.textContent = traduzErro(e); }
  $('loginSubmit').disabled = false;
});
$('logoutBtn').addEventListener('click', async () => {
  if (pendentes() && navigator.onLine) await syncNow();
  if (pendentes()) { showAlert('Ainda há marcações que não foram enviadas. Conecte à internet antes de sair para não perdê-las.'); return; }
  await sb.auth.signOut();
});

function entrar(u) {
  if (user && user.id === u.id) return;
  user = u; load(); hideAlert();
  mostrarApp(true);
  const rota = location.pathname.replace(/^\/+|\/+$/g, '');
  showView(['evolucao', 'semana', 'rotina'].includes(rota) ? rota : 'hoje');
  setSync(pendentes() ? (navigator.onLine ? 'saving' : 'offline') : 'ok');
  ouvirMudancas();
  scheduleSync(0);
}
function sair() {
  if (canal) { sb.removeChannel(canal); canal = null; }
  user = null; resetStore(); setModo('entrar'); mostrarApp(false);
}

async function iniciar() {
  if (!sb) { $('boot').hidden = true; $('view-config').hidden = false; return; }
  sb.auth.onAuthStateChange((evento, sessao) => {
    if (evento === 'SIGNED_OUT' || !sessao) { if (user || evento === 'SIGNED_OUT') sair(); return; }
    setTimeout(() => entrar(sessao.user), 0);
  });
  const { data } = await sb.auth.getSession();
  if (data.session) entrar(data.session.user); else { setModo('entrar'); mostrarApp(false); }
}
iniciar();

let lastDay = todayKey(), rz = null;
setInterval(() => {
  const t = todayKey(); if (t !== lastDay) { if (state.sel === lastDay) state.sel = t; lastDay = t; }
  if (user && state.view !== 'rotina') render();
}, 60000);
setInterval(() => { if (user && !document.hidden) scheduleSync(0); }, 5 * 60000);
window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (state.view === 'semana') { renderGrid(); renderSono(); } }, 150); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && user) { renderSeguro(); scheduleSync(0); } });

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
