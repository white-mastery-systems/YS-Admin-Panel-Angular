# Angular Upgrade Plan: v16 → v21

**Project:** YS-Admin-Panel-Angular (YourStore Admin)  
**Current version:** Angular `16.2.12`  
**Target version:** Angular `21` (LTS)  
**Base branch:** `dev`  
**Strategy:** One major version at a time → separate branch per hop → merge into `dev` after verification  

> Yes — targeting **Angular 21** is a good plan. It is in LTS (security/critical fixes) and is a solid, supported destination without taking on Angular 22’s newer defaults (e.g. OnPush-as-default) until you are ready.

---

## 1. Goals

| Item | Decision |
|------|----------|
| End version | Angular **21.x** (latest patch of 21) |
| Path | `16 → 17 → 18 → 19 → 20 → 21` |
| Branching | One feature/chore branch **per major** |
| Merge target | Always merge into **`dev`** |
| Do not skip majors | Angular migrations must run sequentially |

---

## 2. Branch naming convention

| Hop | Branch name |
|-----|-------------|
| 16 → 17 | `chore/angular-upgrade-v17` |
| 17 → 18 | `chore/angular-upgrade-v18` |
| 18 → 19 | `chore/angular-upgrade-v19` |
| 19 → 20 | `chore/angular-upgrade-v20` |
| 20 → 21 | `chore/angular-upgrade-v21` |

---

## 3. Environment checklist (before any hop)

```bash
# Confirm you are on latest dev
git checkout dev
git pull origin dev

# Node: use Node 20 LTS or Node 22 (this machine has Node 22 — OK for all hops to 21)
node -v
npm -v

# Clean install + baseline build (must be green before upgrading)
rm -rf node_modules
npm ci
npx ng version
npx ng build
```

**Do not start the next hop until:**

- [ ] `ng build` succeeds  
- [ ] App starts (`npm start`)  
- [ ] Critical smoke tests pass (login, store list, orders, settings)  
- [ ] Branch is merged into `dev`  
- [ ] Local `dev` is updated from remote  

---

## 4. Standard workflow for EVERY major hop

Use this template for each version. Replace `NN` with `17`, `18`, `19`, `20`, or `21`.

```bash
# ------------------------------------------------------------
# A) Start from updated dev
# ------------------------------------------------------------
git checkout dev
git pull origin dev

# ------------------------------------------------------------
# B) Create hop branch
# ------------------------------------------------------------
git checkout -b chore/angular-upgrade-vNN

# ------------------------------------------------------------
# C) See available updates
# ------------------------------------------------------------
npx ng update

# ------------------------------------------------------------
# D) Upgrade Angular core + CLI (one major only)
# ------------------------------------------------------------
npx ng update @angular/core@NN @angular/cli@NN --force

# If localize / service-worker were not updated automatically:
npx ng update @angular/localize@NN @angular/service-worker@NN --force

# ------------------------------------------------------------
# E) Fix peer dependency / third-party package issues
#    (install compatible versions of ngx-* libs if npm/ng complains)
# ------------------------------------------------------------
npm install

# ------------------------------------------------------------
# F) Build + run
# ------------------------------------------------------------
npx ng build
npm start
# smoke-test the app, then stop the server

# ------------------------------------------------------------
# G) Commit
# ------------------------------------------------------------
git add .
git status
git commit -m "chore(angular): upgrade to vNN"

# ------------------------------------------------------------
# H) Push branch
# ------------------------------------------------------------
git push -u origin chore/angular-upgrade-vNN

# ------------------------------------------------------------
# I) Open PR into dev (GitHub CLI)  OR create PR in UI
# ------------------------------------------------------------
gh pr create --base dev --head chore/angular-upgrade-vNN \
  --title "chore(angular): upgrade to vNN" \
  --body "$(cat <<'EOF'
## Summary
- Upgrade Angular from previous major to vNN
- Run framework/CLI migration schematics
- Align related dependencies as needed

## Test plan
- [ ] `ng build` passes
- [ ] `npm start` works
- [ ] Login works
- [ ] Main admin screens load
- [ ] No console errors on critical flows
EOF
)"

# ------------------------------------------------------------
# J) After PR approval — merge into dev
# ------------------------------------------------------------
# Preferred: merge via GitHub PR UI / "Merge pull request"
# Or with gh:
gh pr merge --merge

# ------------------------------------------------------------
# K) Sync local dev after merge
# ------------------------------------------------------------
git checkout dev
git pull origin dev
```

> **Note on `--force`:** Use only if `ng update` blocks on peer dependency warnings for third-party libs you will fix in the same hop. Prefer fixing peers without `--force` when possible.

---

## 5. Exact commands per hop

### Hop 1 — Angular 16 → 17

**Branch:** `chore/angular-upgrade-v17`

```bash
git checkout dev
git pull origin dev
git checkout -b chore/angular-upgrade-v17

npx ng update
npx ng update @angular/core@17 @angular/cli@17
npx ng update @angular/localize@17 @angular/service-worker@17

npm install
npx ng build
npm start
# smoke test, then Ctrl+C

git add .
git commit -m "chore(angular): upgrade to v17"
git push -u origin chore/angular-upgrade-v17

gh pr create --base dev --head chore/angular-upgrade-v17 \
  --title "chore(angular): upgrade to v17" \
  --body "## Summary
- Angular 16 → 17

## Test plan
- [ ] build
- [ ] smoke test critical screens"

# After review:
gh pr merge --merge
git checkout dev
git pull origin dev
```

**Watch for:**

- TypeScript bumps to ~5.2  
- Optional new control flow (`@if` / `@for`) — not required now  
- Update ngx libs if peer deps fail (`ngx-bootstrap`, `@ng-bootstrap/ng-bootstrap`, `ngx-echarts`, etc.)

---

### Hop 2 — Angular 17 → 18

**Branch:** `chore/angular-upgrade-v18`  
**Prerequisite:** Hop 1 merged into `dev`

```bash
git checkout dev
git pull origin dev
git checkout -b chore/angular-upgrade-v18

npx ng update
npx ng update @angular/core@18 @angular/cli@18
npx ng update @angular/localize@18 @angular/service-worker@18

npm install
npx ng build
npm start

git add .
git commit -m "chore(angular): upgrade to v18"
git push -u origin chore/angular-upgrade-v18

gh pr create --base dev --head chore/angular-upgrade-v18 \
  --title "chore(angular): upgrade to v18" \
  --body "## Summary
- Angular 17 → 18

## Test plan
- [ ] build
- [ ] smoke test critical screens"

gh pr merge --merge
git checkout dev
git pull origin dev
```

**Watch for:**

- TypeScript ~5.4  
- Prefer `provideHttpClient()` when touching HTTP bootstrap (can defer)  
- Bootstrap / ng-bootstrap peer updates

---

### Hop 3 — Angular 18 → 19

**Branch:** `chore/angular-upgrade-v19`  
**Prerequisite:** Hop 2 merged into `dev`

```bash
git checkout dev
git pull origin dev
git checkout -b chore/angular-upgrade-v19

npx ng update
npx ng update @angular/core@19 @angular/cli@19
npx ng update @angular/localize@19 @angular/service-worker@19

npm install
npx ng build
npm start

git add .
git commit -m "chore(angular): upgrade to v19"
git push -u origin chore/angular-upgrade-v19

gh pr create --base dev --head chore/angular-upgrade-v19 \
  --title "chore(angular): upgrade to v19" \
  --body "## Summary
- Angular 18 → 19

## Test plan
- [ ] build
- [ ] smoke test critical screens"

gh pr merge --merge
git checkout dev
git pull origin dev
```

**Watch for:**

- Chart / editor packages: `ng-apexcharts`, `ngx-echarts`, `ngx-quill`, EditorJS  
- Stricter template diagnostics

---

### Hop 4 — Angular 19 → 20

**Branch:** `chore/angular-upgrade-v20`  
**Prerequisite:** Hop 3 merged into `dev`

```bash
git checkout dev
git pull origin dev
git checkout -b chore/angular-upgrade-v20

npx ng update
npx ng update @angular/core@20 @angular/cli@20
npx ng update @angular/localize@20 @angular/service-worker@20

npm install
npx ng build
npm start

git add .
git commit -m "chore(angular): upgrade to v20"
git push -u origin chore/angular-upgrade-v20

gh pr create --base dev --head chore/angular-upgrade-v20 \
  --title "chore(angular): upgrade to v20" \
  --body "## Summary
- Angular 19 → 20

## Test plan
- [ ] build
- [ ] smoke test critical screens"

gh pr merge --merge
git checkout dev
git pull origin dev
```

**Watch for:**

- Node 20+ required in CI as well as local  
- Capacitor-related build issues (if mobile packaging runs in same pipeline)

---

### Hop 5 — Angular 20 → 21 (TARGET)

**Branch:** `chore/angular-upgrade-v21`  
**Prerequisite:** Hop 4 merged into `dev`

```bash
git checkout dev
git pull origin dev
git checkout -b chore/angular-upgrade-v21

npx ng update
npx ng update @angular/core@21 @angular/cli@21
npx ng update @angular/localize@21 @angular/service-worker@21

npm install
npx ng build
npm start

git add .
git commit -m "chore(angular): upgrade to v21"
git push -u origin chore/angular-upgrade-v21

gh pr create --base dev --head chore/angular-upgrade-v21 \
  --title "chore(angular): upgrade to v21" \
  --body "## Summary
- Angular 20 → 21 (target LTS)

## Test plan
- [ ] build
- [ ] full regression smoke test
- [ ] service worker / PWA still registers (if used)
- [ ] Capacitor build (if applicable)"

gh pr merge --merge
git checkout dev
git pull origin dev

# Confirm final version
npx ng version
```

---

## 6. If you do not use `gh` (GitHub UI flow)

After `git push -u origin chore/angular-upgrade-vNN`:

1. Open GitHub → **Compare & pull request**  
2. Base: **`dev`** ← compare: **`chore/angular-upgrade-vNN`**  
3. Review → **Merge** (merge commit or squash — team preference)  
4. Locally:

```bash
git checkout dev
git pull origin dev
```

---

## 7. Common fix commands (when a hop fails)

```bash
# See why update is blocked
npx ng update
npx ng update @angular/core@NN @angular/cli@NN --verbose

# Clear install issues
rm -rf node_modules package-lock.json
npm install

# Check Angular packages are aligned
npx ng version

# Find remaining old Angular refs
grep -R "\"@angular/" package.json

# Temporary peer bypass ONLY if needed mid-hop (fix properly before merge)
npm install --legacy-peer-deps
```

### Known risky packages in this project

| Package | Action if it blocks upgrade |
|---------|-----------------------------|
| `ngx-perfect-scrollbar` | Remove (already unused / commented) |
| `ngx-bootstrap` | Bump to Angular-compatible major |
| `@ng-bootstrap/ng-bootstrap` | Bump to matching Angular major |
| `ngx-echarts` / `ng-apexcharts` / `ngx-quill` | Bump or temporarily pin with compatible peer |
| `tslint` / `codelyzer` / `protractor` | Remove before/during early hops |
| Capacitor 4 packages | Fix in a follow-up PR if mobile build breaks |

---

## 8. What NOT to do during the climb

- Do **not** skip majors (e.g. 16 → 19 directly)  
- Do **not** rewrite the app to standalone in the same PR as a version hop  
- Do **not** enable zoneless change detection yet  
- Do **not** merge a hop into `dev` if `ng build` fails  
- Do **not** start hop N+1 from an unmerged hop N branch — always branch from updated `dev`

---

## 9. Optional cleanup after v21 is on `dev` (separate PR)

Create a later branch, e.g. `chore/angular-v21-cleanup`:

- Migrate builder: `browser` → `application` (esbuild)  
- Replace TSLint with ESLint (`angular-eslint`)  
- Remove dead polyfills (`classlist.js`, unused `core-js`)  
- Fix scripts: replace `ng build --prod` with `--configuration=production`  
- Plan Capacitor major upgrade separately  

```bash
git checkout dev
git pull origin dev
git checkout -b chore/angular-v21-cleanup
# ... cleanup work ...
git push -u origin chore/angular-v21-cleanup
gh pr create --base dev --title "chore(angular): post-v21 cleanup"
```

---

## 10. Suggested timeline

| Day / Sprint | Deliverable |
|--------------|-------------|
| Sprint 0 | Prep: green build on `dev`, Node aligned, remove obvious dead deps |
| Sprint 1 | Merge `chore/angular-upgrade-v17` → `dev` |
| Sprint 2 | Merge `chore/angular-upgrade-v18` → `dev` |
| Sprint 3 | Merge `chore/angular-upgrade-v19` → `dev` |
| Sprint 4 | Merge `chore/angular-upgrade-v20` → `dev` |
| Sprint 5 | Merge `chore/angular-upgrade-v21` → `dev` + regression |
| Sprint 6+ | Optional cleanup PR |

---

## 11. Official references

- Interactive update guide: https://angular.dev/update-guide  
- `ng update` docs: https://angular.dev/cli/update  
- Version compatibility (TS / Node): https://angular.dev/reference/versions  

For each hop, open the update guide with From = current major and To = next major (Advanced complexity).

---

## 12. Quick copy-paste checklist

```text
[ ] Hop 1: v17 branch → PR → merge to dev
[ ] Hop 2: v18 branch → PR → merge to dev
[ ] Hop 3: v19 branch → PR → merge to dev
[ ] Hop 4: v20 branch → PR → merge to dev
[ ] Hop 5: v21 branch → PR → merge to dev
[ ] Confirm: npx ng version shows Angular 21.x
[ ] Full QA on staging built from dev
```

---

*Document generated for YS-Admin-Panel-Angular — Angular 16.2.12 → 21 LTS upgrade.*
