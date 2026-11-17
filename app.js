/**
 * QR Studio Pro - Application Engine
 * Generates beautiful custom QR codes with logo (PNG/SVG), transparent background,
 * full in-page visual color mixer (rainbow hue slider, lightness, RGB, HEX, 36+ swatches),
 * unique color palettes (under popular shades), 6 QR geometry visual style presets,
 * logo backing badge compositing, WCAG 2.1 real-time scannability audit, and iOS/Android routing.
 */

// Helper to create safe Data URIs for SVGs across all browsers (including Safari)
const createSvgDataUri = (svgStr) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr.trim())}`;

// Raw SVG strings for lossless vector rendering, resizing, and color transformations
const SAMPLE_LOGOS_RAW = {
  globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  telegram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0284c7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>`,
  whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#16a34a"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 6.88C8.94 6.88 8.66 6.94 8.43 7.19C8.2 7.44 7.56 8.04 7.56 9.27C7.56 10.5 8.45 11.69 8.58 11.86C8.7 12.03 10.34 14.56 12.85 15.65C14.94 16.55 15.36 16.37 15.82 16.33C16.28 16.29 17.3 15.72 17.51 15.13C17.72 14.54 17.72 14.04 17.66 13.93C17.6 13.82 17.44 13.76 17.2 13.64C16.96 13.52 15.78 12.94 15.56 12.86C15.34 12.78 15.18 12.74 15.02 12.98C14.86 13.22 14.4 13.82 14.26 13.98C14.12 14.14 13.98 14.16 13.74 14.04C13.5 13.92 12.48 13.59 11.27 12.51C10.33 11.67 9.7 10.63 9.56 10.39C9.42 10.15 9.55 10.02 9.67 9.9C9.77 9.8 9.9 9.63 10.02 9.49C10.14 9.35 10.18 9.25 10.26 9.09C10.34 8.93 10.3 8.79 10.24 8.67C10.18 8.55 9.72 7.42 9.53 6.96C9.34 6.51 9.15 6.57 9.11 6.88Z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#181717"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

// Sample SVG Logos Data URIs
const SAMPLE_LOGOS = {
  globe: createSvgDataUri(SAMPLE_LOGOS_RAW.globe),
  telegram: createSvgDataUri(SAMPLE_LOGOS_RAW.telegram),
  whatsapp: createSvgDataUri(SAMPLE_LOGOS_RAW.whatsapp),
  youtube: createSvgDataUri(SAMPLE_LOGOS_RAW.youtube),
  github: createSvgDataUri(SAMPLE_LOGOS_RAW.github),
  star: createSvgDataUri(SAMPLE_LOGOS_RAW.star)
};

// 6 QR Geometry Styles (Форма и структура)
const QR_STYLES = {
  classic: {
    name: "Классика",
    dotType: "square",
    cornerSquareType: "square",
    cornerDotType: "square"
  },
  rounded: {
    name: "Скругленный",
    dotType: "rounded",
    cornerSquareType: "extra-rounded",
    cornerDotType: "dot"
  },
  dots: {
    name: "Точечный",
    dotType: "dots",
    cornerSquareType: "dot",
    cornerDotType: "dot"
  },
  classy: {
    name: "Элегантный",
    dotType: "classy",
    cornerSquareType: "extra-rounded",
    cornerDotType: "dot"
  },
  classyRounded: {
    name: "Плавный",
    dotType: "classy-rounded",
    cornerSquareType: "extra-rounded",
    cornerDotType: "square"
  },
  extraRounded: {
    name: "Extra round",
    dotType: "extra-rounded",
    cornerSquareType: "dot",
    cornerDotType: "dot"
  }
};

// Unique Color Palettes (Дизайнерские цветовые решения под популярными оттенками)
const UNIQUE_COLOR_PALETTES = {
  indigo: {
    name: "Индиго Неон",
    colorMode: "linear",
    dotsColor1: "#2563eb",
    dotsColor2: "#4f46e5",
    gradientAngle: 135,
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  },
  cyber: {
    name: "Киберпанк",
    colorMode: "radial",
    dotsColor1: "#8b5cf6",
    dotsColor2: "#ec4899",
    gradientAngle: 135,
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  },
  emerald: {
    name: "Изумруд",
    colorMode: "linear",
    dotsColor1: "#059669",
    dotsColor2: "#10b981",
    gradientAngle: 90,
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  },
  sunset: {
    name: "Закатный огонь",
    colorMode: "linear",
    dotsColor1: "#f97316",
    dotsColor2: "#e11d48",
    gradientAngle: 45,
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  },
  gold: {
    name: "Королевское золото",
    colorMode: "linear",
    dotsColor1: "#d97706",
    dotsColor2: "#fbbf24",
    gradientAngle: 135,
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  },
  ocean: {
    name: "Морская бездна",
    colorMode: "linear",
    dotsColor1: "#0284c7",
    dotsColor2: "#0f172a",
    gradientAngle: 135,
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  },
  midnight: {
    name: "Midnight Dark",
    colorMode: "solid",
    dotsColor1: "#06b6d4",
    bgColor: "#0f172a",
    isBgTransparent: false,
    customCornerColor: true,
    cornerSquareColor: "#38bdf8",
    cornerDotColor: "#ffffff"
  },
  berry: {
    name: "Спелая ягода",
    colorMode: "linear",
    dotsColor1: "#7c3aed",
    dotsColor2: "#be123c",
    gradientAngle: 135,
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  },
  mint: {
    name: "Мятный фреш",
    colorMode: "linear",
    dotsColor1: "#0d9488",
    dotsColor2: "#84cc16",
    gradientAngle: 90,
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  },
  monochrome: {
    name: "Премиум Монохром",
    colorMode: "solid",
    dotsColor1: "#0f172a",
    bgColor: "#ffffff",
    isBgTransparent: false,
    customCornerColor: false
  }
};

// Recognized Natural Color Names in Russian & English
const COLOR_NAMES_MAP = {
  'красный': '#ef4444', 'red': '#ef4444',
  'синий': '#2563eb', 'blue': '#2563eb',
  'голубой': '#0284c7', 'cyan': '#06b6d4',
  'зеленый': '#16a34a', 'зелёный': '#16a34a', 'green': '#16a34a',
  'желтый': '#eab308', 'жёлтый': '#eab308', 'yellow': '#eab308',
  'оранжевый': '#f97316', 'orange': '#f97316',
  'фиолетовый': '#7c3aed', 'purple': '#7c3aed', 'violet': '#8b5cf6',
  'розовый': '#ec4899', 'pink': '#ec4899',
  'черный': '#000000', 'чёрный': '#000000', 'black': '#000000',
  'белый': '#ffffff', 'white': '#ffffff',
  'серый': '#64748b', 'gray': '#64748b', 'grey': '#64748b',
  'золотой': '#d97706', 'gold': '#d97706',
  'изумруд': '#059669', 'emerald': '#059669',
  'индиго': '#4f46e5', 'indigo': '#4f46e5',
  'бордовый': '#be123c', 'maroon': '#be123c',
  'бирюзовый': '#0d9488', 'turquoise': '#0d9488',
  'салатовый': '#84cc16', 'lime': '#84cc16'
};

// Global App State
const state = {
  url: "https://ilma-it.github.io/ibragimov-ahmad/",
  rawLogo: "",          // Raw source data URI or image
  logo: "",             // Final composited logo with badge
  logoName: "",
  isSvgLogo: true,      // Pure vector mode flag (bypasses canvas rasterization)
  svgRawString: "",     // Raw XML string of SVG for vector transformations
  svgColorMode: "original", // 'original' | 'matchQR' | 'custom'
  svgCustomColor: "#2563eb",
  logoSize: 0.45,
  logoMargin: 0,
  logoBadge: "circle",  // 'circle' | 'rounded' | 'none'
  stripSvgBg: true,     // Auto-remove embedded full-bleed background layers from SVG
  hideDotsBehindLogo: true,
  colorMode: "solid",   // 'solid' | 'linear' | 'radial'
  dotsColor1: "#0f172a",
  dotsColor2: "#3b82f6",
  gradientAngle: 135,
  isBgTransparent: false,
  bgColor: "#ffffff",
  bgOpacity: 100,
  customCornerColor: false,
  cornerSquareColor: "#3b82f6",
  cornerDotColor: "#2563eb",
  // QR Geometry Style (separated from colors!)
  currentStyle: "classic",
  currentPalette: "monochrome",
  dotType: "square",
  cornerSquareType: "square",
  cornerDotType: "square",
  errorCorrectionLevel: "H",
  qrMargin: 10,
  resolution: 1024,
  // Active Color Studio Target: 'dots1' | 'dots2' | 'bg' | 'cornersSquare' | 'cornersDot'
  activeColorTarget: "dots1",
  // HSL memory cache to prevent loss of hue and saturation when lightness touches 0% or 100%
  cachedH: 222,
  cachedS: 85
};

// DOM Elements
const urlInput = document.getElementById("urlInput");
const testLinkBtn = document.getElementById("testLinkBtn");
const previewUrlBadge = document.getElementById("previewUrlBadge");
const previewUrlText = document.getElementById("previewUrlText");
const urlProtocolBadge = document.getElementById("urlProtocolBadge");

const dropZone = document.getElementById("dropZone");
const logoFileInput = document.getElementById("logoFileInput");
const dropzoneEmpty = document.getElementById("dropzoneEmpty");
const dropzonePreview = document.getElementById("dropzonePreview");
const logoPreviewThumb = document.getElementById("logoPreviewThumb");
const logoFileName = document.getElementById("logoFileName");
const removeLogoBtn = document.getElementById("removeLogoBtn");

// SVG Vector Color Studio & Badge
const logoBadgeHint = document.getElementById("logoBadgeHint");
const stripSvgBgToggle = document.getElementById("stripSvgBgToggle");
const svgColorSection = document.getElementById("svgColorSection");
const svgColorHint = document.getElementById("svgColorHint");
const svgColorModes = document.getElementById("svgColorModes");
const svgCustomControls = document.getElementById("svgCustomControls");
const svgNativePicker = document.getElementById("svgNativePicker");
const svgColorPreviewThumb = document.getElementById("svgColorPreviewThumb");
const svgSwatchesGrid = document.getElementById("svgSwatchesGrid");

const logoSizeInput = document.getElementById("logoSizeInput");
const logoSizeVal = document.getElementById("logoSizeVal");
const logoMarginInput = document.getElementById("logoMarginInput");
const logoMarginVal = document.getElementById("logoMarginVal");
const hideDotsBehindLogo = document.getElementById("hideDotsBehindLogo");

// Color Mode & Angles
const colorModeSwitch = document.getElementById("colorModeSwitch");
const gradientAngleBox = document.getElementById("gradientAngleBox");
const gradientAngleInput = document.getElementById("gradientAngleInput");
const gradientAngleVal = document.getElementById("gradientAngleVal");

// Studio Color Mixer Elements
const studioTargetTabs = document.getElementById("studioTargetTabs");
const tabDots2 = document.getElementById("tabDots2");
const tabCornersSquare = document.getElementById("tabCornersSquare");
const tabCornersDot = document.getElementById("tabCornersDot");
const indDots1 = document.getElementById("indDots1");
const indDots2 = document.getElementById("indDots2");
const indBg = document.getElementById("indBg");
const indCornersSquare = document.getElementById("indCornersSquare");
const indCornersDot = document.getElementById("indCornersDot");

const studioActivePreview = document.getElementById("studioActivePreview");
const studioHexInput = document.getElementById("studioHexInput");
const studioRgbInput = document.getElementById("studioRgbInput");
const studioNativePicker = document.getElementById("studioNativePicker");

const hueSlider = document.getElementById("hueSlider");
const hueValLabel = document.getElementById("hueValLabel");
const lightnessSlider = document.getElementById("lightnessSlider");
const lightnessValLabel = document.getElementById("lightnessValLabel");

const rSlider = document.getElementById("rSlider");
const rValLabel = document.getElementById("rValLabel");
const gSlider = document.getElementById("gSlider");
const gValLabel = document.getElementById("gValLabel");
const bSlider = document.getElementById("bSlider");
const bValLabel = document.getElementById("bValLabel");

// Background & Transparency
const bgTransparentToggle = document.getElementById("bgTransparentToggle");
const solidBgControls = document.getElementById("solidBgControls");
const transparentNotice = document.getElementById("transparentNotice");
const bgOpacityInput = document.getElementById("bgOpacityInput");
const bgOpacityVal = document.getElementById("bgOpacityVal");

// Corner Custom Colors Toggle
const customCornerColorToggle = document.getElementById("customCornerColorToggle");

// Preview & Download Elements
const qrCanvasContainer = document.getElementById("qrCanvasContainer");
const resolutionSelect = document.getElementById("resolutionSelect");
const downloadPngBtn = document.getElementById("downloadPngBtn");
const downloadSvgBtn = document.getElementById("downloadSvgBtn");
const copyClipboardBtn = document.getElementById("copyClipboardBtn");
const printBtn = document.getElementById("printBtn");
const resetBtn = document.getElementById("resetBtn");
const resetBtnSecondary = document.getElementById("resetBtnSecondary");

const standardPreviewCard = document.getElementById("standardPreviewCard");
const toastEl = document.getElementById("toast");

// Initialize QRCodeStyling instances
let qrCode = null;

// Initialize Application
function initApp() {
  if (typeof QRCodeStyling === "undefined") {
    console.error("QRCodeStyling library is not loaded");
    showToast("Ошибка загрузки библиотеки QR-кода", "error");
    return;
  }

  // Create main preview instance (280x280)
  qrCode = new QRCodeStyling(getQROptions(280, 280));
  qrCode.append(qrCanvasContainer);

  // Setup event handlers
  setupEvents();

  // Apply default logo (Globe) with circle badge
  selectSampleLogo("globe", "globe-icon.svg");

  // Synchronize all UI buttons with initial state
  syncActiveButton("#dotTypeBtns", state.dotType);
  syncActiveButton("#cornerSquareBtns", state.cornerSquareType);
  syncActiveButton("#cornerDotBtns", state.cornerDotType);
  syncActiveButton("#densityBtns", state.errorCorrectionLevel);

  document.querySelectorAll(".style-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-style") === state.currentStyle);
  });
  document.querySelectorAll(".unique-palette-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-palette") === state.currentPalette);
  });

  updateUrlDisplay();
  updateTransparencyVisuals();
  updateStudioMixerFromActiveTarget();
  updateReadabilityAnalysis();
}

// Compute Effective Background Color (Hex, RGBA, or 'transparent')
function getEffectiveBgColor() {
  if (state.isBgTransparent) {
    return "transparent";
  }
  if (state.bgOpacity < 100) {
    return hexToRgba(state.bgColor, state.bgOpacity / 100);
  }
  return state.bgColor;
}

// Helper: Convert HEX to RGBA string
function hexToRgba(hex, alpha) {
  let c = (hex || "#ffffff").replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Generate complete options object for QRCodeStyling
function getQROptions(width, height) {
  const effectiveBg = getEffectiveBgColor();

  const options = {
    width: width,
    height: height,
    margin: state.qrMargin,
    type: "canvas",
    data: formatCleanUrl(state.url),
    image: state.logo || undefined,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: state.errorCorrectionLevel || "M"
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: state.logoMargin,
      hideBackgroundDots: state.hideDotsBehindLogo,
      imageSize: state.logoSize
    },
    dotsOptions: {
      type: state.dotType
    },
    backgroundOptions: {
      color: effectiveBg
    },
    cornersSquareOptions: {
      type: state.cornerSquareType,
      gradient: null
    },
    cornersDotOptions: {
      type: state.cornerDotType,
      gradient: null
    }
  };

  // Dots Coloring: Solid vs Linear Gradient vs Radial Gradient
  if (state.colorMode === "linear" || state.colorMode === "radial") {
    options.dotsOptions.gradient = {
      type: state.colorMode,
      rotation: (state.gradientAngle * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: state.dotsColor1 },
        { offset: 1, color: state.dotsColor2 }
      ]
    };
  } else {
    options.dotsOptions.color = state.dotsColor1;
    // CRITICAL BUG FIX: explicitly set gradient to null so qr-code-styling deep merge removes it!
    options.dotsOptions.gradient = null;
  }

  // Corners Custom Coloring (Independent Outer Frame & Inner Dot)
  if (state.customCornerColor) {
    options.cornersSquareOptions.color = state.cornerSquareColor;
    options.cornersDotOptions.color = state.cornerDotColor;
  } else {
    if (state.colorMode === "linear" || state.colorMode === "radial") {
      options.cornersSquareOptions.color = state.dotsColor1;
      options.cornersDotOptions.color = state.dotsColor2;
    } else {
      options.cornersSquareOptions.color = state.dotsColor1;
      options.cornersDotOptions.color = state.dotsColor1;
    }
  }

  return options;
}

// Refresh QR Code Rendering & Preview Holder
function refreshQRCode() {
  if (!qrCode) return;
  const options = getQROptions(280, 280);

  // CRITICAL FIX: If solid color mode is active, completely clear gradient from internal options state!
  if (state.colorMode === "solid") {
    if (qrCode._options && qrCode._options.dotsOptions) {
      delete qrCode._options.dotsOptions.gradient;
      qrCode._options.dotsOptions.gradient = null;
    }
  }

  qrCode.update(options);

  // Update canvas container background / checkerboard
  updateTransparencyVisuals();

  // Update tab indicators
  syncTabIndicators();

  // Evaluate WCAG contrast and update readability badge
  updateReadabilityAnalysis();
}

// Update checkerboard styling on preview container
function updateTransparencyVisuals() {
  if (state.isBgTransparent || state.bgOpacity < 100) {
    qrCanvasContainer.classList.add("checkerboard-bg");
    qrCanvasContainer.style.background = "";
  } else {
    qrCanvasContainer.classList.remove("checkerboard-bg");
    qrCanvasContainer.style.backgroundColor = state.bgColor;
  }
}

// Format URL / URI so iOS & Android automatically handle it properly
function formatCleanUrl(rawUrl) {
  let trimmed = (rawUrl || "").trim();
  if (!trimmed) return "https://example.com";

  // If already starts with a recognized URI scheme (https, http, tg, tel, mailto, etc.), preserve it
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(trimmed)) {
    return trimmed;
  }

  // If missing protocol, auto-prepend https:// for guaranteed native iOS/Android camera website popup
  return "https://" + trimmed;
}

// Update URL Displays
function updateUrlDisplay() {
  const cleanUrl = formatCleanUrl(state.url);
  previewUrlText.textContent = cleanUrl;

  // Protocol badge in input
  if (urlProtocolBadge) {
    const trimmed = (state.url || "").trim().toLowerCase();
    if (trimmed.startsWith("http://")) {
      urlProtocolBadge.textContent = "http://";
    } else if (trimmed.startsWith("tg://")) {
      urlProtocolBadge.textContent = "tg://";
    } else if (trimmed.startsWith("tel:")) {
      urlProtocolBadge.textContent = "tel:";
    } else if (trimmed.startsWith("mailto:")) {
      urlProtocolBadge.textContent = "mail:";
    } else {
      urlProtocolBadge.textContent = "https://";
    }
  }
}

// ==========================================
// LOGO BADGE COMPOSITING
// ==========================================

// Auto-trim transparent padding from uploaded images so no phantom whitespace creates gaps in QR
function trimTransparentBorders(imgSource, callback) {
  if (!imgSource || typeof imgSource !== "string") {
    callback(imgSource);
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    try {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      if (!origW || !origH) {
        callback(imgSource);
        return;
      }

      // Draw onto temporary canvas preserving high resolution for crisp 4K/print exports
      const maxTargetDim = 1600;
      const scale = Math.max(1, Math.min(3, maxTargetDim / Math.max(origW, origH)));
      const w = Math.round(origW * scale);
      const h = Math.round(origH * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let minX = w, minY = h, maxX = 0, maxY = 0;
      let hasVisible = false;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const alpha = data[(y * w + x) * 4 + 3];
          if (alpha > 12) {
            hasVisible = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // If fully transparent or already tightly cropped (less than 2px padding on all sides)
      if (!hasVisible || (minX <= 2 && minY <= 2 && maxX >= w - 3 && maxY >= h - 3)) {
        callback(imgSource);
        return;
      }

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext("2d");
      cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

      callback(cropCanvas.toDataURL("image/png"));
    } catch (e) {
      console.warn("Could not trim image borders:", e);
      callback(imgSource);
    }
  };

  img.onerror = () => {
    callback(imgSource);
  };

  img.src = imgSource;
}
window.trimTransparentBorders = trimTransparentBorders;

// Remove background rects, layers, and inline background styling from an SVG
function stripSvgBackground(svgStr) {
  if (!svgStr) return svgStr;

  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgStr, "image/svg+xml");
      if (!doc.querySelector("parsererror")) {
        const svgEl = doc.documentElement;
        if (svgEl) {
          // 1. Remove background styles from <svg>
          if (svgEl.style) {
            svgEl.style.removeProperty("background");
            svgEl.style.removeProperty("background-color");
          }

          // 2. Remove background groups like <g id="background"> or <g class="background">
          const bgGroups = doc.querySelectorAll('g[id*="bg" i], g[id*="background" i], g[class*="background" i], g[id*="artboard" i]');
          bgGroups.forEach((g) => g.remove());

          // 3. Extract viewBox or width/height dimensions
          let vbW = null, vbH = null;
          const vb = svgEl.getAttribute("viewBox");
          if (vb) {
            const parts = vb.trim().split(/[\s,]+/);
            if (parts.length === 4) {
              vbW = parseFloat(parts[2]);
              vbH = parseFloat(parts[3]);
            }
          }
          if (!vbW) vbW = parseFloat(svgEl.getAttribute("width"));
          if (!vbH) vbH = parseFloat(svgEl.getAttribute("height"));

          // 4. Find potential full-bleed background rects
          const rects = doc.querySelectorAll("rect");
          rects.forEach((rect) => {
            const id = (rect.getAttribute("id") || "").toLowerCase();
            const cls = (rect.getAttribute("class") || "").toLowerCase();
            const w = rect.getAttribute("width") || "";
            const h = rect.getAttribute("height") || "";
            const x = parseFloat(rect.getAttribute("x") || "0");
            const y = parseFloat(rect.getAttribute("y") || "0");

            const is100Percent = w.includes("100%") || h.includes("100%");
            const isNamedBg = id.includes("bg") || id.includes("background") || id.includes("canvas") || cls.includes("background");
            const isFullSize = vbW && vbH && Math.abs(parseFloat(w) - vbW) < 1.5 && Math.abs(parseFloat(h) - vbH) < 1.5 && x <= 0.1 && y <= 0.1;

            if (is100Percent || isNamedBg || isFullSize) {
              rect.remove();
            }
          });

          return new XMLSerializer().serializeToString(svgEl);
        }
      }
    }
  } catch (err) {
    console.warn("DOMParser background strip error:", err);
  }

  // Regex fallback:
  let res = svgStr.replace(/(<svg\b[^>]*\bstyle\s*=\s*["'][^"']*)(?:background|background-color)\s*:[^;"']*;?/gi, "$1");
  res = res.replace(/<rect\b[^>]*(?:width\s*=\s*["']100%["']|id\s*=\s*["'](?:bg|background|canvas)["'])[^>]*\/?>/gi, "");
  res = res.replace(/<rect\b[^>]*\bfill\s*=\s*["'](?:#fff(?:fff)?|white)["'][^>]*\b(?:width|height)\s*=\s*["']100%["'][^>]*\/?>/gi, "");
  return res;
}

// Wrap raw SVG inside a pure vector backing badge (circle or rounded square)
function wrapSvgWithBadge(rawSvg, badgeType = "circle", badgeColor = "#ffffff") {
  if (!rawSvg || badgeType === "none") return rawSvg;
  let cleanSvg = rawSvg.replace(/<\?xml[^>]*\?>/gi, "").replace(/<!DOCTYPE[^>]*>/gi, "").trim();

  // If the SVG has no viewBox, add one if width and height exist
  if (!/viewBox\s*=/i.test(cleanSvg)) {
    const wMatch = cleanSvg.match(/(?:^|\s)width\s*=\s*["'](\d+(\.\d+)?)[^"']*["']/i);
    const hMatch = cleanSvg.match(/(?:^|\s)height\s*=\s*["'](\d+(\.\d+)?)[^"']*["']/i);
    const w = wMatch ? wMatch[1] : "100";
    const h = hMatch ? hMatch[1] : "100";
    cleanSvg = cleanSvg.replace(/<svg\b/i, `<svg viewBox="0 0 ${w} ${h}"`);
  }

  const badgeShape = badgeType === "circle"
    ? `<circle cx="50" cy="50" r="50" fill="${badgeColor}" />`
    : `<rect x="0" y="0" width="100" height="100" rx="20" ry="20" fill="${badgeColor}" />`;

  // Adjust inner svg opening tag to place and scale it within the badge
  const nestedSvg = cleanSvg.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    const cleanAttrs = attrs
      .replace(/(?:^|\s)(x|y|width|height|preserveAspectRatio)\s*=\s*["'][^"']*["']/gi, " ")
      .trim();
    return `<svg x="8" y="8" width="84" height="84" preserveAspectRatio="xMidYMid meet" ${cleanAttrs}>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">
  ${badgeShape}
  ${nestedSvg}
</svg>`;
}

// Dynamically recolors all visible fills and strokes in an SVG markup string
function recolorSvgString(svgStr, targetColor) {
  if (!svgStr || !targetColor) return svgStr;

  try {
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgStr, "image/svg+xml");
      const parserError = doc.querySelector("parsererror");
      if (!parserError) {
        const isNone = (val) => !val || val === "none" || val === "transparent";

        const processEl = (el) => {
          const tag = el.nodeName.toLowerCase();
          if (["defs", "clippath", "mask", "lineargradient", "radialgradient", "filter", "metadata"].includes(tag)) {
            return;
          }

          // Fill attribute
          const fill = el.getAttribute("fill");
          if (fill && !isNone(fill)) {
            el.setAttribute("fill", targetColor);
          }

          // Stroke attribute
          const stroke = el.getAttribute("stroke");
          if (stroke && !isNone(stroke)) {
            el.setAttribute("stroke", targetColor);
          }

          // Inline style
          if (el.style) {
            if (el.style.fill && !isNone(el.style.fill)) {
              el.style.fill = targetColor;
            }
            if (el.style.stroke && !isNone(el.style.stroke)) {
              el.style.stroke = targetColor;
            }
          }

          // If shape has neither fill nor stroke, default in SVG is black fill
          if (["path", "circle", "rect", "polygon", "polyline", "ellipse"].includes(tag)) {
            const hasFill = el.hasAttribute("fill") || (el.style && el.style.fill);
            const hasStroke = el.hasAttribute("stroke") || (el.style && el.style.stroke);
            if (!hasFill && !hasStroke) {
              el.setAttribute("fill", targetColor);
            }
          }
        };

        processEl(doc.documentElement);
        const allEls = doc.documentElement.querySelectorAll("*");
        allEls.forEach(processEl);

        const serializer = new XMLSerializer();
        return serializer.serializeToString(doc.documentElement);
      }
    }
  } catch (err) {
    console.warn("DOMParser recoloring failed, falling back to regex:", err);
  }

  // Regex fallback:
  let res = svgStr;
  res = res.replace(/(?:^|\s)fill\s*=\s*["'](?!none|transparent)[^"']+["']/gi, ` fill="${targetColor}"`);
  res = res.replace(/(?:^|\s)stroke\s*=\s*["'](?!none|transparent)[^"']+["']/gi, ` stroke="${targetColor}"`);
  return res;
}

// Synchronize SVG color studio UI with state
function updateSvgColorUI() {
  if (!svgColorSection) return;
  if (!state.isSvgLogo) {
    svgColorSection.classList.add("hidden");
    return;
  }
  svgColorSection.classList.remove("hidden");

  // Highlight active mode button
  if (svgColorModes) {
    svgColorModes.querySelectorAll(".shape-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-svg-mode") === state.svgColorMode);
    });
  }

  // Update hint text
  if (svgColorHint) {
    if (state.svgColorMode === "original") svgColorHint.textContent = "Оригинальный";
    else if (state.svgColorMode === "matchQR") svgColorHint.textContent = "В цвет QR-кода";
    else if (state.svgColorMode === "custom") svgColorHint.textContent = state.svgCustomColor.toUpperCase();
  }

  // Show/hide custom controls
  if (svgCustomControls) {
    if (state.svgColorMode === "custom") {
      svgCustomControls.classList.remove("hidden");
    } else {
      svgCustomControls.classList.add("hidden");
    }
  }

  // Update color picker thumb
  if (svgColorPreviewThumb) {
    svgColorPreviewThumb.style.background = state.svgCustomColor;
  }
  if (svgNativePicker) {
    svgNativePicker.value = state.svgCustomColor;
  }
}

// Process raw logo with optional circular or rounded backing badge
function processAndApplyLogo() {
  if (!state.rawLogo) {
    state.logo = "";
    refreshQRCode();
    return;
  }

  // 1. PURE VECTOR PIPELINE FOR SVG LOGOS:
  // Preserves 100% crisp vector fidelity at any zoom/export and allows dynamic color adjustments
  if (state.isSvgLogo && state.svgRawString) {
    let finalSvg = state.svgRawString;

    // Strip embedded background rect/layer if stripSvgBg is active OR if logoBadge is 'none'
    if (state.stripSvgBg || state.logoBadge === "none") {
      finalSvg = stripSvgBackground(finalSvg);
    }

    // Apply color transformation if requested
    if (state.svgColorMode === "matchQR") {
      const targetColor = state.dotsColor1 || "#000000";
      finalSvg = recolorSvgString(finalSvg, targetColor);
    } else if (state.svgColorMode === "custom") {
      const targetColor = state.svgCustomColor || "#2563eb";
      finalSvg = recolorSvgString(finalSvg, targetColor);
    }

    // Wrap with vector badge if enabled (circle or rounded white badge)
    if (state.logoBadge !== "none") {
      finalSvg = wrapSvgWithBadge(finalSvg, state.logoBadge, "#ffffff");
    } else {
      // Clean XML headers and ensure valid xmlns & viewBox for pure transparent rendering
      finalSvg = finalSvg.replace(/<\?xml[^>]*\?>/gi, "").replace(/<!DOCTYPE[^>]*>/gi, "").trim();
      if (!/xmlns\s*=/i.test(finalSvg)) {
        finalSvg = finalSvg.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!/viewBox\s*=/i.test(finalSvg)) {
        const wMatch = finalSvg.match(/(?:^|\s)width\s*=\s*["'](\d+(\.\d+)?)[^"']*["']/i);
        const hMatch = finalSvg.match(/(?:^|\s)height\s*=\s*["'](\d+(\.\d+)?)[^"']*["']/i);
        const w = wMatch ? wMatch[1] : "100";
        const h = hMatch ? hMatch[1] : "100";
        finalSvg = finalSvg.replace(/<svg\b/i, `<svg viewBox="0 0 ${w} ${h}"`);
      }
    }

    state.logo = createSvgDataUri(finalSvg);
    if (logoPreviewThumb) {
      logoPreviewThumb.src = state.logo;
    }
    refreshQRCode();
    return;
  }

  // 2. RASTER PIPELINE FOR BITMAP LOGOS (PNG, JPG, WEBP):
  if (state.logoBadge === "none") {
    state.logo = state.rawLogo;
    if (logoPreviewThumb) logoPreviewThumb.src = state.logo;
    refreshQRCode();
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const origW = img.naturalWidth || img.width || 600;
    const origH = img.naturalHeight || img.height || 600;
    const aspect = origW / origH;

    // Use high resolution canvas (1200-2400px) so that 2K, 4K and Ultra exports stay razor-sharp
    const maxDim = Math.max(1200, Math.min(2400, Math.max(origW, origH)));
    let cW, cH;
    if (aspect >= 1) {
      cW = maxDim;
      cH = Math.max(160, Math.round(maxDim / aspect));
    } else {
      cH = maxDim;
      cW = Math.max(160, Math.round(maxDim * aspect));
    }

    const canvas = document.createElement("canvas");
    canvas.width = cW;
    canvas.height = cH;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, cW, cH);

    // Draw backing badge tailored to image aspect ratio
    if (state.logoBadge === "circle") {
      ctx.beginPath();
      // Ellipse smoothly handles both 1:1 circles and rectangular pill/oval badges
      ctx.ellipse(cW / 2, cH / 2, cW / 2, cH / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    } else if (state.logoBadge === "rounded") {
      const radius = Math.min(cW, cH) * 0.16;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(0, 0, cW, cH, radius);
      } else {
        ctx.moveTo(radius, 0);
        ctx.arcTo(cW, 0, cW, cH, radius);
        ctx.arcTo(cW, cH, 0, cH, radius);
        ctx.arcTo(0, cH, 0, 0, radius);
        ctx.arcTo(0, 0, cW, 0, radius);
        ctx.closePath();
      }
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    // Centered logo with minimal padding (4%) so it fits tightly without large empty gaps
    const padX = Math.round(cW * 0.04);
    const padY = Math.round(cH * 0.04);
    const destW = cW - padX * 2;
    const destH = cH - padY * 2;

    ctx.drawImage(img, padX, padY, destW, destH);
    state.logo = canvas.toDataURL("image/png");
    if (logoPreviewThumb) logoPreviewThumb.src = state.logo;
    refreshQRCode();
  };

  img.onerror = () => {
    state.logo = state.rawLogo;
    if (logoPreviewThumb) logoPreviewThumb.src = state.logo;
    refreshQRCode();
  };

  img.src = state.rawLogo;
}

// ==========================================
// QR GEOMETRY STYLES & UNIQUE COLOR PALETTES
// ==========================================

// Apply visual QR geometric style (changes ONLY dots and corners, preserves colors!)
function applyQRStyle(styleKey) {
  const style = QR_STYLES[styleKey];
  if (!style) return;

  state.currentStyle = styleKey;
  state.dotType = style.dotType;
  state.cornerSquareType = style.cornerSquareType;
  state.cornerDotType = style.cornerDotType;

  // Highlight active style button
  document.querySelectorAll(".style-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-style") === styleKey);
  });

  // Sync lower section 4 shape buttons
  syncActiveButton("#dotTypeBtns", state.dotType);
  syncActiveButton("#cornerSquareBtns", state.cornerSquareType);
  syncActiveButton("#cornerDotBtns", state.cornerDotType);

  refreshQRCode();
  showToast(`Стиль формы: ${style.name}`);
}

// Apply unique designer color solution (changes ONLY colors, preserves QR style geometry!)
function applyUniquePalette(paletteKey) {
  const pal = UNIQUE_COLOR_PALETTES[paletteKey];
  if (!pal) return;

  state.currentPalette = paletteKey;
  state.colorMode = pal.colorMode;
  state.dotsColor1 = pal.dotsColor1;
  if (pal.dotsColor2) state.dotsColor2 = pal.dotsColor2;
  if (pal.gradientAngle !== undefined) state.gradientAngle = pal.gradientAngle;
  state.bgColor = pal.bgColor || "#ffffff";
  state.isBgTransparent = !!pal.isBgTransparent;
  state.customCornerColor = !!pal.customCornerColor;
  if (pal.cornerSquareColor) state.cornerSquareColor = pal.cornerSquareColor;
  if (pal.cornerDotColor) state.cornerDotColor = pal.cornerDotColor;

  // Highlight active palette button
  document.querySelectorAll(".unique-palette-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-palette") === paletteKey);
  });

  syncInputsWithState();
  if (state.isSvgLogo && state.svgColorMode === "matchQR") {
    processAndApplyLogo();
  } else {
    refreshQRCode();
  }
  showToast(`Цветовая схема: ${pal.name}`);
}

// Unmark unique palette active status when user manually customizes colors
function markCustomColor() {
  document.querySelectorAll(".unique-palette-btn").forEach((b) => b.classList.remove("active"));
  state.currentPalette = "custom";
}

// ==========================================
// COLOR STUDIO & INTERACTIVE MIXER LOGIC
// ==========================================

// Get current hex color for the active target
function getActiveTargetColor() {
  switch (state.activeColorTarget) {
    case "dots1": return state.dotsColor1;
    case "dots2": return state.dotsColor2;
    case "bg": return state.bgColor;
    case "cornersSquare": return state.cornerSquareColor;
    case "cornersDot": return state.cornerDotColor;
    default: return state.dotsColor1;
  }
}

// Set hex color for the active target and refresh QR code
function setActiveTargetColor(hexColor) {
  const cleanHex = formatHex(hexColor);
  switch (state.activeColorTarget) {
    case "dots1": state.dotsColor1 = cleanHex; break;
    case "dots2": state.dotsColor2 = cleanHex; break;
    case "bg":
      state.bgColor = cleanHex;
      state.isBgTransparent = false;
      bgTransparentToggle.checked = false;
      solidBgControls.classList.remove("hidden");
      transparentNotice.classList.add("hidden");
      break;
    case "cornersSquare": state.cornerSquareColor = cleanHex; break;
    case "cornersDot": state.cornerDotColor = cleanHex; break;
  }

  // Update HSL memory cache if color has clear hue/saturation
  const parsedHsl = hexToHsl(cleanHex);
  if (parsedHsl.s > 5) {
    state.cachedH = parsedHsl.h;
    state.cachedS = parsedHsl.s;
  }

  markCustomColor();
  updateStudioMixerFromActiveTarget();
  if (state.isSvgLogo && state.svgColorMode === "matchQR") {
    processAndApplyLogo();
  } else {
    refreshQRCode();
  }
}

// Update Studio Mixer controls based on current target color
function updateStudioMixerFromActiveTarget() {
  const currentHex = getActiveTargetColor();
  const rgb = hexToRgb(currentHex);
  const hsl = hexToHsl(currentHex);

  // Update preview swatch and native picker
  studioActivePreview.style.backgroundColor = currentHex;
  studioNativePicker.value = currentHex;

  // Only update text fields if user is not actively typing in them (prevents cursor racing)
  if (document.activeElement !== studioHexInput) {
    studioHexInput.value = currentHex;
  }
  if (document.activeElement !== studioRgbInput) {
    studioRgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  }

  // Update Hue & Lightness Sliders
  hueSlider.value = hsl.h;
  hueValLabel.textContent = `${hsl.h}°`;

  lightnessSlider.value = hsl.l;
  lightnessValLabel.textContent = `${hsl.l}%`;
  
  // Show clean lightness gradient: if pure grayscale, center is 50% gray, otherwise vibrant hue
  const midSaturation = hsl.s === 0 ? 0 : 100;
  lightnessSlider.style.background = `linear-gradient(to right, #000000 0%, hsl(${hsl.h}, ${midSaturation}%, 50%) 50%, #ffffff 100%)`;

  // Update RGB Sliders
  rSlider.value = rgb.r;
  rValLabel.textContent = rgb.r;
  gSlider.value = rgb.g;
  gValLabel.textContent = rgb.g;
  bSlider.value = rgb.b;
  bValLabel.textContent = rgb.b;

  syncTabIndicators();
}

// Sync small indicators on the target tabs
function syncTabIndicators() {
  if (indDots1) indDots1.style.background = state.dotsColor1;
  if (indDots2) indDots2.style.background = state.dotsColor2;
  if (indBg) indBg.style.background = state.bgColor;
  if (indCornersSquare) indCornersSquare.style.background = state.cornerSquareColor;
  if (indCornersDot) indCornersDot.style.background = state.cornerDotColor;
}

// Color conversion helpers
function formatHex(hex) {
  let c = (hex || "#000000").trim();
  if (!c.startsWith("#")) c = "#" + c;
  if (/^#[0-9a-f]{3}$/i.test(c)) {
    c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
  }
  return /^#[0-9a-f]{6}$/i.test(c) ? c.toLowerCase() : "#0f172a";
}

function hexToRgb(hex) {
  let c = (hex || "#000000").replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num)) return { r: 15, g: 23, b: 42 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r, g, b) {
  const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h = Math.round(h * 60);
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Parse smart text inputs (Hex, RGB, or natural words)
function parseSmartColorInput(inputStr, strictLength = false) {
  const str = inputStr.trim().toLowerCase();
  if (!str) return null;

  // 1. Natural language names (Russian or English)
  if (COLOR_NAMES_MAP[str]) {
    return COLOR_NAMES_MAP[str];
  }

  // 2. Full 6-digit Hex notation (#rrggbb or rrggbb)
  if (/^#?[0-9a-f]{6}$/i.test(str)) {
    return str.startsWith("#") ? str : "#" + str;
  }

  // 3. Short 3-digit Hex (#rgb or rgb) - only when strictLength or full match
  if (strictLength && /^#?[0-9a-f]{3}$/i.test(str)) {
    const raw = str.replace("#", "");
    return "#" + raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
  }

  // 4. RGB notation: rgb(255, 0, 100) or 255, 0, 100
  const rgbMatch = str.match(/(?:rgb\s*\()?\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)?/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      return rgbToHex(r, g, b);
    }
  }

  return null;
}

// ==========================================
// WCAG 2.1 CONTRAST & SCANNABILITY AUDIT
// ==========================================

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(fgHex, bgHex) {
  const lum1 = getLuminance(fgHex);
  const lum2 = getLuminance(bgHex);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function updateReadabilityAnalysis() {
  const readabilityBox = document.getElementById("readabilityBox");
  const readabilityIcon = document.getElementById("readabilityIcon");
  const readabilityTitle = document.getElementById("readabilityTitle");
  if (!readabilityBox) return;

  // Calculate effective background taking opacity into account
  let effectiveBgHex = "#ffffff";
  if (!state.isBgTransparent) {
    if (state.bgOpacity >= 100) {
      effectiveBgHex = state.bgColor;
    } else {
      const bgRgb = hexToRgb(state.bgColor);
      const alpha = state.bgOpacity / 100;
      const r = Math.round(bgRgb.r * alpha + 255 * (1 - alpha));
      const g = Math.round(bgRgb.g * alpha + 255 * (1 - alpha));
      const b = Math.round(bgRgb.b * alpha + 255 * (1 - alpha));
      effectiveBgHex = rgbToHex(r, g, b);
    }
  }

  const bgLum = getLuminance(effectiveBgHex);
  const dots1Lum = getLuminance(state.dotsColor1);
  const contrast1 = getContrastRatio(state.dotsColor1, effectiveBgHex);

  let worstContrast = contrast1;
  let worstDotsLum = dots1Lum;

  // In gradient mode, audit BOTH colors to guarantee readability across the entire code
  if (state.colorMode === "linear" || state.colorMode === "radial") {
    const dots2Lum = getLuminance(state.dotsColor2);
    const contrast2 = getContrastRatio(state.dotsColor2, effectiveBgHex);
    if (contrast2 < worstContrast) {
      worstContrast = contrast2;
      worstDotsLum = dots2Lum;
    }
  }

  const formattedContrast = worstContrast.toFixed(1);
  const isInverted = worstDotsLum > bgLum;

  readabilityBox.classList.remove("warning", "danger");

  if (state.isBgTransparent) {
    if (worstDotsLum > 0.6) {
      readabilityBox.classList.add("warning");
      readabilityTitle.textContent = "Прозрачный фон + светлый рисунок";
      readabilityIcon.innerHTML = `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>`;
      readabilityIcon.setAttribute("stroke", "#f59e0b");
      return;
    }
  }

  if (worstContrast < 2.5) {
    readabilityBox.classList.add("danger");
    readabilityTitle.textContent = `Критически низкий контраст (${formattedContrast}:1)`;
    readabilityIcon.innerHTML = `<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>`;
    readabilityIcon.setAttribute("stroke", "#ef4444");
  } else if (isInverted) {
    readabilityBox.classList.add("warning");
    readabilityTitle.textContent = `Инвертированный QR (${formattedContrast}:1)`;
    readabilityIcon.innerHTML = `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>`;
    readabilityIcon.setAttribute("stroke", "#f59e0b");
  } else if (worstContrast < 4.0) {
    readabilityBox.classList.add("warning");
    readabilityTitle.textContent = `Средний контраст (${formattedContrast}:1)`;
    readabilityIcon.innerHTML = `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>`;
    readabilityIcon.setAttribute("stroke", "#f59e0b");
  } else {
    readabilityTitle.textContent = `Отличная считываемость (${formattedContrast}:1, Level ${state.errorCorrectionLevel || "H"})`;
    readabilityIcon.innerHTML = `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>`;
    readabilityIcon.setAttribute("stroke", "#10b981");
  }
}

// ==========================================
// SETUP EVENT LISTENERS
// ==========================================

function setupEvents() {
  // 1. URL Input
  urlInput.addEventListener("input", (e) => {
    let val = e.target.value.trim();
    // If user pasted a full URL starting with http:// or https://, auto-normalize visual display
    if (/^https?:\/\//i.test(val)) {
      state.url = val;
      e.target.value = val.replace(/^https?:\/\//i, "");
    } else {
      state.url = val;
    }
    updateUrlDisplay();
    refreshQRCode();
  });

  // Test Link button
  testLinkBtn.addEventListener("click", () => {
    const cleanUrl = formatCleanUrl(state.url);
    window.open(cleanUrl, "_blank");
  });

  // Preview URL Badge click to open
  if (previewUrlBadge) {
    previewUrlBadge.addEventListener("click", () => {
      window.open(formatCleanUrl(state.url), "_blank");
    });
  }

  // Quick project chips
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const targetUrl = chip.getAttribute("data-url");
      state.url = targetUrl;
      urlInput.value = targetUrl.replace(/^https?:\/\//i, "");
      updateUrlDisplay();
      refreshQRCode();
      showToast(`Выбран проект: ${chip.textContent.trim()}`);
    });
  });

  // 2. Logo Upload & Drag & Drop
  logoFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleLogoFile(file);
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  });

  // Remove Logo
  removeLogoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearLogo();
  });

  // Sample Logos
  document.querySelectorAll(".sample-logo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const iconKey = btn.getAttribute("data-icon");
      selectSampleLogo(iconKey, `${iconKey}-logo.svg`);
    });
  });

  // Logo Size Slider & Presets
  function setLogoSize(val) {
    state.logoSize = val / 100;
    if (logoSizeInput) logoSizeInput.value = val;
    if (logoSizeVal) logoSizeVal.textContent = `${val}%`;

    // Sync chips active state
    document.querySelectorAll(".logo-chip").forEach((chip) => {
      chip.classList.toggle("active", parseInt(chip.getAttribute("data-size"), 10) === val);
    });

    // Auto-safety: if logo is large (>= 35%) and error correction is not H, auto-elevate to Level H (30%)
    if (val >= 35 && state.errorCorrectionLevel !== "H") {
      state.errorCorrectionLevel = "H";
      const densityBtns = document.getElementById("densityBtns");
      const densityHint = document.getElementById("densityHint");
      if (densityBtns) {
        densityBtns.querySelectorAll(".shape-btn").forEach((b) => {
          b.classList.toggle("active", b.getAttribute("data-ec") === "H");
        });
      }
      if (densityHint) {
        densityHint.textContent = "Level H (Мелкая плотная сетка, для логотипа 30%)";
      }
      showToast("Для крупного логотипа включена максимальная защита (Level H)", "info");
    }

    refreshQRCode();
  }

  if (logoSizeInput) {
    logoSizeInput.addEventListener("input", (e) => {
      setLogoSize(parseInt(e.target.value, 10));
    });
  }

  document.querySelectorAll(".logo-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      setLogoSize(parseInt(chip.getAttribute("data-size"), 10));
    });
  });

  // Logo Margin Slider
  logoMarginInput.addEventListener("input", (e) => {
    const val = parseInt(e.target.value, 10);
    state.logoMargin = val;
    logoMarginVal.textContent = `${val} px`;
    refreshQRCode();
  });

  hideDotsBehindLogo.addEventListener("change", (e) => {
    state.hideDotsBehindLogo = e.target.checked;
    refreshQRCode();
  });

  // Logo Badge / Background Buttons (Circle, Rounded, None)
  document.querySelectorAll("#logoBadgeBtns .shape-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#logoBadgeBtns .shape-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const badge = btn.getAttribute("data-badge");
      state.logoBadge = badge;

      if (logoBadgeHint) {
        logoBadgeHint.textContent =
          badge === "none" ? "Без подложки (прозрачный)" :
          badge === "circle" ? "Белый круг" : "Скругленный квадрат";
      }

      processAndApplyLogo();
      showToast(
        badge === "none" ? "Фон логотипа убран (прозрачный)" :
        badge === "circle" ? "Включена круглая белая подложка" : "Включена квадратная белая подложка"
      );
    });
  });

  // SVG Strip Embedded Background Toggle
  if (stripSvgBgToggle) {
    stripSvgBgToggle.addEventListener("change", (e) => {
      state.stripSvgBg = e.target.checked;
      processAndApplyLogo();
      showToast(state.stripSvgBg ? "Очистка встроенного фона SVG включена" : "Очистка фона выключена");
    });
  }

  // SVG Logo Color Mode Buttons (Original, Match QR, Custom)
  if (svgColorModes) {
    svgColorModes.querySelectorAll(".shape-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-svg-mode");
        state.svgColorMode = mode;
        updateSvgColorUI();
        processAndApplyLogo();
        showToast(
          mode === "original" ? "Цвет логотипа: оригинальный" :
          mode === "matchQR" ? "Цвет логотипа: в тон QR-кода" : "Выбран свой цвет логотипа"
        );
      });
    });
  }

  // SVG Native Color Picker
  if (svgNativePicker) {
    svgNativePicker.addEventListener("input", (e) => {
      state.svgCustomColor = e.target.value;
      if (svgColorPreviewThumb) svgColorPreviewThumb.style.background = state.svgCustomColor;
      if (svgColorHint) svgColorHint.textContent = state.svgCustomColor.toUpperCase();
      processAndApplyLogo();
    });
  }

  // SVG Preset Color Swatches
  if (svgSwatchesGrid) {
    svgSwatchesGrid.querySelectorAll(".palette-square").forEach((btn) => {
      btn.addEventListener("click", () => {
        const col = btn.getAttribute("data-svg-color");
        state.svgCustomColor = col;
        if (svgNativePicker) svgNativePicker.value = col;
        if (svgColorPreviewThumb) svgColorPreviewThumb.style.background = col;
        if (svgColorHint) svgColorHint.textContent = col.toUpperCase();
        processAndApplyLogo();
      });
    });
  }

  // 3. QR Geometric Styles Bar (Top Bar Buttons with Icons)
  document.querySelectorAll(".style-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyQRStyle(btn.getAttribute("data-style"));
    });
  });

  // 4. Color Mode Switch (Solid, Linear, Radial)
  colorModeSwitch.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      colorModeSwitch.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.colorMode = btn.getAttribute("data-mode");
      markCustomColor();

      const isLinear = state.colorMode === "linear";
      const isGradient = isLinear || state.colorMode === "radial";
      gradientAngleBox.classList.toggle("hidden", !isLinear);
      tabDots2.classList.toggle("hidden", !isGradient);

      if (!isGradient && state.activeColorTarget === "dots2") {
        selectStudioTarget("dots1");
      }

      refreshQRCode();
      showToast(state.colorMode === "solid" ? "Включен сплошной цвет" : "Включен градиент");
    });
  });

  // Studio Target Tabs (Что красим?)
  studioTargetTabs.querySelectorAll(".target-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      selectStudioTarget(tab.getAttribute("data-target"));
    });
  });

  // Rainbow Hue Slider
  hueSlider.addEventListener("input", (e) => {
    const h = parseInt(e.target.value, 10);
    state.cachedH = h;
    const hsl = hexToHsl(getActiveTargetColor());
    let s = state.cachedS || hsl.s;
    let l = hsl.l;
    // If the color was grayscale or too dark/light to see hue, normalize for visibility:
    if (s < 10) s = 85;
    if (l < 15) l = 50;
    else if (l > 85) l = 50;
    state.cachedS = s;

    const newHex = hslToHex(h, s, l);
    setActiveTargetColor(newHex);
  });

  // Lightness Slider (Preserves saturation and hue without turning into permanent gray!)
  lightnessSlider.addEventListener("input", (e) => {
    const l = parseInt(e.target.value, 10);
    let { h, s } = hexToHsl(getActiveTargetColor());
    if (s === 0 && state.cachedH !== undefined) {
      h = state.cachedH;
      s = state.cachedS || 85;
    } else if (h !== 0 || s !== 0) {
      state.cachedH = h;
      state.cachedS = s;
    }
    const newHex = hslToHex(h, s, l);
    setActiveTargetColor(newHex);
  });

  // RGB Sliders
  const handleRgbChange = () => {
    const r = parseInt(rSlider.value, 10);
    const g = parseInt(gSlider.value, 10);
    const b = parseInt(bSlider.value, 10);
    const newHex = rgbToHex(r, g, b);
    setActiveTargetColor(newHex);
  };
  rSlider.addEventListener("input", handleRgbChange);
  gSlider.addEventListener("input", handleRgbChange);
  bSlider.addEventListener("input", handleRgbChange);

  // Studio Smart HEX Text Input (No cursor jump or 3-digit hex racing during typing)
  studioHexInput.addEventListener("input", (e) => {
    const val = e.target.value;
    const parsed = parseSmartColorInput(val, false);
    if (parsed) {
      setActiveTargetColor(parsed);
    }
  });

  studioHexInput.addEventListener("blur", (e) => {
    const val = e.target.value;
    const parsed = parseSmartColorInput(val, true);
    if (parsed) {
      setActiveTargetColor(parsed);
    } else {
      studioHexInput.value = getActiveTargetColor();
    }
  });

  studioHexInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const parsed = parseSmartColorInput(e.target.value, true);
      if (parsed) {
        setActiveTargetColor(parsed);
        studioHexInput.blur();
      }
    }
  });

  // Studio Smart RGB Text Input
  studioRgbInput.addEventListener("input", (e) => {
    const parsed = parseSmartColorInput(e.target.value, false);
    if (parsed) {
      setActiveTargetColor(parsed);
    }
  });

  studioRgbInput.addEventListener("blur", () => {
    const rgb = hexToRgb(getActiveTargetColor());
    studioRgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  });

  studioRgbInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const parsed = parseSmartColorInput(e.target.value, false);
      if (parsed) {
        setActiveTargetColor(parsed);
        studioRgbInput.blur();
      }
    }
  });

  // Native OS Color Picker Button
  studioNativePicker.addEventListener("input", (e) => {
    setActiveTargetColor(e.target.value);
  });

  // Wide 36-color Palette
  document.querySelectorAll(".palette-square").forEach((sq) => {
    sq.addEventListener("click", () => {
      const col = sq.getAttribute("data-color");
      setActiveTargetColor(col);
      showToast(`Выбран цвет: ${col}`);
    });
  });

  // Unique Color Palette Buttons (Under 36-color Palette)
  document.querySelectorAll(".unique-palette-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyUniquePalette(btn.getAttribute("data-palette"));
    });
  });

  // Gradient Angle Slider & Chips
  gradientAngleInput.addEventListener("input", (e) => {
    const angle = parseInt(e.target.value, 10);
    state.gradientAngle = angle;
    gradientAngleVal.textContent = `${angle}°`;
    updateActiveAngleChip(angle);
    markCustomColor();
    refreshQRCode();
  });

  document.querySelectorAll(".angle-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const angle = parseInt(chip.getAttribute("data-angle"), 10);
      state.gradientAngle = angle;
      gradientAngleInput.value = angle;
      gradientAngleVal.textContent = `${angle}°`;
      updateActiveAngleChip(angle);
      markCustomColor();
      refreshQRCode();
    });
  });

  // Background & Transparency Toggle
  bgTransparentToggle.addEventListener("change", (e) => {
    state.isBgTransparent = e.target.checked;
    solidBgControls.classList.toggle("hidden", state.isBgTransparent);
    transparentNotice.classList.toggle("hidden", !state.isBgTransparent);
    markCustomColor();
    if (state.isBgTransparent) {
      showToast("Включен прозрачный фон");
    } else {
      showToast("Включен цветной фон");
    }
    refreshQRCode();
  });

  // Background Opacity Slider
  bgOpacityInput.addEventListener("input", (e) => {
    const val = parseInt(e.target.value, 10);
    state.bgOpacity = val;
    bgOpacityVal.textContent = `${val}%`;
    markCustomColor();
    refreshQRCode();
  });

  // Individual Corner Colors Toggle
  customCornerColorToggle.addEventListener("change", (e) => {
    state.customCornerColor = e.target.checked;
    tabCornersSquare.classList.toggle("hidden", !state.customCornerColor);
    tabCornersDot.classList.toggle("hidden", !state.customCornerColor);
    markCustomColor();

    if (!state.customCornerColor && (state.activeColorTarget === "cornersSquare" || state.activeColorTarget === "cornersDot")) {
      selectStudioTarget("dots1");
    }

    refreshQRCode();
    if (state.customCornerColor) {
      showToast("Индивидуальные цвета углов активированы! Выберите 'Рамки' или 'Точки углов' в микшере.");
    }
  });

  // 5. Individual Shapes & Dots in Section 4
  setupButtonGroup("#dotTypeBtns", (type) => {
    state.dotType = type;
    checkStyleMatch();
    refreshQRCode();
  });

  setupButtonGroup("#cornerSquareBtns", (type) => {
    state.cornerSquareType = type;
    checkStyleMatch();
    refreshQRCode();
  });

  setupButtonGroup("#cornerDotBtns", (type) => {
    state.cornerDotType = type;
    checkStyleMatch();
    refreshQRCode();
  });

  // 6. QR Grid Density & Cell Size (Плотность сетки и размер ячеек)
  const densityBtns = document.getElementById("densityBtns");
  const densityHint = document.getElementById("densityHint");
  const densityHints = {
    L: "Level L (Крупные ячейки, минимальная плотность 7%)",
    M: "Level M (Стандартные сбалансированные ячейки 15%)",
    Q: "Level Q (Плотная сетка, защита 25%)",
    H: "Level H (Мелкая плотная сетка, для логотипа 30%)"
  };

  if (densityBtns) {
    densityBtns.querySelectorAll(".shape-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        densityBtns.querySelectorAll(".shape-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const ec = btn.getAttribute("data-ec");
        state.errorCorrectionLevel = ec;
        if (densityHint) {
          densityHint.textContent = densityHints[ec] || `Level ${ec}`;
        }
        refreshQRCode();
        const label = btn.querySelector("strong") ? btn.querySelector("strong").textContent.trim() : ec;
        showToast(`Установлена плотность: ${label}`);
      });
    });
  }

  // 7. Resolution select
  resolutionSelect.addEventListener("change", (e) => {
    state.resolution = parseInt(e.target.value, 10);
  });

  // 9. Download Actions
  downloadPngBtn.addEventListener("click", downloadPNG);
  downloadSvgBtn.addEventListener("click", downloadSVG);
  copyClipboardBtn.addEventListener("click", copyToClipboard);
  printBtn.addEventListener("click", () => window.print());

  // Reset to Defaults (Header Toolbar & Secondary Button)
  if (resetBtn) resetBtn.addEventListener("click", resetToDefaults);
  if (resetBtnSecondary) resetBtnSecondary.addEventListener("click", resetToDefaults);
}

// Check if current individual shapes match any style button
function checkStyleMatch() {
  let matchedKey = null;
  for (const [key, st] of Object.entries(QR_STYLES)) {
    if (st.dotType === state.dotType && st.cornerSquareType === state.cornerSquareType && st.cornerDotType === state.cornerDotType) {
      matchedKey = key;
      break;
    }
  }
  document.querySelectorAll(".style-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-style") === matchedKey);
  });
  if (matchedKey) {
    state.currentStyle = matchedKey;
  }
}

// Select Target in Studio Color Mixer
function selectStudioTarget(targetKey) {
  state.activeColorTarget = targetKey;
  studioTargetTabs.querySelectorAll(".target-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.getAttribute("data-target") === targetKey);
  });
  updateStudioMixerFromActiveTarget();
}

function updateActiveAngleChip(angle) {
  document.querySelectorAll(".angle-chip").forEach((chip) => {
    chip.classList.toggle("active", parseInt(chip.getAttribute("data-angle"), 10) === angle);
  });
}

// Helper to setup button group toggles
function setupButtonGroup(containerSelector, onSelect) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll(".shape-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".shape-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      onSelect(btn.getAttribute("data-type"));
    });
  });
}

// Handle Logo File (PNG, SVG, JPG, WebP)
function handleLogoFile(file) {
  if (!file) return;

  const validTypes = ["image/png", "image/svg+xml", "image/jpeg", "image/webp", "image/jpg"];
  const isSvg = file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
  const isValidExt = /\.(png|jpe?g|svg|webp)$/i.test(file.name);
  if (!validTypes.includes(file.type) && !isValidExt) {
    showToast("Пожалуйста, загрузите PNG, SVG, JPG или WebP файл", "error");
    return;
  }

  state.logoName = file.name;

  if (isSvg) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const svgText = e.target.result;
      state.isSvgLogo = true;
      state.svgRawString = svgText;
      state.rawLogo = createSvgDataUri(svgText);

      // Default custom uploaded SVG to transparent background (no forced white circle)
      state.logoBadge = "none";
      syncActiveButton("#logoBadgeBtns", "none");
      if (logoBadgeHint) logoBadgeHint.textContent = "Без подложки (прозрачный)";

      logoFileName.textContent = file.name;
      dropzoneEmpty.classList.add("hidden");
      dropzonePreview.classList.remove("hidden");
      document.querySelectorAll(".sample-logo-btn").forEach((b) => b.classList.remove("active"));

      updateSvgColorUI();
      processAndApplyLogo();
      showToast("Векторный SVG загружен (фон прозрачный)!");
    };
    reader.readAsText(file);
    return;
  }

  // Raster image pipeline (PNG, JPG, WebP)
  state.isSvgLogo = false;
  state.svgRawString = null;
  state.logoBadge = "none";
  syncActiveButton("#logoBadgeBtns", "none");
  if (logoBadgeHint) logoBadgeHint.textContent = "Без подложки (прозрачный)";
  updateSvgColorUI();

  const reader = new FileReader();
  reader.onload = (e) => {
    const rawData = e.target.result;
    trimTransparentBorders(rawData, (trimmedData) => {
      state.rawLogo = trimmedData;

      logoFileName.textContent = file.name;
      dropzoneEmpty.classList.add("hidden");
      dropzonePreview.classList.remove("hidden");
      document.querySelectorAll(".sample-logo-btn").forEach((b) => b.classList.remove("active"));

      processAndApplyLogo();
      showToast("Логотип успешно добавлен в центр QR-кода!");
    });
  };
  reader.readAsDataURL(file);
}

// Select Sample Logo
function selectSampleLogo(iconKey, filename) {
  if (!SAMPLE_LOGOS_RAW[iconKey]) return;

  state.isSvgLogo = true;
  state.svgRawString = SAMPLE_LOGOS_RAW[iconKey];
  state.rawLogo = SAMPLE_LOGOS[iconKey];
  state.logoName = filename;
  state.logoBadge = "circle";
  syncActiveButton("#logoBadgeBtns", "circle");
  if (logoBadgeHint) logoBadgeHint.textContent = "Белый круг";

  logoFileName.textContent = filename;
  dropzoneEmpty.classList.add("hidden");
  dropzonePreview.classList.remove("hidden");

  document.querySelectorAll(".sample-logo-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-icon") === iconKey);
  });

  updateSvgColorUI();
  processAndApplyLogo();
}

// Clear Logo
function clearLogo() {
  state.rawLogo = "";
  state.logo = "";
  state.logoName = "";
  state.isSvgLogo = false;
  state.svgRawString = null;
  logoFileInput.value = "";
  dropzoneEmpty.classList.remove("hidden");
  dropzonePreview.classList.add("hidden");
  document.querySelectorAll(".sample-logo-btn").forEach((b) => b.classList.remove("active"));
  updateSvgColorUI();
  refreshQRCode();
  showToast("Логотип удалён");
}

// Reset all QR code parameters to default values
function resetToDefaults() {
  // 1. Reset state to defaults
  state.url = "https://ilma-it.github.io/ibragimov-ahmad/";
  state.currentStyle = "classic";
  state.currentPalette = "monochrome";
  state.dotType = "square";
  state.cornerSquareType = "square";
  state.cornerDotType = "square";
  state.errorCorrectionLevel = "H";
  state.qrMargin = 10;
  state.resolution = 1024;

  // Colors
  state.colorMode = "solid";
  state.dotsColor1 = "#0f172a";
  state.dotsColor2 = "#3b82f6";
  state.gradientAngle = 135;
  state.isBgTransparent = false;
  state.bgColor = "#ffffff";
  state.bgOpacity = 100;
  state.customCornerColor = false;
  state.cornerSquareColor = "#3b82f6";
  state.cornerDotColor = "#2563eb";
  state.activeColorTarget = "dots1";
  state.cachedH = 222;
  state.cachedS = 85;

  // Logo settings
  state.isSvgLogo = true;
  state.svgRawString = SAMPLE_LOGOS_RAW.globe;
  state.rawLogo = SAMPLE_LOGOS.globe;
  state.logoName = "globe-icon.svg";
  state.svgColorMode = "original";
  state.svgCustomColor = "#2563eb";
  state.logoSize = 0.45;
  state.logoMargin = 0;
  state.logoBadge = "circle";
  state.stripSvgBg = true;
  state.hideDotsBehindLogo = true;

  // 2. Synchronize UI Inputs
  if (urlInput) urlInput.value = "ilma-it.github.io/ibragimov-ahmad/";
  updateUrlDisplay();

  const resSelect = document.getElementById("resolutionSelect");
  if (resSelect) resSelect.value = "1024";

  // QR Geometric Style buttons
  document.querySelectorAll(".style-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-style") === "classic");
  });

  // Shapes & Density buttons
  syncActiveButton("#dotTypeBtns", "square");
  syncActiveButton("#cornerSquareBtns", "square");
  syncActiveButton("#cornerDotBtns", "square");
  syncActiveButton("#densityBtns", "H");
  const densityHint = document.getElementById("densityHint");
  if (densityHint) {
    densityHint.textContent = "Level H (Мелкая плотная сетка, для логотипа 30%)";
  }

  // Logo UI Controls
  if (logoSizeInput) logoSizeInput.value = 45;
  if (logoSizeVal) logoSizeVal.textContent = "45%";
  if (logoMarginInput) logoMarginInput.value = 0;
  if (logoMarginVal) logoMarginVal.textContent = "0px";
  if (hideDotsBehindLogo) hideDotsBehindLogo.checked = true;

  syncActiveButton("#logoBadgeBtns", "circle");
  if (logoBadgeHint) logoBadgeHint.textContent = "Белый круг";
  if (stripSvgBgToggle) stripSvgBgToggle.checked = true;

  // Sample Logo buttons
  document.querySelectorAll(".sample-logo-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-icon") === "globe");
  });
  if (logoFileName) logoFileName.textContent = "globe-icon.svg";
  if (dropzoneEmpty) dropzoneEmpty.classList.add("hidden");
  if (dropzonePreview) dropzonePreview.classList.remove("hidden");
  if (logoFileInput) logoFileInput.value = "";

  // SVG Color Studio UI
  updateSvgColorUI();

  // Color Studio & Palettes UI
  document.querySelectorAll(".unique-palette-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-palette") === "monochrome");
  });

  syncInputsWithState();
  updateStudioMixerFromActiveTarget();
  updateTransparencyVisuals();

  // 3. Process logo and refresh QR code preview
  processAndApplyLogo();
  updateReadabilityAnalysis();

  showToast("Параметры сброшены к значениям по умолчанию");
}

// Sync Form Inputs with Internal State
function syncInputsWithState() {
  // Color mode buttons
  colorModeSwitch.querySelectorAll(".seg-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-mode") === state.colorMode);
  });
  const isLinear = state.colorMode === "linear";
  const isGradient = isLinear || state.colorMode === "radial";
  gradientAngleBox.classList.toggle("hidden", !isLinear);
  tabDots2.classList.toggle("hidden", !isGradient);

  // Gradient angle
  gradientAngleInput.value = state.gradientAngle;
  gradientAngleVal.textContent = `${state.gradientAngle}°`;
  updateActiveAngleChip(state.gradientAngle);

  // Background and Transparency
  bgTransparentToggle.checked = state.isBgTransparent;
  solidBgControls.classList.toggle("hidden", state.isBgTransparent);
  transparentNotice.classList.toggle("hidden", !state.isBgTransparent);
  bgOpacityInput.value = state.bgOpacity;
  bgOpacityVal.textContent = `${state.bgOpacity}%`;

  // Corners
  customCornerColorToggle.checked = state.customCornerColor;
  tabCornersSquare.classList.toggle("hidden", !state.customCornerColor);
  tabCornersDot.classList.toggle("hidden", !state.customCornerColor);

  // Auto-reset activeColorTarget if pointing to an element that is now hidden!
  if (!isGradient && state.activeColorTarget === "dots2") {
    state.activeColorTarget = "dots1";
  }
  if (!state.customCornerColor && (state.activeColorTarget === "cornersSquare" || state.activeColorTarget === "cornersDot")) {
    state.activeColorTarget = "dots1";
  }
  selectStudioTarget(state.activeColorTarget);

  syncActiveButton("#dotTypeBtns", state.dotType);
  syncActiveButton("#cornerSquareBtns", state.cornerSquareType);
  syncActiveButton("#cornerDotBtns", state.cornerDotType);

  updateStudioMixerFromActiveTarget();
}

function syncActiveButton(containerSelector, activeVal) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll(".shape-btn").forEach((btn) => {
    const val = btn.getAttribute("data-type") || btn.getAttribute("data-ec") || btn.getAttribute("data-badge");
    btn.classList.toggle("active", val === activeVal);
  });
}

// Generate clean, readable file name based on current URL/target for easy identification
function generateQrFileName(rawUrl, isTransparent = false) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return isTransparent ? "qr-code-transparent" : "qr-code";
  }

  let str = rawUrl.trim();

  // Special protocol prefixes
  let prefix = "";
  if (/^tel:/i.test(str)) {
    prefix = "tel-";
    str = str.replace(/^tel:/i, "");
  } else if (/^mailto:/i.test(str)) {
    prefix = "mail-";
    str = str.replace(/^mailto:/i, "");
  } else if (/^tg:\/\/resolve\?domain=/i.test(str)) {
    prefix = "tg-";
    str = str.replace(/^tg:\/\/resolve\?domain=/i, "");
  } else if (/^tg:\/\//i.test(str)) {
    prefix = "tg-";
    str = str.replace(/^tg:\/\//i, "");
  } else {
    // Strip http://, https://, and leading www.
    str = str.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  }

  // Remove query string and hash fragments for cleaner file names
  str = str.replace(/[?#].*$/, "");
  str = str.replace(/\/+$/, "");

  // Convert separators to hyphens
  let slug = str
    .replace(/[/\\:._+=@~]+/g, "-")
    // Keep letters, numbers, hyphens (supports Cyrillic and Latin safely)
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    // Deduplicate hyphens
    .replace(/-+/g, "-")
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    slug = "code";
  }

  // Limit slug length to 50 characters to avoid OS path length issues
  if (slug.length > 50) {
    slug = slug.substring(0, 50).replace(/-+$/, "");
  }

  const base = prefix ? `qr-${prefix}${slug}` : `qr-${slug}`;
  return isTransparent ? `${base}-transparent` : base;
}

// Download High-Resolution PNG
async function downloadPNG() {
  if (!qrCode) return;
  const res = state.resolution || 1024;
  const fileName = generateQrFileName(state.url, state.isBgTransparent);
  showToast(`Формирование PNG (${res}×${res})...`);

  const exportQR = new QRCodeStyling(getQROptions(res, res));
  
  try {
    await exportQR.download({
      name: fileName,
      extension: "png"
    });
    showToast(`PNG файл «${fileName}.png» успешно сохранён!`);
  } catch (err) {
    console.error("Ошибка при скачивании PNG:", err);
    showToast("Не удалось сохранить файл", "error");
  }
}

// Download Scalable Vector SVG
async function downloadSVG() {
  if (!qrCode) return;
  const fileName = generateQrFileName(state.url, state.isBgTransparent);
  showToast("Формирование векторного SVG...");

  const exportQR = new QRCodeStyling({
    ...getQROptions(800, 800),
    type: "svg"
  });

  try {
    await exportQR.download({
      name: fileName,
      extension: "svg"
    });
    showToast(`Векторный SVG «${fileName}.svg» успешно сохранён!`);
  } catch (err) {
    console.error("Ошибка при скачивании SVG:", err);
    showToast("Не удалось сохранить SVG", "error");
  }
}

// Copy PNG Image to Clipboard (Safe Promise-based ClipboardItem)
async function copyToClipboard() {
  if (!qrCode) return;
  showToast("Копирование в буфер обмена...");
  try {
    const exportQR = new QRCodeStyling(getQROptions(800, 800));

    if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
      try {
        const blobPromise = exportQR.getRawData("png");
        const item = new ClipboardItem({ "image/png": blobPromise });
        await navigator.clipboard.write([item]);
        showToast("Картинка скопирована в буфер обмена!");
        return;
      } catch (e) {
        const blob = await exportQR.getRawData("png");
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          showToast("Картинка скопирована в буфер обмена!");
          return;
        }
      }
    }
    throw new Error("Clipboard API unsupported");
  } catch (err) {
    console.warn("Clipboard copy unavailable, downloading PNG:", err);
    showToast("Буфер недоступен браузером — скачиваем PNG файл...", "info");
    downloadPNG();
  }
}

// Toast notification helper
let toastTimeout = null;
function showToast(message, type = "info") {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  if (type === "error") {
    toastEl.style.background = "#dc2626";
  } else {
    toastEl.style.background = "#0f172a";
  }

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.add("hidden");
  }, 3200);
}

// Start application
document.addEventListener("DOMContentLoaded", initApp);
