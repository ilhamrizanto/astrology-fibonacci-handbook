(function (global) {
  'use strict';

  const LOGICAL_WIDTH = 520;
  const LOGICAL_HEIGHT = 320;

  const state = {
    lunarAngle: 180,
    swingLow: 1820,
    swingHigh: 2140,
    isDraggingLunar: false,
    initialized: false
  };

  const PHASES = [
    {
      min: 0,
      max: 22.5,
      name: '0° — New Moon Conjunction ( Primary Pivot )',
      short: 'NEW MOON (0°)',
      bias: 'ACUM / PIVOT',
      desc: 'Sun-Moon ecliptic conjunction (0°). Historically aligns with primary cycle troughs, volatility compression, and institutional accumulation before trend expansion.'
    },
    {
      min: 22.5,
      max: 67.5,
      name: '45° — Waxing Crescent ( Semi-Square )',
      short: 'WAXING CRESCENT',
      bias: 'EXPANSION',
      desc: 'Early waxing momentum phase. Initial breakout validation following New Moon pivot structures; directional order flow begins to establish trend breadth.'
    },
    {
      min: 67.5,
      max: 112.5,
      name: '90° — First Quarter Square ( Harmonic Friction )',
      short: 'FIRST QUARTER (90°)',
      bias: 'CONSOLIDATION',
      desc: '90° quadrature aspect. Classical intraday/multi-day counter-trend pause or liquidity retest before secondary directional continuation.'
    },
    {
      min: 112.5,
      max: 157.5,
      name: '135° — Waxing Gibbous ( Sesquiquadrate )',
      short: 'WAXING GIBBOUS',
      bias: 'ACCELERATION',
      desc: 'Late-stage momentum acceleration approaching opposition. Retail participation peaks while algorithmic volatility dispersion widens.'
    },
    {
      min: 157.5,
      max: 202.5,
      name: '180° — Full Moon Opposition ( Exhaustion Window )',
      short: 'FULL MOON (180°)',
      bias: 'EXHAUSTION / REVERSAL',
      desc: '180° Sun-Moon opposition. High-probability emotional climax, liquidity sweep, and mean-reversion inflection window (+/- 1.5 trading days).'
    },
    {
      min: 202.5,
      max: 247.5,
      name: '225° — Waning Gibbous ( Dissemination )',
      short: 'WANING GIBBOUS',
      bias: 'DISTRIBUTION',
      desc: 'Post-opposition distribution and structural repricing. Impulsive counter-moves frequently retrace toward equilibrium value zones.'
    },
    {
      min: 247.5,
      max: 292.5,
      name: '270° — Third Quarter Square ( Secondary Inflection )',
      short: 'THIRD QUARTER (270°)',
      bias: 'REBALANCE',
      desc: '270° waning quadrature. Secondary harmonic inflection and structural rebalancing ahead of the terminal balsamic phase.'
    },
    {
      min: 292.5,
      max: 337.5,
      name: '315° — Waning Crescent ( Balsamic Compression )',
      short: 'WANING CRESCENT',
      bias: 'COMPRESSION',
      desc: 'Terminal cycle markdown and directional exhaustion. Volatility contracts as late sellers capitulate into structural Fibonacci support.'
    },
    {
      min: 337.5,
      max: 360.1,
      name: '360° — New Moon Conjunction ( Cycle Renewal )',
      short: 'NEW MOON (360°)',
      bias: 'ACUM / PIVOT',
      desc: 'Completion of the 29.53-day synodic harmonic loop. High-confluence time pivot for fresh impulse origination.'
    }
  ];

  function getPalette() {
    const isMidnight = document.body && document.body.classList.contains('theme-midnight');
    if (isMidnight) {
      return {
        isMidnight: true,
        bg: '#16181D',
        bgPanel: '#1D2026',
        gridFine: 'rgba(235, 230, 221, 0.06)',
        gridMajor: 'rgba(235, 230, 221, 0.14)',
        border: 'rgba(235, 230, 221, 0.22)',
        ink: '#EBE6DD',
        inkMuted: '#9A948C',
        inkSubtle: '#68635D',
        teal: '#5CA4A9',
        tealFill: 'rgba(92, 164, 169, 0.14)',
        crimson: '#D46A7E',
        crimsonFill: 'rgba(212, 106, 126, 0.15)',
        gold: '#CFA85C',
        goldFill: 'rgba(207, 168, 92, 0.16)',
        goldBand: 'rgba(207, 168, 92, 0.22)',
        moonDark: '#232730',
        moonLight: '#EBE6DD',
        badgeBg: '#121418'
      };
    }

    return {
      isMidnight: false,
      bg: '#FAF6F0',
      bgPanel: '#F3ECE1',
      gridFine: 'rgba(28, 25, 23, 0.065)',
      gridMajor: 'rgba(28, 25, 23, 0.15)',
      border: 'rgba(28, 25, 23, 0.22)',
      ink: '#1C1917',
      inkMuted: '#655E57',
      inkSubtle: '#8C847B',
      teal: '#0D7680',
      tealFill: 'rgba(13, 118, 128, 0.10)',
      crimson: '#990F3D',
      crimsonFill: 'rgba(153, 15, 61, 0.10)',
      gold: '#9B6B16',
      goldFill: 'rgba(155, 107, 22, 0.12)',
      goldBand: 'rgba(155, 107, 22, 0.16)',
      moonDark: '#DED6C8',
      moonLight: '#1C1917',
      badgeBg: '#FAF6F0'
    };
  }

  function setupHiDPICanvas(canvas) {
    if (!canvas) return null;
    const dpr = Math.min(global.devicePixelRatio || 1, 3);
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width > 0 ? rect.width : LOGICAL_WIDTH;
    const displayHeight = rect.height > 0 ? rect.height : LOGICAL_HEIGHT;

    const targetW = Math.round(displayWidth * dpr);
    const targetH = Math.round(displayHeight * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const scaleX = targetW / LOGICAL_WIDTH;
    const scaleY = targetH / LOGICAL_HEIGHT;
    ctx.scale(scaleX, scaleY);

    return ctx;
  }

  function formatUSD(value) {
    return '$' + Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatUSDCompact(value) {
    return '$' + Math.round(value).toLocaleString('en-US');
  }

  function getLunarPhaseMetadata(angle) {
    const normalized = ((Number(angle) % 360) + 360) % 360;
    const lookupAngle = Number(angle) === 360 ? 360 : normalized;
    for (let i = 0; i < PHASES.length; i++) {
      if (lookupAngle >= PHASES[i].min && lookupAngle <= PHASES[i].max) {
        return PHASES[i];
      }
    }
    return PHASES[0];
  }

  function drawArchitecturalGrid(ctx, palette, pad) {
    ctx.save();
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    const plotW = LOGICAL_WIDTH - pad.left - pad.right;
    const plotH = LOGICAL_HEIGHT - pad.top - pad.bottom;

    ctx.fillStyle = palette.bgPanel;
    ctx.fillRect(pad.left, pad.top, plotW, plotH);

    ctx.lineWidth = 1;
    ctx.strokeStyle = palette.gridFine;

    const vSteps = 12;
    for (let i = 1; i < vSteps; i++) {
      const x = Math.round(pad.left + (plotW / vSteps) * i) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + plotH);
      ctx.stroke();
    }

    const hSteps = 6;
    for (let j = 1; j < hSteps; j++) {
      const y = Math.round(pad.top + (plotH / hSteps) * j) + 0.5;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();
    }

    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left + 0.5, pad.top + 0.5, plotW - 1, plotH - 1);
    ctx.restore();
  }

  function drawMoonDisc(ctx, cx, cy, r, angleDeg, palette) {
    ctx.save();
    const rad = (angleDeg * Math.PI) / 180;
    const illumination = 0.5 * (1 - Math.cos(rad));

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = palette.moonDark;
    ctx.fill();
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = palette.ink;
    ctx.stroke();

    const isWaxing = (angleDeg % 360) <= 180;
    const k = Math.cos(rad);

    ctx.beginPath();
    if (isWaxing) {
      ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(cx, cy, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k > 0);
    } else {
      ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2, false);
      ctx.ellipse(cx, cy, Math.abs(k) * r, r, 0, -Math.PI / 2, Math.PI / 2, k > 0);
    }
    ctx.closePath();
    ctx.fillStyle = palette.gold;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = palette.ink;
    ctx.stroke();

    ctx.restore();
    return illumination;
  }

  function renderLunarCanvas() {
    const canvas = document.getElementById('lunarCanvas');
    if (!canvas) return;

    const ctx = setupHiDPICanvas(canvas);
    if (!ctx) return;

    const palette = getPalette();
    const pad = { top: 48, right: 24, bottom: 44, left: 48 };
    const plotW = LOGICAL_WIDTH - pad.left - pad.right;
    const plotH = LOGICAL_HEIGHT - pad.top - pad.bottom;

    drawArchitecturalGrid(ctx, palette, pad);

    const deg = Math.max(0, Math.min(360, Number(state.lunarAngle) || 0));
    const meta = getLunarPhaseMetadata(deg);
    const rad = (deg * Math.PI) / 180;
    const midY = pad.top + plotH / 2;
    const amp = plotH * 0.36;

    // Header telemetry bar
    ctx.save();
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.inkMuted;
    ctx.textAlign = 'left';
    ctx.fillText('SYNODIC HARMONIC OSCILLATOR // 29.53059d PERIOD', pad.left, 20);

    const illumPct = Math.round(0.5 * (1 - Math.cos(rad)) * 100);
    ctx.textAlign = 'right';
    ctx.fillStyle = palette.ink;
    ctx.fillText(
      `ELONGATION: ${deg.toFixed(0)}°   ILLUM: ${illumPct}%   BIAS: ${meta.bias}`,
      LOGICAL_WIDTH - pad.right,
      20
    );

    // Subtle divider under header
    ctx.strokeStyle = palette.gridMajor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, 30.5);
    ctx.lineTo(LOGICAL_WIDTH - pad.right, 30.5);
    ctx.stroke();
    ctx.restore();

    // Zero equilibrium line
    ctx.save();
    ctx.strokeStyle = palette.gridMajor;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, Math.round(midY) + 0.5);
    ctx.lineTo(pad.left + plotW, Math.round(midY) + 0.5);
    ctx.stroke();
    ctx.restore();

    // Y-axis labels
    ctx.save();
    ctx.font = '500 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.inkMuted;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('+1.00', pad.left - 8, midY - amp);
    ctx.fillText(' 0.00', pad.left - 8, midY);
    ctx.fillText('-1.00', pad.left - 8, midY + amp);
    ctx.restore();

    // Cardinal aspect bands (New Moon 0/360 & Full Moon 180 inflection windows)
    const cardinalAngles = [0, 90, 180, 270, 360];
    ctx.save();
    cardinalAngles.forEach((cDeg) => {
      const cx = pad.left + (cDeg / 360) * plotW;

      // Highlight 180° and 0°/360° exhaustion/pivot zones with vertical architectural bands
      if (cDeg === 180) {
        const bandW = (24 / 360) * plotW;
        ctx.fillStyle = palette.crimsonFill;
        ctx.fillRect(cx - bandW / 2, pad.top + 1, bandW, plotH - 2);
      } else if (cDeg === 0 || cDeg === 360) {
        const bandW = (18 / 360) * plotW;
        const startX = cDeg === 0 ? cx : cx - bandW;
        ctx.fillStyle = palette.tealFill;
        ctx.fillRect(startX, pad.top + 1, bandW, plotH - 2);
      }

      ctx.strokeStyle = cDeg === 180 ? palette.crimson : palette.gridMajor;
      ctx.lineWidth = cDeg === 180 ? 1.2 : 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(cx) + 0.5, pad.top);
      ctx.lineTo(Math.round(cx) + 0.5, pad.top + plotH);
      ctx.stroke();

      // Bottom X-axis degree ticks
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillStyle = cDeg === 180 ? palette.crimson : palette.inkMuted;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${cDeg}°`, cx, pad.top + plotH + 8);

      const labelMap = {
        0: 'NEW',
        90: '1Q SQ',
        180: 'FULL',
        270: '3Q SQ',
        360: 'NEW'
      };
      ctx.font = '500 8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = palette.inkSubtle;
      ctx.fillText(labelMap[cDeg], cx, pad.top + plotH + 22);
    });
    ctx.restore();

    // Secondary harmonic volatility envelope (2nd harmonic cos(2x))
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= plotW; i++) {
      const a = (i / plotW) * Math.PI * 2;
      const y = midY - Math.sin(a * 2) * (amp * 0.35);
      if (i === 0) ctx.moveTo(pad.left + i, y);
      else ctx.lineTo(pad.left + i, y);
    }
    ctx.strokeStyle = palette.gold;
    ctx.lineWidth = 1.15;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.restore();

    // Primary Synodic Tidal Curve: -cos(a) so 0° = trough (-1), 90° = 0, 180° = crest (+1), 270° = 0, 360° = trough (-1)
    const waveY = (angleRadians) => midY + Math.cos(angleRadians) * amp;

    // Area fill under primary curve up to current selected degree
    const currentX = pad.left + (deg / 360) * plotW;
    const currentY = waveY(rad);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pad.left, midY);
    const maxStep = Math.max(1, Math.round((deg / 360) * plotW));
    for (let i = 0; i <= maxStep; i++) {
      const a = (i / plotW) * Math.PI * 2;
      ctx.lineTo(pad.left + i, waveY(a));
    }
    ctx.lineTo(currentX, midY);
    ctx.closePath();
    ctx.fillStyle = deg >= 150 && deg <= 210 ? palette.crimsonFill : palette.tealFill;
    ctx.fill();
    ctx.restore();

    // Full primary synodic curve stroke
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= plotW; i++) {
      const a = (i / plotW) * Math.PI * 2;
      const y = waveY(a);
      if (i === 0) ctx.moveTo(pad.left + i, y);
      else ctx.lineTo(pad.left + i, y);
    }
    ctx.strokeStyle = palette.teal;
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();

    // Cardinal nodes on curve
    cardinalAngles.forEach((cDeg) => {
      const cx = pad.left + (cDeg / 360) * plotW;
      const cy = waveY((cDeg * Math.PI) / 180);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = palette.bg;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = cDeg === 180 ? palette.crimson : palette.teal;
      ctx.stroke();
      ctx.restore();
    });

    // Active phase crosshair & marker
    const isOppositionZone = deg >= 157.5 && deg <= 202.5;
    const isConjunctionZone = deg <= 22.5 || deg >= 337.5;
    const activeColor = isOppositionZone
      ? palette.crimson
      : isConjunctionZone
      ? palette.gold
      : palette.teal;

    ctx.save();
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(currentX, pad.top);
    ctx.lineTo(currentX, pad.top + plotH);
    ctx.stroke();

    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(pad.left, currentY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Outer target ring + inner precision dot
    ctx.beginPath();
    ctx.arc(currentX, currentY, 7, 0, Math.PI * 2);
    ctx.fillStyle = palette.bg;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = activeColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
    ctx.fillStyle = activeColor;
    ctx.fill();
    ctx.restore();

    // Floating moon phase medallion + telemetry tag inside plot
    const badgeW = 148;
    const badgeH = 38;
    const badgeX =
      currentX + 14 + badgeW < pad.left + plotW
        ? currentX + 12
        : currentX - badgeW - 12;
    const badgeY = Math.max(
      pad.top + 8,
      Math.min(pad.top + plotH - badgeH - 8, currentY - badgeH / 2)
    );

    ctx.save();
    ctx.fillStyle = palette.badgeBg;
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 1;
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    ctx.strokeRect(badgeX + 0.5, badgeY + 0.5, badgeW - 1, badgeH - 1);

    drawMoonDisc(ctx, badgeX + 19, badgeY + 19, 11, deg, palette);

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = activeColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(meta.short, badgeX + 36, badgeY + 7);

    const harmonicIndex = (-Math.cos(rad)).toFixed(2);
    ctx.font = '500 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.inkMuted;
    ctx.fillText(`IDX: ${harmonicIndex > 0 ? '+' : ''}${harmonicIndex}`, badgeX + 36, badgeY + 21);
    ctx.restore();

    // Legend in top-left of plot area
    ctx.save();
    ctx.font = '500 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = palette.teal;
    ctx.fillRect(pad.left + 10, pad.top + 11, 10, 2.5);
    ctx.fillStyle = palette.inkMuted;
    ctx.fillText('SYNODIC WAVE', pad.left + 25, pad.top + 12);

    ctx.fillStyle = palette.gold;
    ctx.fillRect(pad.left + 112, pad.top + 11, 10, 2);
    ctx.fillStyle = palette.inkMuted;
    ctx.fillText('2ND HARMONIC TORQUE', pad.left + 127, pad.top + 12);
    ctx.restore();
  }

  function renderFibCanvas() {
    const canvas = document.getElementById('fibCanvas');
    if (!canvas) return;

    const ctx = setupHiDPICanvas(canvas);
    if (!ctx) return;

    const palette = getPalette();
    const pad = { top: 44, right: 86, bottom: 34, left: 56 };
    const plotW = LOGICAL_WIDTH - pad.left - pad.right;
    const plotH = LOGICAL_HEIGHT - pad.top - pad.bottom;

    drawArchitecturalGrid(ctx, palette, pad);

    const low = Number(state.swingLow);
    const high = Number(state.swingHigh);
    const range = Math.max(10, high - low);

    // Compute key Fibonacci levels
    const lvl0 = high; // 0.0% retracement (Swing High)
    const lvl236 = high - range * 0.236;
    const lvl382 = high - range * 0.382;
    const lvl500 = high - range * 0.5;
    const lvl618 = high - range * 0.618;
    const lvl650 = high - range * 0.65;
    const lvl786 = high - range * 0.786;
    const lvl100 = low; // 100.0% retracement (Swing Low)
    const ext1618 = low + range * 1.618;

    // Vertical scale covers Swing Low (with slight padding) up to 127.2% / 161.8% visual reference
    const minPrice = low - range * 0.1;
    const maxPrice = low + range * 1.32;

    const priceToY = (p) => {
      const norm = (p - minPrice) / (maxPrice - minPrice);
      return pad.top + plotH - norm * plotH;
    };

    // Header bar
    ctx.save();
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.inkMuted;
    ctx.textAlign = 'left';
    ctx.fillText('EUCLIDEAN RATIO GEOMETRY // GOLDEN POCKET (0.618–0.650)', pad.left, 20);

    ctx.textAlign = 'right';
    ctx.fillStyle = palette.gold;
    ctx.fillText(`1.618 EXT TARGET: ${formatUSD(ext1618)}`, LOGICAL_WIDTH - 16, 20);

    ctx.strokeStyle = palette.gridMajor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, 30.5);
    ctx.lineTo(LOGICAL_WIDTH - 16, 30.5);
    ctx.stroke();
    ctx.restore();

    // Draw Golden Pocket (61.8% - 65.0%) highlighted zone
    const y618 = priceToY(lvl618);
    const y650 = priceToY(lvl650);
    const gpHeight = Math.max(4, y650 - y618);

    ctx.save();
    ctx.fillStyle = palette.goldBand;
    ctx.fillRect(pad.left + 1, y618, plotW - 2, gpHeight);

    ctx.strokeStyle = palette.gold;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(pad.left, y618);
    ctx.lineTo(pad.left + plotW, y618);
    ctx.moveTo(pad.left, y650);
    ctx.lineTo(pad.left + plotW, y650);
    ctx.stroke();
    ctx.restore();

    // Draw horizontal Fibonacci retracement & extension hairlines
    const levels = [
      { ratio: '1.272 EXT', price: low + range * 1.272, color: palette.teal, dashed: true },
      { ratio: '0.0% (HIGH)', price: lvl0, color: palette.ink, dashed: false },
      { ratio: '23.6%', price: lvl236, color: palette.inkSubtle, dashed: true },
      { ratio: '38.2%', price: lvl382, color: palette.inkMuted, dashed: true },
      { ratio: '50.0%', price: lvl500, color: palette.inkMuted, dashed: true },
      { ratio: '61.8% PHI', price: lvl618, color: palette.gold, dashed: false },
      { ratio: '78.6%', price: lvl786, color: palette.crimson, dashed: true },
      { ratio: '100% (LOW)', price: lvl100, color: palette.ink, dashed: false }
    ];

    levels.forEach((lv) => {
      const y = Math.round(priceToY(lv.price)) + 0.5;
      if (y < pad.top || y > pad.top + plotH) return;

      ctx.save();
      ctx.strokeStyle = lv.color;
      ctx.lineWidth = lv.dashed ? 1 : 1.25;
      if (lv.dashed) ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right axis ratio label
      ctx.font = lv.ratio.includes('PHI')
        ? '700 9.5px "JetBrains Mono", monospace'
        : '500 9px "JetBrains Mono", monospace';
      ctx.fillStyle = lv.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(lv.ratio, pad.left + plotW + 6, y);

      // Left axis price label for major levels
      if (!lv.dashed || lv.ratio === '50.0%') {
        ctx.font = '500 9px "JetBrains Mono", monospace';
        ctx.fillStyle = lv.ratio.includes('PHI') ? palette.gold : palette.inkMuted;
        ctx.textAlign = 'right';
        ctx.fillText(formatUSDCompact(lv.price), pad.left - 6, y);
      }
      ctx.restore();
    });

    // Multi-leg structural price trajectory (A -> B impulse, B -> C Golden Pocket pullback, C -> D harmonic expansion)
    const xA = pad.left + plotW * 0.08;
    const yA = priceToY(lvl100);

    const xB = pad.left + plotW * 0.42;
    const yB = priceToY(lvl0);

    const xC = pad.left + plotW * 0.68;
    const yC = priceToY((lvl618 + lvl650) / 2);

    const xD = pad.left + plotW * 0.94;
    const yD = priceToY(low + range * 1.272);

    // Subtle structural candles/bars along path for realistic market context
    const waypoints = [
      { x: xA, y: yA },
      { x: pad.left + plotW * 0.16, y: priceToY(low + range * 0.32) },
      { x: pad.left + plotW * 0.22, y: priceToY(low + range * 0.24) },
      { x: pad.left + plotW * 0.31, y: priceToY(low + range * 0.72) },
      { x: pad.left + plotW * 0.36, y: priceToY(low + range * 0.64) },
      { x: xB, y: yB },
      { x: pad.left + plotW * 0.50, y: priceToY(lvl382) },
      { x: pad.left + plotW * 0.55, y: priceToY(lvl236) },
      { x: pad.left + plotW * 0.62, y: priceToY(lvl500) },
      { x: xC, y: yC },
      { x: pad.left + plotW * 0.76, y: priceToY(lvl382) },
      { x: pad.left + plotW * 0.81, y: priceToY(lvl500 * 0.3 + lvl382 * 0.7) },
      { x: pad.left + plotW * 0.88, y: priceToY(lvl0) },
      { x: xD, y: yD }
    ];

    // Diagonal measure line A -> B
    ctx.save();
    ctx.strokeStyle = palette.inkSubtle;
    ctx.setLineDash([2, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xA, yA);
    ctx.lineTo(xB, yB);
    ctx.stroke();
    ctx.restore();

    // Draw detailed price path
    ctx.save();
    ctx.beginPath();
    waypoints.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.strokeStyle = palette.teal;
    ctx.lineWidth = 2.1;
    ctx.stroke();
    ctx.restore();

    // Highlight C -> D bullish harmonic expansion vector
    ctx.save();
    ctx.beginPath();
    for (let i = 9; i < waypoints.length; i++) {
      if (i === 9) ctx.moveTo(waypoints[i].x, waypoints[i].y);
      else ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.strokeStyle = palette.gold;
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();

    // Pivot nodes A, B, C, D
    const pivots = [
      { x: xA, y: yA, label: 'A (LOW)', color: palette.ink, align: 'bottom' },
      { x: xB, y: yB, label: 'B (HIGH)', color: palette.teal, align: 'top' },
      { x: xC, y: yC, label: 'C (0.618 PIVOT)', color: palette.gold, align: 'bottom' },
      { x: xD, y: yD, label: 'D (EXT)', color: palette.gold, align: 'top' }
    ];

    pivots.forEach((p) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = palette.bg;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = p.color;
      ctx.stroke();

      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.fillStyle = p.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = p.align === 'top' ? 'bottom' : 'top';
      const offsetY = p.align === 'top' ? -8 : 8;
      ctx.fillText(p.label, p.x, p.y + offsetY);
      ctx.restore();
    });

    // Golden Pocket callout badge inside chart
    const gpTagW = 166;
    const gpTagH = 22;
    const gpTagX = pad.left + 10;
    const gpTagY = Math.min(pad.top + plotH - gpTagH - 6, Math.max(pad.top + 8, y618 - gpTagH - 4));

    ctx.save();
    ctx.fillStyle = palette.badgeBg;
    ctx.strokeStyle = palette.gold;
    ctx.lineWidth = 1;
    ctx.fillRect(gpTagX, gpTagY, gpTagW, gpTagH);
    ctx.strokeRect(gpTagX + 0.5, gpTagY + 0.5, gpTagW - 1, gpTagH - 1);

    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.gold;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `GOLDEN POCKET: ${formatUSDCompact(lvl650)}–${formatUSDCompact(lvl618)}`,
      gpTagX + 7,
      gpTagY + gpTagH / 2
    );
    ctx.restore();

    // Bottom X-axis structural phase markers
    ctx.save();
    ctx.font = '500 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.inkMuted;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('IMPULSE LEG (A→B)', (xA + xB) / 2, pad.top + plotH + 10);
    ctx.fillText('RETRACEMENT (B→C)', (xB + xC) / 2, pad.top + plotH + 10);
    ctx.fillStyle = palette.gold;
    ctx.fillText('EXPANSION (C→D)', (xC + xD) / 2, pad.top + plotH + 10);
    ctx.restore();
  }

  function syncLunarDOM() {
    const deg = Math.round(Number(state.lunarAngle) || 0);
    const meta = getLunarPhaseMetadata(deg);

    const slider = document.getElementById('lunarAngleSlider');
    if (slider && Number(slider.value) !== deg) {
      slider.value = String(deg);
    }

    const angleVal = document.getElementById('lunarAngleVal');
    if (angleVal) {
      angleVal.textContent = `${deg}°`;
    }

    const phaseName = document.getElementById('lunarPhaseName');
    if (phaseName) {
      phaseName.textContent = meta.name;
    }

    const behaviorDesc = document.getElementById('lunarBehaviorDesc');
    if (behaviorDesc) {
      behaviorDesc.textContent = meta.desc;
    }

    const chips = document.querySelectorAll('.btn-chip[data-deg]');
    chips.forEach((chip) => {
      const chipDeg = Number(chip.getAttribute('data-deg'));
      if (chipDeg === deg) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function syncFibDOM() {
    const low = Number(state.swingLow);
    const high = Number(state.swingHigh);
    const range = high - low;

    const gpTop = high - range * 0.618;
    const gpBottom = high - range * 0.65;
    const ext1618 = low + range * 1.618;

    const lowSlider = document.getElementById('fibSwingLow');
    if (lowSlider && Number(lowSlider.value) !== low) {
      lowSlider.value = String(low);
    }

    const highSlider = document.getElementById('fibSwingHigh');
    if (highSlider && Number(highSlider.value) !== high) {
      highSlider.value = String(high);
    }

    const lowVal = document.getElementById('fibSwingLowVal');
    if (lowVal) {
      lowVal.textContent = formatUSD(low);
    }

    const highVal = document.getElementById('fibSwingHighVal');
    if (highVal) {
      highVal.textContent = formatUSD(high);
    }

    const gpRangeEl = document.getElementById('goldenPocketRange');
    if (gpRangeEl) {
      gpRangeEl.textContent = `${formatUSD(gpBottom)} – ${formatUSD(gpTop)}`;
    }

    const extEl = document.getElementById('fibExt1618');
    if (extEl) {
      extEl.textContent = formatUSD(ext1618);
    }
  }

  function updateLunar(angle) {
    const parsed = Number(angle);
    if (!Number.isNaN(parsed)) {
      state.lunarAngle = Math.max(0, Math.min(360, parsed));
    }
    syncLunarDOM();
    renderLunarCanvas();
  }

  function updateFib(swingLowInput, swingHighInput) {
    const minSpread = 40;
    let nextLow = swingLowInput !== undefined ? Number(swingLowInput) : state.swingLow;
    let nextHigh = swingHighInput !== undefined ? Number(swingHighInput) : state.swingHigh;

    if (Number.isNaN(nextLow)) nextLow = state.swingLow;
    if (Number.isNaN(nextHigh)) nextHigh = state.swingHigh;

    if (nextLow >= nextHigh - minSpread) {
      if (swingLowInput !== undefined && swingHighInput === undefined) {
        nextLow = nextHigh - minSpread;
      } else {
        nextHigh = nextLow + minSpread;
      }
    }

    state.swingLow = nextLow;
    state.swingHigh = nextHigh;

    syncFibDOM();
    renderFibCanvas();
  }

  function redraw() {
    syncLunarDOM();
    syncFibDOM();
    renderLunarCanvas();
    renderFibCanvas();
  }

  function bindCanvasInteractions() {
    const lunarCanvas = document.getElementById('lunarCanvas');
    if (!lunarCanvas) return;

    const getAngleFromPointer = (clientX) => {
      const rect = lunarCanvas.getBoundingClientRect();
      if (!rect.width) return state.lunarAngle;
      const padLeftRatio = 48 / LOGICAL_WIDTH;
      const padRightRatio = 24 / LOGICAL_WIDTH;
      const plotLeft = rect.left + rect.width * padLeftRatio;
      const plotWidth = rect.width * (1 - padLeftRatio - padRightRatio);
      const norm = Math.max(0, Math.min(1, (clientX - plotLeft) / plotWidth));
      return Math.round(norm * 360);
    };

    lunarCanvas.addEventListener('pointerdown', (e) => {
      state.isDraggingLunar = true;
      lunarCanvas.setPointerCapture(e.pointerId);
      updateLunar(getAngleFromPointer(e.clientX));
    });

    lunarCanvas.addEventListener('pointermove', (e) => {
      if (!state.isDraggingLunar) return;
      updateLunar(getAngleFromPointer(e.clientX));
    });

    const endDrag = (e) => {
      if (!state.isDraggingLunar) return;
      state.isDraggingLunar = false;
      try {
        lunarCanvas.releasePointerCapture(e.pointerId);
      } catch (_) {
        // Ignore if pointer was not captured
      }
    };

    lunarCanvas.addEventListener('pointerup', endDrag);
    lunarCanvas.addEventListener('pointercancel', endDrag);
  }

  function init() {
    if (state.initialized) {
      redraw();
      return;
    }

    const lunarSlider = document.getElementById('lunarAngleSlider');
    if (lunarSlider) {
      state.lunarAngle = Number(lunarSlider.value) || 180;
      lunarSlider.addEventListener('input', (e) => {
        updateLunar(e.target.value);
      });
    }

    const phaseChips = document.querySelectorAll('.btn-chip[data-deg]');
    phaseChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const deg = Number(chip.getAttribute('data-deg'));
        updateLunar(deg);
      });
    });

    const fibLowSlider = document.getElementById('fibSwingLow');
    const fibHighSlider = document.getElementById('fibSwingHigh');

    if (fibLowSlider) {
      state.swingLow = Number(fibLowSlider.value) || 1820;
      fibLowSlider.addEventListener('input', (e) => {
        updateFib(Number(e.target.value), undefined);
      });
    }

    if (fibHighSlider) {
      state.swingHigh = Number(fibHighSlider.value) || 2140;
      fibHighSlider.addEventListener('input', (e) => {
        updateFib(undefined, Number(e.target.value));
      });
    }

    bindCanvasInteractions();

    let resizeTimer = null;
    global.addEventListener('resize', () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        redraw();
      });
    });

    if (typeof MutationObserver !== 'undefined' && document.body) {
      const observer = new MutationObserver(() => {
        redraw();
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    state.initialized = true;
    redraw();
  }

  global.AstronacciSim = {
    init,
    updateLunar,
    updateFib,
    redraw
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);