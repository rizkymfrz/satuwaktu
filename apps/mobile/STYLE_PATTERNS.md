# Gaya kode `apps/mobile`

Aturan di bawah diturunkan dari file sample yang diformat manual oleh pemilik repo dan ditegakkan oleh `scripts/format.mjs`.

## Perintah

| Perintah                            | Fungsi                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm format`                       | Format semua `.ts`/`.tsx` di `src` (menulis ke disk)          |
| `pnpm format:check`                 | Hanya melaporkan file yang akan berubah, exit code 1 bila ada |
| `node scripts/format.mjs <path...>` | Cek file atau folder tertentu. Tambah `--write` untuk menulis |

Urutan kerja per file: Prettier, lalu satu pass AST (baris kosong dan urutan import), lalu Prettier lagi. Skrip memastikan hasilnya stabil (dijalankan dua kali hasilnya sama) dan hanya mengubah spasi serta urutan import, tidak pernah isi kode. File `.d.ts` dilewati.

## Prettier

Dari `.prettierrc.json` di root: titik koma, quote ganda, trailing comma `all`, lebar 80, indent 2 spasi, line ending LF. Tidak memakai plugin Tailwind, jadi urutan `className` tidak diubah.

## Import

- Berada di bagian paling atas file, tanpa baris kosong di antaranya, dan 1 baris kosong setelahnya.
- Tiga grup berurutan: package eksternal (termasuk `@tanstack/*`, `@expo-google-fonts/*`, `@rn-primitives/*`), lalu `@repo/*`, lalu alias `@/`.
- Di dalam grup, urut alfabet menurut path modul dengan `@` di depan diabaikan dan huruf besar-kecil tidak dibedakan. Path yang lebih pendek mendahului path yang diawali sama (`react` sebelum `react-native`, `screen` sebelum `screen-scroll`).
- Isi `{ }` dalam satu import: nilai dulu, urut alfabet tanpa peduli huruf besar-kecil; lalu specifier `type`, juga alfabetis. Contoh: `{ useContext, type ComponentProps, type RefAttributes }`.
- Import tanpa binding (`import "@/global.css"`) tidak dipindah. Ia menjadi pembatas, dan hanya import di antara pembatas yang diurutkan. `@/global.css` tetap di paling bawah.
- Import relatif (`./`, `../`) tidak didukung; skrip berhenti dengan pesan error. Pakai alias `@/`.
- Modul yang sama dengan `import type` dan import nilai terpisah dibiarkan pada urutan aslinya.

## Baris kosong

**Level file.** Dua statement bersebelahan rapat hanya bila jenisnya sama (`type` dengan `type`, `const` dengan `const`, atau `export { }` dengan `export type { }`) dan keduanya satu baris. Selain itu 1 baris kosong, sehingga `const`, `type`, dan fungsi multi-baris selalu diapit baris kosong. Statement jenis lain (pemanggilan fungsi, `if` di level file) dibiarkan.

**Di dalam body** (fungsi, callback, hook, `if`/`try`/`for`): tidak ada baris kosong sama sekali, termasuk sebelum `return`.

**Di dalam JSX:** tidak ada baris kosong antar elemen anak.

Dibiarkan: isi object, array, dan argumen; `switch`/`case`; isi tipe object; statement yang punya komentar di antaranya.

## Ekspor

- `export { A, B }` dan `export type { A, B }` di akhir file, tidak ada `export` inline.
- `export { }` (nilai) ditulis lebih dulu, lalu `export type { }`, rapat tanpa baris kosong di antaranya. Nilai dan tipe tidak dicampur dalam satu `export`.
- Nama di dalam `{ }` urut alfabet tanpa peduli huruf besar-kecil, tanpa memisahkan konstanta, fungsi, atau komponen (`LINE_HEIGHT, PAPER_BORDER, paperColors, TORN_AMPLITUDE`).
- Nama yang sama sebagai nilai sekaligus tipe cukup ditulis di `export { }`.
- `export default` hanya untuk file di `src/app/` (kebutuhan Expo Router).

## Urutan deklarasi (konvensi, tidak dipaksa skrip)

Import, `type`, konstanta, fungsi/komponen, lalu `export`. Skrip tidak memindahkan kode karena memindahkan deklarasi bisa mengubah perilaku.

## Lain-lain

- Tanpa komentar di kode. Formatter menghapus komentar `//` dan komentar JSX `{/* */}`. Dikecualikan agar perilaku tidak berubah: `///` (triple-slash), dan komentar yang diawali `@ts-`, `eslint-`, atau `prettier-ignore` (misalnya `// @ts-expect-error`, `// eslint-disable-next-line`). Komentar `/* */` dan `/** */` di luar JSX tidak disentuh formatter.
- Komponen berupa `function` deklaratif, bukan arrow di level file.
