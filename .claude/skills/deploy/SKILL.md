---
name: deploy
description: Use when the user says deploy or asks to deploy changes to production
---

# Deploy

Commit all outstanding changes and push to remote. Netlify auto-deploys from main.

## Steps

1. **Run format-and-commit**: Use the `/format-and-commit` skill to:
    - Validate tools consistency
    - Format code
    - Verify build
    - Commit changes with a meaningful message

2. **Push to remote**: Run `git push` to deploy via Netlify

3. **Confirm deployment**: Report that changes have been pushed and Netlify will auto-deploy
