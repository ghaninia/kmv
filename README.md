# 🎯 Admin Dashboard System

A professional admin dashboard with Laravel backend and React frontend. Manage products, categories, catalogs, and currency conversion all in one place.

## 🐳 Quick Start with Docker (30 Seconds)

**Docker is the recommended way** - everything runs in containers, no local setup needed!

```bash
# 1. Start everything:
make setup

# 2. Open browser:
# http://localhost:8000

# Login:
# Email: admin@example.com | Password: password
```

That's it! You now have a running admin dashboard. 🎉

👉 **Learn more:** [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

---

## 📚 Documentation

| Method | Document | Time |
|--------|----------|------|
| **🐳 Docker** (Recommended) | **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** | 5 min |
| 💻 Local Setup | [QUICK_SETUP.txt](QUICK_SETUP.txt) | 5 min |
| Quick Reference | [QUICK_START.md](QUICK_START.md) | 5 min |
| Complete Guide | [SETUP_SUMMARY.md](SETUP_SUMMARY.md) | 5 min |
| All Guides | [DOCS_INDEX.md](DOCS_INDEX.md) | 5 min |

👉 **Start here:** [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

---

## ✨ Features

### Backend (Laravel 13)
- ✅ 29 REST API endpoints
- ✅ User authentication with Sanctum
- ✅ Product management with galleries
- ✅ Category system
- ✅ Multi-catalog support
- ✅ Public links with password protection
- ✅ USD to Toman currency conversion
- ✅ Daily scheduler for updates
- ✅ 35 comprehensive tests

### Frontend (React 18)
- ✅ Modern Tailwind CSS design
- ✅ Responsive layout
- ✅ Real-time dashboard
- ✅ State management with Zustand
- ✅ Hot module reloading
- ✅ Protected routes

---

## 🛠️ Tech Stack

**Backend:**
- Laravel 13
- PHP 8.3+
- SQLite/MySQL/PostgreSQL
- Spatie Media Library
- PHPUnit

**Frontend:**
- React 18
- React Router
- Tailwind CSS 4
- Zustand
- Axios
- Vite

---

## 📋 System Requirements

### For Docker (Recommended)
- ✅ Docker Desktop (macOS/Windows)
- ✅ Docker & Docker Compose (Linux)

Download: https://www.docker.com/products/docker-desktop

### For Local Development (Optional)
- PHP 8.3+
- Node.js 18+
- Composer
- npm

---

## 🚀 Available Commands

### Docker (Primary)
```bash
make setup              # Full Docker setup (first time) ⭐
make up                 # Start containers
make down               # Stop containers
make logs               # View logs
make ps                 # Show containers
```

### Database (Docker)
```bash
make migrate            # Run migrations
make seed               # Seed database
make fresh              # Reset everything
```

### Testing (Docker)
```bash
make test               # Run all tests
```

### Utilities (Docker)
```bash
make bash               # Access container shell
make artisan CMD="..."  # Run Artisan command
make tinker             # Open PHP shell
```

### Local Development (Alternative)
```bash
make install-local      # Install locally (no Docker)
make dev-local          # Start local servers
```

### All Commands
```bash
make help               # Show all available commands
```

---

## 🌐 Default URLs

| Service | URL |
|---------|-----|
| App | http://localhost:8000 |
| React Dev | http://localhost:5173 |
| API | http://localhost:8000/api |

---

## 🔐 Default Credentials

- **Email:** admin@example.com
- **Password:** password

⚠️ Change these in production!

---

## 📁 Project Structure

```
kmv/
├── app/                    # Backend code
├── resources/js/          # React components
├── database/              # Migrations & seeds
├── tests/                 # Test files
├── routes/                # API routes
├── Makefile               # Commands
├── package.json           # Frontend deps
└── composer.json          # Backend deps
```

See [SETUP.md](SETUP.md) for complete structure.

---

## 🧪 Testing

```bash
make test                    # Run all tests
php artisan test tests/Feature/AuthenticationTest.php  # Single test
php artisan test --watch    # Watch mode
```

**Coverage:**
- 6 Authentication tests
- 6 Category tests
- 6 Product tests
- 7 Catalog tests
- 4 Currency tests
- 6 Public catalog tests

---

## 🆘 Quick Troubleshooting

### Docker not installed?
Download: https://www.docker.com/products/docker-desktop

### Containers won't start?
```bash
make down
make setup
```

### Database errors?
```bash
make fresh  # Resets database
```

### Port already in use?
- Stop other apps using ports 8000 or 5173, OR
- Modify `docker-compose.yml`

More help → See [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

---

## 📖 Learning Path

1. **Setup:** Run `make setup`
2. **Open:** http://localhost:8000
3. **Explore:** Dashboard and features
4. **Learn:** Read [QUICK_START.md](QUICK_START.md)
5. **Extend:** Check [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md)

---

## 🚢 Production Deployment

1. Build: `make build`
2. Configure `.env` for production
3. Setup database: `make migrate`
4. Setup scheduler for daily updates
5. Deploy container
6. See [SETUP.md](SETUP.md) for full guide

---

## 📊 API Endpoints (29 Total)

**Authentication:** 3 endpoints  
**Dashboard:** 1 endpoint  
**Categories:** 5 endpoints  
**Products:** 7 endpoints  
**Catalogs:** 10 endpoints  
**Currency:** 3 endpoints  
**Public:** 1 endpoint  

See [QUICK_START.md](QUICK_START.md) for full API reference.

---

## 🎓 Documentation Files

| File | Purpose |
|------|---------|
| **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** | 🐳 Docker setup (start here!) |
| [QUICK_SETUP.txt](QUICK_SETUP.txt) | Local setup (no Docker) |
| [SETUP_SUMMARY.md](SETUP_SUMMARY.md) | Quick reference |
| [QUICK_START.md](QUICK_START.md) | API endpoints |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Complete guide |
| [SETUP.md](SETUP.md) | Full documentation |
| [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md) | Feature details |

---

## 💡 Pro Tips

1. **Keep containers running:**
   ```bash
   make up      # Start
   # Don't do make down constantly
   ```

2. **Monitor logs in second terminal:**
   ```bash
   make logs
   ```

3. **Quick database reset:**
   ```bash
   make fresh
   ```

4. **Access container shell:**
   ```bash
   make bash
   ```

5. **Run tests before commit:**
   ```bash
   make test
   ```

---

## 🤝 Contributing

Feel free to extend and customize this dashboard for your needs!

---

## 📝 License

MIT License - Use and modify freely.

---

## 🎉 Ready to Start?

```bash
make setup
```

Then open: **http://localhost:8000**

Login with: **admin@example.com** / **password**

Happy coding! 🐳✨

---

## 📞 Need Help?

1. **Docker questions?** → [DOCKER_GUIDE.md](DOCKER_GUIDE.md)
2. **Local setup?** → [QUICK_SETUP.txt](QUICK_SETUP.txt)
3. **API reference?** → [QUICK_START.md](QUICK_START.md)
4. **All documentation?** → [DOCS_INDEX.md](DOCS_INDEX.md)

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
