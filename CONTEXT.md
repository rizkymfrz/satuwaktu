# Satuwaktu — Project Context

> Dokumen ini adalah konteks penuh project Satuwaktu untuk digunakan bersama Claude Code.
> Setiap sesi baru, minta Claude Code membaca file ini terlebih dahulu.

---

## Filosofi & Konsep

**Satuwaktu** adalah ruang arsip dua jiwa. Satu kisah, dua tangan yang menulisnya, untuk mata siapapun yang ingin singgah.

Nama "satuwaktu" bermakna ganda:

- **Satu waktu** — sebuah momen tunggal yang berharga
- **Suatu waktu** — sesuatu yang pernah terjadi, yang akan selalu _pernah_ terjadi

Tone seluruh aplikasi: **puitis minimalis**. Bukan sekadar album foto, tapi arsip kehadiran.

---

## Kosakata UI

| Generik          | Satuwaktu          |
| ---------------- | ------------------ |
| Post / Postingan | Fragmen            |
| Like             | Resonansi          |
| Komentar         | Titipan Kata       |
| Upload           | Abadikan           |
| Login            | Masuk              |
| Album / Gallery  | Timeline / Chapter |

### Resonansi (3 tipe)

- `BEEN_HERE` → "pernah di sini"
- `BEING_HERE` → "sedang di sini"
- `MISS_THIS` → "rindu ini"

### Mood Fragmen (5 pilihan)

- `hangat` `sunyi` `riuh` `sendu` `terang`

---

## Akun & Auth

- Hanya **2 akun fixed** — tidak ada registrasi, tidak ada flow pendaftaran
- Akun di-seed langsung ke database saat setup awal
- Auth menggunakan **JWT + HTTP-only Cookie**
- Fragmen privat: tidak tampil sama sekali untuk publik, tidak ada jejaknya
- Fragmen publik: bisa dilihat, diresonansi, dan dititipi kata oleh siapapun (anonim)

---

## Fitur Utama

### Fragmen

- Tipe: `PHOTO` | `VIDEO` | `TEXT`
- Field: judul (opsional), caption puitis (opsional), tanggal kejadian (bisa berbeda dari tanggal upload), mood, chapter, status publik/privat
- Timestamp ditampilkan secara **puitis dan relatif** — bukan tanggal absolut
  - Contoh: "673 hari yang lalu", "di musim yang sama, dua tahun silam", "setahun yang lalu"
- Fragmen bisa di-**pin** oleh pemilik (maks 3), selalu muncul di posisi teratas bento
- Draft fragmen: bisa disimpan sebagai draft sebelum dipublikasi

### Tiga Mode Tampilan (Home Default)

1. **Home** — bento box dinamis berisi foto
2. **Timeline** — scroll vertikal kronologis dengan garis waktu
3. **Chapter** — dikelompokkan per babak kehidupan

### Resonansi

- Anonim, tidak perlu login
- Satu visitor token → satu resonansi per fragmen (anti spam)
- Tiga pilihan: BEEN_HERE / BEING_HERE / MISS_THIS

### Titipan Kata

- Komentar anonim bebas
- Placeholder: _"apa yang ingin kamu titipkan di sini?"_
- Tidak ada nama, tidak ada akun

---

## Halaman & Routing

### Public Pages

| Route             | Halaman                                      |
| ----------------- | -------------------------------------------- |
| `/`               | Landing — satu kalimat filosofis, fade masuk |
| `/ruang`          | Home (bento) + switch ke Timeline/Chapter    |
| `/fragmen/[id]`   | Detail fragmen                               |
| `/chapter/[slug]` | Detail chapter                               |
| `/tentang`        | Halaman Tentang Kami                         |

### Private Pages (pemilik)

| Route                  | Halaman                                     |
| ---------------------- | ------------------------------------------- |
| `/masuk`               | Login — tidak ada link mencolok dari publik |
| `/kelola`              | Dashboard — semua fragmen (publik + privat) |
| `/kelola/abadikan`     | Upload fragmen baru                         |
| `/kelola/fragmen/[id]` | Edit fragmen                                |
| `/kelola/chapter`      | Kelola chapter                              |

---

## Layout Halaman Utama (FINAL)

Urutan dari atas ke bawah:

1. **Navbar**
   - Kiri: logo "satuwaktu"
   - Tengah: mode pills — Home (aktif) / Timeline / Chapter
   - Kanan: "tentang kami" (teks) + ikon search + ikon gembok (akses login tersembunyi)

2. **Banner "Hari Ini Dulu"**
   - Muncul hanya jika ada fragmen di tanggal yang sama tahun-tahun sebelumnya
   - Thumbnail foto kecil + label + caption fragmen + "lihat fragmen ini →"

3. **Filter Row**
   - Label "chapter :" + pill chips per chapter (horizontal scroll)
   - Tombol "✦ bawa aku ke suatu waktu" di ujung kanan (load fragmen random)

4. **Bento Grid**
   - Hanya foto (video dan teks tidak masuk bento)
   - Layout dinamis — ukuran kotak mengikuti orientasi foto, tidak ada pattern fixed
   - Overlay on hover/tap: mood (kecil, atas) + caption (serif) + timestamp + resonansi count
   - Klik → buka detail fragmen
   - Pin indicator: titik putih kecil di pojok kanan atas fragmen yang dipin
   - Stat cells selipan di antara foto:
     - Total hari bersama (live counter + "berjalan terus")
     - Total fragmen diabadikan
     - Total resonansi dari yang singgah
   - Infinite scroll

5. **Resonansi Bar**
   - Baris di paling bawah sebelum load more
   - "jiwa yang pernah singgah di ruang kenangan ini" + total kunjungan

---

## Tech Stack

### Monorepo

- **Tool**: Turborepo
- **Package manager**: pnpm

### Struktur

```
packages/
│
├── tsconfig/               # Shared TS config (bawaan Turborepo)
│   ├── base.json
│   ├── nextjs.json
│   ├── nestjs.json
│   └── package.json
│
├── eslint-config/          # Shared ESLint (bawaan Turborepo)
│   ├── base.js
│   ├── next.js
│   ├── nestjs.js
│   ├── react-native.js
│   └── package.json
│
├── database/               # Prisma — single source of truth
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   └── index.ts        # export PrismaClient
│   └── package.json
│
├── dto/                    # Shared DTO (class-validator + class-transformer)
│   ├── src/
│   │   ├── fragmen/
│   │   ├── resonansi/
│   │   ├── titipan-kata/
│   │   ├── chapter/
│   │   ├── auth/
│   │   └── index.ts
│   └── package.json
│
├── types/                  # Shared TypeScript types & interfaces
│   ├── src/
│   │   ├── fragmen.types.ts
│   │   ├── resonansi.types.ts
│   │   ├── chapter.types.ts
│   │   ├── user.types.ts
│   │   ├── api.types.ts    # Response wrapper, Pagination, dll.
│   │   └── index.ts
│   └── package.json
│
├── constants/              # Shared constants
│   ├── src/
│   │   ├── resonansi.constants.ts
│   │   ├── mood.constants.ts
│   │   ├── fragmen.constants.ts
│   │   └── index.ts
│   └── package.json
│
└── sdk/                    # ← Ganti api-client jadi ini
    ├── src/
    │   ├── client.ts       # Axios instance (base URL, interceptors, visitor token)
    │   ├── fragmen.sdk.ts
    │   ├── resonansi.sdk.ts
    │   ├── titipan-kata.sdk.ts
    │   ├── chapter.sdk.ts
    │   ├── auth.sdk.ts
    │   ├── media.sdk.ts
    │   └── index.ts
    └── package.json
```

### Frontend (apps/web)

| Teknologi                | Kegunaan               |
| ------------------------ | ---------------------- |
| Next.js 14+ (App Router) | Framework utama        |
| Tailwind CSS             | Styling                |
| Framer Motion            | Animasi & transisi     |
| Zustand                  | State management       |
| TanStack Query           | Server state & caching |
| React Hook Form + Zod    | Form & validasi        |
| Cormorant Garamond       | Font heading/display   |
| Plus Jakarta Sans        | Font body/UI           |

**Arsitektur**: Feature-Sliced Design (FSD)

```
src/
├── app/        # Routing only
├── views/      # Per-halaman view components
├── widgets/    # Blok UI besar
├── features/   # Fitur dengan logic
├── entities/   # Domain objects
└── shared/     # Utils, base UI, hooks
```

### Backend (apps/api)

| Teknologi                           | Kegunaan                    |
| ----------------------------------- | --------------------------- |
| NestJS                              | Framework utama             |
| Prisma                              | ORM                         |
| PostgreSQL                          | Database                    |
| Multer                              | File upload (local storage) |
| JWT + HTTP-only Cookie              | Auth                        |
| class-validator + class-transformer | DTO validation              |

**Arsitektur**: Modular NestJS + Repository Pattern

```
src/
├── auth/
├── fragmen/
├── resonansi/
├── titipan-kata/
├── chapter/
├── media/
├── prisma/
└── common/     # Guards, filters, interceptors, decorators
```

### Struktur

```
packages/
│
├── tsconfig/               # Shared TS config (bawaan Turborepo)
│   ├── base.json
│   ├── nextjs.json
│   ├── nestjs.json
│   └── package.json
│
├── eslint-config/          # Shared ESLint (bawaan Turborepo)
│   ├── base.js
│   ├── next.js
│   ├── nestjs.js
│   ├── react-native.js
│   └── package.json
│
├── database/               # Prisma — single source of truth
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   └── index.ts        # export PrismaClient
│   └── package.json
│
├── dto/                    # Shared DTO (class-validator + class-transformer)
│   ├── src/
│   │   ├── fragmen/
│   │   ├── resonansi/
│   │   ├── titipan-kata/
│   │   ├── chapter/
│   │   ├── auth/
│   │   └── index.ts
│   └── package.json
│
├── types/                  # Shared TypeScript types & interfaces
│   ├── src/
│   │   ├── fragmen.types.ts
│   │   ├── resonansi.types.ts
│   │   ├── chapter.types.ts
│   │   ├── user.types.ts
│   │   ├── api.types.ts    # Response wrapper, Pagination, dll.
│   │   └── index.ts
│   └── package.json
│
├── constants/              # Shared constants
│   ├── src/
│   │   ├── resonansi.constants.ts
│   │   ├── mood.constants.ts
│   │   ├── fragmen.constants.ts
│   │   └── index.ts
│   └── package.json
│
└── sdk/                    # ← Ganti api-client jadi ini
    ├── src/
    │   ├── client.ts       # Axios instance (base URL, interceptors, visitor token)
    │   ├── fragmen.sdk.ts
    │   ├── resonansi.sdk.ts
    │   ├── titipan-kata.sdk.ts
    │   ├── chapter.sdk.ts
    │   ├── auth.sdk.ts
    │   ├── media.sdk.ts
    │   └── index.ts
    └── package.json
```

**Response format standar:**

```typescript
{
  success: boolean
  data: T
  message?: string
  meta?: { total: number; page: number; limit: number }
}
```

### Mobile (apps/mobile) — nanti

- Expo (React Native)
- Expo Router
- NativeWind (styling)
- Reanimated (animasi)
- Expo SecureStore (auth token)
- Arsitektur: FSD simplified

---

## Database Schema (Gambaran)

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String
  password  String
  fragmens  Fragmen[]
  createdAt DateTime   @default(now())
}

model Fragmen {
  id          String       @id @default(cuid())
  title       String?
  caption     String?
  type        FragmenType  // PHOTO | VIDEO | TEXT
  mood        Mood?        // HANGAT | SUNYI | RIUH | SENDU | TERANG
  takenAt     DateTime
  isPrivate   Boolean      @default(false)
  isPinned    Boolean      @default(false)
  isDraft     Boolean      @default(false)
  author      User         @relation(fields: [authorId], references: [id])
  authorId    String
  chapter     Chapter?     @relation(fields: [chapterId], references: [id])
  chapterId   String?
  media       Media[]
  resonansis  Resonansi[]
  titipanKata TitipanKata[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Media {
  id         String   @id @default(cuid())
  url        String
  mimeType   String
  size       Int
  width      Int?
  height     Int?
  fragmen    Fragmen  @relation(fields: [fragmenId], references: [id])
  fragmenId  String
}

model Chapter {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String?
  coverUrl    String?
  order       Int
  fragmens    Fragmen[]
  createdAt   DateTime  @default(now())
}

model Resonansi {
  id           String        @id @default(cuid())
  type         ResonansiType // BEEN_HERE | BEING_HERE | MISS_THIS
  fragmen      Fragmen       @relation(fields: [fragmenId], references: [id])
  fragmenId    String
  visitorToken String
  createdAt    DateTime      @default(now())

  @@unique([fragmenId, visitorToken])
}

model TitipanKata {
  id           String   @id @default(cuid())
  content      String
  fragmen      Fragmen  @relation(fields: [fragmenId], references: [id])
  fragmenId    String
  visitorToken String
  createdAt    DateTime @default(now())
}
```

---

## Infrastruktur

- **VPS**: Contabo (Singapore region) — 2 vCPU, 4GB RAM, storage besar
- **OS**: Ubuntu 22.04 LTS
- **Reverse proxy**: Nginx
- **Process manager**: PM2
- **Database**: PostgreSQL (self-hosted di VPS)
- **Media storage**: Local VPS (`/var/www/satuwaktu/uploads/`)
- **Domain**: satuwaktu.id (belum dibeli, dibeli setelah selesai)

```
VPS
├── Nginx → :3000 (Next.js) dan :4000 (NestJS)
├── PostgreSQL
├── PM2 (Next.js + NestJS)
└── /var/www/satuwaktu/uploads/
    ├── photos/
    └── videos/
```

---

## Fitur Roadmap

### Fase 1 — Launch (Juni–Juli)

- [x] Setup monorepo Turborepo
- [ ] Auth (JWT + HTTP-only cookie, 2 akun seed)
- [ ] CRUD Fragmen (foto, video, teks)
- [ ] Upload media lokal
- [ ] Bento grid home + tiga mode (Home/Timeline/Chapter)
- [ ] Detail fragmen
- [ ] Resonansi (anonim)
- [ ] Titipan Kata (anonim)
- [ ] Timestamp puitis
- [ ] Fragmen publik/privat
- [ ] Halaman Tentang Kami
- [ ] Hari Ini Dulu
- [ ] Filter by Chapter + "bawa aku ke suatu waktu"
- [ ] Fragmen dipin (maks 3)
- [ ] Stat cells (hari bersama, total fragmen, total resonansi)
- [ ] OG image untuk sharing
- [ ] Responsive mobile

### Fase 2 — Post Launch

- [ ] Draft fragmen
- [ ] Bulk upload
- [ ] Reorder fragmen dalam chapter (drag & drop)
- [ ] Cover chapter
- [ ] Statistik sederhana dashboard
- [ ] Mood filter di bento

### Fase 3 — Ekspansi

- [ ] Kapsul waktu (fragmen terjadwal)
- [ ] Soundtrack per chapter (embed Spotify/YouTube)
- [ ] Mobile app (Expo)

---

## Konvensi Kode

- Bahasa komentar & dokumentasi: **Bahasa Indonesia** (sesuai tone project)
- Nama file: `kebab-case`
- Nama komponen: `PascalCase`
- Nama variabel & fungsi: `camelCase`
- DTO selalu menggunakan `class-validator` decorator
- Semua API endpoint return format standar `{ success, data, message?, meta? }`
- Visitor token: UUID yang di-generate di frontend, disimpan di localStorage, dikirim via header `X-Visitor-Token`

---
