/* Academia El Dojo — course player (one script for the three paths).
   Shell page sets <body data-path="ninos|mujeres|fundamentos" data-root="../">.
   Flow: cover (name + age) → welcome video gate (must be watched to the end) → course map → lessons → finish.
   Progress: localStorage per path, portable restore code (?r=), and — when Jessica's personal link carries ?u=<token>
   and config.js has the Supabase URL + anon key — synced through public.course_progress_sync (bot_course_progress.sql). */
(() => {
  const B = document.body, PATH = B.dataset.path, ROOT = B.dataset.root || '../';
  const WA = '5215547000332';
  const CFG = window.ACADEMIA_CONFIG || {};
  const SLUG = { ninos: 'ninos', mujeres: 'autodefensa', fundamentos: 'fundamentos' }[PATH];   // slug in bot.course_progress
  const KEY = `eldojo:academia:${PATH}:v1`;
  const Q = new URLSearchParams(location.search);
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wa = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  const JP_N = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  // ---------------------------------------------------------------- state
  let S = { name: '', track: '', done: {}, quiz: {}, gate: false, started: 0, seenMs: {} };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} sync(); };
  const TOKEN = (Q.get('u') || '').trim();
  if (/^[a-zA-Z0-9]{16,32}$/.test(TOKEN)) { try { localStorage.setItem(KEY + ':u', TOKEN); } catch (e) {} }
  const token = () => { try { return localStorage.getItem(KEY + ':u') || ''; } catch (e) { return ''; } };
  if (Q.get('edad') === '7-9' || Q.get('edad') === '10-12') S.track = Q.get('edad');
  if (Q.get('n')) S.name = Q.get('n').slice(0, 40);

  let C, PTH, LESSONS = [];
  const total = () => LESSONS.length;
  const nDone = () => LESSONS.filter(l => S.done[l.id]).length;
  const pct = () => Math.round(100 * nDone() / Math.max(1, total()));

  // portable progress: done-set as a bitmask over lessons in order → base32 code (?r=)
  const A32 = 'abcdefghijklmnopqrstuvwxyz234567';
  function code() { let bits = LESSONS.map(l => S.done[l.id] ? 1 : 0).join(''); while (bits.length % 5) bits += '0'; let s = ''; for (let i = 0; i < bits.length; i += 5) s += A32[parseInt(bits.slice(i, i + 5), 2)]; return s; }
  function restore(c) { if (!/^[a-z2-7]{1,20}$/.test(c)) return; const bits = [...c].map(ch => A32.indexOf(ch).toString(2).padStart(5, '0')).join(''); LESSONS.forEach((l, i) => { if (bits[i] === '1') S.done[l.id] = S.done[l.id] || Date.now(); }); S.gate = true; }
  function myLink() { const u = new URL(location.href); u.hash = ''; u.search = ''; u.searchParams.set('r', code()); if (S.track) u.searchParams.set('edad', S.track); if (token()) u.searchParams.set('u', token()); return u.toString(); }

  let syncT;
  function sync() {
    const t = token(); if (!t || !CFG.supabaseUrl || !CFG.anonKey) return;
    clearTimeout(syncT); syncT = setTimeout(() => {
      fetch(`${CFG.supabaseUrl}/rest/v1/rpc/course_progress_sync`, {
        method: 'POST', headers: { apikey: CFG.anonKey, Authorization: `Bearer ${CFG.anonKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_token: t, p_slug: SLUG, p_track: S.track || null, p_done: S.done, p_done_n: nDone(), p_total: total() })
      }).then(r => r.ok ? r.json() : {}).then(r => {          // another phone may have more progress: merge, never drop
        if (r && r.done && typeof r.done === 'object') { let more = false; for (const k in r.done) if (!S.done[k]) { S.done[k] = r.done[k]; more = true; } if (more) { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} render(); } }
      }).catch(() => {});
    }, 600);
  }

  // ---------------------------------------------------------------- media
  const thumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const PLAY = '<span><svg viewBox="0 0 24 24"><path d="M6 4l15 8-15 8z"/></svg></span>';
  let ytP; const noEmbed = () => { try { return sessionStorage.getItem('eldojo:noembed') === '1'; } catch (e) { return false; } };
  function ytApi() {
    if (ytP) return ytP;
    ytP = new Promise((res, rej) => {
      if (window.YT && YT.Player) return res(YT);
      window.onYouTubeIframeAPIReady = () => res(YT);
      const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.onerror = rej; document.head.appendChild(s);
      setTimeout(() => rej(new Error('timeout')), 8000);
    });
    return ytP;
  }
  function mountPlayer(box, v) {
    const url = `https://www.youtube.com/watch?v=${v.youtube_id}${v.start_seconds ? '&t=' + v.start_seconds : ''}`;
    box.innerHTML = `<div class="player__cover tone"><img src="${thumb(v.youtube_id)}" alt="" loading="lazy"></div><button class="gate__play" aria-label="Ver video: ${esc(v.title)}">${PLAY}</button><a class="player__yt" href="${url}" target="_blank" rel="noopener">YouTube ↗</a>`;
    $('.gate__play', box).onclick = () => {
      if (noEmbed()) { window.open(url, '_blank', 'noopener'); return; }
      const fail = () => { try { sessionStorage.setItem('eldojo:noembed', '1'); } catch (e) {} window.open(url, '_blank', 'noopener'); };
      ytApi().then(YT => {
        box.innerHTML = '<div class="yt"></div>'; let ok = false;
        new YT.Player($('.yt', box), { videoId: v.youtube_id, playerVars: { autoplay: 1, rel: 0, playsinline: 1, modestbranding: 1, start: v.start_seconds || 0 },
          events: { onReady: e => { ok = true; e.target.playVideo(); }, onError: () => { mountPlayer(box, v); fail(); } } });
        setTimeout(() => { if (!ok) { mountPlayer(box, v); fail(); } }, 7000);
      }).catch(fail);
    };
  }

  // ---------------------------------------------------------------- screens
  const app = $('#app');
  function lessonById(id) { return LESSONS.find(l => l.id === id); }
  function nextLesson() { return LESSONS.find(l => !S.done[l.id]); }
  function setNav(jp, txt) { $('#navJp').textContent = jp; $('#navCh').textContent = txt; $('#pbar').style.width = pct() + '%'; }
  function hi() { return S.name ? `${S.name.split(' ')[0]}` : ''; }

  const COVER = { ninos: ROOT + 'assets/v/leon2', mujeres: ROOT + 'academia/video/cover-mujeres', fundamentos: ROOT + 'assets/v/warmup' };
  function viewCover() {
    setNav('第一巻', PTH.name);
    const kids = PATH === 'ninos';
    return `<section class="screen on cover" aria-label="Portada">
      <div class="cover__grid">
        <div class="pn cover__art">
          <div class="tone"><video src="${COVER[PATH]}.mp4" poster="${COVER[PATH]}.jpg" autoplay muted loop playsinline preload="metadata"></video></div>
          <div class="cover__kanji" translate="no" aria-hidden="true">${PTH.kanji}</div>
          <div class="cover__ttl">
            <span class="tag"><span class="jp" translate="no">入門</span><span class="label">${esc(C.academy.name)} · Gratis</span></span>
            <h1 class="ttl">${esc(PTH.name).replace(/^(.*?)( para | de )(.*)$/i, '<span class="ln">$1$2</span><span class="ln"><em>$3</em></span>')}</h1>
          </div>
        </div>
        <div class="cover__side">
          <div class="pn cover__card">
            <p class="lede"><b>${esc(PTH.promise)}</b></p>
            <p class="hint" style="font-size:15px">${esc(PTH.who_for)}</p>
            <div class="facts" style="margin-top:16px">
              <div class="pn fact"><b>${total()}</b><span>Lecciones</span></div>
              <div class="pn fact"><b>${PTH.modules.length}</b><span>Semanas</span></div>
              <div class="pn fact pn--red"><b>100%</b><span>Gratis</span></div>
            </div>
          </div>
          <form class="pn cover__card" id="startForm" autocomplete="on">
            <span class="tag"><span class="jp" translate="no">名前</span><span class="label">Tu acceso</span></span>
            <label class="field"><span>${kids ? 'Nombre de tu hijo o hija' : '¿Cómo te llamas?'}</span><input name="n" maxlength="40" value="${esc(S.name)}" placeholder="${kids ? 'Ej. León' : 'Tu nombre'}" required></label>
            ${kids ? `<div class="field"><span>Edad</span><div class="ages">
              <button type="button" class="age" data-age="7-9" aria-pressed="${S.track === '7-9'}">7 a 9<small>años</small></button>
              <button type="button" class="age" data-age="10-12" aria-pressed="${S.track === '10-12'}">10 a 12<small>años</small></button></div></div>` : ''}
            <button class="btn" style="width:100%;margin-top:18px" type="submit">${nDone() ? 'Continuar mi curso' : 'Entrar a mi curso'} <span class="arr">→</span></button>
            <p class="hint">${token() ? 'Tu avance se guarda en tu enlace personal de WhatsApp: ábrelo en cualquier teléfono y sigues donde te quedaste.' : 'Tu avance se guarda en este teléfono. Pídenos tu enlace personal por WhatsApp para seguir en cualquier lugar.'}</p>
          </form>
        </div>
      </div>
    </section>`;
  }

  function viewHome() {
    const nx = nextLesson(); setNav('第二巻', `${pct()}% completado`);
    const R = 54, CIRC = 2 * Math.PI * R;
    const nxMod = nx && PTH.modules.find(m => m.lessons.includes(nx));
    return `<section class="screen on home" aria-label="Tu curso"><div class="wrap">
      <div class="home__head">
        <div>
          <span class="tag"><span class="jp" translate="no">${PTH.kanji}</span><span class="label">${esc(PTH.name)}</span></span>
          <h1 class="ttl" style="margin-top:14px">${hi() ? `<span class="ln">¡Oss, ${esc(hi())}!</span>` : '<span class="ln">¡Oss!</span>'}<span class="ln"><em>${nDone() ? 'Sigue así' : 'Aquí empieza'}</em></span></h1>
        </div>
        <div class="ring" aria-label="${pct()}% completado"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" fill="var(--paper)" stroke="var(--ink)" stroke-width="14"/><circle cx="60" cy="60" r="${R}" fill="none" stroke="var(--red)" stroke-width="10" stroke-dasharray="${CIRC * pct() / 100} ${CIRC}"/></svg><b>${pct()}%</b></div>
      </div>
      ${nx ? `<div class="pn next">
        <div class="tone"><img src="${thumb(nx.video.youtube_id)}" alt="" loading="lazy"></div>
        <div class="next__body">
          <span class="label" style="color:var(--red)">${nDone() ? 'Tu siguiente lección' : 'Empieza aquí'} · Semana ${nxMod.n}</span>
          <h2 class="h2">${esc(nx.title)}</h2>
          <p>${esc(nx.objective)}</p>
          <a class="btn" href="#l/${nx.id}" style="align-self:flex-start">Ir a la lección <span class="arr">→</span></a>
        </div></div>` : `<div class="pn pn--red next__body" style="margin-bottom:28px"><h2 class="h2">¡Terminaste el curso!</h2><a class="btn btn--paper" href="#fin" style="align-self:flex-start">Ver tu cinturón de casa →</a></div>`}
      <div class="mods">${PTH.modules.map(m => {
        const md = m.lessons.every(l => S.done[l.id]);
        return `<section class="mod">
          <div class="mod__head"><span class="tag"><span class="jp" translate="no">第${JP_N[m.n - 1]}週</span><span class="label">Semana ${m.n}</span></span><h2 class="h2">${esc(m.title)}</h2><p class="mod__goal">${esc(m.goal)}</p></div>
          <div class="lessons">${m.lessons.map((l, i) => `<a class="lc${S.done[l.id] ? ' done' : ''}${nx && nx.id === l.id ? ' next-up' : ''}" href="#l/${l.id}">
            <div class="tone"><img src="${thumb(l.video.youtube_id)}" alt="" loading="lazy"></div>
            <div class="lc__b"><span class="lc__n">Lección ${LESSONS.indexOf(l) + 1}</span><span class="lc__t">${esc(l.title)}</span><span class="lc__m">${l.duration_min} min</span></div></a>`).join('')}</div>
          <div class="pn milestone${md ? '' : ' locked'}"><span class="jp" translate="no">${md ? '達' : '?'}</span><div><b class="label">${md ? 'Hito desbloqueado' : 'Hito por desbloquear'}</b><p style="font-size:14px;margin-top:4px">${esc(m.milestone)}</p></div></div>
        </section>`; }).join('')}</div>
      <div class="pn habit"><span class="tag"><span class="jp" translate="no">習慣</span><span class="label">Tu plan de práctica</span></span><p style="margin-top:12px">${esc(PTH.habit_plan)}</p>
        <ul>${C.academy.safety_rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
      ${PTH.extras && PTH.extras.length ? `<details class="pn extras"><summary><span class="h3">Biblioteca extra · ${PTH.extras.length} técnicas</span><span class="label">Abrir ↓</span></summary>
        <ul>${PTH.extras.map(x => `<li><a href="https://www.youtube.com/watch?v=${x.youtube_id}" target="_blank" rel="noopener">${esc(x.label)}<small>${esc(x.channel)} ↗</small></a></li>`).join('')}</ul></details>` : ''}
    </div></section>`;
  }

  function viewLesson(l) {
    const i = LESSONS.indexOf(l), m = PTH.modules.find(mm => mm.lessons.includes(l)), prev = LESSONS[i - 1], next = LESSONS[i + 1];
    setNav(`第${JP_N[m.n - 1]}週`, `Lección ${i + 1} de ${total()}`);
    const drill = l.partner_drill || l.solo_drill, q = l.self_check, ans = S.quiz[l.id];
    const age = l.age_notes ? Object.entries(l.age_notes).map(([k, v]) => `<div class="age-note"${S.track && S.track !== k ? ' style="opacity:.55"' : ''}><b>${k} años:</b> ${esc(v)}</div>`).join('') : '';
    const cp = l.class_pointer ? `<div class="pn card pn--ink"><span class="label" style="color:var(--red)">Tu clase en El Dojo</span>${Object.entries(l.class_pointer).map(([k, v]) => `<p><b style="text-transform:capitalize">${esc(k)}:</b> ${esc(v)}</p>`).join('')}</div>` : '';
    return `<section class="screen on lesson" aria-label="${esc(l.title)}"><div class="wrap">
      <div class="crumb"><a href="#inicio">Mi curso</a><span>/</span><span>Semana ${m.n} · ${esc(m.title)}</span></div>
      <div class="lesson__grid">
        <div>
          <span class="tag"><span class="jp" translate="no">第${i + 1}課</span><span class="label">Lección ${i + 1} · ${l.duration_min} min</span></span>
          <h1 class="h2" style="margin:12px 0 16px;font-size:clamp(34px,5.4vw,62px)">${esc(l.title)}</h1>
          <div class="player" id="player"></div>
          <p class="credit">Video: «${esc(l.video.title)}» · ${esc(l.video.channel)} (YouTube). ${esc(l.video.why_this_video || '')}</p>
          <div class="pn obj"><span class="label" style="color:var(--red)">Objetivo</span><p><b>${esc(l.objective)}</b></p><p style="color:var(--ink-soft)">${esc(l.why_it_matters)}</p></div>
          <div class="blk"><h3 class="h3"><span class="jp" translate="no">技</span>Paso a paso</h3><ol class="steps">${l.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
          <div class="blk"><h3 class="h3"><span class="jp" translate="no">誤</span>Errores comunes</h3><ul class="mist">${l.common_mistakes.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>
        </div>
        <aside class="side">
          <div class="pn card card--safe"><span class="label" style="color:#ff8a70">Seguridad</span><p>${esc(l.safety)}</p></div>
          ${drill ? `<div class="pn card card--drill"><span class="label" style="color:var(--red)">${l.partner_drill ? 'Practica con tu compañero' : 'Practica en casa'}</span><p>${esc(drill)}</p></div>` : ''}
          ${l.parent_note ? `<div class="pn card"><span class="label" style="color:var(--teal)">Para papá y mamá</span><p>${esc(l.parent_note)}</p>${age}</div>` : ''}
          ${cp}
          ${q ? `<div class="pn quiz${ans != null ? ' answered' : ''}" id="quiz"><span class="tag"><span class="jp" translate="no">問</span><span class="label">Pregunta rápida</span></span>
            <p class="quiz__q">${esc(q.question)}</p>
            ${q.options.map((o, k) => `<button class="opt${k === q.answer ? ' ok' : ' no'}${ans != null && k === q.answer ? ' reveal' : ''}" data-k="${k}" aria-pressed="${ans === k}">${esc(o)}</button>`).join('')}
            <p class="quiz__exp"><b>${ans === q.answer ? '¡Exacto!' : 'Casi.'}</b> ${esc(q.explanation)}</p></div>` : ''}
        </aside>
      </div>
      <div class="lnav">
        ${prev ? `<a class="btn btn--paper" href="#l/${prev.id}">← Anterior</a>` : '<a class="btn btn--paper" href="#inicio">← Mi curso</a>'}
        <button class="btn" id="doneBtn"${q && ans == null ? ' disabled' : ''}>${S.done[l.id] ? (next ? 'Siguiente lección' : 'Terminar el curso') : 'Marcar completa y continuar'} <span class="arr">→</span></button>
      </div>
      ${q && ans == null ? '<p class="hint" style="text-align:right">Responde la pregunta rápida para marcar la lección.</p>' : ''}
    </div></section>`;
  }

  function viewFin() {
    setNav('最終話', '¡Curso completado!');
    const cp = LESSONS[LESSONS.length - 1].class_pointer || {};
    return `<section class="screen on fin" aria-label="Fin"><div class="wrap">
      <span class="tag"><span class="jp" translate="no">最終話</span><span class="label">Fin del tomo · ${esc(PTH.name)}</span></span>
      <h1 class="ttl" style="margin-top:16px"><span class="ln">¡Lo</span><span class="ln"><em>lograste${hi() ? ', ' + esc(hi()) : ''}!</em></span></h1>
      <div class="pn belt"><span class="label">Cinturón de casa</span><div class="belt__bar" aria-hidden="true"></div>
        <p>${nDone()} de ${total()} lecciones completadas. El siguiente capítulo se escribe en el tatami.</p>
        ${cp.principal ? `<p style="margin-top:10px"><b>Tu clase:</b> ${esc(cp.principal)}</p>` : ''}</div>
      <a class="btn btn--wa" href="${wa(`Hola, ${S.name ? (PATH === 'ninos' ? S.name + ' terminó' : 'soy ' + S.name + ' y terminé') : 'terminé'} el curso de ${PTH.name} de la Academia El Dojo. ¿Qué día podemos ir a la primera clase?`)}" target="_blank" rel="noopener">Agendar mi primera clase por WhatsApp →</a>
      <p style="margin-top:18px"><a href="#inicio" style="text-decoration:underline">Volver a mi curso</a></p>
    </div></section>`;
  }

  // ---------------------------------------------------------------- milestone modal
  function milestone(m) {
    const md = $('#modal'); const last = m.n === PTH.modules.length;
    md.innerHTML = `<div class="pn modal__card" role="dialog" aria-modal="true" aria-label="Hito"><div class="burst"><span>¡Oss!</span></div>
      <div class="jp big" translate="no">達</div><h2 class="h2" style="margin-top:6px">¡Semana ${m.n} lista!</h2>
      <p style="margin-top:10px"><b>${esc(m.milestone)}</b></p><p style="margin-top:8px;color:var(--ink-soft)">${esc(m.cta)}</p>
      <a class="btn btn--wa" target="_blank" rel="noopener" href="${wa(`Hola, ${S.name ? (PATH === 'ninos' ? S.name + ' terminó' : 'soy ' + S.name + ' y terminé') : 'terminé'} la Semana ${m.n} del curso de ${PTH.name}. Me gustaría conocer El Dojo.`)}">Escríbenos por WhatsApp</a>
      <button class="modal__close" id="mClose">${last ? 'Ver mi cinturón de casa' : 'Seguir con la Semana ' + (m.n + 1)}</button></div>`;
    md.classList.add('on'); $('#mClose').onclick = () => { md.classList.remove('on'); location.hash = last ? '#fin' : '#inicio'; };
  }

  // ---------------------------------------------------------------- welcome video gate (must be watched in full)
  function gate(onDone) {
    const g = $('#gate'), v = $('video', g), bar = $('.gate__bar i', g), btn = $('#gateGo'), lock = $('.gate__lock', g), skip = $('.gate__skip', g), play = $('.gate__play', g), mute = $('.gate__mute', g);
    g.classList.add('on'); B.classList.add('no-chat'); B.style.overflow = 'hidden';
    let watched = 0, last = 0, unlocked = false;
    const unlock = () => { if (unlocked) return; unlocked = true; btn.disabled = false; lock.textContent = '¡Listo! Tu curso está desbloqueado'; bar.style.width = '100%'; };
    v.addEventListener('timeupdate', () => {
      const d = v.currentTime - last; if (d > 0 && d < 1.5) watched += d; last = v.currentTime;
      const p = Math.min(1, watched / (v.duration || 60)); bar.style.width = (p * 100) + '%';
      if (!unlocked) lock.textContent = `Mira el video completo para entrar · ${Math.max(0, Math.ceil((v.duration || 60) - watched))} s`;
      if (p >= .97) unlock();
    });
    v.addEventListener('seeking', () => { if (!unlocked && v.currentTime > last + 1) v.currentTime = last; });
    v.addEventListener('ended', unlock);
    v.addEventListener('error', () => { unlock(); });
    v.addEventListener('pause', () => { if (!v.ended) play.style.display = 'grid'; });
    v.addEventListener('play', () => { play.style.display = 'none'; });
    play.onclick = () => { v.muted = false; mute.textContent = '🔊'; v.play().catch(() => { v.muted = true; mute.textContent = '🔇'; v.play(); }); };
    v.onclick = () => v.paused ? v.play() : v.pause();
    mute.onclick = () => { v.muted = !v.muted; mute.textContent = v.muted ? '🔇' : '🔊'; };
    setTimeout(() => { if (!unlocked && watched < 1) skip.style.display = 'inline'; }, 45000);   // only if it never started
    skip.onclick = e => { e.preventDefault(); unlock(); };
    btn.onclick = () => { v.pause(); g.classList.remove('on'); B.classList.remove('no-chat'); B.style.overflow = ''; S.gate = true; save(); onDone(); };
  }

  // ---------------------------------------------------------------- router
  function render() {
    const h = location.hash.slice(1);
    $('#modal').classList.remove('on');
    if (!S.started && !h.startsWith('l/') && h !== 'inicio' && h !== 'fin') { app.innerHTML = viewCover(); bindCover(); }
    else if (h.startsWith('l/') && lessonById(h.slice(2))) { app.innerHTML = viewLesson(lessonById(h.slice(2))); bindLesson(lessonById(h.slice(2))); }
    else if (h === 'fin') app.innerHTML = viewFin();
    else app.innerHTML = viewHome();
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('#myLink').href = wa(`Hola, este es mi enlace del curso ${PTH.name} (${pct()}%): ${myLink()}`);
  }
  function bindCover() {
    $$('.age').forEach(b => b.onclick = () => { S.track = b.dataset.age; $$('.age').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    $('#startForm').onsubmit = e => {
      e.preventDefault(); S.name = e.target.n.value.trim().slice(0, 40);
      if (PATH === 'ninos' && !S.track) { $('.ages').animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 260); return; }
      S.started = S.started || Date.now(); save();
      if (!S.gate) gate(() => { location.hash = '#inicio'; render(); }); else { location.hash = '#inicio'; render(); }
    };
  }
  function bindLesson(l) {
    mountPlayer($('#player'), l.video);
    $$('#quiz .opt').forEach(b => b.onclick = () => {          // update in place: no re-render, no jump to the top
      const k = +b.dataset.k, q = l.self_check; S.quiz[l.id] = k; save();
      $$('#quiz .opt').forEach(o => { o.setAttribute('aria-pressed', +o.dataset.k === k); o.classList.toggle('reveal', +o.dataset.k === q.answer); });
      $('#quiz').classList.add('answered'); $('#quiz .quiz__exp b').textContent = k === q.answer ? '¡Exacto!' : 'Casi.';
      $('#doneBtn').disabled = false; const h = $('.lnav + .hint'); if (h) h.remove();
    });
    $('#doneBtn').onclick = () => {
      const wasDone = !!S.done[l.id]; S.done[l.id] = S.done[l.id] || Date.now(); save();
      const m = PTH.modules.find(mm => mm.lessons.includes(l)), i = LESSONS.indexOf(l);
      if (!wasDone && m.lessons.every(x => S.done[x.id])) { milestone(m); return; }
      location.hash = LESSONS[i + 1] ? '#l/' + LESSONS[i + 1].id : '#fin';
    };
  }

  // ---------------------------------------------------------------- boot
  fetch(ROOT + 'academia/course.json').then(r => r.json()).then(data => {
    C = data; PTH = C.paths.find(p => p.slug === PATH); LESSONS = PTH.modules.flatMap(m => m.lessons);
    if (Q.get('r')) { restore(Q.get('r')); S.started = S.started || Date.now(); save(); }
    if (token() && !S.started) S.started = 0;
    $('#gate video').src = `${ROOT}academia/video/bienvenida-${PATH}.mp4`;
    addEventListener('hashchange', render); render(); sync();
    if (S.started && !S.gate) gate(() => { location.hash = '#inicio'; render(); });
  });
  $('#replayGate').onclick = e => { e.preventDefault(); const v = $('#gate video'); v.currentTime = 0; gate(render); $('#gateGo').disabled = !S.gate; };
})();
