ALUR SISTEM WEBSITE PENJUALAN TIKET FESTIVAL

1. Akses Homepage
User dapat membuka website tanpa harus melakukan login atau membuat akun terlebih dahulu. Pada tahap ini user berstatus sebagai Guest. Guest dapat melihat homepage, daftar festival, mencari festival, menggunakan filter, dan melihat detail festival seperti poster, deskripsi, tanggal, lokasi, jadwal, harga tiket, dan informasi lainnya.
2. Melihat Detail Festival
Guest memilih salah satu festival untuk melihat informasi lengkap. User dapat melihat jenis tiket yang tersedia, harga, kuota, jadwal acara, lokasi, informasi organizer, FAQ, dan ketentuan festival. Pada tahap ini user masih belum diwajibkan memiliki akun.
3. Memilih untuk Membeli Tiket
Jika user tertarik membeli tiket, user menekan tombol Beli Tiket. Sistem kemudian memeriksa apakah user sudah login. Pembelian tiket merupakan fitur yang membutuhkan autentikasi.
4. Login atau Daftar Akun
Jika user belum login, sistem meminta user untuk login atau melakukan pendaftaran terlebih dahulu. User yang belum memiliki akun dapat melakukan registrasi dengan mengisi data yang diperlukan. Setelah berhasil login atau registrasi, user dapat melanjutkan proses pembelian tiket.
5. Memilih Tiket dan Checkout
User yang sudah login memilih jenis tiket dan jumlah tiket yang ingin dibeli. Sistem memeriksa ketersediaan kuota tiket, menghitung harga tiket, biaya layanan, diskon atau voucher jika tersedia, kemudian menampilkan total pembayaran kepada user.
6. Pembuatan Order
Setelah user melakukan checkout, sistem membuat order dengan nomor pesanan. Order menyimpan informasi user, tiket yang dipilih, jumlah tiket, harga, diskon, biaya layanan, pajak jika digunakan, dan total pembayaran.
7. Pembayaran
User melakukan pembayaran menggunakan metode pembayaran yang tersedia melalui payment gateway. Sistem menunggu konfirmasi pembayaran dari payment gateway. Order belum dianggap selesai sebelum pembayaran dikonfirmasi berhasil.
8. Pembayaran Berhasil
Setelah payment gateway mengonfirmasi bahwa pembayaran berhasil, backend memperbarui status pembayaran dan order menjadi berhasil atau paid. Sistem kemudian melanjutkan proses pembuatan tiket.
9. Pembuatan E-Ticket
Sistem membuat tiket digital untuk setiap tiket yang berhasil dibeli. Setiap tiket memiliki kode tiket dan QR Code yang digunakan untuk proses validasi ketika user datang ke festival. User dapat melihat tiket melalui halaman My Tickets.
10. Check-in di Festival
Pada hari festival, user menunjukkan QR Code tiket kepada petugas. Petugas melakukan scan QR Code. Sistem memeriksa apakah tiket tersedia, valid, sesuai dengan event, dan belum pernah digunakan.
11. Tiket Valid
Jika tiket valid dan belum digunakan, sistem menerima proses check-in dan mencatat waktu check-in. Status tiket kemudian berubah menjadi sudah digunakan. User diperbolehkan masuk ke area festival.
12. Tiket Tidak Valid
Jika QR Code tidak ditemukan, tiket sudah digunakan, tiket dibatalkan, atau status tiket tidak memenuhi syarat, sistem menolak proses check-in dan user tidak diperbolehkan menggunakan tiket tersebut untuk masuk.
13. Pengelolaan oleh Organizer
Organizer yang telah login dapat membuat dan mengelola festival, menentukan jenis tiket, harga, kuota, periode penjualan, informasi event, serta melihat data penjualan dan peserta untuk festival yang dikelolanya.
14. Persetujuan oleh Admin
Event yang dibuat oleh Organizer dapat diperiksa oleh Admin. Admin dapat menyetujui atau menolak event. Event yang telah disetujui dan dipublikasikan dapat ditampilkan kepada Guest dan Customer.
15. Ringkasan Alur Utama
Guest membuka Homepage → melihat festival → membuka detail festival → menekan Beli Tiket → sistem mengecek login → jika belum login, user Login/Daftar → memilih tiket → Checkout → membuat Order → melakukan Pembayaran → pembayaran dikonfirmasi berhasil → sistem membuat E-Ticket dan QR Code → user datang ke festival → QR Code di-scan petugas → sistem memvalidasi tiket → jika valid, user Check-in dan diperbolehkan masuk.
