# BAGIAN III: DIMENSI WAKTU — SIKLUS ASTRONOMI & JAM KOSMIK
## BAB 9: MODEL MATEMATIKA BRADLEY SIDEROGRAPH & KONVERSI GANN SQUARE OF 9

Dalam arsitektur makroekonomi dan mikrostruktur pasar keuangan, upaya untuk memformalkan hubungan antara mekanika benda langit (*celestial mechanics*) dan fluktuasi harga aset telah melahirkan dua instrumen kuantitatif paling legendaris pada abad ke-20: **Bradley Siderograph** yang dirumuskan oleh Donald A. Bradley (dengan nama pena Garth Allen) pada tahun 1947, serta matriks spiral kuadratik **Square of Nine** yang dikembangkan oleh William Delbert Gann. Jika bab-bab sebelumnya telah membedah siklus sinodik tunggal dan kecepatan geosentris individual, Bab 9 ini melangkah lebih jauh ke arah sintesis multivariat. Bradley Siderograph menyatukan ratusan interaksi angular planet ke dalam satu kurva gelombang potensi pasar tunggal (*composite astro-harmonic wave*), sementara metodologi Gann membangun jembatan geometris yang menyetarakan derajat bujur ekliptika (*ecliptic longitude*) dan kalender matahari dengan kuota harga pasar melalui fungsi akar kuadrat (*square root spiral*).

Bab ini mendekonstruksi kedua metode tersebut secara matematis dan algoritmik, melepaskan selubung esoteris yang sering menyelimuti literatur klasik mereka, serta menyajikannya dalam kerangka kerja *quantitative astro-finance* yang dapat diprogram, diuji secara empiris (*backtested*), dan dieksekusi pada tingkat institusional.

---

### 9.1 Dekonstruksi Algoritma Matematis Bradley Siderograph (Donald A. Bradley, 1947)

Pada tahun 1947, peneliti siklus astronomi Donald A. Bradley menerbitkan monograf seminal berjudul *Stock Market Prediction: The Planetary Barometer and How to Use It* melalui Llewellyn Publications. Tujuan Bradley bukanlah menciptakan indikator arah harga linier yang naif, melainkan merancang sebuah **barometer potensi ketegangan kolektif** (*mass-psychology tension gauge*) di mana seluruh konfigurasi aspek geosentris antarplanet dikuantifikasi menjadi satu nilai skalar harian.

#### 9.1.1 Persamaan Induk Bradley Siderograph

Secara matematis, nilai indeks Bradley Siderograph pada waktu $t$, yang dinotasikan sebagai $S(t)$, merupakan fungsi superposisi linier tertimbang dari tiga vektor komponen astronomis:

$$S(t) = M \cdot [P(t) + D(t)] + L(t)$$

Di mana setiap variabel didefinisikan secara ketat sebagai berikut:
1. **$P(t)$ (*Intermediate/Short-Term Planetary Term*)**: Penjumlahan aljabar dari intensitas aspek geosentris yang terbentuk antara pasangan planet dalam (*inner planets*: Merkurius, Venus, Mars) dan Matahari terhadap seluruh planet luar (*outer planets*: Jupiter, Saturnus, Uranus, Neptunus, Pluto), ditambah interaksi antar-planet dalam itu sendiri.
2. **$D(t)$ (*Declination Term*)**: Komponen ekuatorial yang mengukur posisi deklinasi ($\delta$) geosentris dari dua planet penggerak emosi jangka pendek terkuat dalam tradisi astro-finansial, yaitu **Venus ($\venus$)** dan **Mars ($\mars$)**.
3. **$L(t)$ (*Long-Term Planetary Term*)**: Penjumlahan aljabar tertimbang dari seluruh aspek geosentris yang terbentuk secara eksklusif di antara lima planet lambat (*outer planets*: Jupiter, Saturnus, Uranus, Neptunus, dan Pluto). Komponen ini bertindak sebagai gelombang pembawa (*carrier wave* atau *secular trend baseline*) berfrekuensi rendah.
4. **$M$ (*Multiplier Constant*)**: Konstanta pengali skalar untuk menyamakan varians amplitudo antara osilasi frekuensi tinggi ($P(t) + D(t)$) terhadap tren frekuensi rendah ($L(t)$). Dalam monograf asli tahun 1947, Bradley menetapkan nilai empiris $M = 1$ untuk perhitungan mentah standar, atau menggunakan faktor skala $M = 3.5$ hingga $M = 4.0$ ketika memplot *Siderograph* pada grafik kertas milimeter agar fluktuasi harian terlihat seimbang terhadap pergeseran lambat kurva $L(t)$. Dalam perangkat lunak algoritma modern (seperti *Financial Trader* milik siklus analis Donald Bradley dan adaptasi *Microcycles* oleh Alphee Lavoie), rasio standar yang dipertahankan adalah:

$$S_{\text{standard}}(t) = 1.0 \cdot [P(t) + D(t)] + M_L \cdot L(t)$$

Di mana bobot internal pada $L(t)$ sudah diperbesar secara proporsional (dikalikan faktor pengali $4$ atau $5$) untuk mencerminkan massa dan durasi stasioner planet luar.

---

#### 9.1.2 Fungsi Pembobotan Orb Segitiga (*Linear Decay Tent Function*)

Salah satu kontribusi kuantitatif terpenting Bradley adalah penolakannya terhadap fungsi langkah biner (*binary step function*) dalam mengevaluasi aspek astronomi. Sebuah aspek (seperti Kuadratur $90^\circ$) tidak muncul secara tiba-tiba pada jarak tepat $90.00^\circ$ dan menghilang pada $90.01^\circ$. Sebaliknya, resonansi gravitasi dan elektromagnetik mengikuti kurva atenuasi kontinu yang menyerupai fungsi tenda segitiga (*triangular tent function* atau *linear decay kernel*).

Misalkan terdapat dua benda langit $i$ dan $j$ pada waktu $t$ dengan bujur ekliptika geosentris masing-masing $\lambda_i(t)$ dan $\lambda_j(t)$. Jarak sudut terpendek (*shortest angular separation*) antara keduanya pada lingkaran ekliptika $360^\circ$, yang dinotasikan sebagai $\Delta\theta_{ij}(t) \in [0^\circ, 180^\circ]$, dihitung dengan rumus:

$$\Delta\theta_{ij}(t) = \min\left( |\lambda_i(t) - \lambda_j(t)| \pmod{360^\circ}, \; 360^\circ - \left(|\lambda_i(t) - \lambda_j(t)| \pmod{360^\circ}\right) \right)$$

Bradley membatasi perhitungannya hanya pada lima **Aspek Ptolemeus Utama (*Major Ptolemaic Aspects*)**, yaitu himpunan sudut harmonik $\Theta_{\text{aspect}} = \{0^\circ, 60^\circ, 90^\circ, 120^\circ, 180^\circ\}$. Untuk setiap aspek target $\theta_{\text{aspect}} \in \Theta_{\text{aspect}}$, deviasi sudut absolut (*orb deviation*) didefinisikan sebagai $|\Delta\theta_{ij}(t) - \theta_{\text{aspect}}|$.

Dalam model asli Bradley (1947), batas toleransi maksimum (*maximum orb*, $\text{Orb}_{\max}$) ditetapkan sebesar **$15^\circ$** untuk seluruh interaksi aspek (baik dalam komponen $P(t)$ maupun $L(t)$), dengan nilai intensitas puncak sebesar $10$ poin (atau dinormalisasi menjadi $1.0$) tepat ketika aspek mencapai keakuratan eksak ($0^\circ$ deviasi). Secara matematis, fungsi bobot intensitas ternormalisasi $w(\Delta\theta_{ij})$ dinyatakan dengan **Linear Decay Tent Function**:

$$w(\Delta\theta_{ij}) = \max\left(0, \; 1 - \frac{|\Delta\theta_{ij} - \theta_{\text{aspect}}|}{\text{Orb}_{\max}}\right)$$

Jika diekspresikan dalam skala poin numerik asli Bradley (di mana nilai maksimum pada titik eksak adalah $W_{\max} = 10$ dan $\text{Orb}_{\max} = 15^\circ$), maka persamaan intensitas mentah $I_{ij}(\Delta\theta_{ij})$ menjadi:

$$I_{ij}(\Delta\theta_{ij}) = 10 \cdot \max\left(0, \; 1 - \frac{|\Delta\theta_{ij} - \theta_{\text{aspect}}|}{15^\circ}\right) = \max\left(0, \; \frac{15^\circ - |\Delta\theta_{ij} - \theta_{\text{aspect}}|}{1.5^\circ}\right)$$

##### Sifat Matematis dan Turunan Pertama dari Fungsi Tenda Bradley
Perhatikan perilaku fungsi $w(\Delta\theta)$ di sekitar titik eksak $\Delta\theta = \theta_{\text{aspect}}$:
1. Ketika $|\Delta\theta_{ij} - \theta_{\text{aspect}}| \ge 15^\circ$, nilai $w(\Delta\theta_{ij}) = 0$. Planet belum memasuki zona resonansi efektif.
2. Ketika $|\Delta\theta_{ij} - \theta_{\text{aspect}}|$ menyusut dari $15^\circ$ menuju $0^\circ$ (*applying aspect*), nilai $w(\Delta\theta_{ij})$ meningkat secara linier dengan laju konstan sebesar $\frac{1}{15^\circ} \approx 0.0667$ per derajat (atau $0.667$ poin Bradley per derajat).
3. Tepat pada saat aspek menjadi eksak ($\Delta\theta_{ij} = \theta_{\text{aspect}}$), fungsi mencapai nilai maksimum $w = 1.0$ (atau $10$ poin). Namun, secara kalkulus, fungsi nilai mutlak $|\Delta\theta - \theta_{\text{aspect}}|$ memiliki **ketidakberlanjutan turunan pertama (*first-derivative discontinuity* atau *cusp*)** tepat di $\Delta\theta = \theta_{\text{aspect}}$. Laju perubahan $\frac{dw}{d(\Delta\theta)}$ melompat secara instan dari $+0.0667/\text{derajat}$ menjadi $-0.0667/\text{derajat}$ ketika aspek berubah dari *applying* (mendekat) menjadi *separating* (menjauh).
4. Ketidakberlanjutan gradien tepat pada titik eksak inilah yang menghasilkan **puncak-puncak tajam (*sharp spikes/pivots*)** pada grafik harian Bradley Siderograph. Dalam dinamika pasar keuangan, titik *cusp* di mana $\frac{dS(t)}{dt}$ berubah tanda secara mendadak berkorespondensi langsung dengan pelepasan ketegangan likuiditas dan pembalikan tren harga (*market trend reversals*).

---

#### 9.1.3 Tabel Bobot Valensi Aspek, Komponen $L(t)$, dan Deklinasi $D(t)$

Tidak semua aspek memiliki polaritas psikologis yang sama. Mengikuti tradisi kosmobiologi klasik dan pengamatan statistik terhadap indeks Dow Jones Industrial Average (DJIA) sejak tahun 1897, Bradley memberikan **skor valensi polaritas ($V_{\text{aspect}}$)** terhadap masing-masing dari lima aspek Ptolemeus.

##### A. Rasionalisasi Fisika-Harmonik Valensi Aspek
Mengapa sudut $60^\circ$ (*Sextile*) dan $120^\circ$ (*Trine*) diberi valensi positif ($+1$), sedangkan $90^\circ$ (*Square*) dan $180^\circ$ (*Opposition*) diberi valensi negatif ($-1$)? Penjelasannya terletak pada geometri pembagian lingkaran harmonik (*harmonic circle division* $360^\circ / n$):
- **Harmoni Segitiga ($n=3 \implies 120^\circ$ dan $n=6 \implies 60^\circ$)**: Dalam mekanika gelombang dan akustika, pembagian oleh angka $3$ menghasilkan interval konsonan yang stabil (analog dengan *perfect fifth* dalam musik). Secara astronomis, sudut $120^\circ$ dan $60^\circ$ memungkinkan sinkronisasi fase orbital tanpa menciptakan interferensi destruktif pada medan magnetosfer maupun psikologi kolektif, sehingga diasosiasikan dengan optimisme, ekspansi kredit, dan akumulasi modal (**Valensi $+1$**).
- **Ketegangan Ortogonal & Bipolar ($n=2 \implies 180^\circ$ dan $n=4 \implies 90^\circ$)**: Pembagian lingkaran oleh pangkat dua ($2^1=2, 2^2=4$) menciptakan vektor gaya yang saling berlawanan arah ($180^\circ$, tarik-menarik diametral) atau saling memotong secara tegak lurus ($90^\circ$, gesekan ortogonal maksimum). Dalam sejarah pasar, konfigurasi $90^\circ$ dan $180^\circ$ secara konsisten memicu disonansi kognitif massal, kepanikan likuiditas, dan aksi jual paksa (**Valensi $-1$**).
- **Konjungsi ($n=1 \implies 0^\circ$)**: Titik penyatuan dua siklus sinodik memiliki sifat **ambivalen** yang bergantung pada sifat intrinsik pasangan planet yang bertemu. Bradley menyusun matriks valensi khusus untuk Konjungsi ($0^\circ$) berdasarkan kombinasi spesifik dari 10 benda langit (Matahari hingga Pluto, tanpa Bulan karena pergerakan Bulan yang terlalu cepat, $\approx 13.2^\circ/\text{hari}$, akan menciptakan *noise* ekstrem pada grafik harian).

Berikut adalah **Tabel Matriks Valensi Aspek dan Konjungsi Bradley Siderograph** yang telah dibakukan:

| Kategori Interaksi / Aspek | Sudut ($\theta_{\text{aspect}}$) | Batas Orb ($\text{Orb}_{\max}$) | Skor Maksimum ($W_{\max}$) | Valensi Polaritas ($V_{ij}$) | Keterangan Kuantitatif & Dinamika Pasar |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Trine (Harmonik ke-3)** | $120^\circ$ | $15^\circ$ | $10$ | **$+1$** | Selalu positif untuk semua pasangan planet. Memicu reli konstruktif. |
| **Sextile (Harmonik ke-6)** | $60^\circ$ | $15^\circ$ | $10$ | **$+1$** | Selalu positif untuk semua pasangan planet. Mendukung pemulihan harga. |
| **Square (Harmonik ke-4)** | $90^\circ$ | $15^\circ$ | $10$ | **$-1$** | Selalu negatif untuk semua pasangan planet. Memicu tekanan korektif tajam. |
| **Opposition (Harmonik ke-2)** | $180^\circ$ | $15^\circ$ | $10$ | **$-1$** | Selalu negatif untuk semua pasangan planet. Puncak ketegangan/kulminasi. |
| **Conjunction (Harmonik ke-1)** | $0^\circ$ | $15^\circ$ | $10$ | **Variabel ($\pm 1$)** | Bergantung pada pasangan benda langit (lihat matriks sub-konjungsi di bawah). |

**Matriks Valensi Khusus Konjungsi ($0^\circ$) Antar-Planet dalam Algoritma Bradley:**
Dalam monograf 1947, Bradley mengklasifikasikan 45 kemungkinan pasangan konjungsi dari 10 benda langit ($\binom{10}{2} = 45$ pasangan) ke dalam grup konstruktif ($+1$) dan destruktif ($-1$):
1. **Konjungsi Bervalensi Positif ($V_{ij} = +1$)**: Setiap konjungsi yang melibatkan **Venus ($\venus$)** atau **Jupiter ($\jupiter$)** dengan Matahari ($\odot$), Merkurius ($\mercury$), Uranus ($\uranus$), Neptunus ($\neptune$), atau Pluto ($\pluto$), *kecuali* jika berpasangan dengan Mars ($\mars$) atau Saturnus ($\saturn$). Selain itu, konjungsi Matahari-Merkurius ($\odot\conjunction\mercury$) dan Uranus-Neptunus ($\uranus\conjunction\neptune$) diberi valensi $+1$.
2. **Konjungsi Bervalensi Negatif ($V_{ij} = -1$)**: Setiap konjungsi yang melibatkan **Mars ($\mars$)** atau **Saturnus ($\saturn$)** dengan planet mana pun (termasuk $\venus\conjunction\mars$, $\venus\conjunction\saturn$, $\jupiter\conjunction\mars$, dan $\jupiter\conjunction\saturn$), serta konjungsi yang melibatkan Pluto ($\pluto$) dengan Matahari, Merkurius, Uranus, atau Neptunus.

##### B. Formulasi Eksplisit Komponen Jangka Menengah $P(t)$ dan Jangka Panjang $L(t)$
Misalkan himpunan benda langit dibagi menjadi dua sub-himpunan yang saling lepas:
- **Planet Dalam ($\mathcal{I}$)**: $\{\text{Matahari } (\odot), \text{Merkurius } (\mercury), \text{Venus } (\venus), \text{Mars } (\mars)\}$ (4 benda langit).
- **Planet Luar ($\mathcal{O}$)**: $\{\text{Jupiter } (\jupiter), \text{Saturnus } (\saturn), \text{Uranus } (\uranus), \text{Neptunus } (\neptune), \text{Pluto } (\pluto)\}$ (5 benda langit).

Terdapat total $\binom{10}{2} = 45$ pasangan interaksi planet. Dari 45 pasangan tersebut:
- Sebanyak $\binom{5}{2} = 10$ pasangan merupakan interaksi murni antar-planet luar ($\{i, j\} \subset \mathcal{O}$). Ke-10 pasangan inilah yang menyusun komponen jangka panjang **$L(t)$**.
- Sisanya sebanyak $45 - 10 = 35$ pasangan melibatkan setidaknya satu planet dalam ($\{i, j\}$ di mana $i \in \mathcal{I}$ dan $j \in \mathcal{I} \cup \mathcal{O}$). Ke-35 pasangan inilah yang menyusun komponen jangka pendek/menengah **$P(t)$**.

Dengan demikian, persamaan eksplisit untuk $P(t)$ adalah:

$$P(t) = \sum_{\substack{i < j \\ \{i,j\} \not\subset \mathcal{O}}} \sum_{\theta_{\text{aspect}} \in \Theta} V_{ij}(\theta_{\text{aspect}}) \cdot 10 \cdot \max\left(0, \; 1 - \frac{|\Delta\theta_{ij}(t) - \theta_{\text{aspect}}|}{15^\circ}\right)$$

Sedangkan untuk komponen jangka panjang $L(t)$, karena pergerakan sudut planet luar sangat lambat (sehingga satu aspek dapat bertahan selama berbulan-bulan hingga bertahun-tahun), Bradley memberikan faktor pengali bobot massa/durasi $K_L = 4$ (atau $K_L = 5$ dalam varian tertentu) terhadap skor dasar 10 poin:

$$L(t) = K_L \cdot \sum_{\substack{i < j \\ \{i,j\} \subset \mathcal{O}}} \sum_{\theta_{\text{aspect}} \in \Theta} V_{ij}(\theta_{\text{aspect}}) \cdot 10 \cdot \max\left(0, \; 1 - \frac{|\Delta\theta_{ij}(t) - \theta_{\text{aspect}}|}{15^\circ}\right)$$

##### C. Formulasi Eksplisit Komponen Deklinasi Venus-Mars $D(t)$
Selain bujur ekliptika, Bradley menyadari bahwa kemiringan sumbu rotasi Bumi ($\epsilon \approx 23^\circ 26'$) menyebabkan variasi musiman pada sudut datang radiasi dan posisi ekuatorial planet yang diukur melalui **deklinasi ($\delta$)**. Bradley mengisolasi deklinasi geosentris dari dua planet tetangga terdekat Bumi—**Venus ($\delta_{\venus}$)** dan **Mars ($\delta_{\mars}$)**—untuk membentuk suku $D(t)$:

$$D(t) = \frac{|\delta_{\venus}(t)| \cdot \text{sgn}(\delta_{\venus}) + |\delta_{\mars}(t)| \cdot \text{sgn}(\delta_{\mars})}{C_D} \equiv \frac{\delta_{\venus}(t) + \delta_{\mars}(t)}{2}$$

Dalam pedoman komputasi praktis Bradley:
- Deklinasi Utara (*North Declination*, $\delta > 0^\circ$) diberi tanda aljabar **positif ($+$)**.
- Deklinasi Selatan (*South Declination*, $\delta < 0^\circ$) diberi tanda aljabar **negatif ($-$)**.
- Nilai derajat deklinasi Venus dan Mars (yang secara astronomis berkisar antara $-28^\circ$ hingga $+28^\circ$) dijumlahkan secara aljabar dan dibagi dengan konstanta skala $C_D = 2$ (atau digunakan langsung nilainya dalam derajat tergantung pada faktor pengali $M$). Ketika Venus dan Mars keduanya berada jauh di deklinasi Utara (misalnya $\delta_{\venus} = +24^\circ\text{ N}$ dan $\delta_{\mars} = +22^\circ\text{ N}$), suku $D(t)$ menyumbangkan dorongan positif yang signifikan terhadap kurva $P(t)$. Sebaliknya, ketika salah satu planet melintasi ekuator langit ($\delta = 0^\circ$, *celestial equator crossover*) atau mencapai titik balik deklinasi maksimum (*out-of-bounds / maximum declination*), kurva $D(t)$ mengalami infleksi halus yang memodulasi gelombang pendek.

---

#### 9.1.4 Prinsip Kunci Polarity Inversion: Mengapa Bradley adalah *Timing Gauge*

<figure class="editorial-figure">
  <div class="figure-badge">GAMBAR 9.1 • DEKONSTRUKSI ALGORITMA BRADLEY SIDEROGRAPH</div>
  <img src="assets/diagrams/fig_19_bradley_siderograph_algorithm.svg" alt="Dekonstruksi Algoritma Bradley Siderograph Fungsi Tent dan Polarity Inversion" class="zoomable-img">
  <figcaption><strong>Gambar 9.1:</strong> Anatomi model kuantitatif Bradley Siderograph: Fungsi pembobotan segitiga (<em>Orb Tent Function</em>) dengan valensi aspek, dikombinasikan menjadi kurva $S(t)$ untuk mengidentifikasi <em>Bradley Turn Dates</em> ($\frac{dS}{dt}=0$) beserta simulasi <em>In-Phase vs Polarity Inversion</em>.</figcaption>
</figure>

Kesalahan paling fatal yang sering dilakukan oleh trader ritel maupun analis kuantitatif pemula ketika menguji Bradley Siderograph secara statistik (seperti menghitung korelasi Pearson sederhana $r(\Delta \text{Price}, \Delta S(t))$) adalah mengasumsikan bahwa kurva $S(t)$ yang menanjak selalu berarti pasar saham harus naik (*bullish*), dan kurva $S(t)$ yang menurun selalu berarti pasar harus jatuh (*bearish*).

Donald Bradley sendiri telah memperingatkan secara eksplisit dalam bukunya pada tahun 1947 bahwa Siderograph bukanlah proyeksi harga, melainkan **barometer waktu (*Timing Gauge*)** yang tunduk pada fenomena **Polarity Inversion (Inversi Polaritas)**.

##### A. Definisi Matematis Titik Balik (*Inflection & Extrema Timing*)
Secara kalkulus, informasi prediktif utama dari Bradley Siderograph terletak pada **waktu terjadinya nilai ekstrem lokal (*local extrema*)**, yaitu tanggal-tanggal $t^*$ di mana turunan pertama kurva Siderograph terhadap waktu bernilai nol dan turunan keduanya tidak nol:

$$t^* = \left\{ t \;\middle|\; \frac{dS(t)}{dt} = 0 \quad \text{dan} \quad \frac{d^2S(t)}{dt^2} \neq 0 \right\}$$

Karena $S(t)$ dibangun dari fungsi nilai mutlak $|\Delta\theta(t) - \theta_{\text{aspect}}|$ yang tidak terdiferensiasi secara mulus di titik puncak aspek, kondisi ekstrem lokal pada waktu diskrit harian ($t \in \mathbb{Z}$) didefinisikan sebagai **Titik Pivot Siderograph (*Bradley Turn Date*)** jika memenuhi salah satu dari dua pertidaksamaan berikut:
1. **Puncak Siderograph (*Bradley High Pivot*)**: $S(t^*) > S(t^* - 1)$ dan $S(t^*) > S(t^* + 1)$.
2. **Lembah Siderograph (*Bradley Low Pivot*)**: $S(t^*) < S(t^* - 1)$ dan $S(t^*) < S(t^* + 1)$.

Jendela toleransi empiris (*orb of time*) untuk sebuah *Bradley Turn Date* di pasar keuangan modern adalah **$\pm 4$ hari kalender** (atau $\pm 2\text{--}3$ hari bursa perdagangan) di sekitar tanggal $t^*$. Jika terdapat gerhana (*Solar/Lunar Eclipse*) atau planet luar yang sedang stasioner (*Retrograde/Direct Station*) bertepatan dengan tanggal $t^*$, presisi waktu sering kali menyempit menjadi $\pm 1$ hari bursa.

##### B. Mekanisme *In-Phase* vs. *Inverted Phase* dan Cara Mendeteksinya
Mengapa sebuah *Bradley High Pivot* terkadang bertepatan dengan puncak pasar (*Market Top*), namun di periode lain justru bertepatan dengan titik terendah pasar (*Market Bottom*)?
Dalam fisika gelombang terkopel (*coupled oscillators*), ketika sistem eksternal (siklus kosmik $S(t)$) mendorong sistem dinamis non-linier internal (pasar modal dengan rezim likuiditas dan suku bunga tertentu), fase respons sistem internal dapat terkunci pada sudut fase $\phi = 0^\circ$ (**In-Phase / Direct Synchronization**) atau bergeser sejauh $\phi = 180^\circ$ (**Out-of-Phase / Inverted Synchronization**). Pergeseran fase $180^\circ$ ini disebut sebagai **Polarity Inversion**.

Untuk mendeteksi secara objektif apakah pasar sedang berjalan *In-Phase* atau *Inverted* terhadap Bradley Siderograph, protokol kuantitatif Astronacci menggunakan **Algoritma Deteksi Fase Jendela Bergulir (*Rolling Phase-Lock Detection*)**:

1. **Observasi Rezim Tren Sebelum Tanggal Pivot ($t - 15$ hingga $t^* - 2$)**:
   Hitung kemiringan (*slope*) regresi linier dari logaritma harga aset $\beta_P$ dan kemiringan kurva Bradley $\beta_S$ selama 10 hingga 15 hari perdagangan menjelang tanggal pivot $t^*$:
   $$\beta_P = \frac{\text{Cov}(t, \ln P_t)}{\text{Var}(t)}, \qquad \beta_S = \frac{\text{Cov}(t, S_t)}{\text{Var}(t)}$$
2. **Klasifikasi Status Fase**:
   - **Status *In-Phase* ($\text{sgn}(\beta_P) = \text{sgn}(\beta_S)$)**: Jika kurva Bradley sedang menanjak menuju puncak $t^*$ ($\beta_S > 0$) dan harga pasar juga sedang mengalami reli kuat ($\beta_P > 0$), maka pasar terkunci dalam mode **In-Phase**. Implikasinya: Puncak Bradley pada $t^*$ akan bertindak sebagai **Puncak Harga (*Market High / Resistance*)**, dan penurunan kurva Bradley setelah $t^*$ akan diikuti oleh koreksi harga turun.
   - **Status *Inverted* ($\text{sgn}(\beta_P) \neq \text{sgn}(\beta_S)$)**: Jika kurva Bradley sedang menanjak menuju puncak $t^*$ ($\beta_S > 0$), tetapi harga pasar justru sedang terjun bebas dalam aksi jual panik ($\beta_P < 0$), maka pasar sedang mengalami **Polarity Inversion**. Implikasinya: Puncak Bradley pada $t^*$ akan bertindak sebagai **Titik Terendah Harga (*Capitulation Low / Support*)**, dan ketika kurva Bradley berbalik turun setelah $t^*$, harga pasar justru akan memulai reli kenaikan yang tajam.
3. **Pemicu *Phase Flip* (*Inversion Trigger*)**:
   Inversi polaritas paling sering terjadi ketika kurva jangka pendek $P(t) + D(t)$ bergerak berlawanan arah secara ekstrem terhadap kemiringan kurva jangka panjang $L(t)$ (misalnya $\frac{dL(t)}{dt} \ll 0$ akibat kuadratur Saturnus-Uranus, sementara $P(t)$ melonjak tajam karena trine Venus-Jupiter), atau ketika sebuah *Major Turn Date* dilewati tanpa pembalikan harga akibat intervensi likuiditas bank sentral yang ekstrem (*unconventional monetary policy shock*).

---

### 9.2 Matematika Konversi W.D. Gann: Degree-to-Price & Degree-to-Time (Square of 9)

Jika Donald Bradley memetakan dimensi waktu melalui superposisi gelombang aspek, **William Delbert Gann (1878–1955)** memecahkan masalah kesetaraan antara **Ruang (Harga)** dan **Waktu (Derajat Ekliptika/Hari)** melalui geometri matriks spiral kuadratik yang dikenal sebagai **Gann Square of Nine** (atau *Master Price and Time Calculator*).

#### 9.2.1 Konstruksi Geometris Spiral Akar Kuadrat *Square of Nine*

*Square of Nine* bukanlah sekadar tabel angka mistis, melainkan representasi diskrit dari **Spiral Archimedes Kuadratik (*Quadratic Archimedean Spiral* / *Ulam-type Spiral*)** yang memetakan bilangan bulat positif $N \in \mathbb{Z}^+$ ke dalam koordinat kutub $(r, \theta)$.

```
                   180° (23 Sep - Autumnal Equinox)
                              │
             135°             │             225°
                \             │             /
                 17 ── 16 ── 15 ── 14 ── 13
                 │                        │
                 18    5 ─── 4 ─── 3     12
                 │     │           │      │
  90° ────────── 19    6     1 ─── 2     11 ────────── 270°
(21 Jun)         │     │                  │          (21 Des)
                 20    7 ─── 8 ─── 9 ── 10
                 │                        │
                 21 ── 22 ── 23 ── 24 ── 25 ── 26
                /             │             \
              45°             │             315°
                              │
                    0° / 360° (21 Mar - Vernal Equinox)
```

Perhatikan sifat matematis dari konstruksi spiral di atas (dengan orientasi putaran searah atau berlawanan arah jarum jam):
1. Angka **$1$** ditempatkan tepat di titik pusat $(r = 0)$.
2. Lingkaran (cincin persegi) pertama dimulai dari angka $2$ dan berakhir pada angka **$9 = 3^2$**, yang terdiri dari $8$ angka ($3^2 - 1^2 = 8$).
3. Cincin kedua dimulai dari angka $10$ dan berakhir pada angka **$25 = 5^2$**, yang terdiri dari $16$ angka ($5^2 - 3^2 = 16$).
4. Secara umum, cincin ke-$n$ ($n = 1, 2, 3, \dots$) berakhir tepat pada sudut diagonal kanan bawah ($315^\circ$) dengan nilai **kuadrat dari bilangan ganjil berurutan**:
   $$N_{\text{odd}}(n) = (2n + 1)^2 \quad \implies \quad 1, \; 9, \; 25, \; 49, \; 81, \; 121, \; 169, \dots$$
5. Sementara itu, tepat pada sisi diagonal yang berlawanan sejauh $180^\circ$ (sudut diagonal kiri atas, $135^\circ$), terletak barisan **kuadrat dari bilangan genap berurutan**:
   $$N_{\text{even}}(n) = (2n)^2 \quad \implies \quad 4, \; 16, \; 36, \; 64, \; 100, \; 144, \; 196, \dots$$

##### Hubungan Fundamental antara Akar Kuadrat ($\sqrt{P}$) dan Lingkaran $360^\circ$
Perhatikan bahwa untuk berpindah satu putaran penuh sebesar **$360^\circ$** dari satu kuadrat ganjil ke kuadrat ganjil berikutnya pada garis sudut yang sama (misalnya dari $9 = 3^2$ ke $25 = 5^2$, atau dari $25 = 5^2$ ke $49 = 7^2$), akar kuadrat dari angka tersebut selalu bertambah tepat sebesar **$2$**:

$$\Delta(\sqrt{N})_{360^\circ} = \sqrt{(2n+1)^2} - \sqrt{(2n-1)^2} = (2n+1) - (2n-1) = 2$$

Demikian pula, untuk berpindah setengah putaran sebesar **$180^\circ$** (dari kuadrat ganjil $(2n-1)^2$ ke kuadrat genap $(2n)^2$ di seberangnya, misalnya dari $9 = 3^2$ ke $16 = 4^2$), akar kuadrat dari angka tersebut selalu bertambah tepat sebesar **$1$**:

$$\Delta(\sqrt{N})_{180^\circ} = \sqrt{(2n)^2} - \sqrt{(2n-1)^2} = 2n - (2n-1) = 1$$

Hubungan invarian inilah yang menjadi **Hukum Fundamental Gann Square of Nine**:
> *Dalam ruang akar kuadrat ($\sqrt{P}$), satu putaran penuh lingkaran ekliptika ($360^\circ$) setara dengan penambahan atau pengurangan sebesar $2.0$ unit akar kuadrat, dan setengah putaran ($180^\circ$) setara dengan $1.0$ unit akar kuadrat.*

Secara proporsional, setiap perubahan sudut sebesar $\Delta\theta$ derajat pada lingkaran *Square of Nine* menghasilkan perubahan pada akar kuadrat harga sebesar:

$$\Delta(\sqrt{P}) = \frac{\Delta\theta}{180^\circ} = 2 \cdot \left(\frac{\Delta\theta}{360^\circ}\right)$$

---

#### 9.2.2 Formula Konversi Harga-ke-Sudut ($\text{Price} \to \theta$) dan Sudut-ke-Harga ($\theta \to \text{Price}$)

Dari hukum invarian di atas, kita dapat menurunkan sepasang persamaan analitik eksak yang memungkinkan kalkulasi instan tanpa perlu melihat tabel fisik *Square of Nine*.

##### A. Persamaan Proyeksi Sudut-ke-Harga ($\theta \to \text{Price}$)
Misalkan pasar membentuk sebuah titik balik signifikan (*major pivot low* atau *major pivot high*) pada harga awal $P_0$. Untuk memproyeksikan level *resistance* (tanda $+$) atau *support* (tanda $-$) harmonik setelah pergerakan sudut rotasi sebesar $\Delta\theta$ (misalnya $\Delta\theta \in \{45^\circ, 60^\circ, 90^\circ, 120^\circ, 180^\circ, 270^\circ, 360^\circ, 720^\circ\}$), rumus target harga $P_{\text{target}}$ adalah:

$$P_{\text{target}} = \left( \sqrt{P_0} \pm \frac{\Delta\theta}{180^\circ} \right)^2$$

Kita dapat mendefinisikan **Faktor Increment Gann ($k_\theta = \frac{\Delta\theta}{180^\circ}$)** untuk sudut-sudut harmonik utama dalam tabel referensi cepat berikut:

| Sudut Rotasi ($\Delta\theta$) | Proporsi Lingkaran ($\frac{\Delta\theta}{360^\circ}$) | Faktor Increment Akar Kuadrat ($k_\theta = \frac{\Delta\theta}{180^\circ}$) | Makna Geometri pada *Square of Nine* & Psikologi Pasar |
| :---: | :---: | :---: | :--- |
| **$22.5^\circ$** | $1/16$ | $\pm 0.125$ | Sub-harmonik *Intraday* / *Minor Scalping Pivot*. |
| **$45^\circ$** | $1/8$ | $\pm 0.250$ | **Semi-Square / Octile**: Garis *Fixed Cross* pertama; reaksi koreksi minor pertama. |
| **$60^\circ$** | $1/6$ | $\pm 0.333\dots$ | **Sextile**: Level konsolidasi harmonik segitiga. |
| **$90^\circ$** | $1/4$ | $\pm 0.500$ | **Square / Quartile**: Garis *Cardinal Cross*; *support/resistance* kuartalan yang sangat kuat. |
| **$120^\circ$** | $1/3$ | $\pm 0.666\dots$ | **Trine**: Target ekspansi gelombang impulsif (*Elliott Wave 3/5*). |
| **$135^\circ$** | $3/8$ | $\pm 0.750$ | **Sesquiquadrate**: Zona jebakan likuiditas (*false breakout zone*) sebelum $180^\circ$. |
| **$180^\circ$** | $1/2$ | $\pm 1.000$ | **Opposition**: Penyeberangan diametral; titik pembalikan tren mayor (*Major Reversal*). |
| **$225^\circ$** | $5/8$ | $\pm 1.250$ | **Rasio Fibonacci semu** ($5/8 = 0.625 \approx 0.618$); zona retracement dalam. |
| **$270^\circ$** | $3/4$ | $\pm 1.500$ | **Three-Quarter Square**: Garis *Cardinal Cross* ketiga; kelelahan tren (*trend exhaustion*). |
| **$315^\circ$** | $7/8$ | $\pm 1.750$ | Garis sudut penyelesaian cincin kuadrat ganjil. |
| **$360^\circ$** | $1$ | $\pm 2.000$ | **Full Circle / Complete Cycle**: Penyelesaian satu siklus penuh; target harga struktural. |
| **$540^\circ$** | $1.5$ | $\pm 3.000$ | Satu setengah putaran spiral; target *parabolic blow-off top*. |
| **$720^\circ$** | $2$ | $\pm 4.000$ | Dua putaran penuh spiral; target siklus *multi-year bull market*. |

##### B. Persamaan Konversi Harga-ke-Sudut Absolut ($\text{Price} \to \theta_{\text{abs}}$) dan Sudut Relatif
Sebaliknya, jika kita ingin mengetahui posisi sudut absolut $\theta_{\text{abs}} \in [0^\circ, 360^\circ)$ dari sembarang harga $P$ terhadap sumbu nol *Square of Nine*, atau menghitung selisih sudut fase $\Delta\theta$ antara dua titik harga $P_1$ dan $P_2$, kita menggunakan operasi modulo pada akar kuadratnya:

1. **Selisih Sudut Fase antara Dua Harga ($P_1 \to P_2$)**:
   $$\Delta\theta_{1 \to 2} = |\sqrt{P_2} - \sqrt{P_1}| \times 180^\circ$$
   Jika $\Delta\theta_{1 \to 2} \pmod{180^\circ} \approx 0^\circ$ atau $\Delta\theta_{1 \to 2} \pmod{90^\circ} \approx 0^\circ$, maka harga $P_2$ berada dalam resonansi kuadratik sempurna terhadap $P_1$.

2. **Posisi Sudut Absolut ($\theta_{\text{abs}}$) terhadap Sumbu Kardinal**:
   Untuk memetakan harga $P$ ke dalam koordinat sudut lingkaran $360^\circ$ (di mana kelipatan genap dari akar kuadrat bernilai $0^\circ$):
   $$\theta_{\text{abs}}(P) = \left( (\sqrt{P} \pmod 2) \times 180^\circ \right) \pmod{360^\circ}$$

##### C. Teknik Penskalaan Desimal (*Radix / Octave Scaling*)
Karena fungsi $f(P) = \sqrt{P}$ bersifat non-linier dan **tidak invarian terhadap skala perkalian sembarang** (yaitu $\sqrt{10 \cdot P} \neq 10 \cdot \sqrt{P}$ karena $\sqrt{10} \approx 3.162277$), pemilihan satuan desimal harga menjadi sangat krusial.
Pada spiral *Square of Nine*, lebar langkah persentase dari satu cincin ke cincin berikutnya adalah:

$$\frac{P_{360^\circ} - P_0}{P_0} = \frac{(\sqrt{P_0} + 2)^2 - P_0}{P_0} = \frac{4\sqrt{P_0} + 4}{P_0} \approx \frac{4}{\sqrt{P_0}}$$

Perhatikan implikasi matematis dari rasio $\frac{4}{\sqrt{P_0}}$ ini:
- Jika $P_0$ terlalu kecil (misalnya harga pasangan mata uang EUR/USD $= 1.0850$), maka satu putaran $360^\circ$ menghasilkan $(\sqrt{1.0850} + 2)^2 = 9.25$, atau lonjakan sebesar $+752\%$! Ini tidak berguna untuk perdagangan *intraday* maupun *swing*.
- Sebaliknya, jika $P_0$ terlalu besar (misalnya harga Bitcoin $\$64,000$), maka $\sqrt{64000} \approx 252.982$, sehingga perubahan $90^\circ$ ($+0.5$) hanya menghasilkan $(\sqrt{64000} + 0.5)^2 = \$64,253.23$, atau perubahan mikro sebesar $+0.395\%$ yang terlalu rapat untuk analisis *weekly swing*.

Oleh karena itu, Gann dan para praktisi kuantitatif modern menetapkan **Aturan Normalisasi Tiga-Digit (*Three-Digit Significant Normalization Rule*)**:
> *Sebelum dimasukkan ke dalam persamaan Square of Nine, setiap harga aset $P_{\text{raw}}$ harus dinormalisasi menjadi $P_0$ dengan cara mengalikan atau membaginya dengan faktor pangkat sepuluh $10^k$ ($k \in \mathbb{Z}$) sedemikian rupa sehingga $P_0$ berada di dalam **Rentang Efektif Spiral $P_0 \in [100, 1000)$** (atau $[10, 100)$ untuk sensitivitas volatilitas tinggi).*

Persamaan formal dengan penskalaan desimal adalah:

$$P_0 = P_{\text{raw}} \times 10^{-k} \quad \text{di mana } k = \lfloor \log_{10}(P_{\text{raw}}) \rfloor - 2$$

$$\hat{P}_{\text{target}} = \left( \sqrt{P_0} \pm \frac{\Delta\theta}{180^\circ} \right)^2 \quad \implies \quad P_{\text{target, actual}} = \hat{P}_{\text{target}} \times 10^k$$

**Contoh Penerapan Penskalaan Desimal Lintas Aset:**
- **Bitcoin (BTC/USD)** pada harga $\$64,000$: Dibagi $10^2 = 100$ menjadi **$P_0 = 640.0$** (rentang $100\text{--}1000$). Setelah dihitung pada basis $640$, hasilnya dikalikan kembali dengan $100$.
- **Indeks Harga Saham Gabungan (IHSG / JKSE)** pada level $7,200$: Dibagi $10^1 = 10$ menjadi **$P_0 = 720.0$** (untuk target *swing* menengah) atau dibagi $10^2 = 100$ menjadi **$P_0 = 72.0$** (untuk target struktural makro tahunan).
- **EUR/USD** pada level $1.0850$: Dikalikan $10^2 = 100$ menjadi **$P_0 = 108.50$** (untuk target *swing* ratusan pips) atau dikalikan $10^3 = 1000$ menjadi **$P_0 = 1085.0$** (untuk target *intraday* puluhan pips).
- **Emas (XAU/USD)** pada harga $\$2,400$: Dapat dihitung secara *native* pada **$P_0 = 2400$** (untuk level presisi rapat) atau dibagi $10^1 = 10$ menjadi **$P_0 = 240.0$** (untuk target *major swing*).

---

#### 9.2.3 Kalender Alami Gann (*Gann Wheel of 360° / Cardinal Cross Dates*)

Kejeniusan arsitektur *Square of Nine* terletak pada cincin terluarnya yang menyatukan spiral harga dengan **Bujur Ekliptika Matahari ($\lambda_{\odot}$)** dan **Kalender Tropis Tahunan ($365.2422$ hari)**.

Gann menolak memulai tahun analisis finansial pada tanggal 1 Januari (yang merupakan ketetapan sipil Romawi yang arbitrer secara astronomis). Sebaliknya, Gann menetapkan titik nol lingkaran waktu ($0^\circ$) tepat pada **Vernal Equinox (Ekuinoks Musim Semi, sekitar 20/21 Maret)**, yaitu momen astronomis ketika pusat piringan Matahari melintasi ekuator langit dari Selatan ke Utara pada bujur ekliptika **$\lambda_{\odot} = 0^\circ 00'\text{ Aries}$**.

Dengan membagi orbit tahunan Bumi mengelilingi Matahari menjadi **Delapan Titik Harmonik Oktagon (*The 8-Fold Solar Seasonal Cycle*)**, terbentuklah dua salib waktu utama pada *Gann Wheel*:
1. **The Cardinal Cross ($0^\circ, 90^\circ, 180^\circ, 270^\circ$)**: Empat titik balik musim astronomis utama (dua Ekuinoks dan dua Solstis).
2. **The Fixed Cross / Mid-Points ($45^\circ, 135^\circ, 225^\circ, 315^\circ$)**: Empat titik tengah musim tepat $45^\circ$ di antara titik-titik kardinal.

Berikut adalah **Tabel Kalender Alami Gann (*Solar Longitude to Calendar Date Conversion*)** secara eksak:

| Sudut Roda Gann ($\theta_{\text{wheel}}$) | Bujur Ekliptika Matahari ($\lambda_{\odot}$) | Simbol & Posisi Zodiak Tropis | Tanggal Kalender Rata-Rata ($\pm 1$ Hari) | Klasifikasi Salib Geometris | Signifikansi Historis & Siklus Likuiditas Pasar |
| :---: | :---: | :---: | :---: | :--- | :--- |
| **$0^\circ / 360^\circ$** | $0^\circ$ | $0^\circ \text{ Aries } (\aries)$ | **21 Maret** | **Cardinal Cross** (*Vernal Equinox*) | Titik Nol Tahun Astro-Finansial; awal siklus baru kuartal musim semi. |
| **$45^\circ$** | $45^\circ$ | $15^\circ \text{ Taurus } (\taurus)$ | **5 Mei** | **Fixed Cross** (*Spring Mid-Point*) | Puncak musiman musim semi (*"Sell in May and go away"* pivot). |
| **$90^\circ$** | $90^\circ$ | $0^\circ \text{ Cancer } (\cancer)$ | **21 Juni** | **Cardinal Cross** (*Summer Solstice*) | Deklinasi Utara maksimum Matahari ($+23^\circ 26'$); titik balik tengah tahun. |
| **$135^\circ$** | $135^\circ$ | $15^\circ \text{ Leo } (\leo)$ | **7 Agustus** | **Fixed Cross** (*Summer Mid-Point*) | Titik kulminasi musim panas; sering memicu krisis volatilitas Agustus. |
| **$180^\circ$** | $180^\circ$ | $0^\circ \text{ Libra } (\libra)$ | **23 September** | **Cardinal Cross** (*Autumnal Equinox*) | Penyeberangan ekuator Selatan; awal periode koreksi/kepanikan musim gugur. |
| **$225^\circ$** | $225^\circ$ | $15^\circ \text{ Scorpio } (\scorpio)$ | **7 November** | **Fixed Cross** (*Autumn Mid-Point*) | Titik akhir likuidasi pajak institusional & awal *year-end rally*. |
| **$270^\circ$** | $270^\circ$ | $0^\circ \text{ Capricorn } (\capricorn)$ | **21 Desember** | **Cardinal Cross** (*Winter Solstice*) | Deklinasi Selatan maksimum Matahari ($-23^\circ 26'$); pivot *Santa Claus Rally*. |
| **$315^\circ$** | $315^\circ$ | $15^\circ \text{ Aquarius } (\aquarius)$ | **4 Februari** | **Fixed Cross** (*Winter Mid-Point*) | Titik balik kuartal pertama pasca-rilis laporan keuangan tahunan. |

##### Anomali Kecepatan Orbital Bumi (Hukum Kedua Kepler) dalam Kalender Gann
Perlu dicatat secara astronomis bahwa karena orbit Bumi mengelilingi Matahari berbentuk elips (dengan eksentrisitas $e \approx 0.0167$), Bumi bergerak paling cepat ketika berada di sekitar *Perihelion* (awal Januari, $\approx 1.019^\circ/\text{hari}$) dan paling lambat ketika berada di sekitar *Aphelion* (awal Juli, $\approx 0.953^\circ/\text{hari}$). Akibatnya:
- Untuk menempuh sudut $180^\circ$ dari *Vernal Equinox* (21 Maret, $0^\circ$) menuju *Autumnal Equinox* (23 September, $180^\circ$), Matahari membutuhkan waktu sekitar **$186$ hari kalender**.
- Sebaliknya, untuk menempuh sudut $180^\circ$ dari *Autumnal Equinox* (23 September, $180^\circ$) kembali ke *Vernal Equinox* (21 Maret, $360^\circ$), Matahari hanya membutuhkan waktu sekitar **$179$ hari kalender**.

Oleh sebab itu, dalam implementasi kuantitatif tingkat tinggi, konversi tanggal pada *Gann Wheel* tidak boleh menggunakan interpolasi hari kalender linier yang kasar, melainkan harus membaca langsung **Bujur Ekliptika Geosentris Matahari ($\lambda_{\odot}(t)$)** dari tabel ephemeris astronomi (seperti *Swiss Ephemeris* / JPL DE440).

---

#### 9.2.4 Squaring Time and Price (*Price-Time Parity*)

<figure class="editorial-figure">
  <div class="figure-badge">GAMBAR 9.2 • GANN WHEEL 360° &amp; PRICE-TIME SQUARING PARITY</div>
  <img src="assets/diagrams/fig_20_gann_time_price_squaring.svg" alt="Gann Wheel 360 Derajat Kalender Alami dan Price Time Squaring" class="zoomable-img">
  <figcaption><strong>Gambar 9.2:</strong> Kiri: Roda kalender alami 360° W.D. Gann berporos pada <em>Vernal Equinox</em> ($0^\circ$ = 21 Maret) beserta titik kardinal &amp; ordinal. Kanan: Proyeksi vektor diagonal $1\times 1$ ($45^\circ$) yang mempertemukan konversi sudut harga $\left(\sqrt{P_0} \pm \frac{\Delta\theta}{180^\circ}
ight)^2$ dengan lintasan waktu Matahari ($\approx 0.9856^\circ/\text{hari}$).</figcaption>
</figure>

Konsep puncak dalam metodologi W.D. Gann adalah **"Squaring of Price and Time"** (Penyetaraan Harga dan Waktu). Gann menyatakan: *"When Time and Price square-out, a change in trend is inevitable."* Secara matematis, keseimbangan paritas Harga-Waktu terjadi ketika **vektor pergerakan harga ($\Delta P$ atau posisi sudut $\theta_P$) mencapai kesetaraan numerik atau keselarasan sudut dengan vektor pergerakan waktu ($\Delta t$ atau bujur Matahari $\lambda_{\odot}$)**.

Terdapat tiga metode matematis utama untuk menghitung *Price-Time Parity*:

##### Metode 1: Keselarasan Sudut Roda Gann (*Angular Alignment on the Square of Nine*)
Misalkan sebuah aset mencetak titik tertinggi atau terendah utama (*Major Pivot*) pada harga $P_0$ dan pada tanggal $t_0$ di mana Matahari berada pada bujur ekliptika $\lambda_{\odot}(t_0)$.
1. Kita memetakan harga ternormalisasi $P_0$ ke atas *Square of Nine* dan mencatat posisi sudut absolutnya $\theta_P(P_0)$:
   $$\theta_P(P_0) = \left( (\sqrt{P_0} \pmod 2) \times 180^\circ \right) \pmod{360^\circ}$$
2. **Paritas Statis (Harga terhadap Tanggal Pivot)**: Jika $\theta_P(P_0)$ membentuk sudut harmonik ($0^\circ, 90^\circ, 180^\circ, 270^\circ$) terhadap posisi sudut Matahari $\lambda_{\odot}(t_0)$ pada hari pivot tersebut, maka pivot tersebut adalah **True Harmonic Pivot** yang menandai puncak atau dasar siklus multi-tahun.
3. **Proyeksi Waktu Masa Depan (*Time Resistance from Price Angle*)**: Tanggal-tanggal di masa depan $t_{\text{future}}$ di mana bujur Matahari $\lambda_{\odot}(t_{\text{future}})$ melewati sudut $\theta_P(P_0)$, $\theta_P(P_0) \pm 90^\circ$, atau $\theta_P(P_0) + 180^\circ$ akan menjadi tanggal **Time Resistance** di mana pasar sangat rentan mengalami pembalikan arah.

##### Metode 2: Konversi Derajat Pergerakan Matahari ke Harga (*Solar Degree-to-Price Parity*)
Laju pergerakan harian rata-rata Matahari pada ekliptika (*Mean Daily Solar Motion*, $\bar{\omega}_{\odot}$) adalah:

$$\bar{\omega}_{\odot} = \frac{360^\circ}{365.24219 \text{ hari}} \approx 0.985647^\circ \text{ per hari kalender}$$

Setelah pasar bergerak selama $\Delta t$ hari kalender sejak tanggal pivot $t_0$, Matahari telah menempuh jarak sudut sebesar:

$$\Delta\lambda_{\odot}(\Delta t) = \lambda_{\odot}(t_0 + \Delta t) - \lambda_{\odot}(t_0) \approx 0.985647^\circ \times \Delta t$$

*Squaring of Price and Time* tercapai pada hari ke-$\Delta t$ apabila harga pasar $P(t_0 + \Delta t)$ memenuhi salah satu dari dua persamaan paritas berikut:
- **Paritas Linier (1 Derajat = $10^k$ Unit Harga)**:
  $$P_{\text{target}}(\Delta t) = P_0 \pm \left( \Delta\lambda_{\odot}(\Delta t) \times 10^k \right)$$
- **Paritas Spiral Kuadratik (Sudut Matahari = Sudut Spiral Square of 9)**:
  $$P_{\text{target}}(\Delta t) = \left( \sqrt{P_0} \pm \frac{\Delta\lambda_{\odot}(\Delta t)}{180^\circ} \right)^2 \times 10^k$$

##### Metode 3: *Squaring the Range* dan *Squaring the High/Low*
Jika sebuah reli atau penurunan besar memiliki rentang harga absolut $\Delta P_{\text{range}} = |P_{\text{high}} - P_{\text{low}}|$, atau memiliki harga puncak $P_{\text{high}}$ dan harga dasar $P_{\text{low}}$:
- Siklus waktu dikatakan mencapai *Square-Out* ketika jumlah hari kalender ($\Delta t_{\text{calendar}}$), hari perdagangan ($\Delta t_{\text{trading}}$), minggu, atau bulan sejak titik pivot sama dengan nilai terukur dari harga atau akar kuadratnya:
  $$\Delta t_{\text{target}} = P_0 \times 10^{-k} \quad \text{atau} \quad \Delta t_{\text{target}} = \Delta P_{\text{range}} \times 10^{-k}$$
- Dalam satuan derajat Matahari, waktu *Square-Out* terjadi ketika Matahari telah bergerak sejauh $\Delta\lambda_{\odot} = P_0 \times 10^{-k}$ derajat dari titik awalnya.

---

### 9.3 Contoh Kalkulasi Langkah-demi-Langkah (Worked Numerical Examples)

Untuk memastikan seluruh formulasi di atas dapat direplikasi secara presisi oleh analis kuantitatif, sub-bab ini menyajikan tiga simulasi numerik langkah-demi-langkah secara lengkap.

---

#### Simulasi 1: Proyeksi Level *Support* & *Resistance* Gann Square of 9 pada Bitcoin (BTC/USD) dan S&P 500

##### Kasus 1A: Proyeksi Siklus *Bull Market* dari Titik Terendah Makro Bitcoin (November 2022)
Pada tanggal **21 November 2022** (pasca-keruntuhan bursa FTX), Bitcoin (BTC/USD) mencetak titik terendah siklus makro (*Major Cycle Low*) pada harga **$P_{\text{raw}} = \$15,476.00$**. Kita akan menghitung proyeksi target *resistance* struktural menggunakan persamaan Gann Square of Nine.

**Langkah 1: Penskalaan Desimal (*Radix Scaling*)**
Harga mentah $P_{\text{raw}} = 15,476$ berada di atas $1,000$. Untuk membawanya ke dalam rentang efektif $[100, 1000)$, kita membagi $P_{\text{raw}}$ dengan faktor skala $10^2 = 100$:

$$P_0 = \frac{15,476}{100} = 154.76$$

**Langkah 2: Ekstraksi Akar Kuadrat Dasar ($\sqrt{P_0}$)**

$$\sqrt{P_0} = \sqrt{154.76} = 12.44025723$$

**Langkah 3: Kalkulasi Rotasi Harmonik Spiral ($\Delta\theta = 45^\circ, 90^\circ, 180^\circ, 360^\circ, \dots$)**
Dengan menggunakan rumus $P_{\text{target}} = \left(\sqrt{P_0} + \frac{\Delta\theta}{180^\circ}\right)^2 \times 100$:

1. **Rotasi $+45^\circ$ ($k_\theta = +0.25$)**:
   $$\hat{P}_{45^\circ} = (12.440257 + 0.25)^2 = (12.690257)^2 = 161.0426 \implies \mathbf{\$16,104.26}$$
2. **Rotasi $+90^\circ$ ($k_\theta = +0.50$)**:
   $$\hat{P}_{90^\circ} = (12.440257 + 0.50)^2 = (12.940257)^2 = 167.4503 \implies \mathbf{\$16,745.03}$$
3. **Rotasi $+180^\circ$ ($k_\theta = +1.00$)**:
   $$\hat{P}_{180^\circ} = (12.440257 + 1.00)^2 = (13.440257)^2 = 180.6405 \implies \mathbf{\$18,064.05}$$
4. **Rotasi $+360^\circ$ / Putaran Ke-1 ($k_\theta = +2.00$)**:
   $$\hat{P}_{360^\circ} = (12.440257 + 2.00)^2 = (14.440257)^2 = 208.5210 \implies \mathbf{\$20,852.10}$$
   *(Catatan Validasi Pasar: Reli impulsif pertama Bitcoin pada Januari 2023 terhenti tepat di $\$21,085$ dan berkonsolidasi selama dua minggu di area $\$20,850$!)*
5. **Rotasi $+720^\circ$ / Putaran Ke-2 ($k_\theta = +4.00$)**:
   $$\hat{P}_{720^\circ} = (12.440257 + 4.00)^2 = (16.440257)^2 = 270.2821 \implies \mathbf{\$27,028.21}$$
6. **Rotasi $+1080^\circ$ / Putaran Ke-3 ($k_\theta = +6.00$)**:
   $$\hat{P}_{1080^\circ} = (12.440257 + 6.00)^2 = (18.440257)^2 = 340.0431 \implies \mathbf{\$34,004.31}$$
7. **Rotasi $+1440^\circ$ / Putaran Ke-4 ($k_\theta = +8.00$)**:
   $$\hat{P}_{1440^\circ} = (12.440257 + 8.00)^2 = (20.440257)^2 = 417.8041 \implies \mathbf{\$41,780.41}$$
8. **Rotasi $+2520^\circ$ / Putaran Ke-7 Harmonik Septil ($k_\theta = +14.00$)**:
   $$\hat{P}_{2520^\circ} = (12.440257 + 14.00)^2 = (26.440257)^2 = 699.0872 \implies \mathbf{\$69,908.72}$$
9. **Rotasi $+2700^\circ$ / Putaran $7.5\times$ ($k_\theta = +15.00$)**:
   $$\hat{P}_{2700^\circ} = (12.440257 + 15.00)^2 = (27.440257)^2 = 752.9677 \implies \mathbf{\$75,296.77}$$
   *(Catatan Validasi Pasar: Puncak tertinggi sepanjang masa Bitcoin pada Maret 2024 sebelum *halving* tercatat di **$\$73,777$**, tepat di antara level $2610^\circ$ $[\$72,577]$ dan $2700^\circ$ $[\$75,296]$!)*

---

##### Kasus 1B: Proyeksi Level *Support* Korektif dari Puncak S&P 500 (Januari 2022)
Pada tanggal **4 Januari 2022**, indeks S&P 500 mencetak puncak historis pada level **$P_0 = 4,818.62$**. Karena kita ingin mengukur target koreksi *bear market* tahun 2022 secara presisi tanpa faktor pembagi (menggunakan nilai indeks *native* $P_0 = 4818.62$), kita menghitung rotasi pengurangan akar kuadrat ($-$):

1. **Akar Kuadrat Puncak ($\sqrt{P_0}$)**:
   $$\sqrt{4818.62} = 69.4162805$$
2. **Level Support $-90^\circ$ ($-0.50$)**:
   $$P_{-90^\circ} = (69.41628 - 0.50)^2 = (68.91628)^2 = \mathbf{4,749.45}$$
3. **Level Support $-180^\circ$ ($-1.00$)**:
   $$P_{-180^\circ} = (69.41628 - 1.00)^2 = (68.41628)^2 = \mathbf{4,680.79}$$
4. **Level Support $-360^\circ$ / 1 Putaran Penuh ($-2.00$)**:
   $$P_{-360^\circ} = (69.41628 - 2.00)^2 = (67.41628)^2 = \mathbf{4,544.95}$$
5. **Level Support $-720^\circ$ / 2 Putaran Penuh ($-4.00$)**:
   $$P_{-720^\circ} = (69.41628 - 4.00)^2 = (65.41628)^2 = \mathbf{4,279.29}$$
6. **Level Support $-1440^\circ$ / 4 Putaran Penuh ($-8.00$)**:
   $$P_{-1440^\circ} = (69.41628 - 8.00)^2 = (61.41628)^2 = \mathbf{3,771.96}$$
7. **Level Support $-1890^\circ$ / $5.25$ Putaran ($-10.50$)**:
   $$P_{-1890^\circ} = (69.41628 - 10.50)^2 = (58.91628)^2 = \mathbf{3,471.13}$$
8. **Level Support $-1867.5^\circ$ / $5.1875$ Putaran ($-10.375$)**:
   $$P_{-1867.5^\circ} = (69.41628 - 10.375)^2 = (59.04128)^2 = \mathbf{3,485.87}$$
   *(Catatan Validasi Pasar: Titik terendah absolut *bear market* S&P 500 pada **13 Oktober 2022** terjadi tepat pada level **$3,491.58$**—hanya terpaut $5.7$ poin atau $0.16\%$ dari harmonik oktaf Gann!)*

---

#### Simulasi 2: Konversi Tanggal *Swing High/Low* ke Sudut *Gann Wheel* & *Time Resistance*

Kita akan memetakan hubungan waktu dan harga antara puncak S&P 500 pada **4 Januari 2022** dan titik terendahnya pada **13 Oktober 2022**, lalu memproyeksikan tanggal *Time Resistance* berikutnya.

**Langkah 1: Menentukan Sudut Matahari ($\lambda_{\odot}$) pada Tanggal Pivot Awal ($t_0 = \text{4 Januari 2022}$)**
- Berdasarkan tabel *Swiss Ephemeris* pada tanggal 4 Januari 2022 pukul 12:00 UTC, Matahari berada pada posisi zodiak **$13^\circ 55'\text{ Capricorn}$**.
- Karena tanda Capricorn dimulai pada bujur ekliptika $270^\circ$, maka sudut absolut pada *Gann Wheel* adalah:
  $$\lambda_{\odot}(t_0) = 270^\circ + 13.917^\circ = \mathbf{283.92^\circ}$$

**Langkah 2: Menghitung Posisi Sudut Harga Puncak ($P_0 = 4818.62$) pada *Square of Nine***
- Kita ambil akar kuadrat $\sqrt{4818.62} = 69.41628$.
- Menggunakan rumus sudut absolut $\theta_P(P_0) = ((\sqrt{P_0} \pmod 2) \times 180^\circ) \pmod{360^\circ}$:
  $$69.41628 \pmod 2 = 1.41628$$
  $$\theta_P(4818.62) = 1.41628 \times 180^\circ = \mathbf{254.93^\circ}$$
- Jika menggunakan penskalaan desimal $P_0 = 481.862$:
  $$\sqrt{481.862} = 21.951355 \implies 21.951355 \pmod 2 = 1.951355 \implies \theta_P = 1.951355 \times 180^\circ = \mathbf{351.24^\circ}$$

**Langkah 3: Menghitung Proyeksi Tanggal *Time Resistance* dari Sudut Matahari ($\lambda_{\odot}(t_0) = 283.92^\circ$)**
Titik balik waktu utama berikutnya akan terjadi ketika Matahari bergerak membentuk sudut harmonik $+90^\circ, +180^\circ, +270^\circ$, dan $+276^\circ$ (harmonik kuadratik terhadap sudut harga $254.93^\circ$) dari posisi awalnya $283.92^\circ$:

1. **Rotasi Matahari $+90^\circ$ (*First Square in Time*)**:
   $$\lambda_{\text{target}, 1} = (283.92^\circ + 90^\circ) \pmod{360^\circ} = 373.92^\circ - 360^\circ = \mathbf{13.92^\circ} \quad (13^\circ 55'\text{ Aries})$$
   - *Konversi Ephemeris ke Tanggal*: Matahari mencapai $13^\circ 55'\text{ Aries}$ pada tanggal **3 April 2022**.
   - *Validasi Pasar*: Setelah kejatuhan kuartal pertama, S&P 500 mencetak puncak *bear market rally* (*Lower High* besar pertama) pada tanggal **29 Maret – 4 April 2022** di level $4,637$, tepat sebelum terjun bebas sebesar $-21\%$ menuju bulan Juni!

2. **Rotasi Matahari $+180^\circ$ (*Opposition in Time*)**:
   $$\lambda_{\text{target}, 2} = (283.92^\circ + 180^\circ) \pmod{360^\circ} = \mathbf{103.92^\circ} \quad (13^\circ 55'\text{ Cancer})$$
   - *Konversi Ephemeris ke Tanggal*: Matahari mencapai $13^\circ 55'\text{ Cancer}$ pada tanggal **5–6 Juli 2022**.

3. **Rotasi Matahari menuju Sudut Kuadratik Harga ($\theta_P = 254.93^\circ$)**:
   - Sudut kuadratik ($-90^\circ$) dari sudut harga puncak $254.93^\circ$ adalah:
     $$\lambda_{\text{price-square}} = 254.93^\circ - 90^\circ = \mathbf{164.93^\circ} \quad (14^\circ 56'\text{ Virgo})$$
   - Sudut semi-kuadratik ($-45^\circ$) dari sudut harga puncak $254.93^\circ$ adalah:
     $$\lambda_{\text{price-semisquare}} = 254.93^\circ - 45^\circ = \mathbf{209.93^\circ} \quad (29^\circ 56'\text{ Libra})$$
   - Sementara itu, jika kita menghitung jarak sudut Matahari dari puncak **4 Januari 2022** ($\lambda_{\odot} = 283.92^\circ$) menuju dasar pasar pada **13 Oktober 2022**:
     - Pada tanggal **13 Oktober 2022**, jumlah hari kalender yang telah berlalu adalah **$\Delta t = 282$ hari**.
     - Posisi bujur Matahari pada 13 Oktober 2022 adalah **$200.15^\circ$ ($20^\circ 09'\text{ Libra}$)**.
     - Total pergerakan sudut Matahari dari puncak ke lembah adalah:
       $$\Delta\lambda_{\odot} = (360^\circ - 283.92^\circ) + 200.15^\circ = 76.08^\circ + 200.15^\circ = \mathbf{276.23^\circ}$$
     - Perhatikan bahwa **$276.23^\circ \approx 270^\circ$ (*Three-Quarter Solar Circle / $270^\circ$ Time Square*)** dengan deviasi hanya $6^\circ$, dan jumlah hari kalender **$282$ hari** berada tepat dalam resonansi numerik dengan posisi derajat awal Matahari pada puncak 4 Januari (**$283.9^\circ$**)! Ini adalah manifestasi sempurna dari *Squaring Price and Time* di mana jumlah hari kalender ($\Delta t = 282$) menyamai derajat ekliptika titik awal ($\lambda_0 = 283.9^\circ$).

---

#### Simulasi 3: Kalkulasi Eksplisit Nilai Harian Bradley Siderograph $S(t)$

Sebagai demonstrasi komputasi mikro, mari kita hitung kontribusi sebagian komponen Bradley Siderograph pada tanggal titik balik legendar