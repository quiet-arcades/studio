const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'className') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child != null) node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
};

function statusBadgeClass(status) {
  if (status === 'done') return 'badge badge-ok';
  if (status === 'next') return 'badge badge-next';
  return 'badge';
}

async function runChecks(gameId, checkId, resultsBox, triggerBtn) {
  triggerBtn.disabled = true;
  resultsBox.replaceChildren(el('div', { className: 'check-result' }, 'Running checks…'));

  try {
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkId ? { gameId, checkId } : { gameId }),
    });
    const data = await res.json();
    if (!res.ok) {
      resultsBox.replaceChildren(el('div', { className: 'check-result' }, `Error: ${data.error || res.status}`));
      return;
    }

    const nodes = data.results.map((r) =>
      el(
        'div',
        { className: 'check-result' },
        el(
          'div',
          { className: 'milestone-head' },
          el('strong', {}, `${r.label} (${r.command})`),
          el('span', { className: r.ok ? 'badge badge-ok' : 'badge badge-err' }, r.ok ? `PASS · ${r.durationMs}ms` : `FAIL (${r.exitCode}) · ${r.durationMs}ms`),
        ),
        r.output ? el('pre', {}, r.output) : null,
      ),
    );
    resultsBox.replaceChildren(...nodes);
  } catch (err) {
    resultsBox.replaceChildren(el('div', { className: 'check-result' }, `Request failed: ${err.message}`));
  } finally {
    triggerBtn.disabled = false;
  }
}

function renderGameCard(game) {
  const resultsBox = el('div', { className: 'check-results' });
  const runAllBtn = el('button', { type: 'button', className: 'btn btn-primary' }, 'Run All Checks');
  runAllBtn.addEventListener('click', () => runChecks(game.id, null, resultsBox, runAllBtn));

  const checkButtons = (game.checks || []).map((c) => {
    const btn = el('button', { type: 'button', className: 'btn' }, c.label);
    btn.addEventListener('click', () => runChecks(game.id, c.id, resultsBox, btn));
    return btn;
  });

  const git = game.git || {};
  const gitSummary = git.exists
    ? [
        el('span', {}, `Branch: ${git.branch || 'n/a'}`),
        el('span', {}, `Last commit: ${git.lastCommit || 'n/a'}`),
        el('span', { className: git.dirtyCount > 0 ? 'badge badge-warn' : 'badge badge-ok' }, git.dirtyCount > 0 ? `${git.dirtyCount} uncommitted` : 'Clean working tree'),
      ]
    : [el('span', { className: 'badge badge-err' }, 'Directory missing')];

  const milestones = el(
    'div',
    { className: 'milestones' },
    ...(game.milestones || []).map((m) =>
      el(
        'div',
        { className: 'milestone' },
        el(
          'div',
          { className: 'milestone-head' },
          el('span', { className: 'milestone-title' }, m.title),
          el('span', { className: statusBadgeClass(m.status) }, m.status),
        ),
        el('p', { className: 'milestone-summary' }, m.summary),
      ),
    ),
  );

  const ownerActions =
    game.ownerActions && game.ownerActions.length > 0
      ? el(
          'div',
          { className: 'owner-actions' },
          el('h3', {}, 'Owner Actions Needed'),
          el('ul', { className: 'clean-list' }, ...game.ownerActions.map((a) => el('li', {}, a))),
        )
      : null;

  return el(
    'article',
    { className: 'game-card' },
    el(
      'div',
      { className: 'game-top' },
      el(
        'div',
        {},
        el('h3', { className: 'game-title' }, game.name),
        el('p', { className: 'game-tagline' }, game.tagline),
      ),
      el('span', { className: 'badge badge-next' }, game.stage),
    ),
    el('div', { className: 'meta-row' }, ...(game.techStack || []).map((t) => el('span', { className: 'chip' }, t))),
    el('div', { className: 'git-bar' }, ...gitSummary),
    milestones,
    ownerActions,
    el('div', { className: 'checks-bar' }, runAllBtn, ...checkButtons),
    resultsBox,
  );
}

async function loadPortfolio() {
  const res = await fetch('/api/portfolio');
  const data = await res.json();

  document.getElementById('studio-name').textContent = data.studio.name;
  document.getElementById('studio-tagline').textContent = data.studio.tagline;
  document.getElementById('portfolio-count').textContent = `${data.games.length} ${data.games.length === 1 ? 'title' : 'titles'}`;

  const principlesList = document.getElementById('principles-list');
  principlesList.replaceChildren(...(data.studio.principles || []).map((p) => el('li', {}, p)));

  const grid = document.getElementById('games-grid');
  grid.replaceChildren(...data.games.map(renderGameCard));
}

document.getElementById('refresh-btn').addEventListener('click', loadPortfolio);
loadPortfolio();
