/* ==========================================================================
   ASTRONACCI INTERACTIVE SIMULATIONS
   1. Lunar Orbit & Behavioral Market Sentiment Clock
   2. Fractal Fibonacci Price Geometry & Golden Pocket
   ========================================================================== */

window.AstronacciSim = (function() {
  // --- 1. Lunar Orbit Simulation ---
  const lunarCanvas = document.getElementById('lunarCanvas');
  const lunarCtx = lunarCanvas ? lunarCanvas.getContext('2d') : null;
  const angleSlider = document.getElementById('lunarAngleSlider');
  const angleValSpan = document.getElementById('lunarAngleVal');
  const phaseNameEl = document.getElementById('lunarPhaseName');
  const behaviorDescEl = document.getElementById('lunarBehaviorDesc');

  let currentLunarAngle = 0; // degrees

  const phases = [
    { maxDeg: 22.5, name: "New Moon (Bulan Baru)", bias: "Akumulasi Institusi / Local Bottom Reversal", neuro: "Penurunan sekresi melatonin, pemulihan selera risiko (Risk-On)." },
    { maxDeg: 67.5, name: "Waxing Crescent (Sabit Awal)", bias: "Ekspansi Volume Bertahap / Awal Impulsif", neuro: "Sentimen optimisme bertumbuh stabil." },
    { maxDeg: 112.5, name: "First Quarter (Kuartal Pertama / 90° Square)", bias: "Friksi Volatilitas / Retest Support Minor", neuro: "Ragu-ragu, pengujian keyakinan pasar." },
    { maxDeg: 157.5, name: "Waxing Gibbous (Cembung Membesar)", bias: "Akselerasi Tren Naik / Fase FOMO Ritel", neuro: "Peningkatan dopamin & euforia spekulasi." },
    { maxDeg: 202.5, name: "Full Moon (Bulan Purnama / 180° Opposition)", bias: "Klimaks Euforia / Local Exhaustion Top Reversal", neuro: "Puncak melatonin & aversi risiko mendadak, potensi aksi jual masif." },
    { maxDeg: 247.5, name: "Waning Gibbous (Cembung Menyusut)", bias: "Distribusi Smart Money / Awal Koreksi Tajam", neuro: "Kepanikan tersembunyi & likuidasi bertahap." },
    { maxDeg: 292.5, name: "Last Quarter (Kuartal Terakhir / 270° Square)", bias: "Kapitulasi Sisa Buyer / Rebound Semu (Dead Cat)", neuro: "Keputusasaan ritel & penyerapan likuiditas oleh institusi." },
    { maxDeg: 337.5, name: "Waning Crescent (Sabit Akhir)", bias: "Fase Exhaustion Bearish / Pengurangan Volatilitas", neuro: "Apatis total, pasar sunyi bersiap menyambut New Moon." },
    { maxDeg: 360, name: "New Moon (Bulan Baru)", bias: "Akumulasi Institusi / Local Bottom Reversal", neuro: "Siklus baru dimulai." }
  ];

  function getPhaseInfo(deg) {
    const d = deg % 360;
    for (let p of phases) {
      if (d <= p.maxDeg) return p;
    }
    return phases[0];
  }

  function drawLunar() {
    if (!lunarCtx) return;
    const w = lunarCanvas.width;
    const h = lunarCanvas.height;
    lunarCtx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const orbitR = 105;

    // Draw Space Grid Background
    lunarCtx.strokeStyle = "rgba(30, 40, 61, 0.4)";
    lunarCtx.lineWidth = 1;
    lunarCtx.beginPath();
    lunarCtx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    lunarCtx.stroke();

    // Crosshairs
    lunarCtx.setLineDash([4, 4]);
    lunarCtx.beginPath();
    lunarCtx.moveTo(cx - orbitR - 30, cy);
    lunarCtx.lineTo(cx + orbitR + 30, cy);
    lunarCtx.moveTo(cx, cy - orbitR - 30);
    lunarCtx.lineTo(cx, cy + orbitR + 30);
    lunarCtx.stroke();
    lunarCtx.setLineDash([]);

    // Sunlight Rays Indicator (From the Left)
    lunarCtx.fillStyle = "#FFD700";
    lunarCtx.font = "10px JetBrains Mono";
    lunarCtx.fillText("☀ SINAR MATAHARI (0° INGRESS)", 15, 25);
    lunarCtx.strokeStyle = "rgba(255, 215, 0, 0.3)";
    lunarCtx.beginPath();
    for (let i = 0; i < 4; i++) {
      let yOffset = 40 + i * 20;
      lunarCtx.moveTo(15, yOffset);
      lunarCtx.lineTo(60, yOffset);
    }
    lunarCtx.stroke();

    // Central Earth
    lunarCtx.beginPath();
    lunarCtx.arc(cx, cy, 24, 0, Math.PI * 2);
    lunarCtx.fillStyle = "#1e3a8a";
    lunarCtx.fill();
    lunarCtx.strokeStyle = "#60a5fa";
    lunarCtx.lineWidth = 2;
    lunarCtx.stroke();

    // Earth label
    lunarCtx.fillStyle = "#e2e8f0";
    lunarCtx.font = "10px Inter";
    lunarCtx.textAlign = "center";
    lunarCtx.fillText("BUMI", cx, cy + 4);

    // Moon Position
    const rad = (currentLunarAngle * Math.PI) / 180;
    // 0 deg = Left (closest to sunlight = New Moon between Sun and Earth)
    const moonX = cx - Math.cos(rad) * orbitR;
    const moonY = cy - Math.sin(rad) * orbitR;

    // Vector Ray from Earth to Moon
    lunarCtx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    lunarCtx.lineWidth = 1.5;
    lunarCtx.beginPath();
    lunarCtx.moveTo(cx, cy);
    lunarCtx.lineTo(moonX, moonY);
    lunarCtx.stroke();

    // Moon Body
    lunarCtx.beginPath();
    lunarCtx.arc(moonX, moonY, 14, 0, Math.PI * 2);
    lunarCtx.fillStyle = "#334155";
    lunarCtx.fill();

    // Illuminated Crescent / Half Moon
    lunarCtx.beginPath();
    lunarCtx.arc(moonX, moonY, 14, Math.PI * 0.5, Math.PI * 1.5);
    lunarCtx.fillStyle = "#f8fafc";
    lunarCtx.fill();

    lunarCtx.strokeStyle = "#d4af37";
    lunarCtx.lineWidth = 2;
    lunarCtx.stroke();

    // Angle Badge
    lunarCtx.fillStyle = "#00f0ff";
    lunarCtx.font = "11px JetBrains Mono";
    lunarCtx.fillText(currentLunarAngle + "°", moonX, moonY - 20);
  }

  function updateLunar(deg) {
    currentLunarAngle = deg;
    if (angleSlider) angleSlider.value = deg;
    if (angleValSpan) angleValSpan.textContent = deg;
    const info = getPhaseInfo(deg);
    if (phaseNameEl) phaseNameEl.textContent = info.name;
    if (behaviorDescEl) {
      behaviorDescEl.innerHTML = `• <strong>Bias Perilaku Pasar</strong>: ${info.bias}<br>• <strong>Korelasi Neurokimia</strong>: ${info.neuro}`;
    }
    drawLunar();
  }

  // --- 2. Fibonacci Price Geometry Simulation ---
  const fibCanvas = document.getElementById('fibCanvas');
  const fibCtx = fibCanvas ? fibCanvas.getContext('2d') : null;
  const fibLowSlider = document.getElementById('fibSwingLow');
  const fibHighSlider = document.getElementById('fibSwingHigh');
  const fibLowValSpan = document.getElementById('fibSwingLowVal');
  const fibHighValSpan = document.getElementById('fibSwingHighVal');
  const gpRangeSpan = document.getElementById('goldenPocketRange');
  const ext1618Span = document.getElementById('fibExt1618');

  let swingLow = 20000;
  let swingHigh = 60000;

  const fibLevels = [
    { ratio: 0.0, label: "0.000 (High)", color: "#94a3b8" },
    { ratio: 0.236, label: "0.236", color: "#64748b" },
    { ratio: 0.382, label: "0.382 (Shallow Dip)", color: "#38bdf8" },
    { ratio: 0.500, label: "0.500 (Equilibrium)", color: "#e2e8f0" },
    { ratio: 0.618, label: "0.618 (Golden Ratio)", color: "#d4af37", isGP: true },
    { ratio: 0.650, label: "0.650 (Harmonic Base)", color: "#f59e0b", isGP: true },
    { ratio: 0.786, label: "0.786 (Deep Defense)", color: "#f43f5e" },
    { ratio: 1.000, label: "1.000 (Swing Low)", color: "#ef4444" }
  ];

  function drawFibonacci() {
    if (!fibCtx) return;
    const w = fibCanvas.width;
    const h = fibCanvas.height;
    fibCtx.clearRect(0, 0, w, h);

    const padLeft = 40;
    const padRight = 110;
    const padTop = 35;
    const padBottom = 35;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    const diff = swingHigh - swingLow;

    // Draw Price Wave
    fibCtx.strokeStyle = "rgba(0, 240, 255, 0.7)";
    fibCtx.lineWidth = 2.5;
    fibCtx.beginPath();
    // Start at Low
    fibCtx.moveTo(padLeft, padTop + chartH);
    // Impulsive wave up to High
    fibCtx.bezierCurveTo(
      padLeft + chartW * 0.3, padTop + chartH * 0.9,
      padLeft + chartW * 0.4, padTop + chartH * 0.1,
      padLeft + chartW * 0.6, padTop
    );
    // Retracement wave down to Golden Pocket
    const gpY = padTop + chartH * 0.618;
    fibCtx.bezierCurveTo(
      padLeft + chartW * 0.75, padTop + chartH * 0.2,
      padLeft + chartW * 0.85, gpY - 10,
      padLeft + chartW, gpY
    );
    fibCtx.stroke();

    // Shaded Golden Pocket Zone (0.618 to 0.650)
    const gpTopY = padTop + chartH * 0.618;
    const gpBotY = padTop + chartH * 0.650;
    fibCtx.fillStyle = "rgba(212, 175, 55, 0.15)";
    fibCtx.fillRect(padLeft, gpTopY, chartW, Math.max(gpBotY - gpTopY, 4));

    // Draw Horizontal Fib Lines
    fibLevels.forEach(lvl => {
      const lineY = padTop + chartH * lvl.ratio;
      const priceAtLvl = swingHigh - diff * lvl.ratio;

      fibCtx.strokeStyle = lvl.isGP ? "#d4af37" : (lvl.ratio === 0.5 ? "rgba(255,255,255,0.4)" : "rgba(100, 116, 139, 0.4)");
      fibCtx.lineWidth = lvl.isGP ? 1.8 : 1;
      fibCtx.setLineDash(lvl.ratio === 0.5 || lvl.isGP ? [4, 2] : [2, 2]);

      fibCtx.beginPath();
      fibCtx.moveTo(padLeft, lineY);
      fibCtx.lineTo(padLeft + chartW, lineY);
      fibCtx.stroke();

      // Price Tag Label
      fibCtx.fillStyle = lvl.color;
      fibCtx.font = "10px JetBrains Mono";
      fibCtx.textAlign = "left";
      fibCtx.fillText(`${lvl.label} : $${Math.round(priceAtLvl).toLocaleString()}`, padLeft + chartW + 8, lineY + 3);
    });

    fibCtx.setLineDash([]);
  }

  function updateFib(low, high) {
    swingLow = Math.min(low, high - 1000);
    swingHigh = Math.max(high, low + 1000);

    const diff = swingHigh - swingLow;
    const gp618 = swingHigh - diff * 0.618;
    const gp650 = swingHigh - diff * 0.650;
    const ext1618 = swingHigh + diff * 0.618; // or 1.618 extension target

    if (fibLowValSpan) fibLowValSpan.textContent = swingLow.toLocaleString();
    if (fibHighValSpan) fibHighValSpan.textContent = swingHigh.toLocaleString();
    if (gpRangeSpan) gpRangeSpan.textContent = `$${Math.round(gp650).toLocaleString()} - $${Math.round(gp618).toLocaleString()}`;
    if (ext1618Span) ext1618Span.textContent = `$${Math.round(ext1618).toLocaleString()}`;

    drawFibonacci();
  }

  // --- Initialize Listeners ---
  function init() {
    if (angleSlider) {
      angleSlider.addEventListener('input', (e) => updateLunar(parseInt(e.target.value)));
    }

    document.querySelectorAll('.btn-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const deg = parseInt(e.target.getAttribute('data-deg'));
        updateLunar(deg);
      });
    });

    if (fibLowSlider && fibHighSlider) {
      fibLowSlider.addEventListener('input', (e) => updateFib(parseInt(e.target.value), swingHigh));
      fibHighSlider.addEventListener('input', (e) => updateFib(swingLow, parseInt(e.target.value)));
    }

    // Initial render
    updateLunar(0);
    updateFib(20000, 60000);
  }

  return { init, updateLunar, updateFib };
})();
