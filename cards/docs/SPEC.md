# Cards spec (v1): poker first

Status: approved by the owner's answers (2026-11-10): the app is **Cards**, a home for card
games with poker first, and the other questions take their defaults. Builds wait for this app's
turn in the queue: one build at a time. Red-teamed with Fable, then reviewed by
Gemini (both tables at the end, every finding folded in or answered).

## What it is

**Cards** is a card-games app for `cards.prignano.ai`, built the way the chess app is. Its first
game, and the only one in v1, is Texas Hold'em poker. Blackjack and other card games come later
(see "More games later"). The angle is poker as a game of odds and decisions: "outs", the cards
still in the deck that would win you the hand, are the first probability lesson, and the odds
helper is built around them.

Two modes, as asked:

1. **Play a friend.** One player starts a room and gets a 6-character code and a share link. The
   friend joins from their own device and they play heads-up (one against one) in real time. No
   sign-in, no names, no chat. The server deals, so neither phone ever holds the other player's
   cards.
2. **Play the computer, with a coach.** Heads-up against an on-device computer player at Easy,
   Medium or Hard. A free, instant **odds helper** shows your outs, the pot odds and your chance
   to win while you decide. After the match, a **Claude coach** reviews your biggest hands and
   answers "Explain this hand" taps, for signed-in family members, under a hard spend cap.

It's plain JavaScript and SVG with no build step, served as static files plus one Cloudflare
Worker (rooms and coach), installable as an app (PWA) from day one.

### Play money only

This is not gambling and never becomes it. Gambling needs a stake, chance and a prize; Cards has
no stake and no prize.

- Chips have no value. They can't be bought, earned as a prize, carried between matches,
  transferred to another player or cashed out. There are no purchases, ads or links to
  real-money poker of any kind.
- **No bankroll.** Every match starts both players with the same 1,000 chips, and the chips
  vanish when the match ends. What the app keeps is how you played (matches won, and decision
  stats like "calls with the right odds"), never a chip total.
- **No casino trappings:** no daily bonus chips, spin wheels, streak rewards, loot, jackpots,
  "near miss" effects, slot or casino sounds, neon, or green-felt casino styling.
- The About screen says this in one plain paragraph, and the coach never talks about betting
  money, bankrolls, casinos or poker sites (see "The coach").

## Decisions so far

| # | Question | Answer |
| --- | --- | --- |
| 1 | What to build | A poker game like the chess app, with a play-a-friend mode and an AI-coach mode (owner, 2026-11-10) |
| 2 | Online play | Reuse the chess app's live-room design (chess PR #7): 6-character code, a Durable Object per room, the server is the referee, no sign-in (owner via the coordinator, 2026-11-10) |
| 3 | Coach | Reuse the chess coach design: Claude only through the Worker, structured-only input, hard spend caps, fail closed, sign-in on coach paths only (owner via the coordinator, 2026-11-10) |
| 4 | Money | Play money only, as above |
| 5 | Variant | No-limit Texas Hold'em, heads-up only in v1; 3 to 6 seats only if the owner asks later (owner, 2026-11-10) |
| 6 | Home | Its own public repo under `nickprignano`, a `prignano.ai` subdomain, Workers Builds deploys on merge to `main`. The owner creates the repo and adds the domain. Launch ends with the `content/games.json` PR in `prignanodotai-web` |
| 7 | Name | **Cards**, at `cards.prignano.ai`, repo `nickprignano/cards`: one app for card games, poker first, blackjack and others later (owner, 2026-11-10) |
| 8 | Audience | 13 and up; the Claude coach for adults only (owner chose 13+ on 2026-11-10; the coach was tightened to adults only after the outside review) |
| 9 | Coach budget | Its own Anthropic workspace, $5 a month, Sonnet 5.5 (owner, 2026-11-10) |
| 10 | Action timer | 45 seconds a decision in rooms, on by default; the room's creator can turn it off (owner, 2026-11-10) |
| - | License | MIT. Every part is our own. The room and coach Worker code is ported from the chess repo (GPL-3.0-or-later); the owner holds the copyright on that code and no third-party code is in it, so he can release it here under MIT (the same reasoning as Dropline). That holds only while no one else has contributed to that code; checked 2026-11-11: the chess history has only the owner's and Claude's commits. chess.js and Stockfish are not part of the port |
| - | Name and look | Original. No poker brand, TV show, card-room or app names, art, sounds or chip designs |

## Prior art and licenses

Checked 2026-11-10 (KB prior-art script, npm registry, PyPI).

| Source | License | What we take |
| --- | --- | --- |
| The game | Not protectable | Texas Hold'em rules are a public card game. We write our own rules engine |
| [pokersolver](https://github.com/goldfire/pokersolver) 2.1.4, [phe](https://github.com/thlorenz/phe) 0.6.0, [poker-ts](https://github.com/claudijo/poker-ts) 1.5.0, @poker-apprentice/hand-evaluator 4.3.0, poker-odds-calculator 0.4.0 | MIT | Nothing. A hand evaluator and odds calculator are short to write and easy to test exhaustively (see Tests), so we write our own and vendor nothing |
| poker-evaluator 2.1.1 | ISC | Nothing (it ships a large lookup table file) |
| [pokerkit](https://github.com/uoftcprg/pokerkit) 0.7.7 (University of Toronto) | MIT | Python, so not usable in the browser. Its documentation of no-limit betting rules (minimum raises, all-ins that don't reopen betting) is a useful check on ours |
| [rlcard](https://github.com/datamllab/rlcard) | MIT | Nothing. Research bots need training and a GPU, which we don't want |
| Large open-source poker servers (PokerTH, casino-server and others) | mixed (many GPL or unlicensed) | Nothing; they confirm the shape (server deals, clients see only their own cards) |
| Open-source Cloudflare Durable Object room-code games (trivia, sudoku and others) | mixed | Nothing; our chess rooms are already this |
| Our chess app (PRs #5 and #7) | ours | The coach Worker (Access check, budget Durable Object, reserve-then-settle, JSON-schema output) and the live rooms (codes, seat tokens, reconnect, message limits, expiry), with Dropline's red-team fixes (no KV, separate create limit) |
| Pinball PR #7 | ours | The PWA recipe (also in ai-brain's prompt library) |

## How a game looks and feels

### Art

- An original look in prignano-theme colors that follow light and dark mode. The table is a
  rounded panel in the theme's card color, not green felt.
- **Cards** are our own SVG: a big rank and suit in the corner and a large suit in the middle.
  Face cards use the letter (J, Q, K) and a geometric emblem of our own, no court figures. The
  card back is an original line-art pattern from the prignano-theme art library.
- **Four-color deck on by default** (spades dark, hearts red, diamonds blue, clubs green), with
  the suit symbol always shown, so color is never the only cue. A setting switches to two colors.
- **Chips** are plain discs in theme colors with the amount written as a number. Stacks and the
  pot always show numbers too.
- Cards slide in and flip with short eases; nothing flashes. `prefers-reduced-motion` places
  cards without movement.
- Each computer player has an original line-art avatar and a plain name.

### Controls

- **Fold, Check or Call, Bet or Raise.** Bet and raise open a slider with buttons for half the
  pot, the pot and all-in, and a number box. Illegal sizes can't be chosen: the slider runs from
  the legal minimum to your stack.
- Buttons are at least 44 px tall on a 360 px wide phone in portrait. Landscape works too.
- Keyboard: F folds, C checks or calls, B or R opens the bet slider, arrows move it, Enter
  confirms, M mutes.
- Confirm on all-in (a second tap), so a slipped thumb doesn't end a match.

### Screen readers

- Cards read as words ("Ace of spades"). A polite live region announces every action ("Computer
  raises to 120", "Turn: seven of hearts") and each result.
- A "Read the table" button speaks your cards, the board, the pot, both stacks and whose turn it
  is.

### Sound

Synthesized with the Web Audio API, so there is nothing to license: a soft card flick, a short
click for chips, a small chime for winning a hand. No casino sounds. Muted until the first tap,
and the mute setting is saved on the device.

## The game

### Rules

No-limit Texas Hold'em, heads-up, to standard rules:

- Two hole cards each, then the flop (3 cards), turn and river, with a betting round before the
  flop and after each street. Best five of your seven cards wins; ties split the pot. (Heads-up, a
  called pot is always an even number of chips, so there is no odd chip to award.)
- **Heads-up blinds:** the dealer posts the small blind and acts first before the flop and last
  after it. The dealer button moves every hand.
- **No limit:** a bet or raise can be anything from the minimum to all-in. The minimum bet is the
  big blind; the minimum raise is the size of the last bet or raise. An uncalled bet is returned.
  (Facing an all-in, the only choices are call or fold, so heads-up needs no rule about short
  all-ins reopening betting.)
- **Short of the blind:** a player whose stack is smaller than their blind posts what they have
  and is all-in; any part the other player can't match is returned, and if nobody can act the
  board is dealt straight out.
- **Reveal only when no decision is left:** both hands turn face up once neither player has a
  betting decision left (an all-in that has been called, or the river betting is over). A shove
  that hasn't been called yet reveals nothing. A fold, a resignation or a claim mid-hand
  reveals nothing.
- **Showdown:** hands that reach showdown are shown to both players automatically (no mucking in
  v1: seeing the other hand is how you learn). In a room, a hand that folds is never shown.
  Against the computer, its cards are shown in your match history after each hand, folded or
  not, because seeing what it held is how you learn; the computer is not a person.

### A match

- Both players start with 1,000 chips. Blinds start at 10 and 20 and rise every 10 hands (15/30,
  25/50, 50/100, 75/150, 100/200, 150/300, 200/400, then doubling), so a match ends in about 20 to
  40 minutes. A **Quick** setting raises them every 6 hands.
- The match ends when one player has all the chips, or either player resigns. Then: **Rematch**.
- **Your record** (on the device): matches won and lost against each computer level and in
  rooms, plus decision stats from the odds helper ("calls when the odds were right: 8 of 11").

### The deck

Shuffled with `crypto.getRandomValues` and an unbiased Fisher-Yates shuffle (rejection sampling,
no modulo bias). In rooms the Worker shuffles; against the computer the device does.

## Playing the computer

### Levels

The computer runs on the device in a Web Worker, so it works offline and costs nothing. It sees
only what a player in its seat would see: its own two cards, the board, the bets and the stacks.
It never sees your cards or the deck, and a test proves it (Tests, item 3).

| Level | How it plays |
| --- | --- |
| **Easy** | Loose and passive: calls a lot, rarely raises, folds only weak hands to big bets, never bluffs. Betting your good hands beats it, which is the first lesson |
| **Medium** | Tight and aggressive: plays a starting-hand table we compute ourselves (each of the 169 starting hands ranked by its chance to beat a random hand), bets and raises when its chance to win is high, calls when the pot odds are right, bluffs now and then |
| **Hard** | Medium's rules plus a **range**: it estimates your likely hands from how you've bet this hand (weighting the 1,326 starting combinations by your actions) and works out its chance to win against those, and it bluffs at a game-theory rate (about one bluff for every two value bets on a pot-sized river bet). Strong for a hobby bot, not a solver. (Adapting to your habits over a match was cut: it barely acts within one match) |

The bots get their chance to win cheaply: a precomputed preflop table, and a seeded Monte Carlo
of a few hundred deals after the flop, so a decision stays well under the thinking delay on an
older phone.

- The computer waits 0.6 to 1.5 seconds before acting, so it doesn't feel instant and doesn't
  "tell" by speed (the delay doesn't depend on its hand).
- No Hard-plus or "unbeatable" level in v1: a real solver is a research project, and a game you
  can't beat isn't fun.
- Seeded randomness in tests, so the same seed gives the same decisions.

### The odds helper (free, on the device)

On your turn, a panel you can open or close shows, in words matched to the coach level
(Beginner, Advanced, Competition, as in chess):

- **Your hand** in words ("Pair of eights, with a flush draw").
- **Outs**: the cards that would improve you to a likely winner, listed and counted, with the
  "rule of 4 and 2" estimate next to the exact figure. Outs × 4 counts both cards to come, so
  it is only used when you are all-in on the flop; for an ordinary call on the flop the verdict
  uses the next card only (outs × 2), since there will be more betting on the turn.
- **Pot odds**: "Call 40 to win 160: you need to win 20% of the time."
- **Your chance to win** against a random hand (Advanced and Competition can switch to "against
  the hands their betting suggests"), by Monte Carlo with about 5,000 deals in the Web Worker,
  exact on the turn and river, and a one-line verdict ("Calling is good value").
- After each hand, a one-line note on any decision where the numbers disagreed with what you did.

It is on by default against the computer and off in rooms (see below). Using it doesn't change
your record: the decision stats are about the choice, not the helper.

## The coach (Claude)

Ported from the chess coach (chess PR #5). Same structure, poker content.

### Where Claude is used

- **Post-match review:** the device picks the 3 hands from the match where the most chips moved
  on a decision the numbers disagreed with, and sends only those 3. Claude writes, for each, what
  happened, the probability idea behind it, and one habit to take away. Up to 2 reviews a day
  per account.
- **"Explain this hand":** a tap on any finished hand in the match history. Up to 5 a day per
  account.
- Everything during the hand (the odds helper) is free and on the device. Claude never decides a
  move and never sees a hand that's still being played.

### Levels

| Level | Voice |
| --- | --- |
| Beginner | Plain words, one idea per hand: "you had 9 cards that made your flush, about a 1 in 5 chance with one card to come, and the call cost a fifth of the pot, so you needed to win 1 time in 6: calling was fine" |
| Advanced | Names the idea (pot odds, implied odds, position, semi-bluff, value bet, range), with the numbers |
| Competition | Terse: the range it thinks each player had, the equity at each decision, the better line and why |

### What Claude sees

The Worker builds every request from **structured data only**, so nothing the browser sends can
carry instructions:

- A **hand history** in a fixed schema: blinds, starting stacks and every action as
  `{seat, street, kind, amount}`, where `kind` is one of fold, check, call, bet, raise or all-in
  and `amount` is a whole number of chips. Cards are 2-character codes (`As`, `Td`). At most 3
  hands per review (1 for an explain) and 40 actions per hand.
- The Worker **replays every hand** with the same rules module the game uses (`src/poker/rules.js`)
  and rejects anything illegal: duplicate cards, a bet below the minimum, an action out of turn,
  stacks that don't sum to 2,000, blinds not on the schedule, or a hand that doesn't replay to
  its end. That last check is what "never sees a hand still being played" means in practice.
  The pot odds at each decision are computed by the Worker from the replay, not taken from the
  browser.
- **Win chances** are computed on the device (too slow for the Worker's CPU limit) and sent as
  one whole number from 0 to 100 per decision. Anything else is dropped. A tampered number only
  spoils the sender's own review.
- **Which cards it may see:** your own hole cards and the board. The computer's hole cards after
  the hand ends, folded or not (the same cards your match history already shows you). In a room, the other
  player's cards **only if they were shown at showdown**; the review is built on the device from
  that player's own history, which never had the friend's folded cards in it.
- The level is one of three values.
- **The prompt is rebuilt from the replay.** The Worker never forwards the request's JSON: it
  writes the hand into the prompt from its own replayed state, so unknown keys and anything
  else in the request are dropped by construction.

**What Claude never sees:** free text (there is no chat box), names, emails, room codes, seat
tokens or account details.

**Output** goes through a JSON schema (plain text with a length cap per hand, plus card codes to
highlight), so the app renders it as text and nothing in it runs as code. The review is labelled
"written by AI".

**What the coach must not say:** the fixed system prompt keeps it to the decisions and the
probability in the hands it was given, critiques only the player being reviewed (never the
friend), and rules out talk of money, bankrolls, betting sites, casinos, gambling as a pastime,
and tips for "making money at poker". Prompts follow Anthropic's usage policy for products minors
may use. Because a prompt alone proves little, the Worker also runs a **deterministic output
filter** on every reply: whole-word phrases, not fragments (so "even money", "dead money" and
"opposite" don't trip it), covering real money, cash, dollars and currency signs, casino,
bankroll, buy-ins, stakes and "moving up", gambling, poker sites and real-money poker brands. A
hit sends the reply to the free on-device notes instead. The filter and its known false
positives have their own CI test. A paraphrase can still slip past a word list; the coach being
adults-only is what makes that residual risk acceptable. Before build 2 merges, the build thread also runs a fixed set of tempting hand
histories (a huge all-in win, a long losing streak) once through the real prompt, with the
owner's yes for the few cents it costs, and reads the outputs.

**Without Claude:** when the player isn't signed in, or the budget is used up, the review falls
back to notes generated on the device from the odds helper ("Hand 14: you called 300 needing
33% with about 18%"). Shorter, but the app still works.

### Sign-in

As in chess: **Cloudflare Access** on `/coach/*` and `/api/coach` only, Google as the sign-in
provider plus Access's one-time email code, and a closed email allowlist the owner edits in the
dashboard. The Worker checks the Access token on every coach call. Playing the computer, the odds
helper and rooms need no account.

- **The coach is for adults only** (tightened after the outside review). It has its own
  allowlist, separate from chess's family list. An AI coaching children on betting is the least
  defensible part of this app, and knowingly adding a child would bring Anthropic's extra
  safeguards for products serving minors and, if the app were ever judged commercial, US
  children's-privacy law. Children use the free odds helper and on-device notes, which need no
  list.
- The allowlist stays closed. Opening it to any Google user would let strangers spend the budget.
- Nothing asks for or records a child's age. What is stored for the usage counters is a key
  derived from the account (hashed with a secret salt), treated as personal data. Usage counters
  expire on their own at the end of the day; "Delete my data" removes the key from then on but
  does not reset today's counters, so it can't be used to get more reviews. Cloudflare Access's
  own sign-in logs and Anthropic's short-term API logs are outside the app; the privacy page says
  so.

### Spend and abuse controls

The chess app's five layers, with this app's own numbers (owner, 2026-11-10):

1. **An Anthropic workspace used only for this app, with a $5 monthly spend limit** the owner
   sets in the Claude Console. It stops spending even if everything else fails.
2. **A Worker budget** in a Durable Object: before each call it **reserves** the worst case the
   way chess's `worstCost` does (the input's characters ÷ 2 as tokens at the cache-write price,
   plus the full `max_tokens` at the output price), then settles the real cost from the
   response's `usage`. It stops Claude calls for the day at $0.16 and for the month at $4.50. If
   the budget object can't be reached, the coach turns off; it never fails open. The Claude call
   and the settle run inside `ctx.waitUntil()`, so a player closing the app mid-call doesn't
   strand a reservation. A reservation that still isn't settled after 2 minutes is counted as
   spent at its reserved amount (an alarm on the budget object), never released. If Anthropic
   answers that the workspace limit is reached (an HTTP 400 `invalid_request_error`, not a 429),
   the coach turns off for the rest of the month.
3. **Per-user limits:** 2 reviews and 5 explains a day per account, in the same Durable Object.
   The Workers Rate Limiting binding sits in front as a cheap first filter.
4. **Bounded requests:** at most 3 hands in a review and 1 in an explain. Sonnet 5.5 thinks by
   default and thinking counts against `max_tokens`, so calls run at low effort with room for it:
   `max_tokens` 4,000 for a review and 1,500 for an explain. A reply cut off at `max_tokens` or
   stopped by the output filter falls back to the free notes, **and still counts** against the
   user's daily limit and the budget (changed after the outside review, so it can't be retried
   endlessly).
5. **The API key lives only in a Worker secret** (`ANTHROPIC_API_KEY`), following ai-brain
   decision 0016. Never in the repo, a claude.ai environment or chat. The owner puts it there and
   rotates it new-then-revoke.

**Model:** Claude Sonnet 5.5 (`claude-sonnet-5-5`), as chess, for its writing. **Cost per call**
(Anthropic list prices, skill price table cached 2026-11-03). The fixed instructions are short,
so caching saves little and isn't counted:

| Model | Explain (about 1,500 in, 400 out) | Review (about 3,000 in, 1,500 out) | Reserved per review | Daily cap ($0.16) covers |
| --- | --- | --- | --- | --- |
| Haiku 5.5 ($0.10 / $0.50 per million) | $0.0004 | $0.001 | $0.003 | about 150 reviews |
| Sonnet 5.5 ($2 / $10) | $0.007 | $0.021 | $0.055 | about 6 reviews |
| Opus 5.5 ($4 / $20) | $0.014 | $0.042 | $0.110 | about 2 reviews |

On Sonnet, one account at its daily maximum costs about $0.08. Because each call must fit its
reservation under the cap, a second heavy user that day gets their 2 reviews and about 2
explains before the cap stops the coach; later users get the free notes. Anthropic keeps API
inputs and outputs for a limited time and doesn't train on them by default; the privacy page
says so.

## Playing a friend

### Flow

1. **Start a room.** Pick the blind speed (Standard or Quick) and whether the action timer is on
   (owner, 2026-11-10). The app shows the code in large letters, **Copy link**, and **Share** on phones
   (the browser's own share sheet).
2. **Join.** The friend opens the link (`/#room=CODE` fills in the code; a `#` part is never sent
   to any server, so the code can't leak in a request or a `Referer`) or types it into **Join a
   room**. Opening the link never connects by itself: the friend taps **Join**, so a chat app's
   link preview or scanner can't take the seat.
3. **Play** a match. Players show as "You" and "Friend". No names, no chat. A small set of
   preset emotes ("Nice hand", "Good game") is **not** in v1.
4. **Rematch** when both tap it; the first dealer switches. A tally ("You 2, Friend 1") lasts
   for the room's life.
5. **Leave** ends your seat; the friend sees "Your friend left".

The odds helper and the coach are **off during a room match**, for both players, and the app
says plainly that this is honour-based (nothing stops a player using a calculator in another
tab). When the match ends, each player can open the post-match review of their own hands.

### Server: hidden cards

This is the one big difference from chess, where the whole board is public.

- **The Worker deals.** One Durable Object per room shuffles the deck, keeps it and both hands in
  its storage, and is the only place the full deck ever exists.
- **Each player gets only their own view.** Every message to a seat is built by one function,
  `viewFor(seat)`, which includes that seat's hole cards, the board dealt so far, the bets and
  stacks, and the other player's cards **only** once no betting decision is left (see the reveal
  rule above). It carries no hand names, winners or win chances before the reveal. The deck, undealt cards and the other player's hidden cards are never in any message,
  including the full-state message a reconnecting player gets. A test checks this across
  thousands of random hands (Tests, item 4).
- **The server is the referee.** It checks every action with `src/poker/rules.js` (the same module the
  browser uses): out of turn, below the minimum, more than your stack or not a legal action is
  rejected. It decides who wins each pot.
- **Cards aren't committed in advance.** A cryptographic "provably fair" shuffle would mean
  revealing folded cards or doing mental-poker cryptography; both are out of scope. Players trust
  the room server, which is the owner's Worker. Its stored deck is readable by the owner's
  Cloudflare account and deleted when the room closes. The About page says so.
- Logs never contain cards: Workers observability stays off (or error counts only), and the room
  code writes no state to `console`.
- The post-match review in a room is built on each device from that player's own messages, so it
  can't hold anything the room never sent them.

### Server: rooms

Ported from chess, with poker messages:

- **Create:** `POST /api/rooms` returns a 6-character code from 31 unambiguous letters and digits
  (about 887 million codes) and a secret seat token.
- **No KV** (as Dropline's red team settled): KV's free plan allows only 1,000 writes a day and
  caches a "not found" for up to a minute, so the room's own Durable Object answers "no such
  room" for a code it never created, without writing anything.
- **Rate limits** on hashed addresses (an IPv6 address counts by its /64): creating rooms is
  limited to 3 a minute and **10 a day**, and looking up codes to 20 a minute, as Dropline. The
  Workers Rate Limiting binding is approximate and per data center, so the hard limits live in
  Durable Objects: a small `QUOTA` object allows at most **50 new rooms a day for the whole app**
  (one write per room created), and each room has its own action budget (below). A guesser who
  did find an open room could only take an empty seat.
- **Messages:** `hello` (with the seat token, or none to take the empty seat), `act`
  (`{kind, amount}`), `rematch`, `resign`, `leave`, each at most 200 characters, at most 5 a
  second per socket. An `act` from a seat less than 0.5 seconds after its last one is ignored.
- **Room action budget** (added after the outside review): a room accepts at most **500 actions
  in its lifetime**, across all matches and rematches and however many times a seat reconnects;
  then it closes with a "start a new room" note. A long match is about 300 actions. With the
  daily room cap, this bounds what one person can write: 50 rooms × 500 actions × at most 2 rows
  is 50,000 rows, half the free plan's daily write allowance, so chess and Dropline keep the
  other half.
- **One row per action:** the room keeps its whole state as one JSON value and writes it once
  per accepted action. It calls `setAlarm()` only when the earliest deadline changes. Ignored or
  rejected messages write nothing.
- **WebSocket Hibernation API**, as chess, so an idle room uses no duration.
- **Seats and reconnect:** the browser keeps its seat token in `localStorage` for that code.
  Coming back with it restores the seat and the current hand, and closes any older socket with
  the same token. A third person is turned away: no spectators.
- **Action timer** (owner, 2026-11-10): when on, each decision has a 45-second clock. When it
  runs out, the player checks if they can, otherwise folds that one decision. There is no
  "sitting out": the next decision gets a fresh clock. **When the timer is off**, a decision
  still has a 5-minute ceiling, so a losing player who keeps the app open can't trap the other
  for a day.
- **One alarm, many deadlines:** a Durable Object has a single alarm. The room stores every
  deadline it has (the turn clock, the grace budget, idle expiry, the 7-day hard expiry) and
  always sets the alarm to the earliest one; when it fires, it handles whatever is due and sets
  the next. So pausing a clock can never cancel a room's expiry, and no deck is kept past 7 days.
- **Disconnects** (changed after the red team): a locked phone drops its socket, and with the
  clock running, auto-folds would let the other player run through dozens of hands and the
  climbing blinds in a minute. So while a seat has no socket, its clock pauses and no new hand
  is dealt. Each player has a **grace budget of 3 minutes per match** in total; when it's used up,
  the other player can claim the match. A total budget, rather than 3 minutes each time, stops
  disconnecting from being a way to buy thinking time.
- **Expiry:** a room no one joins closes after 1 hour, any room 24 hours after its last action,
  and every room within 7 days. Closing deletes the room's storage, deck included.

### Cheating, in plain words

| Risk | What we do |
| --- | --- |
| A modified app peeks at the other hand | It can't: the other hand is never sent until it's shown |
| A modified app makes an illegal bet or acts out of turn | The server rejects it |
| Predicting the shuffle | `crypto.getRandomValues` in the Worker, a fresh shuffle each hand, the deck never leaves the server |
| A friend looks over your shoulder, or both of you use an odds calculator | Honour-based, said plainly; these are friendly games with nothing at stake |
| Guessing a room code to sit in | Rate limits, 887 million codes, short-lived rooms; a stranger only gets a seat in a free game |
| Stalling to wait someone out | The action timer and the 3-minute grace budget |
| A leak through something other than card codes (a hand name, an early winner, a win chance, a deck index) | The non-interference test (Tests, item 4) compares whole messages, not card codes |
| Two people in a 3-6 seat game sharing cards (collusion) | Not possible in heads-up. Only matters if bigger tables come (owner, 2026-11-10: heads-up only), and stays honour-based there |

### Cost

On the Workers Free plan, Durable Objects allow 100,000 requests a day, counting incoming
WebSocket messages, and fail with an error past that rather than charging (as checked for
Dropline, 2026-11-10). Incoming WebSocket messages count 20 to 1 toward requests, so
requests are not the tight limit. Rows written are: SQLite-backed Durable Objects allow about
100,000 a day on the free plan, and every storage write, `setAlarm()` and delete counts. These
allowances are **per account**, shared with chess and Dropline rooms. The room action budget and
the daily room cap above keep this app to at most half of it: 50 rooms a day, each good for a
long match and a rematch (limits to be confirmed against Cloudflare's pricing page in build 3). If a limit is reached, rooms say "unavailable, try later" and
the computer is unaffected. The coach's spend is capped separately above. The account's plan is
the owner's call.

## Audience and privacy

**Audience** (owner, 2026-11-10): default **13 and up**, with poker presented as a game of
probability and decisions, nothing at stake and none of the casino trappings above. The owner
should know how formal raters see this: PEGI treats simulated gambling with realistic
presentation as 18 (its rules were revised in 2025 after the Balatro appeal, giving more room to
fantastical presentation), and Australia has classified games with simulated gambling R18+ since
2024. Cards isn't in any store, so no rating applies, but a public poker site that welcomes 13-year-
olds is a choice the owner makes knowingly. The play-money design (no stake, no prize, no chips
to buy or keep) is what keeps it a card game rather than a social casino, and the coach is for
adults only (see Sign-in).

**Web filters:** family and school filters may file a poker site under gambling. Filters usually
judge a hostname, but some judge the whole domain, which could block `prignano.ai` and the chess
app for the same children. If that happens, the major filter vendors take recategorisation
requests; the launch checklist in `docs/DEPLOY.md` includes checking the subdomain's category
with one or two of them.

- No accounts (except the coach's Access sign-in), names, chat, analytics, ads or trackers.
  The one third-party request is the prignano-theme header from jsDelivr, pinned to a commit SHA
  with a subresource integrity hash, as chess does; jsDelivr sees the player's address when it
  loads, and `Referrer-Policy: no-referrer` stops it seeing which page asked. A
  Content-Security-Policy header lists the only allowed sources.
- **First launch** shows a one-screen notice: made for 13 and up, play money only, chips are
  worth nothing; tap to continue. On the prignano.ai games page the entry carries the 13+ label.
- Settings, your record, match histories (for the review) and seat tokens stay in
  `localStorage` on the device; "Delete my data" clears them and the coach's usage key.
- Rooms hold only the current match, the two seat tokens and the tally, and are deleted when the
  room closes. The Worker keeps no request logs, and rate-limit keys are hashed addresses that
  expire.
- A short privacy page in plain words, like chess's, plus the play-money paragraph.

## Installable app

Pinball PR #7's recipe: manifest (`display: standalone`, no orientation lock), original icons in
any, maskable and Apple touch sizes, iOS home-screen tags, a service worker that caches every
served file with its list stamped by `tools/sw-version.mjs` and a test that fails when the list
is stale, an Update button, safe-area padding, the site header hidden in the installed app, and
sound resumed after an iPhone locks. The service worker never caches `/api/*` or `/coach/*`.
Playing the computer works offline.

## Hosting

One Cloudflare Worker named after the repo, serving the folder as static assets and running
`worker/index.js` first for `/api/*` and `/coach/*`, with the `ROOM` and `BUDGET` Durable Objects
and a small `QUOTA` object (all SQLite-backed, so they work on the free plan), and `ROOM_LIMIT`
and `COACH_LIMIT` rate limits, as in chess's `wrangler.jsonc`. Workers Builds deploys each merge to
`main`.

The owner's steps, listed in `docs/DEPLOY.md` as chess's are: create the repo, add the custom
domain, create the Anthropic workspace with its spend limit and put its key in the Worker secret,
set `USER_SALT`, and add the Access application for the coach paths. Claude sets up the Worker
on the account only with his yes. The last step is the `content/games.json` PR in
`prignanodotai-web`: the game goes in hidden when the repo is created, and the launch PR sets its
url and `live`.

## Files

```
index.html, styles.css, manifest.webmanifest, sw.js, _headers, privacy.html, icons/
src/cards.js       deck, unbiased shuffle, card codes, card SVGs (shared by every game)
src/table.js       SVG table, chips, animation, screen-reader text (shared)
src/poker/rules.js hand state machine: blinds, actions, legal sizes, pots, showdown (shared with the Worker)
src/poker/evaluate.js  best five of seven, hand names
src/poker/odds.js  outs, pot odds, win chance (Monte Carlo and exact)
src/poker/bot.js   the three computer levels (pure; sees only its seat's view)
src/poker/bot-worker.js  runs bot.js and odds.js off the main thread
src/poker/ui.js    poker controls and screens
src/coach.js       calls /api/coach, falls back to on-device notes
src/live.js        room create and join, WebSocket, reconnect
src/audio.js       Web Audio sounds
src/main.js        screens: home (the list of games, one in v1), history, settings, about
worker/index.js    routes, rate limits, Access check
worker/rooms.js    room rules and viewFor() with no Cloudflare in them (tested in Node)
worker/room.js     the room Durable Object
worker/coach.js    request builder (replay and validation), Claude call, JSON schema
worker/budget.js   the budget Durable Object
worker/quota.js    the daily room cap
tools/sw-version.mjs, tools/preflop-table.mjs (writes the 169-hand table we compute ourselves)
wrangler.jsonc, .assetsignore, docs/DEPLOY.md
test/              node --test
```

## Tests

`node --test` covers:

Every random source in the tests is a seeded generator passed in, never `crypto.getRandomValues`
directly, so no test can fail by chance.

1. **Hand evaluation:** all 2,598,960 five-card hands are dealt and the counts per category
   match the known totals (40 straight flushes, 624 fours of a kind, 3,744 full houses, 5,108
   flushes, 10,200 straights, 54,912 threes of a kind, 123,552 two pairs, 1,098,240 pairs,
   1,302,540 high cards), with 7,462 distinct ranks; the wheel (A-2-3-4-5) is the lowest straight;
   best-of-seven agrees with a slow brute-force reference on 100,000 random seven-card hands;
   ties split correctly.
2. **Rules:** heads-up blinds and order of action, minimum bets and raises, uncalled bets
   returned, a stack smaller than its blind, all-in run-outs, the reveal rule,
   blind levels, match end. Chip totals are conserved after every action in 10,000 random seeded hands.
3. **Computer and odds helper:** the same non-interference check as item 4 for the bot's and the
   odds helper's inputs (change only the cards that seat can't see; the input must not change);
   every bot action is legal; the same seed gives the same decisions. **Strength** is measured
   as chips won per hand at fixed blinds with stacks reset to 100 big blinds every hand (rising
   blinds turn matches into all-in contests and hide skill): Medium must beat Easy, and Hard
   must beat Medium, by at least 3 standard errors over a seeded run sized to finish in CI in
   under a minute.
4. **Hidden cards in rooms** (`worker/rooms.js` in Node): a **non-interference** test. For
   thousands of seeded hands, run the same actions, reconnects and rematches over two deals that
   differ only in the cards one seat can't see (the other's hidden cards and the undealt cards),
   and require every message to that seat to be byte-for-byte the same until the reveal. This
   catches a leak in any form (card codes, deck indexes, hand names, an early winner), not just
   card codes. Also: the shuffle passes a chi-squared test for card position over 100,000
   seeded shuffles; seats, the third person turned away, out-of-turn and illegal actions refused,
   the timer's check-or-fold, the clock pausing while disconnected, the grace budget and claim,
   expiry, and that no view includes the other player's seat token. Also: the alarm is always
   the earliest stored deadline (pausing a clock never drops expiry), the 5-minute ceiling with
   the timer off, the 0.5-second spacing, the 500-action room budget, and one storage write per
   accepted action. Because `worker/room.js` (the Durable Object and its WebSocket attachments)
   isn't covered by Node tests, a smaller run of the same non-interference check goes through the
   real Durable Object under `wrangler dev` before the build 3 PR.
5. **Odds:** outs and exact river and turn win chances against a random hand on a fixed set of
   known spots; the seeded Monte Carlo figure within 2 points of the exact flop figure against a
   random hand.
6. **Coach request builder:** illegal, unfinished or tampered histories are rejected (stacks not
   summing to 2,000, blinds off the schedule); win chances outside 0-100 or non-integers are
   dropped; the request never contains the friend's unshown cards; the output filter catches its
   phrases and lets "even money", "dead money" and "opposite" through; cut-off and filtered
   replies count against the user; the prompt is built from the replay, not the request; "Delete
   my data" doesn't reset today's counters; an unsettled reservation is counted at its reserved
   amount; budget reserve and settle (ported from chess).
7. **Words:** a banned list, stored encoded (real poker brands, TV shows, sites and card rooms),
   appears in no shipped file.
8. **PWA:** the service worker's file list is current.

**Done means:** all tests pass in CI, and before each build PR the build thread runs a scripted
Playwright check at phone and desktop sizes: a match against each level, the odds helper, and
under `wrangler dev` a two-browser room match with a reconnect and a rematch. Installing,
playing offline and a real two-phone room game are manual checks in `docs/DEPLOY.md`.

## Pull requests

After the owner creates the repo, and when it's this game's turn in the build queue:

1. **Spec:** this file as `docs/SPEC.md`, `AGENTS.md`, `CLAUDE.md`, MIT `LICENSE`; the hidden
   `games.json` entry in `prignanodotai-web`.
2. **Build 1, the game against the computer:** rules, evaluator, odds helper, three levels,
   table, cards, sounds, record, About, PWA, static `wrangler.jsonc`, `docs/DEPLOY.md`, CI, tests
   1, 2, 3, 5, 7, 8.
3. **Build 2, the coach:** Worker, Access check, budget Durable Object, Claude review and
   explain, output filter, on-device notes, privacy page, test 6. Owner steps: workspace, key, salt, Access app.
4. **Build 3, play a friend:** room Durable Object, rate limits, create and join, share link,
   reconnect, timer, rematch, test 4.

Then the Cloudflare setup (with the owner's yes) and the launch `games.json` PR.

## More games later

The owner wants blackjack and other card games after poker (2026-11-10). v1 builds only poker,
but keeps the parts every card game needs in shared files (deck and shuffle, card art, table,
sounds, the room and coach Worker), with poker's rules under `src/poker/`, so a second game adds
a folder rather than a rewrite. No game framework is built ahead of time.

Each new game gets a short addendum to this spec, its own Fable red team and its own build PRs.
The play-money rules above apply to every game. Blackjack needs extra care there: it is played
against the house, so the natural design is a bankroll that carries over, which is exactly what
this app rules out. And because the house has the edge, any scoring by chips won rewards wild
betting (doubling up after losses, going all-in) over good play. So the outside review's shape
is the starting point for its addendum: **one-unit hands only** (no bet slider, no side bets;
the choices are hit, stand, double, split and surrender), the deck reshuffled every hand, and the
score is how far your choices were from basic strategy in expected value, not chips. Its coach
and odds helper teach basic strategy and the house edge, never card counting.

## Not in v1

Other games (see above), tables of 3 to 6, Omaha or other variants, tournaments with many tables,
spectators, chat or emotes, a public lobby or matchmaking with strangers, a shared leaderboard,
"provably fair" shuffles, a solver-strength bot, voice, music, and anything with money.

## Answers to the open questions (owner, 2026-11-10)

1. **Audience:** 13 and up, with the Claude coach for adults unless the owner adds a child (tightened to adults only after the outside review).
2. **Name:** Cards, at `cards.prignano.ai`, repo `nickprignano/cards`, with blackjack and other
   games later. A quick search of app stores, Steam and itch.io comes before the spec PR; a close
   match in the same genre goes back to the owner.
3. **Tables:** heads-up only in v1.
4. **Coach budget:** its own workspace, $5 a month, Sonnet 5.5.
5. **Action timer:** 45 seconds, on by default, the creator can turn it off.

## Fable red team (2026-11-10): what it found and what changed

| Finding | Change |
| --- | --- |
| A brief disconnect lost the match: the clock ran on, two timeouts meant auto-folding every hand, and the other player could run through dozens of hands in a minute | No "sitting out"; a disconnected seat's clock pauses and no new hand is dealt, against a 3-minute grace budget per match, then the claim |
| The hidden-card test only scanned for card codes, so a leak as a hand name, early winner, win chance or deck index would pass | A non-interference test: two deals differing only in hidden cards must give byte-identical messages; the same check for the bot's and odds helper's inputs |
| "Revealed in an all-in" was loose: an uncalled shove, a resignation or a claim could expose cards | Reveal only once no betting decision is left; folds, resignations and claims reveal nothing |
| Stacks smaller than the blind weren't specified, and the short-all-in reopening rule can't arise heads-up | A short-blind rule and tests; the reopening rule and its test removed; minimum bet stated |
| The spend numbers didn't match chess's actual reservation, thinking could truncate replies at the planned `max_tokens`, and "two heavy users fit" was false | Reserve figures from chess's `worstCost`, only the 3 reviewed hands sent, `max_tokens` raised with low effort, cut-off replies don't use the user's count, capacity restated (about 6 reviews a day), cache saving dropped |
| An AI coaching children on betting, through the chess family list that includes children | A separate coach allowlist, adults by default; the audience question explains the trade-off |
| Bot win-rate thresholds were guesses and 500 Monte Carlo matches would be too slow for CI | Chips per hand at fixed blinds, a 3-standard-error margin, a cheap equity lookup; Hard cut to "Medium plus a range" |
| The chi-squared and Monte Carlo tests could fail by chance | Every test uses a seeded generator; "exact" is against a named range (a random hand) |
| Quota facts: free limits are per account (shared with chess and Dropline), KV allows 1,000 writes a day, SQLite Durable Objects cap rows written | No KV (as Dropline), room creation limited to 3 a minute, capacity restated as about 50 matches a day, one write per accepted action |
| A one-off read of sample outputs proves little about what the coach says | A deterministic output filter with its own test, the prompt critiques only the reviewee, histories must replay to the end, stacks and blinds validated |
| Family and school filters may class a poker subdomain as gambling and block the whole domain | Noted under Audience, with a launch-checklist item |
| Over-building | Cut: sitting out, the reopening rule, Hard's habit-tracking and mixed sizing, the timer's preset values (now on or off), the pokersolver cross-check |

## Outside review (Gemini, 2026-11-10): what it found and what changed

| Finding | Change |
| --- | --- |
| One address could script rooms to use up the account's daily storage writes for every game, and the rate-limit binding is approximate | Hard caps in Durable Objects: 50 new rooms a day for the app, 10 a day per address, 500 actions per room for its life, 0.5 s between a seat's actions, one row per action, alarms only when the earliest deadline changes |
| "Delete my data" reset the per-user limits; filtered or cut-off replies didn't count, so they could be retried endlessly; the filter would trip on "even money" or "opposite" | Counters expire on their own and aren't reset by deleting; filtered and cut-off replies count; whole-word phrases with a false-positive test |
| A Durable Object has one alarm, so setting the turn clock would overwrite expiry and keep decks stored indefinitely | Every deadline is stored and the alarm is always the earliest |
| With the timer off a player could stall for a day; link scanners opening a share link could take the second seat | A 5-minute ceiling with the timer off; the link fills the code and the friend taps Join |
| A closed app mid-call could strand a reservation; the workspace limit answers with a 400, not a 429 | `ctx.waitUntil()` around call and settle, unsettled reservations counted as spent after 2 minutes, the 400 handled |
| Showing the computer's folded cards contradicted "a folded hand is never shown" | Clarified: that rule is for rooms; against the computer its cards are shown after each hand on purpose |
| The share link's `?room=CODE` could reach jsDelivr in a `Referer` | `#room=CODE` plus `Referrer-Policy: no-referrer` |
| Node tests can't see leaks in the Durable Object's WebSocket code | A smaller non-interference run through the real Durable Object under `wrangler dev` before build 3 |
| The prompt must not carry anything but replayed state | The Worker rebuilds the prompt from its replay and never forwards request JSON |
| A word list misses paraphrased bankroll advice; adding a child would bring Anthropic's minor safeguards and US children's-privacy law | The coach is adults only, no child exception |
| 13+ is defensible in the US for a free, no-stake game, but Europe and Australia rate realistic poker 18 | 13+ kept; a first-launch notice (13+, play money) and the 13+ label on the games page |
| Blackjack scored on chips rewards wild betting because of the house edge | The blackjack plan is one-unit hands, a reshuffle every hand, scored against basic strategy |
| The Beginner example call was a losing call (19.6% to win against 20% needed); "outs × 4" overstates a flop call when more betting is to come | The example now needs 1 in 6; the flop verdict uses the next card only unless all-in |
| Heads-up pots are always even, so there is no odd chip | The rule and its test removed |
| WebSocket messages count 20 to 1 toward requests; alarms and deletes count as rows written | The cost section restated around rows written |
| jsDelivr is a third-party request; Access and Anthropic keep their own logs | The privacy section says both |
| GPL-to-MIT porting holds only with no outside contributors | The spec PR checks the chess history first |
| Suggested: Haiku 5.5 or templates only; self-hosting the theme header | Not taken: the owner chose Sonnet 5.5 (Haiku stays an option), templates are already the fallback, and the theme header stays pinned from jsDelivr like the other games |

