<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep visitor/demo access in a shared React context, with no persisted accounts; the project remains a frontend simulation until real registration is explicitly requested.
- Keep homepage-specific auction cards separate from shared auction detail controls to preserve existing dashboard flows.
- Keep simulated registration at /register with shared Zod schemas and transient form state; do not persist personal documents or passwords or transmit them to a server.
- Only complete buyer demo access after plan selection; merchant submissions remain pending and do not unlock partner access.
