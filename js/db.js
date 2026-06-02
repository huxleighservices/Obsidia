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
    ? `<img src="${p.imageUrl}" alt="${escHtml(p.name)}" style="width:100%;height:100%;object-fit:cover;display:block;" class="piece-card-bg">`
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

    if (snap.empty) return; // keep static fallback

    // Sort client-side by order to avoid needing a composite index
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
    // keep static fallback silently
  }
}
