const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'className') node.className = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child != null) node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
};

function stageClass(stage) {
  if (stage.startsWith('Live') || stage.startsWith('v1 Live')) return 'stage-pill stage-live';
  if (stage.includes('Complete')) return 'stage-pill stage-active';
  return 'stage-pill';
}

function milestoneClass(status) {
  if (status === 'done') return 'ms-badge ms-done';
  if (status === 'next') return 'ms-badge ms-next';
  return 'ms-badge';
}

async function loadRoadmap() {
  const res = await fetch('/roadmap.json');
  const games = await res.json();

  const liveCount = games.filter((g) => g.stage.startsWith('Live') || g.stage.startsWith('v1 Live')).length;
  const activeCount = games.filter((g) => !g.stage.startsWith('Live') && !g.stage.startsWith('v1 Live') && g.stage !== 'Queued').length;
  const queuedCount = games.length - liveCount - activeCount;

  document.getElementById('roadmap-summary').replaceChildren(
    el('span', { className: 'stage-pill stage-live' }, `${liveCount} Live`),
    el('span', { className: 'stage-pill stage-active' }, `${activeCount} In Progress`),
    el('span', { className: 'stage-pill' }, `${queuedCount} Queued`),
  );

  document.getElementById('roadmap-list').replaceChildren(
    ...games.map((g) =>
      el(
        'article',
        { className: 'roadmap-card' },
        el(
          'div',
          { className: 'roadmap-card-top' },
          el(
            'div',
            {},
            el('h3', {}, g.name),
            el('p', { className: 'roadmap-tagline' }, g.tagline),
          ),
          el(
            'div',
            { className: 'roadmap-actions' },
            el('span', { className: stageClass(g.stage) }, g.stage),
            g.url ? el('a', { className: 'play-link', href: g.url, target: '_blank', rel: 'noopener' }, 'Play ↗') : null,
          ),
        ),
        g.milestones && g.milestones.length > 0
          ? el(
              'ul',
              { className: 'milestones-list' },
              ...g.milestones.map((m) =>
                el(
                  'li',
                  {},
                  el('span', { className: milestoneClass(m.status) }, m.status),
                  el('span', {}, el('strong', {}, `${m.title}: `), m.summary),
                ),
              ),
            )
          : null,
      ),
    ),
  );
}

loadRoadmap();
