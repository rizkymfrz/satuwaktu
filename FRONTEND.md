Halaman Final — Phase 1
Public Pages
/ — Landing

Satu kalimat filosofis di tengah layar
Animasi fade in
Auto redirect ke /ruang setelah animasi selesai (atau klik)

/ruang — Home (Default: Bento)

Navbar: logo + mode pills (Home/Timeline/Chapter) + tentang kami + search + gembok
Banner "Hari Ini Dulu" (kondisional)
Filter by chapter pills + tombol "bawa aku ke suatu waktu"
Bento grid dinamis (foto only, stat cells, overlay hover/tap, pin indicator)
Resonansi bar
Infinite scroll

/ruang?mode=timeline — Timeline

Switch dari mode pills di navbar, bukan halaman baru
Garis waktu vertikal, scroll kronologis
Tiap fragmen (foto/video/teks) tampil sebagai card
Timestamp puitis

/ruang?mode=chapter — Chapter List

Switch dari mode pills
Grid/list chapter dengan cover foto
Nama chapter, jumlah fragmen, timestamp chapter pertama

/chapter/[slug] — Detail Chapter

Header chapter: nama + deskripsi + cover
List fragmen dalam chapter (foto/video/teks)
Bisa di-scroll

/fragmen/[id] — Detail Fragmen

Media full (foto/video) atau teks
Caption serif
Timestamp puitis
Tiga tombol resonansi (BEEN_HERE / BEING_HERE / MISS_THIS) + count
Kolom titipan kata: list + form input anonim

/tentang — Tentang Kami

Satu halaman statis
Ditulis pemilik: prolog kisah, kapan mulai, satu foto ikonik
Tidak ada interaksi publik

Private Pages (Pemilik)
/masuk — Login

Form email + password
Tidak ada link mencolok dari publik (akses via ikon gembok di navbar)
Redirect ke /kelola setelah berhasil

/kelola — Dashboard

Scope Phase 1: List + Delete (Opsi A)
Tabel/grid semua fragmen (publik + privat + draft)
Filter: semua / publik / privat / draft
Info per fragmen: thumbnail, caption, chapter, mood, status, timestamp
Aksi: delete + link ke halaman edit
Tombol "Abadikan" → navigasi ke /kelola/abadikan

/kelola/abadikan — Upload Fragmen Baru

Pilih tipe: Foto / Video / Teks
Upload media (foto/video) atau textarea (teks)
Field: caption, tanggal kejadian, mood, chapter, status publik/privat/draft
Submit → redirect ke /kelola

/kelola/fragmen/[id] — Edit Fragmen

Form pre-filled dengan data fragmen
Bisa edit: caption, tanggal, mood, chapter, status, pin
Bisa ganti/hapus media
Submit → redirect ke /kelola

/kelola/chapter — Kelola Chapter

List semua chapter
Create chapter baru (nama + deskripsi)
Rename + delete chapter
Reorder via drag & drop
Set cover foto dari fragmen yang sudah ada di chapter itu

Catatan Penting
/ruang pakai query params untuk mode — bukan tiga halaman terpisah. Jadi URL-nya:
/ruang → Home (bento, default)
/ruang?mode=timeline → Timeline
/ruang?mode=chapter → Chapter list
Ini bikin mode switch tidak trigger full page reload, cukup update query param dan re-render konten.
/kelola/chapter — drag & drop — gw rekomendasiin pakai @dnd-kit/core bro, paling ringan dan well-maintained untuk React. Bukan react-beautiful-dnd yang sudah tidak aktif.

Summary Halaman
#RouteSiapaPhase1/Publik12/ruangPublik13/chapter/[slug]Publik14/fragmen/[id]Publik15/tentangPublik16/masukPemilik17/kelolaPemilik18/kelola/abadikanPemilik19/kelola/fragmen/[id]Pemilik110/kelola/chapterPemilik1
