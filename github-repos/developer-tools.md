# 🛠️ Developer, Design & Privacy Repositories

Open-source tools to replace enterprise SaaS for design, web analytics, and security.

---

### 1. [Penpot](https://github.com/penpot/penpot)
> The open-source design and prototyping tool for product teams, using native open web standards (SVG, CSS Grid, Flexbox).

- **Replaces:** Figma ($15-$75/mo per editor) / Adobe XD
- **Official Repo:** [penpot/penpot](https://github.com/penpot/penpot)
- **License:** MPL-2.0
- **Best For:** Collaborative UI/UX design without cloud lock-in or seat licenses.

#### 💻 Docker Compose Setup
```bash
# Download official docker-compose file
curl -O https://raw.githubusercontent.com/penpot/penpot/main/docker/images/docker-compose.yaml

# Start Penpot services
docker compose -p penpot -f docker-compose.yaml up -d
```
> Open browser at `http://localhost:9001`

---

### 2. [Plausible Analytics](https://github.com/plausible/analytics)
> Simple, lightweight (< 1 KB script), open-source and privacy-friendly alternative to Google Analytics.

- **Replaces:** Google Analytics 4 (GA4) / Mixpanel
- **Official Repo:** [plausible/analytics](https://github.com/plausible/analytics)
- **License:** AGPL-3.0
- **Best For:** Tracking site visitors without cookie banners or GDPR compliance headaches.

#### 💻 Docker Compose Deployment
```bash
git clone https://github.com/plausible/community-edition.git plausible-ce
cd plausible-ce
docker compose up -d
```

---

### 3. [Bitwarden](https://github.com/bitwarden/server)
> Enterprise-grade open-source password manager with end-to-end encryption.

- **Replaces:** 1Password ($36/yr) / LastPass ($36/yr)
- **Official Repo:** [bitwarden/server](https://github.com/bitwarden/server) / [dani-garcia/vaultwarden](https://github.com/dani-garcia/vaultwarden)
- **License:** GPL-3.0 / AGPL-3.0
- **Best For:** Secure credential, API key, and passkey storage across mobile, desktop, and browser extensions.

#### 💻 Lightweight Vaultwarden (Rust Server) Setup
```bash
docker run -d --name vaultwarden -v /vw-data/:/data/ -p 8080:80 vaultwarden/server:latest
```
