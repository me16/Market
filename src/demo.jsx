// Interactive Run Show demo — mirrors line-notes runshow UI exactly.
import React, { useState, useEffect, useRef, useMemo } from 'react'

/* ------------------------------------------------------------------ */
/* DATA                                                               */
/* ------------------------------------------------------------------ */
const CAST = [
  { id: 'maria',  name: 'MARIA',  actor: 'Jordan Lee',   color: '#C8A96E' },
  { id: 'jonas',  name: 'JONAS',  actor: 'Sam Park',     color: '#4A8FD4' },
  { id: 'ellie',  name: 'ELLIE',  actor: 'Maya Wong',    color: '#9B7BC8' },
  { id: 'david',  name: 'DAVID',  actor: 'Theo Banks',   color: '#3BAF6A' },
];

const NOTE_TYPES = [
  { id: 'drop',  label: 'DROP',  hint: 'F1' },
  { id: 'add',   label: 'ADD',   hint: 'F2' },
  { id: 'trans', label: 'TRANS', hint: 'F3' },
  { id: 'note',  label: 'NOTE',  hint: 'F4' },
];

/* Original script content — Scene 4 of a fictional play. */
const SCRIPT = [
  { kind: 'act',    text: 'ACT II' },
  { kind: 'scene',  text: 'SCENE 4 — KITCHEN, EVENING' },
  { kind: 'dir',    text: 'MARIA enters, holding a paper bag. She sets it on the counter and does not turn on the light. Outside, the wind is making the screen door rattle.' },
  { kind: 'speaker', char: 'maria', text: 'MARIA' },
  { kind: 'line',   char: 'maria', text: 'We agreed on Tuesday. I marked it on the calendar.' },
  { kind: 'speaker', char: 'jonas', text: 'JONAS (off)' },
  { kind: 'line',   char: 'jonas', text: 'The calendar lies.' },
  { kind: 'speaker', char: 'maria', text: 'MARIA' },
  { kind: 'line',   char: 'maria', text: 'Excuse me?' },
  { kind: 'dir',    text: 'JONAS enters from the hallway, carrying a screwdriver and a small box.' },
  { kind: 'speaker', char: 'jonas', text: 'JONAS' },
  { kind: 'line',   char: 'jonas', text: 'I said the calendar lies. You wrote Tuesday because you wanted it to be Tuesday.' },
  { kind: 'line',   char: 'jonas', text: 'But the post said Thursday. I read it twice.' },
  { kind: 'speaker', char: 'maria', text: 'MARIA' },
  { kind: 'line',   char: 'maria', text: 'Then why is the kettle still on?' },
  { kind: 'dir',    text: 'A long pause. JONAS sets the box on the table without looking at it.' },
  { kind: 'speaker', char: 'jonas', text: 'JONAS' },
  { kind: 'line',   char: 'jonas', text: 'Because I was hopeful.' },
  { kind: 'speaker', char: 'ellie', text: 'ELLIE (from upstairs)' },
  { kind: 'line',   char: 'ellie', text: 'Mom — did the package come?' },
  { kind: 'dir',    text: 'MARIA and JONAS look at each other. Neither answers.' },
  { kind: 'speaker', char: 'maria', text: 'MARIA' },
  { kind: 'line',   char: 'maria', text: 'It came. It is on the counter. Come down and open it before dinner.' },
];

/* Two notes prefilled to make the demo feel inhabited from frame one. */
const SEED_NOTES = [
  { id: 'seed-1', lineIdx: 6,  charId: 'jonas', type: 'drop', text: 'rushed entrance, missed first beat',  page: 14, t: '00:02:18' },
  { id: 'seed-2', lineIdx: 11, charId: 'jonas', type: 'add',  text: '"because" — extra word',              page: 14, t: '00:03:41' },
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */
function fmt(sec) {
  const h = Math.floor(sec / 3600).toString().padStart(2,'0');
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2,'0');
  const s = (sec % 60).toString().padStart(2,'0');
  return `${h}:${m}:${s}`;
}
function castById(id) { return CAST.find(c => c.id === id); }
function typeColor(t) {
  return t === 'drop'  ? '#E8221A'
       : t === 'add'   ? '#3BAF6A'
       : t === 'trans' ? '#D4AF37'
       : t === 'note'  ? '#4A8FD4'
       : '#5E5C58';
}

/* ------------------------------------------------------------------ */
/* APP                                                                */
/* ------------------------------------------------------------------ */
function RunShowDemo() {
  const [notes, setNotes] = useState(SEED_NOTES);
  const [selectedType, setSelectedType] = useState('drop');
  const [activeChar, setActiveChar] = useState(null);
  const [popover, setPopover] = useState(null);  // { lineIdx, x, y, charId, type, text }
  const [running, setRunning] = useState(true);
  const [elapsed, setElapsed] = useState(143);   // start mid-run for realism
  const [toast, setToast] = useState(null);
  const [scratch, setScratch] = useState('Watch flicker before "kettle" line — ME standby for L43.');

  /* timer */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  /* toast dismiss */
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  /* keyboard shortcuts (F1-F4 → type, Esc closes popover) */
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setPopover(null); return; }
      if (popover && ['1','2','3','4'].includes(e.key)) {
        const t = NOTE_TYPES[parseInt(e.key,10)-1];
        if (t) setPopover(p => p && ({...p, type: t.id}));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [popover]);

  const openPopover = (lineIdx, charId, ev) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const wrapper = ev.currentTarget.closest('.rs-page-wrapper');
    const wrap = wrapper ? wrapper.getBoundingClientRect() : rect;
    const x = Math.min(rect.left - wrap.left + rect.width + 12, wrap.width - 280);
    const y = rect.top - wrap.top - 8;
    setPopover({ lineIdx, charId: charId || null, type: selectedType, text: '', x, y });
  };

  const confirmNote = () => {
    if (!popover || !popover.charId) return;
    const newNote = {
      id: 'n-' + Date.now(),
      lineIdx: popover.lineIdx,
      charId: popover.charId,
      type: popover.type,
      text: popover.text || '',
      page: 14,
      t: fmt(elapsed),
    };
    setNotes(n => [newNote, ...n]);
    setSelectedType(popover.type);
    setPopover(null);
    const c = castById(newNote.charId);
    setToast(`Logged — ${newNote.type.toUpperCase()} on ${c.name}`);
  };

  const deleteNote = (id) => setNotes(n => n.filter(x => x.id !== id));

  /* per-line note lookup */
  const notesByLine = useMemo(() => {
    const m = {};
    notes.forEach(n => { (m[n.lineIdx] = m[n.lineIdx] || []).push(n); });
    return m;
  }, [notes]);

  /* count per char */
  const countsByChar = useMemo(() => {
    const c = {};
    notes.forEach(n => { c[n.charId] = (c[n.charId] || 0) + 1; });
    return c;
  }, [notes]);

  const typeCounts = useMemo(() => {
    const c = { drop: 0, add: 0, trans: 0, note: 0 };
    notes.forEach(n => { c[n.type] = (c[n.type] || 0) + 1; });
    return c;
  }, [notes]);

  /* visible notes — filtered by character if one is selected */
  const visibleNotes = activeChar ? notes.filter(n => n.charId === activeChar) : notes;

  return (
    <div className="demo-body">
      {/* ============== LEFT SIDEBAR ============== */}
      <div className="rs-sidebar">
        <div className="rs-sidebar-header">
          <span className="ln-logo">LINE NOTES</span>
          <span className="show-name">·  The Kettle</span>
          <span className="heartbeat-dot" title="Syncing" style={{marginLeft:'auto'}}></span>
        </div>

        <div className="ln-sidebar-section">
          <h5>Cast</h5>
          {CAST.map(c => (
            <button
              key={c.id}
              className={'char-item' + (activeChar === c.id ? ' char-item--active' : '')}
              onClick={() => setActiveChar(activeChar === c.id ? null : c.id)}
              style={{width:'100%', background:'transparent', border:'none', borderRadius:0}}>
              <span className="char-dot" style={{background: c.color}}></span>
              <span>{c.name}</span>
              <span className="char-count">{countsByChar[c.id] || 0}</span>
            </button>
          ))}
        </div>

        <div className="ln-sidebar-section">
          <h5>Note Type</h5>
          <div className="note-types">
            {NOTE_TYPES.map(t => (
              <button
                key={t.id}
                className={'note-type-btn' + (selectedType === t.id ? ' note-type-btn--active' : '')}
                onClick={() => setSelectedType(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ln-sidebar-section" style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden', padding: 0}}>
          <div style={{padding:'12px 12px 6px', display:'flex', alignItems:'center', gap:8}}>
            <h5 style={{margin:0}}>Notes</h5>
            <span style={{marginLeft:'auto', fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--text-muted)'}}>
              {visibleNotes.length}{activeChar ? ` / ${notes.length}` : ''}
            </span>
          </div>
          <div className="notes-list">
            {visibleNotes.length === 0 && (
              <div className="note-empty">
                No notes yet.<br/>
                Click any line in the script to add one.
              </div>
            )}
            {visibleNotes.map(n => {
              const c = castById(n.charId);
              return (
                <div key={n.id} className="note-item">
                  <div className="note-color-bar" style={{background: c.color}}></div>
                  <div className="note-item-content">
                    <div className="note-item-header">
                      <span className="note-page">p.{n.page}</span>
                      <span className="note-char-name">{c.name}</span>
                      <span className={'note-type-label ' + n.type}>{n.type.toUpperCase()}</span>
                      <span style={{marginLeft:'auto', fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--text-muted)'}}>{n.t}</span>
                    </div>
                    {n.text && <div className="note-text-preview">{n.text}</div>}
                  </div>
                  <button
                    onClick={() => deleteNote(n.id)}
                    style={{background:'none', border:'none', color:'var(--text-muted)', fontSize:13, cursor:'pointer'}}
                    title="Delete note">×</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============== CENTER: SCRIPT ============== */}
      <div className="rs-script-area">
        <div className="ln-header">
          <div className="ln-page-nav">
            <button>‹</button>
            <input className="page-input" value="14" readOnly/>
            <span className="total">/ 64</span>
            <button>›</button>
          </div>
          <button className="ln-header-btn">☆ Bookmarks</button>
          <button className="ln-header-btn">2-up</button>
          <div className="spacer"></div>
          <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--text-muted)', letterSpacing:'0.06em'}}>
            ACT II · SCENE 4
          </span>
        </div>

        <div className="rs-canvas-area">
          <div className="rs-page-wrapper">
            <div className="rs-page">
              <span className="page-num">— 14 —</span>
              {SCRIPT.map((item, i) => {
                if (item.kind === 'act')   return <div key={i} className="act-marker">{item.text}</div>;
                if (item.kind === 'scene') return <div key={i} className="scene-head">{item.text}</div>;
                if (item.kind === 'dir')   return (
                  <div key={i} className="stage-dir line"
                       onClick={(e) => openPopover(i, null, e)}>
                    {item.text}
                  </div>
                );
                if (item.kind === 'speaker') {
                  const c = castById(item.char);
                  return (
                    <div key={i} className="speaker" style={{color: c ? c.color : undefined}}>
                      {item.text}
                    </div>
                  );
                }
                // line
                const lineNotes = notesByLine[i] || [];
                const primary = lineNotes[0];
                const c = castById(item.char);
                const cls = 'line' +
                  (primary ? ' line--noted line--noted-' + primary.type : '');
                return (
                  <div key={i} className={cls}
                       onClick={(e) => openPopover(i, item.char, e)}>
                    {c && (
                      <span className="actor-pill" style={{background: c.color}}>
                        {c.actor.split(' ')[0].toUpperCase()}
                      </span>
                    )}
                    {item.text}
                    {primary && (
                      <span className={'tag-flag ' + primary.type}>
                        {primary.type.toUpperCase()}
                        {lineNotes.length > 1 ? ' ·' + lineNotes.length : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* popover, anchored to wrapper */}
            {popover && (
              <NotePopover
                popover={popover}
                setPopover={setPopover}
                line={SCRIPT[popover.lineIdx]}
                onConfirm={confirmNote}
                onCancel={() => setPopover(null)}
              />
            )}
          </div>

          {toast && (
            <div className="demo-toast">
              <span className="ok">✓</span> &nbsp; {toast}
            </div>
          )}
        </div>
      </div>

      {/* ============== RIGHT: CONTROLS ============== */}
      <div className="rs-controls">
        <div className="rs-controls-inner">
          <div className="rs-section-label">Session</div>

          {running ? (
            <div className="rs-session-header">
              <div style={{display:'flex', flexDirection:'column', gap:2, flex:1, minWidth:0}}>
                <span className="rs-session-title">Tech Rehearsal · D7</span>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--text-muted)', letterSpacing:'0.05em'}}>
                  STARTED 19:42 · ACT II
                </span>
              </div>
              <span className="rs-session-elapsed rs-session-elapsed--running">{fmt(elapsed)}</span>
            </div>
          ) : (
            <button className="rs-start-run-btn" onClick={() => { setRunning(true); setElapsed(0); }}>
              ▶ Start Run
            </button>
          )}

          {running && (
            <button className="rs-end-run-btn" onClick={() => setRunning(false)}>
              End Run
            </button>
          )}

          <div className="rs-stat-grid">
            <div className="rs-stat">
              <div className="n n--red">{typeCounts.drop}</div>
              <div className="l">Drops</div>
            </div>
            <div className="rs-stat">
              <div className="n n--green">{typeCounts.add}</div>
              <div className="l">Adds</div>
            </div>
            <div className="rs-stat">
              <div className="n n--gold">{typeCounts.trans}</div>
              <div className="l">Trans</div>
            </div>
            <div className="rs-stat">
              <div className="n n--blue">{typeCounts.note}</div>
              <div className="l">Notes</div>
            </div>
          </div>

          <div>
            <div className="rs-section-label" style={{marginBottom:6}}>Cue Standby</div>
            <div style={{background:'var(--bg-deep)', border:'1px solid var(--bg-border)', padding:'10px 12px', display:'flex', flexDirection:'column', gap:8}}>
              {[
                { id:'L43', label:'LX 43 — flicker',      type:'state-on'   },
                { id:'S22', label:'SQ 22 — wind out',     type:'state-hold' },
                { id:'L44', label:'LX 44 — kitchen warm', type:'state-off'  },
              ].map(cue => (
                <div key={cue.id} style={{display:'flex', alignItems:'center', gap:10, fontSize:12}}>
                  <span style={{
                    width:9, height:9, borderRadius:'50%',
                    background: cue.type === 'state-on' ? 'var(--state-on)' : cue.type === 'state-hold' ? 'var(--state-hold)' : 'var(--state-off)'
                  }}></span>
                  <span style={{fontFamily:'DM Mono, monospace', color:'var(--text-secondary)', fontSize:11, minWidth:34}}>{cue.id}</span>
                  <span style={{color:'var(--text-primary)'}}>{cue.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rs-scratchpad-section">
            <div className="rs-section-label">SM Scratchpad</div>
            <textarea
              className="rs-scratchpad-input"
              value={scratch}
              onChange={e => setScratch(e.target.value)}
              placeholder="Quick notes for the call sheet…"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* POPOVER                                                            */
/* ------------------------------------------------------------------ */
function NotePopover({ popover, setPopover, line, onConfirm, onCancel }) {
  const ref = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (popover.charId && textRef.current) {
      // auto-focus text when char is set
      // (don't steal focus on initial open if no char yet)
    }
  }, [popover.charId]);

  return (
    <div className="note-popover" ref={ref}
         style={{ left: popover.x, top: popover.y }}>
      {line && (line.kind === 'line' || line.kind === 'dir') && (
        <div className="popover-line-text">"{line.text}"</div>
      )}

      <div className="popover-section-label">Cast</div>
      <div className="popover-chars">
        {CAST.map(c => (
          <button
            key={c.id}
            className={'popover-char' + (popover.charId === c.id ? ' popover-char--active' : '')}
            onClick={() => setPopover(p => ({...p, charId: c.id}))}>
            <span className="pop-char-dot" style={{background: c.color}}></span>
            <span style={{flex:1}}>{c.name}</span>
            <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--text-muted)'}}>{c.actor}</span>
          </button>
        ))}
      </div>

      <div className="popover-section-label" style={{paddingTop:0}}>Type</div>
      <div className="popover-types">
        {NOTE_TYPES.map((t, i) => (
          <button
            key={t.id}
            className={'popover-type' + (popover.type === t.id ? ' popover-type--active' : '')}
            onClick={() => setPopover(p => ({...p, type: t.id}))}>
            <span>{t.label}</span>
            <span style={{fontSize:8, opacity:0.6}}>{i+1}</span>
          </button>
        ))}
      </div>

      <textarea
        ref={textRef}
        className="popover-text"
        placeholder="Optional note…"
        rows="2"
        value={popover.text}
        onChange={e => setPopover(p => ({...p, text: e.target.value}))}
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onConfirm(); }
        }}
      />

      <div className="popover-btns">
        <button className="popover-btn popover-btn--cancel" onClick={onCancel}>Cancel</button>
        <button
          className="popover-btn popover-btn--confirm"
          disabled={!popover.charId}
          onClick={onConfirm}>
          Add Note ↵
        </button>
      </div>
    </div>
  );
}

export default RunShowDemo
