# Tugas Week 10 — API Daftar Produk

Proyek mandiri API daftar produk dengan Express, Prisma ORM, dan PostgreSQL. API meneruskan contoh `Buku` dan `Pulpen` dari laporan Week 9 ke database dan menyediakan operasi CRUD.

## Persyaratan

- Node.js 20.19+, 22.12+, atau 24+
- npm
- PostgreSQL yang dapat diakses dari komputer

## Menyiapkan proyek

1. Buka terminal di folder `Week10` dan pasang dependensi:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env`, lalu sesuaikan `DATABASE_URL` dengan PostgreSQL milikmu. Contoh lokal:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/week10_products?schema=public"
   PORT=3000
   ```

   Buat database `week10_products` terlebih dahulu jika belum ada.

3. Generate Prisma Client agar seed dan server bisa memakainya:

   ```bash
   npm run prisma:generate
   ```

4. Buat tabel dari migration:

   ```bash
   npm run db:migrate
   ```

5. Masukkan data awal `Buku` dan `Pulpen` jika tabel masih kosong:

   ```bash
   npm run db:seed
   ```

6. Jalankan server:

   ```bash
   npm run dev
   ```

Server berjalan di `http://localhost:3000`. `.env` berisi kredensial database dan tidak dimasukkan ke Git.

## Endpoint

| Method | Endpoint | Sukses | Keterangan |
|---|---|---:|---|
| GET | `/products` | 200 | Mengambil array seluruh produk |
| GET | `/products/:id` | 200 | Mengambil satu produk |
| POST | `/products` | 201 | Membuat produk baru |
| PUT | `/products/:id` | 200 | Memperbarui produk berdasarkan ID |
| DELETE | `/products/:id` | 200 | Menghapus produk berdasarkan ID |

Semua endpoint memakai JSON. Jika produk tidak ditemukan, API mengembalikan status `404` dan `{ "message": "Produk tidak ditemukan" }`. Nama wajib diisi. Harga harus integer JSON dari `0` sampai `2147483647`; input yang tidak valid menghasilkan status `400`.

### POST `/products`

```json
{
  "name": "Penghapus",
  "price": 3000
}
```

Response `201` berupa objek produk, termasuk `id` yang dibuat database.

### PUT `/products/:id`

Body menyertakan `id`, `name`, dan `price`. Nilai `id` harus sama dengan ID di URL.

```json
{
  "id": 1,
  "name": "Buku edisi baru",
  "price": 18000
}
```

## Request Postman

Import [koleksi Postman](postman/week10-products.postman_collection.json). Koleksi menyediakan skenario GET sukses dan 404, POST sukses dan validasi gagal, PUT sukses dan ketidakcocokan ID, serta DELETE. Variabel `productId` dimulai dari `999999`; setelah POST, salin `id` dari response ke variabel tersebut sebelum menjalankan PUT dan DELETE yang sukses.

## Hasil Pengujian

Bagian ini berisi bukti hasil pengujian API yang dilakukan dengan Postman. Saya menjelaskannya dengan contoh sehari-hari. Bayangkan di toko ada rak berisi daftar barang. Semua proses yang kita lakukan pada API ini, seperti melihat daftar, menambah barang, mengubah harga, dan menghapus barang, sama seperti mengatur barang di rak tersebut.

Data awal dari proses seed adalah Buku dengan harga 15000 dan Pulpen dengan harga 5000. Pengujian dilakukan dengan menjalankan server di `http://localhost:3000` dan menguji setiap endpoint dengan Postman.

| No | Percobaan | Hasil yang diharapkan | Hasil yang didapat | Bukti |
|---|---|---|---|---|
| 1 | Seed data awal | Buku dan Pulpen masuk ke database | Seed berhasil: Buku dan Pulpen | <img src="images/Screenshot%202026-11-07%20101320.png" alt="Bukti seed data awal" width="700"> |
| 2 | GET `/products` | Status 200 dan daftar berisi Buku dan Pulpen | Status 200 dan daftar Buku dan Pulpen muncul | <img src="images/Screenshot%202026-11-07%20103150.png" alt="Bukti GET seluruh produk" width="700"> |
| 3 | GET `/products/1` | Status 200 dan data Buku muncul | Status 200 dan data Buku dengan id 1 muncul | <img src="images/Screenshot%202026-11-07%20105504.png" alt="Bukti GET produk id 1" width="700"> |
| 4 | GET `/products/999999` | Status 404 dan pesan Produk tidak ditemukan | Status 404 dan pesan Produk tidak ditemukan muncul | <img src="images/Screenshot%202026-11-07%20105551.png" alt="Bukti GET produk tidak ditemukan" width="700"> |
| 5 | POST `/products` dengan nama Penghapus dan harga 3000 | Status 201 dan produk baru dengan id 3 dibuat | Status 201 dan id 3 untuk Penghapus muncul | <img src="images/Screenshot%202026-11-07%20105659.png" alt="Bukti POST produk baru" width="700"> |
| 6 | PUT `/products/3` untuk mengubah nama menjadi Penghapus diperbarui dan harga menjadi 3500 | Status 200 dan data Penghapus diperbarui muncul | Status 200 dan data id 3 yang diperbarui muncul | <img src="images/Screenshot%202026-11-07%20112526.png" alt="Bukti PUT perbarui produk" width="700"> |
| 7 | DELETE `/products/3` | Status 200 dan pesan Produk berhasil dihapus | Status 200 dan pesan Produk berhasil dihapus muncul | <img src="images/Screenshot%202026-11-07%20112553.png" alt="Bukti DELETE hapus produk" width="700"> |
| 8 | GET `/products` kembali | Status 200 dan daftar hanya berisi Buku dan Pulpen | Status 200 dan daftar hanya berisi Buku dan Pulpen | <img src="images/Screenshot%202026-11-07%20112757.png" alt="Bukti GET seluruh produk setelah hapus" width="700"> |

Penjelasan setiap percobaan:

1. Seed itu ibarat menaruh contoh pertama di rak sebelum toko dibuka. Di sini contohnya adalah Buku dan Pulpen.
2. GET seluruh produk itu ibarat bertanya kepada penjaga toko. Penjaga menjawab dengan daftar semua barang yang ada di rak.
3. GET satu produk itu ibarat bertanya untuk satu barang saja dengan nomor urutnya. Di sini nomor urutnya adalah 1, dan barangnya adalah Buku.
4. GET barang yang tidak ditemukan itu ibarat bertanya nomor urut yang tidak ada di rak. Di sini nomor urutnya adalah 999999, jadi jawaban dari server adalah barang tidak ditemukan dengan status 404.
5. POST itu ibarat menitip barang baru ke toko. Barang baru di sini adalah Penghapus dengan harga 3000. Setelah dititip, toko memberikan nomor urut baru, yaitu id 3, dan statusnya 201.
6. PUT itu ibarat membetulkan tulisan pada label barang yang sudah ada di rak. Di sini barang id 3 diubah menjadi Penghapus diperbarui dengan harga 3500. Nomor urut id tidak berubah, hanya isi labelnya yang berubah.
7. DELETE itu ibarat mengambil barang dari rak supaya barang itu tidak ada lagi di daftar. Di sini barang id 3 dihapus, dan server menjawab bahwa produk berhasil dihapus.
8. GET kembali itu ibarat memeriksa rak lagi setelah barang dihapus. Hasilnya daftar hanya tinggal Buku dan Pulpen, sehingga penghapusan terbukti berhasil.

Untuk melihat isi tabel di database, perintah SQL yang dipakai adalah:

```sql
SELECT id, name, price FROM "Product" ORDER BY id;
```

Kesimpulan: semua percobaan utama berhasil. Tombol lihat semua barang, lihat satu barang, tambah barang baru, ubah barang yang sudah ada, dan hapus barang yang sudah ada semuanya berjalan dengan status dan jawaban yang sesuai dengan harapan.
