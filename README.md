# Applytics - Finpro SBD Group 10

Applytics merupakan sebuah platform yang dirancang untuk membantu pengguna mengelola dan memonitor seluruh proses pencarian kerja secara terstruktur dan terpusat. Sistem ini menyediakan tabel interaktif yang menyimpan berbagai informasi penting seperti nama perusahaan, posisi pekerjaan, status lamaran, tanggal aplikasi, estimasi gaji, tindakan lanjutan, kontak recruiter, website perusahaan, serta tautan portofolio atau referensi pendukung. Setiap data lamaran dapat dikelola melalui fitur tambah, ubah, hapus, pencarian, filtering, dan sorting sehingga pengguna dapat memantau progres rekrutmen dengan lebih mudah dan efisien. 

Dari sisi basis data, sistem menggunakan beberapa tabel yang saling terhubung untuk menyimpan data pengguna, perusahaan, aplikasi pekerjaan, status seleksi, dan aktivitas lanjutan. Selain berfungsi sebagai pencatat lamaran kerja, website ini juga mendukung analisis produktivitas dan statistik pencarian kerja sehingga pengguna dapat mengorganisasi proses job hunting secara lebih profesional, rapi, dan terukur.

---

## 👥 Anggota Kelompok 10

Berikut adalah anggota tim pengembang Finpro SBD - Group 10:

| No | Nama | NPM | Peran / Fokus |
|---|---|---|---|
| 1 | **Muhammad Hashif Jade** | 2406396786 | Frontend |
| 2 | **Muhammad Zaki Alkhairi** | 2406432375 | Frontend |
| 3 | **Naziehan Labieb** | 2406487102 | Backend |
| 4 | **Zulfahmi Fajri** | 2406345425 | Backend |

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- Redis
- pg
- dotenv
- cors
- nodemon

### Database
- PostgreSQL sebagai database utama
- Redis sebagai database pendukung untuk cache dashboard analytics

## Redis Caching

Redis digunakan sebagai caching layer untuk menyimpan hasil dashboard analytics dan query statistik yang sering diakses. Dengan Redis, waktu response endpoint analytics menjadi lebih cepat dan mengurangi beban query PostgreSQL.

---

## Fitur Utama

- Register dan login user
- Manajemen data perusahaan
- Manajemen data lamaran kerja
- Tracking status lamaran
- Riwayat perubahan status lamaran
- Reminder interview, follow-up, deadline, atau dokumen
- Catatan pada setiap lamaran kerja
- Filtering dan pencarian data lamaran
- Dashboard analytics
- Redis cache untuk mempercepat akses dashboard

---

## 📊 Diagram

### UML Diagram
<img src="https://i.ibb.co.com/0Rg8PBvX/Applytics-UML.png" alt="Applytics UML" border="0">

### Flowchart 
<img src="https://i.ibb.co.com/KvNQXvr/Applytics-Flowchart.png" alt="Applytics Flowchart" border="0">

### ERD Diagram
<img src="https://i.ibb.co.com/7NgWdF10/Applytics-ERD.png" alt="Applytics ERD" border="0">

---

## Setup Backend

### 1. Masuk ke folder backend

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

Jika `nodemon` belum tersedia, jalankan:

```bash
npm install -D nodemon
```

### 3. Buat file `.env`

Buat file `.env` di dalam folder `backend`.

Contoh isi file `.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password_kamu@localhost:5432/applytics
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

Contoh:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:Asuruwin18@localhost:5432/applytics
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

> Catatan: sesuaikan `password_kamu` dengan password PostgreSQL lokal.

### 4. Buat database PostgreSQL

Masuk ke PostgreSQL:

```bash
psql -U postgres
```

Buat database:

```sql
CREATE DATABASE applytics;
```

Keluar dari PostgreSQL:

```sql
\q
```

### 5. Jalankan schema database

Jika file schema berada di `backend/supabase/schema.sql`, jalankan:

```bash
psql -U postgres -d applytics -f supabase/schema.sql
```

Jika menggunakan file dump atau seed, jalankan sesuai nama file:

```bash
psql -U postgres -d applytics -f seed.sql
```

### 6. Jalankan Redis

Jika Redis berjalan secara lokal, pastikan service Redis sudah aktif.

Jika menggunakan Docker:

```bash
docker run --name applytics-redis -p 6379:6379 -d redis
```

Jika container sudah pernah dibuat, cukup jalankan:

```bash
docker start applytics-redis
```

### 7. Jalankan backend

```bash
npm run dev
```

Jika berhasil, terminal akan menampilkan:

```txt
Backend listening on port 5000
PostgreSQL connected
Redis connected
```

Backend berjalan di:

```txt
http://localhost:5000
```

---

## Setup Frontend

### 1. Masuk ke folder frontend

Dari root project:

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file environment frontend

Buat file `.env.local` di dalam folder `frontend`.

Contoh isi:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Jika frontend masih menggunakan Supabase untuk authentication atau kebutuhan lain, tambahkan environment Supabase sesuai konfigurasi project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Jalankan frontend

```bash
npm run dev
```

Frontend biasanya berjalan di:

```txt
http://localhost:3000
```

---

## Progress Report

<img src="https://i.ibb.co.com/gb40kwdw/Screenshot-2026-05-15-184535.png" alt="Screenshot 2026 05 15 184535" border="0">
<img width="811" height="733" alt="image" src="https://github.com/user-attachments/assets/7ffe05a8-8a48-4409-bc49-e315bb60fbfc" />
