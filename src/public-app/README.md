# App Publik — alumni-sipil-its.alsits.id

Ini adalah source code untuk app Base44 **terpisah** yang di-deploy di subdomain `alumni-sipil-its.alsits.id`.

## Setup

1. Buat app baru di Base44 Dashboard
2. Copy semua file dari folder `public-app/` ke app baru tersebut
3. Ganti `ALSITS_API_URL` di `src/api/alumniApi.js` dengan URL function `getPublicAlumniData` dari app ALSITS utama
4. Deploy app baru → custom domain `alumni-sipil-its.alsits.id`

## DNS di Hostinger

Masuk ke Hostinger → Domains → alsits.id → DNS Zone Editor → tambah:
- Type: CNAME
- Name: alumni-sipil-its
- Value: (URL target dari Base44, biasanya: `<app-id>.base44.app`)
- TTL: 3600