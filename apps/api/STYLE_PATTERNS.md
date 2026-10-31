# Gaya kode `apps/api`

Aturan di bawah ditegakkan oleh `scripts/format.mjs`.

## Perintah

| Perintah                            | Fungsi                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm format`                       | Format semua file di `src` dan `test` (menulis ke disk)       |
| `pnpm format:check`                 | Hanya melaporkan file yang akan berubah, exit code 1 bila ada |
| `node scripts/format.mjs <path...>` | Cek file atau folder tertentu. Tambah `--write` untuk menulis |

Urutan kerja per file: Prettier, lalu satu pass AST (baris kosong dan urutan import), lalu Prettier lagi. Skrip memastikan hasilnya stabil (dijalankan dua kali hasilnya sama) dan hanya mengubah spasi serta urutan import, tidak pernah isi kode.

## Prettier

Dari `apps/api/.prettierrc`: single quote, trailing comma `all`. Selebihnya default Prettier: lebar 80, indent 2 spasi, titik koma, line ending LF.

## Import

- Berada di bagian paling atas file, tanpa baris kosong di antaranya, dan 1 baris kosong setelahnya.
- Urutan: paket eksternal, lalu `@repo/*`, lalu relatif.
- Paket eksternal urut alfabet menurut path modul, dengan `@` di depan diabaikan dan huruf besar-kecil tidak dibedakan (`dotenv`, `express`, `@nestjs/common`, `node:crypto`, `rxjs`, `supertest`).
- Relatif: `../` (yang lebih dalam dulu) sebelum `./`, lalu alfabet.
- Modul yang sama: `import type` di atas import nilai, dan keduanya tidak digabung.
- Specifier dalam `{}` urut alfabet tanpa peduli huruf besar-kecil, dan `type` tidak dipisahkan: `{ assertOwner, type Principal }`.
- Import tanpa binding (`import 'dotenv/config'`) tidak dipindah. Ia menjadi pembatas, dan hanya import di antara pembatas yang diurutkan.

## Baris kosong

**Level file.** Dua statement bersebelahan rapat hanya bila jenisnya sama (`type` dengan `type`, atau `const` dengan `const`) dan keduanya satu baris. Selain itu 1 baris kosong. Akibatnya const atau type multi-baris selalu diapit baris kosong. Statement jenis lain (misalnya pemanggilan fungsi di level file) dibiarkan.

**Class.** 1 baris kosong antar member. Property yang berurutan rapat, termasuk yang inisialisernya multi-baris. Property berdekorator dibiarkan apa adanya.

**Di dalam body** (fungsi, method, constructor, callback, hook, `it`): tidak ada baris kosong sama sekali. Berlaku untuk const multi-baris, `return` multi-baris, dan blok `if`/`try`/`for`.

**Body `describe`:** deklarasi (`let`/`const`) rapat satu sama lain. 1 baris kosong di sekitar tiap `describe`, `it`, dan hook.

Dibiarkan: isi object, array, dan argumen; `switch`/`case`; statement yang punya komentar di antaranya.

## Urutan deklarasi (konvensi, tidak dipaksa skrip)

Dari sample: import, `interface`, `type`, `const` satu baris (tanpa `export` dulu, lalu `export`), `const` multi-baris, fungsi, class. Skrip tidak memindahkan kode karena memindahkan deklarasi bisa mengubah perilaku.

## Lain-lain

- Tanpa komentar di kode.
- `export` inline di deklarasi, tanpa `export { ... }` di akhir file dan tanpa `export default`.
- Pesan error berbahasa Inggris, huruf kapital di awal, tanpa titik. Teks yang tampil ke pengguna (push notifikasi) berbahasa Indonesia.
