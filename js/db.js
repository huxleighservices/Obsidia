/* OBSIDIA — Firestore piece loader for public pages */

function buildPieceItemHTML(p) {
  const img = p.imageUrl
    ? `<img src="${p.imageUrl}" alt="${escHtml(p.name)}" style="width:100%;height:100%;object-fit:cover;display:block;">`
    : `<div class="piece-item-bg ${p.paletteClass || 'pi-walnut'}"></div>`;

  return `
    <div class="piece-item-img">
      ${img}
      <div class="piece-item-overlay"><span>View Piece</span></div>
    </div>
    <div class="piece-item-name">${escHtml(p.name)}</div>
    <div class="piece-item-detail">${escHtml(p.material)}</div>`;
}

function buildFeaturedCardHTML(p) {
  const img = p.imageUrl
    ? `<img src="${p.imageUrl}" alt="${escHtml(p.name)}" style="width:100%;height:auto;display:block;" class="piece-card-bg">`
    : `<div class="piece-card-bg ${p.paletteClass || 'pi-walnut'}"></div>`;

  return `${img}
    <div class="piece-card-info">
      <div class="piece-card-name">${escHtml(p.name)}</div>
      <div class="piece-card-mat">${escHtml(p.material)}</div>
    </div>`;
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showPieceLightbox(p) {
  const existing = document.getElementById('obsidia-lightbox');
  if (existing) existing.remove();

  const lb = document.createElement('div');
  lb.id = 'obsidia-lightbox';
  lb.style.cssText = 'position:fixed;inset:0;background:rgba(14,16,12,0.93);z-index:1000;display:flex;align-items:center;justify-content:center;padding:2rem;backdrop-filter:blur(6px);cursor:pointer;';

  const content = p.imageUrl
    ? `<img src="${p.imageUrl}" alt="${escHtml(p.name)}" style="max-width:100%;max-height:72vh;object-fit:contain;display:block;margin:0 auto 2rem;">`
    : `<div class="${p.paletteClass || 'pi-walnut'}" style="width:100%;height:360px;margin-bottom:2rem;"></div>`;

  lb.innerHTML = `
    <div style="max-width:720px;width:100%;position:relative;cursor:default;" onclick="event.stopPropagation()">
      <button onclick="document.getElementById('obsidia-lightbox').remove()" style="position:absolute;top:-0.5rem;right:0;background:none;border:none;color:rgba(221,210,177,0.45);font-size:2rem;cursor:pointer;line-height:1;padding:0 0.2rem;transition:color 0.2s;" onmouseover="this.style.color='rgba(221,210,177,0.9)'" onmouseout="this.style.color='rgba(221,210,177,0.45)'">×</button>
      ${content}
      <div style="text-align:center;">
        <div style="font-size:0.58rem;letter-spacing:0.28em;text-transform:uppercase;color:rgba(170,141,45,0.85);margin-bottom:0.8rem;">${escHtml(p.category || '')}</div>
        <div style="font-size:1.6rem;font-weight:300;color:rgba(221,210,177,0.95);margin-bottom:0.5rem;">${escHtml(p.name)}</div>
        <div style="font-size:0.65rem;letter-spacing:0.22em;text-transform:uppercase;color:rgba(221,210,177,0.4);margin-bottom:2.2rem;">${escHtml(p.material)}</div>
        <a href="start-now.html" style="display:inline-block;padding:0.85rem 2.4rem;border:1px solid rgba(221,210,177,0.25);color:rgba(221,210,177,0.8);font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;">Commission a Similar Piece</a>
      </div>
    </div>`;

  lb.addEventListener('click', () => lb.remove());
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', esc); }
  });
  document.body.appendChild(lb);
}

async function loadPiecesGrid(gridEl) {
  if (!gridEl) return;
  gridEl.innerHTML = '<div style="grid-column:1/-1;padding:4rem;text-align:center;color:rgba(221,210,177,0.3);font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;">Loading Collection...</div>';

  try {
    const snap = await firebase.firestore()
      .collection('pieces')
      .orderBy('order')
      .get();

    gridEl.innerHTML = '';

    if (snap.empty) {
      gridEl.innerHTML = '<div style="grid-column:1/-1;padding:6rem;text-align:center;color:rgba(221,210,177,0.3);font-size:0.9rem;">The collection is being updated. Check back soon.</div>';
      return;
    }

    snap.forEach((doc, i) => {
      const p = { id: doc.id, ...doc.data() };
      const el = document.createElement('div');
      el.className = 'piece-item fade-up stagger-' + ((i % 3) + 1);
      el.dataset.category = p.category || '';
      el.innerHTML = buildPieceItemHTML(p);
      el.addEventListener('click', () => showPieceLightbox(p));
      gridEl.appendChild(el);
    });

    if (window.observeAnimate) window.observeAnimate();

  } catch (err) {
    console.error('Pieces load error:', err);
    gridEl.innerHTML = '<div style="grid-column:1/-1;padding:4rem;text-align:center;color:rgba(221,210,177,0.25);">Could not load collection.</div>';
  }
}

async function loadFeaturedGrid(gridEl) {
  if (!gridEl) return;

  try {
    const snap = await firebase.firestore()
      .collection('pieces')
      .where('featured', '==', true)
      .get();

    if (snap.empty) return;

    const pieces = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 3);

    gridEl.innerHTML = '';
    const stagger = ['stagger-1','stagger-2','stagger-3'];
    pieces.forEach((p, i) => {
      const el = document.createElement('a');
      el.href = 'pieces.html';
      el.className = `piece-card fade-in ${stagger[i] || ''}`;
      el.innerHTML = buildFeaturedCardHTML(p);
      gridEl.appendChild(el);
    });

    if (window.observeAnimate) window.observeAnimate();

  } catch (err) {
    console.error('Featured load error:', err);
  }
}
