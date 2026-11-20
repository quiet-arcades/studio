# Instructions for AI Assistants — ThinCab

This directory (`thincab/`) holds the hardware/software specification and build artifacts for **ThinCab**, an open-source dual-purpose arcade cabinet and thin-client workstation.

Read [`docs/SPEC.md`](./docs/SPEC.md) and [`docs/BOM.md`](./docs/BOM.md) before making changes.

## Rules

- **Optimize for minimum viable cost without sacrificing UX.** Every added part or complexity must justify its cost and UX impact.
- **Keep it reproducible.** Prefer standard off-the-shelf components, solderless quick-disconnect wiring, and declarative software provisioning.
- **No secrets or local network specifics.** Keep hostnames, IPs, MAC addresses, and credentials out of committed configs (use placeholders or `.example` files).
- **Incubation boundary.** Keep `thincab/` self-contained here until the physical build is proven and ready to split into its own open-source repository.
