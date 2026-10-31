# AGENTS.md — `apps/api`

NestJS 12 (ESM, `module: nodenext`) di atas Prisma lewat `@repo/db`. Kontrak request/response ada di `@repo/dto`. Aturan format rinci ada di `STYLE_PATTERNS.md` dan ditegakkan oleh `scripts/format.mjs`.

## Arsitektur

- Satu folder per fitur di `src/`, berisi `*.module.ts`, `*.controller.ts`, `*.service.ts`, dan spec-nya. Module didaftarkan di `src/app.module.ts`.
- Controller hanya memetakan HTTP ke service: parameter, guard, throttle, status code. Logika bisnis dan akses database ada di service.
- Akses database selalu lewat `PrismaService.db`. Jangan membuat `PrismaClient` baru.
- Bentuk response dibuat oleh fungsi `toXxxView` dan `xxxSelect`, bukan oleh controller. Bila select atau pemeta dipakai lebih dari satu method, taruh di `<resource>.view.ts` (`fragment.view.ts`, `comment.view.ts`, `chapter.view.ts`, `account.view.ts`); selain itu boleh inline di service. Fungsi murni pembentuk input Prisma dan `where` ditaruh di `<resource>.input.ts` dan `<resource>.where.ts`; query SQL mentah di `<nama>.query.ts`.
- Tipe dan validasi request/response hidup di `@repo/dto`. Jangan menduplikasi di sini.
- Otorisasi: `PrincipalGuard` (global) mengisi `request.principal`; `@OwnerOnly()` untuk endpoint khusus pemilik; `assertOwner` untuk mempersempit tipe `Principal`.
- Lintas fitur: `common/` untuk hal generik framework (filter, pipe, interceptor), `config/` untuk konstanta aplikasi (`api.config.ts`, `archive.config.ts`) dan semua pembacaan env (`env.config.ts`), `prisma/` untuk akses data. Fitur tidak mengimpor `app.setup.ts`. Fitur lain dipakai lewat module dan service yang diekspor (contoh `NotificationsModule` mengimpor `FragmentsModule`), kecuali helper murni: `auth/*`, `fragments/fragment.view.ts`, dan `likes/voter-key.ts`.
- Satu tabel punya satu pemilik: `pushDevice` hanya disentuh `NotificationsService`. `PushService` hanya transport ke Expo dan melaporkan token basi lewat callback.
- Batas throttle (`<TOPIK>_LIMIT`) ditaruh di controller pemakainya dan diekspor bila dipakai test. Jendela waktunya selalu `THROTTLE_WINDOW_MS` dari `config/api.config.ts`.

## Penempatan file

| Jenis                    | Lokasi                                   |
| ------------------------ | ---------------------------------------- |
| Entry point              | `src/main.ts`                            |
| Konfigurasi aplikasi     | `src/app.setup.ts`                       |
| Fitur                    | `src/<fitur>/`                           |
| Helper murni fitur       | `src/<fitur>/<nama>.ts` tanpa sufiks     |
| Select dan pemeta view   | `src/<fitur>/<resource>.view.ts`         |
| Config dan konstanta app | `src/config/<nama>.config.ts`            |
| Unit test                | `src/<fitur>/<subjek>.spec.ts`           |
| E2E test                 | `test/<topik>.e2e-spec.ts`               |
| Helper test bersama      | `src/testing/` (dikecualikan dari build) |
| Skrip tooling            | `scripts/`                               |

## Penamaan

### File dan folder

- `kebab-case`. Folder fitur plural untuk koleksi resource (`fragments`, `comments`, `likes`, `chapters`, `notifications`, `settings`) dan singular untuk konsep tunggal (`auth`, `archive`, `profile`, `media`, `health`, `prisma`).
- Sufiks Nest: `.module.ts`, `.controller.ts`, `.service.ts`, `.guard.ts`, `.filter.ts`, `.decorator.ts`, `.job.ts`, `.config.ts`. Sufiks khusus fitur: `.view.ts` (record ke view), `.input.ts` (body ke data Prisma), `.where.ts` (query ke `where`), `.query.ts` (SQL mentah). Jangan memakai `.filter.ts` kecuali exception filter Nest. Satu kelas Nest utama per file; controller kedua dalam satu fitur boleh berbagi file bila routenya satu keluarga.
- Spec berdampingan dengan subjek: `<subjek>.spec.ts`. Bila satu service punya beberapa area uji, tambah kualifier: `fragments.write.spec.ts`. E2E: `<topik>.e2e-spec.ts`.

### Identifier

| Jenis                        | Aturan                                                                                                      | Contoh                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Class, interface, type, enum | `PascalCase`, tanpa prefix `I`                                                                              | `FragmentsService`, `OwnerPrincipal`, `PushContent`         |
| Module, controller, service  | `<Fitur>Module`, `<Fitur>Controller`, `<Fitur>Service`; controller tambahan `<Konteks><Resource>Controller` | `FragmentCommentsController`, `CommentRepliesController`    |
| Guard, filter, decorator     | `<Nama>Guard`, `<Nama>Filter`, `PascalCase` untuk decorator                                                 | `PrincipalGuard`, `AllExceptionsFilter`, `CurrentPrincipal` |
| DTO request                  | `<Aksi><Resource>Body` atau `<Aksi><Resource>Query` (di `@repo/dto/validation`)                             | `CreateFragmentBody`, `ListCommentsQuery`                   |
| DTO response                 | `<Resource>View`, halaman `<Resource>Page`                                                                  | `FragmentView`, `CommentPage`                               |
| Record Prisma hasil select   | `<Resource>Record`                                                                                          | `FragmentRecord`                                            |
| Fungsi, method, variabel     | `camelCase`, diawali kata kerja untuk aksi                                                                  | `listAccounts`, `registerToken`, `assertChapter`            |
| Method notifikasi            | `notify<Peristiwa>`                                                                                         | `notifyCommentAdded`, `notifyLikeAdded`, `notifyOnThisDay`  |
| Pemeta dan pembentuk         | `toXxxView`, `xxxSelect`, `xxxOf(...)`, `describeXxx`                                                       | `toFragmentView`, `voterKeyOf`, `previewOf`                 |
| Method private               | `camelCase` tanpa underscore                                                                                | `setLiked`, `buildWhere`                                    |
| Properti injeksi             | Nama pendek dari service, tanpa sufiks `Service`                                                            | `prisma`, `media`, `notifications`, `jwt`                   |
| Konstanta                    | `SCREAMING_SNAKE_CASE`, satuan di nama bila ada                                                             | `LOGIN_WINDOW_MS`, `MAX_UPLOAD_BYTES`, `MEDIA_URL_PREFIX`   |
| Konstanta throttle           | `<TOPIK>_LIMIT`, jendela bersama `THROTTLE_WINDOW_MS`                                                       | `VISIT_LIMIT`, `THROTTLE_WINDOW_MS`                         |
| Konstanta Prisma `select`    | `<RESOURCE>_SELECT`                                                                                         | `ACCOUNT_SELECT`, `REPLY_SELECT`                            |
| Boolean                      | Awalan `is`, `has`, `can`, atau kata sifat jelas                                                            | `hasMore`, `replacingPhoto`                                 |
| Parameter yang tak dipakai   | Awalan `_`                                                                                                  | `_data`                                                     |

### Env dan config

- Nama env `SCREAMING_SNAKE_CASE`: `DATABASE_URL`, `PORT`, `CORS_ORIGIN`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `UPLOAD_DIR`, `EXPO_ACCESS_TOKEN`.
- Env baru wajib ditambahkan ke `.env.example` dan ke `globalEnv` di `turbo.json`.
- `process.env` hanya dibaca di `src/config/env.config.ts` lewat fungsi bertipe (`requireJwtSecret`, `listenPort`, `corsOrigins`, `resolveUploadDir`, `expoAccessToken`). Kode lain memanggil fungsi itu, tidak membaca `process.env` langsung. Pengecualian: `import 'dotenv/config'` di `main.ts` dan test yang menyetel env.
- Segmen rute yang dipakai lebih dari satu tempat (`API_PREFIX`, `MEDIA_ROUTE`) didefinisikan sekali di `config/api.config.ts`.
- Rute memakai `kebab-case` dan prefix `v1` (`API_PREFIX`). Jangan mengganti rute, nama field JSON, nama tabel/kolom Prisma, atau nama env tanpa persetujuan eksplisit: itu kontrak eksternal.
- Field berawalan `notif*` pada settings adalah nama kolom/kontrak dan tidak diubah di sisi API.

## Kode

- Tanpa komentar di kode.
- `export` inline, tanpa `export default` dan tanpa `export { ... }` di akhir file.
- Import ESM dengan ekstensi `.js` untuk path relatif. Urutan import dan baris kosong diatur `scripts/format.mjs`.
- Pesan error berbahasa Inggris, huruf kapital di awal, tanpa titik. Teks yang tampil ke pengguna akhir (push notifikasi) berbahasa Indonesia.
- Gunakan exception bawaan Nest (`NotFoundException`, `BadRequestException`, dll). Pemetaan error Prisma ada di `AllExceptionsFilter`.
- Fire-and-forget dengan `void` hanya untuk efek samping non-kritis (notifikasi) yang menangani errornya sendiri.

## Test

- Unit test: `describe('<Subjek>')` lalu `describe('<method>')` bersarang, nama method persis sama dengan yang diuji. Helper pembuat subjek dinamai `setup`. Fixture konstan `SCREAMING_SNAKE_CASE`.
- E2E: `describe('<Topik> (e2e)')`, service dimock lewat `vi.fn()`, tanpa database nyata.
- Ubah nama method di service berarti ubah juga mock, `describe`, dan pemanggil di spec dalam perubahan yang sama.

## Validasi

Jalankan dari `apps/api`, semua harus lulus sebelum selesai:

```sh
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm test:e2e
pnpm build
```

`pnpm format` menulis perbaikan format. Di root monorepo, `pnpm format` dan `pnpm format:check` (Prettier) mencakup file non-API dan Markdown.

Jangan menjalankan deploy, restart service, atau commit sebagai bagian dari refactor kecuali diminta.
