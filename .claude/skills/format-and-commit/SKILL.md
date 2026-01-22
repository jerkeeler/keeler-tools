---
name: format-and-commit
description: Format code with Prettier and create a meaningful git commit after implementing changes
---

# Format and Commit

Use this skill after completing a plan implementation to format code and create a clean commit.

## Steps

1. **Format the code**: Run `npm run format` to format all files with Prettier

2. **Check git status**: Review what files have been changed using `git status`

3. **Stage the changes**: Stage all relevant modified files (be selective - don't stage unrelated changes)

4. **Create a meaningful commit**: Generate a commit message that:
    - Starts with a verb in imperative mood (Add, Fix, Update, Implement, Refactor, etc.)
    - Summarizes the main change in ~50 characters for the subject line
    - Optionally includes a body with more details if the change is complex
    - End with: `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`

5. **Show the result**: Display the commit hash and summary

## Example Commit Message Format

```
Add mini piano player with 88 keys and touch support

- Implement Web Audio API for sound synthesis
- Add horizontal scrolling with minimap navigation
- Support mouse, touch, and keyboard input
- Handle mobile portrait orientation with rotate prompt

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## Notes

- Do NOT push to remote unless explicitly asked
- If pre-commit hooks fail, fix the issues and create a new commit (don't amend)
- Skip files that look like they contain secrets (.env, credentials, etc.)
