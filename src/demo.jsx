// Interactive replica of the Line Notes "Run Show" surface.
//
// Structure, controls, note types, role types, cast colours, empty states and the
// start/end-run flow are modelled on the live app at app.linenotes.io (verified
// 2026-08-02). The production, script, cast and notes are invented demonstration
// content — the app itself ships with none of this.
//
// Verified against the real app:
//   - seven note types: Skip, Para, Called, Add, Gen, Jumped, Missed
//   - no live session timer and no live note counters in Run Show
//   - right rail while idle:    Start Run + Run Reports
//   - right rail while running: session title + End Run + Scratchpad (only)
//   - starting a run opens a modal asking for session title + total script pages
//   - ending a run opens a modal for final scratchpad notes, then generates a report
//   - a note cannot be logged before cast members exist
//   - cast colours come from a fixed 10-swatch palette; swatches are round
import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

/* ------------------------------------------------------------------ */
/* REAL APP CONSTANTS                                                 */
/* ------------------------------------------------------------------ */

// The seven note types, in the order and casing the app uses.
const NOTE_TYPES = ['Skip', 'Para', 'Called', 'Add', 'Gen', 'Jumped', 'Missed'];

// The app's cast-colour palette, sampled from the Add Cast Member dialog.
const CAST_COLORS = [
  '#C45C4A', '#D4844A', '#C8A96E', '#7AB87A', '#5B9BD4',
  '#8B6CC4', '#C46CA4', '#6AB4B4', '#D4B44A', '#7A9AB4',
];

/* ------------------------------------------------------------------ */
/* DEMONSTRATION CONTENT — invented, not from any real production      */
/* ------------------------------------------------------------------ */
const PRODUCTION = 'The Kettle';
const TOTAL_PAGES = 12;

// Cast members carry a name, a colour and one or more characters, as in the app.
const CAST = [
  { id: 'lee',   name: 'Jordan Lee', characters: ['MARIA'], color: CAST_COLORS[2] },
  { id: 'park',  name: 'Sam Park',   characters: ['JONAS'], color: CAST_COLORS[4] },
  { id: 'wong',  name: 'Maya Wong',  characters: ['ELLIE'], color: CAST_COLORS[5] },
  { id: 'banks', name: 'Theo Banks', characters: ['DAVID'], color: CAST_COLORS[3] },
];

// A script page. `zone: true` marks an annotatable line zone — the app tints these
// during a run and they are the only clickable regions.
const PAGE = [
  { kind: 'title',  text: 'THE KETTLE' },
  { kind: 'sub',    text: 'Act II, Scene 4. Kitchen, evening' },
  { kind: 'dir',    text: 'MARIA enters, holding a paper bag. She sets it on the counter and does not turn on the light.' },
  { kind: 'cue',    text: 'MARIA' },
  { kind: 'line',   text: 'We agreed on Tuesday. I marked it on the calendar.', zone: true, cast: 'lee' },
  { kind: 'cue',    text: 'JONAS (off)' },
  { kind: 'line',   text: 'The calendar lies.', zone: true, cast: 'park' },
  { kind: 'cue',    text: 'MARIA' },
  { kind: 'line',   text: 'Excuse me?', zone: true, cast: 'lee' },
  { kind: 'dir',    text: 'JONAS enters from the hallway, carrying a screwdriver and a small box.' },
  { kind: 'cue',    text: 'JONAS' },
  { kind: 'line',   text: 'I said the calendar lies. You wrote Tuesday because you wanted it to be Tuesday.', zone: true, cast: 'park' },
  { kind: 'line',   text: 'But the post said Thursday. I read it twice.', zone: true, cast: 'park' },
  { kind: 'cue',    text: 'MARIA' },
  { kind: 'line',   text: 'Then why is the kettle still on?', zone: true, cast: 'lee' },
];

const SEED_NOTES = [
  { id: 's1', lineIdx: 6,  castId: 'park', type: 'Skip', text: 'went straight past it', page: 4 },
  { id: 's2', lineIdx: 11, castId: 'park', type: 'Para', text: 'paraphrased the back half', page: 4 },
];

/* ------------------------------------------------------------------ */
/* ICONS — one set, 1.5px stroke, 16px box                            */
/* ------------------------------------------------------------------ */
const PATHS = {
  chevronLeft:  <polyline points="10 3.5 5.5 8 10 12.5" />,
  chevronRight: <polyline points="6 3.5 10.5 8 6 12.5" />,
  bookmark:     <path d="M4 2.5h8v11l-4-3-4 3z" />,
  spread:       <><rect x="2" y="3" width="5" height="10" /><rect x="9" y="3" width="5" height="10" /></>,
  play:         <path d="M5 3.5l7 4.5-7 4.5z" />,
  stop:         <rect x="4" y="4" width="8" height="8" />,
  close:        <><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></>,
};

function Icon({ name, size = 16, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={fill}
         stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="square" strokeLinejoin="miter"
         aria-hidden="true" focusable="false"
         style={{ display: 'block', flexShrink: 0 }}>
      {PATHS[name]}
    </svg>
  );
}

const castById = (id) => CAST.find(c => c.id === id);

/* ------------------------------------------------------------------ */
/* RUN SHOW                                                           */
/* ------------------------------------------------------------------ */
function RunShowDemo() {
  const [running, setRunning]   = useState(true);
  const [session, setSession]   = useState('The Kettle, Aug 2');
  const [notes, setNotes]       = useState(SEED_NOTES);
  const [selectedType, setType] = useState('Skip');
  const [popover, setPopover]   = useState(null);
  const [scratch, setScratch]   = useState('Watch flicker before "kettle" line. ME standby for L43.');
  const [modal, setModal]       = useState(null);   // 'start' | 'end' | null
  const [report, setReport]     = useState(null);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') { setPopover(null); setModal(null); } }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const notesByLine = useMemo(() => {
    const m = {};
    notes.forEach(n => { (m[n.lineIdx] = m[n.lineIdx] || []).push(n); });
    return m;
  }, [notes]);

  const openPopover = (lineIdx, castId, ev) => {
    if (!running) { setToast('Start the run first'); return; }
    const wrap = ev.currentTarget.closest('.rs-page-wrapper');
    const r = ev.currentTarget.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    setPopover({
      lineIdx,
      castId: castId || null,
      type: selectedType,
      text: '',
      x: Math.min(r.left - w.left + r.width + 14, Math.max(8, w.width - 286)),
      y: r.top - w.top - 6,
    });
  };

  const confirmNote = () => {
    if (!popover || !popover.castId) return;
    setNotes(n => [{
      id: 'n' + Date.now(),
      lineIdx: popover.lineIdx,
      castId: popover.castId,
      type: popover.type,
      text: popover.text,
      page: 4,
    }, ...n]);
    setType(popover.type);
    setPopover(null);
  };

  const endRun = (finalNotes) => {
    setReport({ title: session, duration: '2:41', pages: TOTAL_PAGES, count: notes.length, finalNotes });
    setRunning(false);
    setModal(null);
  };

  return (
    <div className="demo-body">

      {/* ============ LEFT SIDEBAR ============ */}
      <div className="rs-sidebar">
        <div className="rs-sidebar-header">
          <span className="ln-logo">Line Notes</span>
          <span className="show-name">{PRODUCTION}</span>
          <span className="heartbeat-dot" />
          <button className="rs-actors-btn">Actors</button>
        </div>

        <div className="ln-sidebar-section">
          <h5>Cast</h5>
          {CAST.map(c => (
            <div key={c.id} className="char-item">
              <span className="char-dot" style={{ background: c.color }} />
              <span className="char-name">{c.name}</span>
              <span className="char-role">{c.characters.join(', ')}</span>
            </div>
          ))}
        </div>

        <div className="ln-sidebar-section">
          <h5>Note Type</h5>
          <div className="note-types">
            {NOTE_TYPES.map(t => (
              <button
                key={t}
                className={'note-type-btn' + (selectedType === t ? ' note-type-btn--active' : '')}
                onClick={() => setType(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="ln-sidebar-section ln-sidebar-section--notes">
          <h5>Notes</h5>
          <div className="notes-list">
            {notes.length === 0 && (
              <div className="note-empty">No notes yet for this run.</div>
            )}
            {notes.map(n => {
              const c = castById(n.castId);
              return (
                <div key={n.id} className="note-item">
                  <span className="note-color-bar" style={{ background: c.color }} />
                  <div className="note-item-content">
                    <div className="note-item-header">
                      <span className="note-type-label">{n.type}</span>
                      <span className="note-char-name">{c.name}</span>
                      <span className="note-page">p.{n.page}</span>
                    </div>
                    {n.text && <div className="note-text-preview">{n.text}</div>}
                  </div>
                  <button
                    className="note-del"
                    onClick={() => setNotes(x => x.filter(y => y.id !== n.id))}
                    aria-label="Delete note">
                    <Icon name="close" size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ CENTRE: SCRIPT ============ */}
      <div className="rs-script-area">
        <div className="ln-header">
          <div className="ln-page-nav">
            <button aria-label="Previous page"><Icon name="chevronLeft" /></button>
            <input className="page-input" value="4" readOnly />
            <span className="total">/ {TOTAL_PAGES}</span>
            <button aria-label="Next page"><Icon name="chevronRight" /></button>
          </div>
          <button className="ln-header-btn"><Icon name="bookmark" size={13} /> Bookmarks</button>
          <button className="ln-header-btn"><Icon name="spread" size={13} /> 2-up</button>
        </div>

        <div className="rs-canvas-area">
          <button className="rs-page-edge rs-page-edge--l" aria-label="Previous page">
            <Icon name="chevronLeft" size={13} />
          </button>

          <div className="rs-page-wrapper">
            <div className="rs-page">
              {PAGE.map((item, i) => {
                if (item.kind === 'title') return <p key={i} className="pdf-title">{item.text}</p>;
                if (item.kind === 'sub')   return <p key={i} className="pdf-sub">{item.text}</p>;
                if (item.kind === 'dir')   return <p key={i} className="pdf-dir">{item.text}</p>;
                if (item.kind === 'cue')   return <p key={i} className="pdf-cue">{item.text}</p>;

                const lineNotes = notesByLine[i] || [];
                return (
                  <p key={i}
                     className={'pdf-line zone' + (running ? ' zone--live' : '') + (lineNotes.length ? ' zone--noted' : '')}
                     onClick={(e) => openPopover(i, item.cast, e)}>
                    {item.text}
                    {lineNotes.map(n => (
                      <span key={n.id} className="zone-flag"
                            style={{ background: castById(n.castId).color }}>
                        {n.type}
                      </span>
                    ))}
                  </p>
                );
              })}
            </div>

            {popover && (
              <NotePopover
                popover={popover}
                setPopover={setPopover}
                line={PAGE[popover.lineIdx]}
                onConfirm={confirmNote}
                onCancel={() => setPopover(null)}
              />
            )}
          </div>

          <button className="rs-page-edge rs-page-edge--r" aria-label="Next page">
            <Icon name="chevronRight" size={13} />
          </button>

          {toast && <div className="demo-toast">{toast}</div>}
        </div>
      </div>

      {/* ============ RIGHT RAIL ============ */}
      <div className="rs-controls">
        {running ? (
          <>
            <div className="rs-session-header">
              <span className="rs-session-title">{session}</span>
              <button className="rs-end-run-btn" onClick={() => setModal('end')}>
                <Icon name="stop" size={9} fill="currentColor" /> End Run
              </button>
            </div>
            <div className="rs-scratchpad-section">
              <div className="rs-section-label">Scratchpad</div>
              <textarea
                className="rs-scratchpad-input"
                value={scratch}
                onChange={e => setScratch(e.target.value)}
                placeholder="Notes…"
              />
            </div>
          </>
        ) : (
          <>
            <button className="rs-start-run-btn" onClick={() => setModal('start')}>
              <Icon name="play" size={13} fill="currentColor" /> Start Run
            </button>
            <div className="rs-reports">
              <div className="rs-section-label">Run Reports</div>
              {report ? (
                <div className="rs-report-card">
                  <p className="rs-report-title">{report.title}</p>
                  <p className="rs-report-meta">
                    Aug 2, 2026 · {report.duration} · {report.count} notes
                  </p>
                  <div className="rs-report-acts">
                    <button className="ln-header-btn">View</button>
                    <button className="ln-header-btn">Resume</button>
                    <button className="ln-header-btn">Delete</button>
                  </div>
                </div>
              ) : (
                <p className="rs-empty">No run reports yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      {modal === 'start' && (
        <StartRunModal
          defaultTitle={PRODUCTION + ', Aug 2'}
          onCancel={() => setModal(null)}
          onStart={(title) => { setSession(title); setRunning(true); setNotes([]); setReport(null); setModal(null); }}
        />
      )}
      {modal === 'end' && (
        <EndRunModal onCancel={() => setModal(null)} onEnd={endRun} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NOTE POPOVER                                                        */
/* ------------------------------------------------------------------ */
function NotePopover({ popover, setPopover, line, onConfirm, onCancel }) {
  const ref = useRef(null);

  // Seven note types make this popover tall enough to fall out of the scroll
  // container, so clamp it back into the visible canvas after measuring.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canvas = el.closest('.rs-canvas-area');
    const wrap = el.closest('.rs-page-wrapper');
    if (!canvas || !wrap) return;

    const pad = 12;
    const h = el.offsetHeight;
    const wrapTop = wrap.getBoundingClientRect().top;
    const { top: cTop, bottom: cBot } = canvas.getBoundingClientRect();

    let top = popover.y;
    if (wrapTop + top + h > cBot - pad) top = cBot - pad - h - wrapTop;
    if (wrapTop + top < cTop + pad)     top = cTop + pad - wrapTop;
    el.style.top = top + 'px';
  }, [popover.y, popover.lineIdx]);

  return (
    <div className="note-popover" ref={ref} style={{ left: popover.x, top: popover.y }}>
      {line && <div className="popover-line-text">{line.text}</div>}

      <div className="popover-section-label">Cast</div>
      <div className="popover-chars">
        {CAST.map(c => (
          <button
            key={c.id}
            className={'popover-char' + (popover.castId === c.id ? ' popover-char--active' : '')}
            onClick={() => setPopover(p => ({ ...p, castId: c.id }))}>
            <span className="pop-char-dot" style={{ background: c.color }} />
            <span className="pop-char-name">{c.name}</span>
            <span className="pop-char-role">{c.characters.join(', ')}</span>
          </button>
        ))}
      </div>

      <div className="popover-section-label">Note Type</div>
      <div className="popover-types">
        {NOTE_TYPES.map(t => (
          <button
            key={t}
            className={'popover-type' + (popover.type === t ? ' popover-type--active' : '')}
            onClick={() => setPopover(p => ({ ...p, type: t }))}>
            {t}
          </button>
        ))}
      </div>

      <textarea
        className="popover-text"
        placeholder="Note…"
        rows="2"
        value={popover.text}
        onChange={e => setPopover(p => ({ ...p, text: e.target.value }))}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onConfirm(); } }}
      />

      <div className="popover-btns">
        <button className="popover-btn popover-btn--cancel" onClick={onCancel}>Cancel</button>
        <button className="popover-btn popover-btn--confirm" disabled={!popover.castId} onClick={onConfirm}>
          Add Note ↵
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RUN SESSION MODALS                                                  */
/* ------------------------------------------------------------------ */
function Modal({ title, children, actions }) {
  return (
    <div className="rs-modal-scrim">
      <div className="rs-modal">
        <h4 className="rs-modal-title">{title}</h4>
        {children}
        <div className="rs-modal-acts">{actions}</div>
      </div>
    </div>
  );
}

function StartRunModal({ defaultTitle, onCancel, onStart }) {
  const [title, setTitle] = useState(defaultTitle);
  const [pages, setPages] = useState(String(TOTAL_PAGES));
  return (
    <Modal
      title="Start Run Session"
      actions={<>
        <button className="popover-btn popover-btn--cancel" onClick={onCancel}>Cancel</button>
        <button className="popover-btn popover-btn--confirm" onClick={() => onStart(title)}>Start Run</button>
      </>}>
      <label className="rs-field">
        <span>Session title</span>
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <label className="rs-field">
        <span>Total script pages</span>
        <input value={pages} onChange={e => setPages(e.target.value)} />
      </label>
    </Modal>
  );
}

function EndRunModal({ onCancel, onEnd }) {
  const [final, setFinal] = useState('');
  return (
    <Modal
      title="End Run Session?"
      actions={<>
        <button className="popover-btn popover-btn--cancel" onClick={onCancel}>Cancel</button>
        <button className="popover-btn popover-btn--confirm" onClick={() => onEnd(final)}>End &amp; Generate Report</button>
      </>}>
      <label className="rs-field">
        <span>Final Notes (Scratchpad)</span>
        <textarea rows="3" value={final} onChange={e => setFinal(e.target.value)} />
      </label>
    </Modal>
  );
}

export default RunShowDemo
