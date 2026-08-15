# Helm Roadmap

High-performance AI model benchmarking and evaluation harness roadmap.

## v1.1 — HTMX Lean Dashboard
- **HTMX Architecture**: Streamlined server-rendered evaluation console per [`docs/specs/htmx-migration-plan.md`](docs/specs/htmx-migration-plan.md).
- **Automated Metric Harness**: Latency, TTFT (time-to-first-token), and throughput benchmarks across local and API models.

## v1.2 — Regression Ceiling Guards
- **Continuous Evaluation CI**: Automated pull request gating against performance and accuracy regressions.
- **Multimodal Evaluation Suites**: Image and audio reasoning benchmarks.

## Out of Scope
- Proprietary proprietary benchmark lock-in
- Heavy SPA client dependencies

---
For technical specifications, see [`docs/specs/`](docs/specs/).
