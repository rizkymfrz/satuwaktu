# AGENTS.md — `apps/mobile`

## Expo HAS CHANGED

Baca dokumentasi Expo sesuai versi SDK di `package.json` (saat ini `expo ~58`) di https://docs.expo.dev/versions/ sebelum menulis kode. Jangan mengandalkan pengetahuan versi lama.

## Stack

Expo SDK 58, React Native 0.88, React 19.3 dengan React Compiler (`experiments.reactCompiler`), Expo Router 58 dengan `typedRoutes`, TypeScript 6 (`strict`), NativeWind 4 + `@rn-primitives/*` (komponen gaya shadcn/react-native-reusables), TanStack Query 5.

Lapisan data **bukan** milik aplikasi ini. Axios, fungsi API, query key, hook query, dan hook mutation hidup di `@repo/sdk`; tipe request/response di `@repo/dto`. Aplikasi mobile tidak punya dependency `axios` dan tidak boleh menambahkannya. Tidak ada package `@repo/api-client`.

## Arsitektur

| Layer              | Lokasi                                          | Tanggung jawab                                                                                                                                                |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route              | `src/app/`                                      | Hanya komposisi route Expo Router. Satu file = `import` screen + `export default`. Tanpa logika, tanpa JSX lain.                                              |
| Layout root        | `src/app/_layout.tsx`                           | Font, splash, `AppProviders`, `Stack`, `PortalHost`, `Toaster`. Satu-satunya tempat mendaftarkan `Stack.Screen`.                                              |
| Provider           | `src/providers/app-providers.tsx`               | Urutan provider global. Provider fitur (`SessionProvider`, `SettingsProvider`) diimpor dari fitur pemiliknya.                                                 |
| Wiring API         | `src/lib/api.ts`                                | Satu-satunya tempat membuat `apiClient`, `queryClient`, `tokenStorage`, dan membaca `EXPO_PUBLIC_API_URL`.                                                    |
| Storage            | `src/lib/secure-storage.ts`                     | Pembungkus `expo-secure-store` (native) dan `localStorage` (web). Dipakai `lib/api.ts`, bukan langsung oleh UI.                                               |
| Data (API + query) | `@repo/sdk`                                     | `xxxKeys`, fungsi `getXxx`/`createXxx(http, ...)`, hook `useXxx`/`useCreateXxx`. Lihat "Integrasi data".                                                      |
| Fitur              | `src/features/<fitur>/`                         | Screen, komponen khusus fitur, hook adaptor, pemeta view ke model UI, store/context fitur.                                                                    |
| Komponen bersama   | `src/components/{layout,motion,scrapbook,map}/` | Komponen lintas fitur yang tidak tahu domain fitur manapun.                                                                                                   |
| Primitif UI        | `src/components/ui/`                            | Komponen gaya shadcn. Generik, tanpa pengetahuan domain.                                                                                                      |
| Tema               | `src/theme/`, `src/global.css`                  | Token warna, spasi, tone. `theme/palette.ts` dibuat oleh `scripts/palette.mjs` dari `global.css`.                                                             |
| Utilitas           | `src/lib/`                                      | Helper murni lintas fitur (`format` termasuk formatter tanggal/jam, `utils`, `use-debounced-value`, `screen-insets`, `scroll-lock`). Tanpa pengetahuan fitur. |
| Dev                | `src/dev/`, `src/app/showcase.tsx`              | Demo dan showcase. Bukan bagian alur produk; kode produk (termasuk `components/ui`) dilarang mengimpor `@/dev/*` (ditegakkan lint).                           |

### Batas dependensi (ditegakkan `eslint.config.mjs`)

- Fitur **leaf**: `about`, `chapters`, `fragments`, `home`, `map`, `profile`, `search`, `timeline`. Leaf tidak boleh mengimpor leaf lain.
- Fitur **core**: `archive` (model Fragment/Chapter untuk UI dan komponen yang dipakai banyak leaf), `session`, `settings`. Core tidak boleh mengimpor leaf. Leaf boleh mengimpor core.
- `components/`, `lib/`, `theme/`, `providers/` tidak boleh mengimpor leaf. `components/{layout,map,motion,scrapbook}`, `lib/`, `theme/` hanya boleh `import type` dari fitur.
- Kode yang dibutuhkan dua leaf dipindah ke core (`archive`) atau ke `components/` / `lib/`, bukan diimpor silang.
- Fitur baru yang dipakai fitur lain didaftarkan sebagai core di `eslint.config.mjs`; fitur lain didaftarkan di `LEAF_FEATURES`.

## Struktur folder fitur

```
src/features/<fitur>/
  screens/<nama>-screen.tsx     Screen penuh. Satu screen per route.
  components/<nama>.tsx         Komponen khusus fitur (subfolder bila satu keluarga: components/notes/).
  use-<nama>.ts                 Hook adaptor di atas hook @repo/sdk (state UI, validasi, pesan error).
  from-api.ts                   Pemeta View (dto) ke model UI, bila model UI memang berbeda.
  types.ts                      Tipe model UI fitur.
  <nama>.ts                     Helper murni fitur (tanpa sufiks).
  store.tsx                     Context + Provider + hook `useXxx`, hanya untuk state lintas screen.
```

Buat file hanya saat dibutuhkan. Fitur kecil boleh hanya `screens/` dan `components/`.

## Penamaan

- File dan folder: `kebab-case`. Folder fitur memakai nama domain (`fragments`, `chapters`, `session`).
- Screen: `<nama>-screen.tsx`, komponen `<Nama>Screen`. Route file memakai nama URL (`chapters.tsx`, `[id].tsx`, `(tabs)/`).
- Komponen: `PascalCase`, satu komponen utama per file, nama file = nama komponen dalam kebab-case.
- Hook: file `use-<nama>.ts`, fungsi `useNama`. Hook di dalam `store.tsx` boleh `useSession`, `useSettings`.
- Fungsi pemeta: `toXxx` (`toFragment`). Fungsi aksi diawali kata kerja.
- Konstanta: `SCREAMING_SNAKE_CASE` dengan satuan di nama (`REQUEST_TIMEOUT_MS`).
- Tipe: `PascalCase` tanpa prefix `I`. Props inline pada parameter bila pendek.
- Env publik: `EXPO_PUBLIC_*`, dibaca hanya di `lib/api.ts`, dicatat di `.env.example`.
- Teks untuk pengguna: bahasa Indonesia. Pesan `Error` internal: bahasa Inggris.
- Ekspor: `export { Nama }` (dan `export type { ... }`) di akhir file; ini pola dominan di `features`, `lib`, `providers`. `export default` hanya untuk file di `src/app/`.
- Import alias: `@/` untuk `src/`. Tanpa komentar di kode.
- Gaya: NativeWind `className`; spasi mengikuti skala `Space` (diperiksa lint). Jangan memakai namespace `React`; impor langsung dari `react`.

## Varian Button

Varian ditentukan oleh **peran aksi**, bukan selera tampilan. Pilih dengan urutan ini:

| Varian        | Peran                                                                                                                                   | Contoh                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `default`     | Aksi utama konteks (layar, kartu, atau dialog): maksimal satu per area. Juga status "aktif" pada tombol toggle.                         | Simpan, Kirim, Masuk, Pakai lokasi ini, Abadikan fragmen pertama, Like (aktif)                  |
| `secondary`   | Aksi pendukung yang mengubah atau memilih sesuatu, atau berpindah antar-item.                                                           | Edit, Sematkan, Ganti foto, Pilih lagu, Pilih di peta, Lebih lama/baru, pemilih tanggal dan jam |
| `outline`     | Kontrol netral yang tidak mengubah data: membatalkan, kembali, mencoba ulang, mengatur ulang, utilitas. Juga status "mati" pada toggle. | Batal, Kembali, Coba lagi, Reset filter, ikon Cari/Peta/Tentang, Putar/Jeda, Like (mati)        |
| `destructive` | Menghapus atau membuang data. Wajib lewat konfirmasi bila tidak bisa dibatalkan (`ConfirmDialog` dengan `destructive`).                 | Hapus fragmen, Hapus foto, Hapus lokasi, Hapus lagu                                             |
| `ghost`       | Aksi tersier tanpa bingkai dan tanpa bayangan di dalam komponen yang sudah punya aksi utama.                                            | Batal di bawah Kirim balasan                                                                    |
| `link`        | Aksi teks inline di dalam konten.                                                                                                       | Balas                                                                                           |

- Dalam satu kelompok tombol, `default` dipakai paling banyak sekali. Aksi lainnya `secondary`/`outline`.
- Jangan memakai `outline` hanya karena terlihat ringan. Bila aksi mengubah atau memilih sesuatu, pakai `secondary`.
- Tombol yang sama menurut peran harus selalu bervarian sama di semua layar (mis. semua "Coba lagi" adalah `outline`).
- Tombol ikon mengikuti peran aksinya, bukan ukurannya.

## Integrasi data (Axios + TanStack Query)

Alur: komponen → hook `@repo/sdk` → fungsi API (`http` Axios) → backend.

1. **Wiring** ada di `src/lib/api.ts`. `createApiClient` menerima `baseUrl`, `timeoutMs`, `getToken` (dari `tokenStorage`), dan `getDeviceId`. Interceptor SDK menambah `Authorization: Bearer` dan header device, serta mengubah error Axios menjadi `ApiError`.
2. **Provider** di `AppProviders`: `SafeAreaProvider` → `QueryClientProvider` → `ApiProvider` → `SessionProvider` → `SettingsProvider`. Hook SDK membaca client dari `useApiClient()`.
3. **QueryClient**: retry maksimal 2 kali dan tidak mengulang error 4xx (`isApiError`). Ubah default hanya di `lib/api.ts`.
4. **Membaca data**: pakai hook SDK langsung di screen atau hook adaptor fitur (`useChapters`). Daftar fragmen yang dipetakan ke model UI lewat `useFragmentList(filters)` (`features/archive/use-fragment-list.ts`), jangan menulis ulang `pages.flatMap(...).map(toFragment)`. Jangan menulis `useQuery` baru dengan `http` di mobile.
5. **Menulis data**: pakai hook mutation SDK (`useCreateChapter`). Invalidasi cache sudah dilakukan hook SDK; bila fitur butuh invalidasi tambahan, pakai key yang diekspor SDK (`fragmentKeys`, `archiveKeys`) lewat `useQueryClient()`.
6. **Alur imperatif di luar render** (restore sesi, login) boleh memanggil fungsi API SDK dengan `http` dari `useApiClient()` (lihat `features/session/store.tsx`).
7. **Error**: pakai `isApiError(error)` dan baca `error.status`. Terjemahkan ke pesan Indonesia di hook adaptor (lihat `use-chapter-options.ts`), bukan di komponen tampilan.
8. **Status query di UI**: `isPending` → spinner, `isError` → `QueryError` (`components/layout/query-error.tsx`), data kosong → `EmptyState`, selain itu daftar. Jangan menulis ulang blok "Tidak bisa memuat ... / Coba lagi".
9. **URL media**: gunakan `apiClient.mediaUrl(path)` di pemeta (`features/archive/from-api.ts`), bukan menggabung string.

### Autentikasi dan token

- Token hanya lewat `tokenStorage` (`lib/api.ts`) yang menyimpan di SecureStore (web: `localStorage`). Jangan memakai `AsyncStorage` atau menyimpan token di state/context.
- `SessionProvider` (`features/session/store.tsx`) memulihkan sesi pemilik dari token (`getMe`), menghapus token bila 401, dan mengosongkan `queryClient` saat masuk dan keluar. Bila pemulihan gagal karena jaringan (bukan 401), token dipertahankan dan `RestoreFailed` menampilkan tombol coba lagi, bukan melempar pemilik ke gerbang. Selama sesi pemilik aktif, 401 dari query atau mutation mana pun memicu `signOut` dan toast "Sesi berakhir".
- Peran: `owner` (login) atau `guest` (tanpa token). Perilaku berbeda per peran dibaca dari `useSession().role`.

## Aturan shared packages

- `@repo/dto`: sumber tunggal tipe `*View`, body, dan konstanta validasi (`MAX_CHAPTER_NAME_LENGTH`). Impor tipe dari sini; jangan mendefinisikan ulang bentuk response di mobile. Model UI di `features/*/types.ts` hanya untuk bentuk yang memang berbeda dari View, dengan pemeta `from-api.ts`.
- `@repo/sdk`: sumber tunggal fungsi API, query key, dan hook query/mutation. Endpoint baru atau perubahan hook dikerjakan di package ini, bukan disalin ke mobile.
- Perubahan di `packages/*` atau `apps/api` bukan bagian dari pekerjaan fitur mobile kecuali diminta.
- Dependency baru di mobile harus punya kebutuhan nyata; jangan menambahkan library yang sudah dicakup SDK, TanStack Query, atau primitif UI yang ada.

## Referensi implementasi

Fitur acuan: **`chapters`** (daftar, buat baru, detail).

| Peran                           | File                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Route tipis                     | `src/app/(tabs)/chapters.tsx`, `src/app/chapters/[id].tsx`                                            |
| Screen (query, role, 3 state)   | `src/features/chapters/screens/chapters-screen.tsx`                                                   |
| Komponen fitur                  | `src/features/chapters/components/chapter-card.tsx`, `new-chapter-card.tsx`, `new-chapter-dialog.tsx` |
| Hook adaptor + mutation + error | `src/features/archive/use-chapter-options.ts` (core karena dipakai `fragments` juga)                  |
| Hook SDK                        | `packages/sdk/src/chapters.ts` (`chapterKeys`, `listChapters`, `useChapters`, `useCreateChapter`)     |
| Komponen state error            | `src/components/layout/query-error.tsx`                                                               |
| Wiring API, token, QueryClient  | `src/lib/api.ts`, `src/lib/secure-storage.ts`, `src/providers/app-providers.tsx`                      |
| Sesi/token                      | `src/features/session/store.tsx`                                                                      |

## Ketidakkonsistenan yang diketahui

Jangan diperbaiki massal; rapikan saat menyentuh filenya.

- `features/map/components/map-error.tsx` dan `map-partial-notice.tsx` sengaja tidak memakai `QueryError`: keduanya overlay di atas peta dengan tampilan sendiri.
- `EmptyState` (`components/layout/empty-state.tsx`): kartu scrapbook dengan ikon lucide (`icon`), judul (`title`), pesan (children), tombol (`action`), dan `fill` (tengah layar), seperti `QueryError`. `compact` untuk keadaan kosong kecil di dalam halaman (ikon bulat + teks, tanpa kartu).
- Tipe ref: di RN 0.88 `ScrollView` dan `TextInput` hanya nilai. Pakai `ScrollViewInstance` / `TextInputInstance` untuk tipe ref.
- `src/components/ui/` hasil port shadcn memuat banyak komponen yang belum dipakai; jangan dianggap pola fitur.

## Formatting

Aturan format ada di `STYLE_PATTERNS.md` dan ditegakkan oleh `scripts/format.mjs` (Prettier, lalu pass AST untuk baris kosong dan urutan import). Aturan itu diturunkan dari file yang diformat manual oleh pemilik repo; jangan mengarang aturan baru dari preferensi pribadi. Setelah mengubah kode, jalankan `pnpm format`.

## Validasi

Jalankan dari `apps/mobile`:

```sh
pnpm format:check
pnpm check-types
pnpm lint:strict
pnpm test
```

Tes (vitest) hidup berdampingan dengan kodenya sebagai `*.test.ts` dan hanya untuk logika murni (`exif-location`, `group-by-month`, `lib/format`).

Jangan menjalankan build distribusi, deploy, atau commit kecuali diminta.
