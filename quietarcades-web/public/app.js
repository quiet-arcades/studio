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

async function loadGames() {
  const res = await fetch('/games.json');
  const games = await res.json();
  const grid = document.getElementById('games-grid');

  grid.replaceChildren(
    ...games.map((g) =>
      el(
        'article',
        { className: 'game-card' },
        el('div', {}, el('h3', {}, g.name), el('p', {}, g.tagline)),
        el('a', { className: 'play-link', href: g.url, target: '_blank', rel: 'noopener' }, 'Play ↗'),
      ),
    ),
  );
}

loadGames();
