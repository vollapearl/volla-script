// ============================================
// VOLLA PEARL - MAIN E-COMMERCE ENGINE
// ============================================

(function(){
var RAJAONGKIR_URL = "https://script.google.com/macros/s/AKfycbyP-ZUS1uGDHYHEsWAjxg7Fl4Joavs2umoVUxItd-mVWXoImq2YRwtWz-SYVgvPCVe5/exec";
var VOUCHER_PUB_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQC_ZEF6KZ0aMsPfgKjZIbOntgKeOyN1JsD6vjhUkWIt2AYvNpVoYK_Fd1XhoZXvD9TDOV-3CMZNJtL/pub?gid=1079538112&single=true&output=csv";
var SCRIPT_GABUNGAN_URL = "https://script.google.com/macros/s/AKfycbxCLbvhjq3GcnN4OcUM14LqobjRtR0Pzg1B6ghf6mjtZg0WavnryxeYIo-9CjzDmYbc/exec"; 

try {
  localStorage.removeItem('simpleCart_items'); localStorage.removeItem('tokowa_cart');
  for (var k in localStorage) {
    if (localStorage.hasOwnProperty(k) && k !== "vollapearl_custom_cart" && k !== "volla_last_order" && k !== "volla_used_vouchers") {
      var v = localStorage.getItem(k);
      if (typeof v === 'string' && (v.includes('NaN') || v.includes('undefined') || v.includes('null'))) localStorage.removeItem(k);
    }
  }
} catch(e) {}

var VOLLA_COLOR = '#1a2b4c', VOLLA_COLOR_LIGHT = '#e8edf5', VOLLA_ACCENT = '#c9a96e';
var CART_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>';

var style = document.createElement('style');
style.textContent = `
  #cart-btn, #cart, .cart-btn-head, [id*="cart"].pop, #pop-cart, #cart-popup, .cart-button { display: none !important; } 
  input, textarea, select { font-size: 16px !important; padding: 10px 12px !important; }
  .post-body table.variant, .entry-content table.variant, table.image, .volla-variant-table, .variant.hide { display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; overflow: hidden !important; position: absolute !important; }
  table[style*="rgb(245, 124, 0)"], table[style*="#f57c00"] { display: none !important; visibility: hidden !important; }
  .item.variant, .product-variant, .product-variants, .variant-wrapper, .opsi-produk, .product-options, .option-wrap, .item-variants { display: none !important; }
  .volla-add-btn { background: var(--key) !important; color: white !important; display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: center !important; text-align: center !important; width: 100% !important; padding: 0 !important; height: 60px !important; border: none !important; border-radius: 4px !important; cursor: pointer !important; font-size:100% !important;}
  #volla-toast { position: fixed; bottom: -100px; left: 50%; transform: translateX(-50%); background: white; padding: 12px 24px; border-radius: 50px; box-shadow: 0 10px 30px rgba(26,43,76,0.15); z-index: 99999; display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 600; color: #1a2b4c; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); border: 1px solid #e8edf5; width: max-content; max-width: 90vw; }
  #volla-toast.show { bottom: 90px; } 
  #volla-toast-icon { background: #27ae60; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
  .volla-modal-content { display: flex; flex-direction: column; height: 100%; background: #f5f5f7; position: relative; }
  .volla-scroll-area { flex: 1; overflow-y: auto; padding: 12px; padding-bottom: 90px; }
  .volla-card { background: #fff; border-radius: 10px; padding: 7px; margin-bottom: 7px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .volla-card-title { font-size: 14px; font-weight: 600; color: #333; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .volla-input-modern { width: 100%; padding: 12px 0; border: none; border-bottom: 1px solid #eee; border-radius: 0; font-size: 14px; background: transparent; transition: 0.2s; color:#333; }
  .volla-input-modern:focus { border-bottom-color: #ee4d2d; outline: none; }
  .volla-sticky-bottom { position: absolute; bottom: 0; left: 0; width: 100%; background: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; box-shadow: 0 -4px 12px rgba(0,0,0,0.05); z-index: 100; }
  .volla-cart-item { display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid #f5f5f5; }
  .volla-cart-item:last-child { border-bottom: none; }
  .volla-cart-img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid #eee; }
  .volla-qty-btn { width: 28px; height: 28px; border: 1px solid #eee; background: #fafafa; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; color:#666; font-weight:500;}
  .ship-loading { font-size: 12px; color: #ee4d2d; font-weight: 600; margin-top: 8px; display: none; }
`;
document.head.appendChild(style);

var viewportMeta = document.querySelector('meta[name="viewport"]');
if(!viewportMeta){ viewportMeta = document.createElement('meta'); viewportMeta.name = 'viewport'; document.head.appendChild(viewportMeta); }
viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

if(window.location.pathname.includes('.html')){
  var productStyle = document.createElement('style');
  productStyle.textContent = `.item.qty, .option .item.qty, .qty-container, .quantity-wrap { display: none !important; }`;
  document.head.appendChild(productStyle);
  setTimeout(function(){
    document.querySelectorAll('.item.qty, .qty, [class*="quantity"]').forEach(function(el){
      if(el.closest('.product, .post, article') && !el.closest('#cart-modal')){ el.style.display = 'none'; }
    });
  }, 300);
}

var SHEET_ID = "1TKocTvvTgyOnr8JU2Eo15AQt84mOynOkx4bgpkpwpVs";
var GID_META = "226483595", GID_SHOPEE = "484833297", GID_SILVER_FIX = "255262711";
var GID_MANUAL_VOUCHER = "341975128";

var CART_KEY = "vollapearl_custom_cart";
var currentProduct = null, allProducts = {}, cartInitialized = false, rawSilverFix = [], rawMetaFeed = [];
var validSheetVouchers = {}; 
var activeShipping = { cost: 0, locationLabel: "" };
var ALL_VOUCHERS = {}; 
var activeVoucher = null, selectedItems = {}, formData = { nama: '', alamat: '', hp: '' };

function getUniqueCode() {
  var today = new Date().toLocaleDateString('id-ID'), seqData = JSON.parse(localStorage.getItem('volla_order_seq') || '{"date":"","count":1}');
  if (seqData.date !== today) { seqData = { date: today, count: 1 }; localStorage.setItem('volla_order_seq', JSON.stringify(seqData)); }
  var code = 50 + seqData.count; return code > 99 ? 99 : code;
}

function incrementUniqueCode() {
  var today = new Date().toLocaleDateString('id-ID'), seqData = JSON.parse(localStorage.getItem('volla_order_seq') || '{"date":"","count":1}');
  if (seqData.date !== today) { seqData = { date: today, count: 1 }; }
  seqData.count++; localStorage.setItem('volla_order_seq', JSON.stringify(seqData));
}

function normalize(text){ return (text || "").toLowerCase().replace(/[^\w\s]/gi,' ').replace(/\s+/g,' ').trim(); }
function extractNumber(str){ if(!str) return 0; var cleaned = str.toString().replace(/[^\d]/g, ''); var num = parseInt(cleaned); return isNaN(num) ? 0 : num; }
function formatRupiah(angka){ var n = parseInt(angka); if(isNaN(n) || n === 0) return "Rp0"; return "Rp" + n.toLocaleString("id-ID"); }
function getSlug(){ var path = window.location.pathname; return path.split("/").pop().replace(".html","").toLowerCase(); }

function cleanFrontendTitle(fullTitle) {
  if (!fullTitle) return ''; var cleaned = fullTitle.split('|')[0].split('(')[0].trim();
  var jenis = ''; var lower = cleaned.toLowerCase();
  if (lower.indexOf('set') !== -1) jenis = 'Set'; else if (lower.indexOf('anting') !== -1) jenis = 'Anting'; else if (lower.indexOf('kalung') !== -1) jenis = 'Kalung'; else if (lower.indexOf('gelang') !== -1) jenis = 'Gelang'; else if (lower.indexOf('cincin') !== -1) jenis = 'Cincin'; else if (lower.indexOf('liontin') !== -1) jenis = 'Liontin'; else if (lower.indexOf('giwang') !== -1) jenis = 'Giwang'; else if (lower.indexOf('bros') !== -1) jenis = 'Bros';
  var removeWords = ['Asli','Air Tawar','Perak Asli 925','Lapis Emas 18K','18K','VollaPearl','Volla Pearl','Original','Mutiara Asli','Sterling Silver','925','Lapis Emas','Perhiasan','Jewelry','Anti Karat','Anti Luntur','High Quality','Premium','Perak','Silver','Gold','Emas','S925','S 925','Freshwater','freshwater','Fresh Water','fresh water','Water','Pearl','with','With','dengan','Dengan','–','—','-','Set Perhiasan','Perhiasan','Bracelet','Necklace','Earring','Pendant','Brooch','Ring','Bangle'];
  for (var i = 0; i < removeWords.length; i++) cleaned = cleaned.replace(new RegExp('\\b' + removeWords[i] + '\\b', 'gi'), '');
  cleaned = cleaned.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (jenis) cleaned = cleaned.replace(new RegExp('\\b' + jenis + '\\b', 'gi'), '').trim();
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  if (!cleaned.toLowerCase().includes('mutiara')) cleaned += ' Mutiara';
  if (jenis) cleaned = cleaned.replace(' Mutiara', jenis === 'Set' ? ' ' + jenis + ' Perhiasan Mutiara' : ' ' + jenis + ' Mutiara');
  return cleaned.replace(/\s+/g, ' ').trim();
}

function getProductImageFromPage(){
  var selectors = ['.post-body img', '.entry-content img', 'article img', 'figure.cover img', 'img[src*="blogger.googleusercontent.com"]'];
  for(var i = 0; i < selectors.length; i++){
    var img = document.querySelector(selectors[i]);
    if(img){ var src = img.getAttribute('src') || img.getAttribute('data-src') || ''; if(src && src.includes('http') && !src.includes('avatar')) return src; }
  } return '';
}

function getSheetData(g) { return fetch("https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/export?format=csv&gid=" + g + "&t=" + Date.now()).then(r => r.text()); }

var toastTimeout;
function showNotification(productName) {
  var toast = document.getElementById('volla-toast');
  if(!toast) { toast = document.createElement('div'); toast.id = 'volla-toast'; document.body.appendChild(toast); }
  toast.innerHTML = '<div id="volla-toast-icon">✓</div><div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:250px;">Ditambahkan ke Keranjang!</div>';
  setTimeout(function() { toast.classList.add('show'); }, 50); clearTimeout(toastTimeout);
  toastTimeout = setTimeout(function(){ toast.classList.remove('show'); }, 2500);
}

function extractVariantOptions(variants){
  var result = { jenis: [], mutiara: [], rangka: [], batu: [] };
  Object.values(variants).forEach(function(v){
    if(v.jenis && !result.jenis.includes(v.jenis)) result.jenis.push(v.jenis);
    if(v.mutiara && !result.mutiara.includes(v.mutiara)) result.mutiara.push(v.mutiara);
    if(v.rangka && !result.rangka.includes(v.rangka)) result.rangka.push(v.rangka);
    if(v.batu && !result.batu.includes(v.batu)) result.batu.push(v.batu);
  }); return result;
}

function getVariationData(baseName, varianName, productTitle) {
  var b = baseName.toLowerCase().trim(); var v = varianName ? varianName.toLowerCase().trim() : ''; var tTitle = (productTitle || '').toLowerCase(); var coreVarian = '';
  var searchStr = v ? v : tTitle;
  ['anting','kalung','gelang','cincin','cinin','set','bros','liontin','giwang'].forEach(function(t) { if (searchStr.includes(t)) coreVarian = (t === 'cinin' ? 'cincin' : t); });
  var normalPrice = 0, diskon = 0;
  for (var i = 1; i < rawMetaFeed.length; i++) { 
      var t = (rawMetaFeed[i][1] || '').toLowerCase();
      if (t.includes(b)) { if (coreVarian !== 'set' && t.includes('set')) continue; var d = parseInt(rawMetaFeed[i][11] || '0'); if (d > 0) { diskon = d; break; } } 
  }
  var checkPrice = function(sheetData, nameCol, priceCol) {
    for (var i = 1; i < sheetData.length; i++) { 
        var t = (sheetData[i][nameCol] || '').toLowerCase();
        if (t.includes(b) && t.includes(coreVarian || v)) { 
            if (coreVarian !== 'set' && t.includes('set')) continue; if (coreVarian === 'set' && !t.includes('set')) continue;
            var p = extractNumber(sheetData[i][priceCol]); if (p > 0) return p;
        } 
    } return 0;
  };
  normalPrice = checkPrice(rawSilverFix, 3, 25);
  if (normalPrice === 0) normalPrice = checkPrice(rawMetaFeed, 1, 3);
  if (normalPrice === 0) normalPrice = checkPrice(rawMetaFeed, 1, 10);
  if (normalPrice === 0) { for (var i = 1; i < rawSilverFix.length; i++) { var t = (rawSilverFix[i][3] || '').toLowerCase(); if (t.includes(b)) { if (coreVarian !== 'set' && t.includes('set')) continue; if (coreVarian === 'set' && !t.includes('set')) continue; var p = extractNumber(rawSilverFix[i][25]); if (p > 0) { normalPrice = p; break; } } } }
  if (normalPrice === 0) { for (var i = 1; i < rawMetaFeed.length; i++) { var t = (rawMetaFeed[i][1] || '').toLowerCase(); if (t.includes(b)) { if (coreVarian !== 'set' && t.includes('set')) continue; if (coreVarian === 'set' && !t.includes('set')) continue; var p = extractNumber(rawMetaFeed[i][3]) || extractNumber(rawMetaFeed[i][10]); if (p > 0) { normalPrice = p; break; } } } }
  var finalPrice = diskon > 0 ? Math.ceil((normalPrice * (1 - diskon / 100)) / 1000) * 1000 : normalPrice;
  return { final: finalPrice, normal: normalPrice, discount: diskon };
}

function buildVariantMatrixFromSilverFix(baseName) {
  var result = {}, fallbackMetaPrice = { normal: 0, final: 0, diskon: 0 };
  for (var m = 1; m < rawMetaFeed.length; m++) {
      var namaMeta = (rawMetaFeed[m][1] || '').toLowerCase();
      if (namaMeta.includes(baseName.toLowerCase())) {
          var hn = extractNumber(rawMetaFeed[m][3]), hd = extractNumber(rawMetaFeed[m][10]), dp = extractNumber(rawMetaFeed[m][11]) || 0;
          var hf = hd > 0 ? Math.ceil(hd / 1000) * 1000 : hn;
          if (hf > 0) { fallbackMetaPrice = { normal: hn, final: hf, diskon: dp }; break; }
      }
  }
  var jenisData = {}, jenisList = ["Anting","Kalung","Gelang","Cincin","Set","Liontin","Giwang","Bros"];
  for (var i = 1; i < rawMetaFeed.length; i++) {
    var row = rawMetaFeed[i], nama = (row[1] || '').toLowerCase();
    if (!nama.includes(baseName.toLowerCase())) continue;
    jenisList.forEach(function(j){
      if (nama.includes(j.toLowerCase())) {
        var key = normalize(j);
        if (!jenisData[key]) {
          var hNormal = extractNumber(row[3]), hDiskon = extractNumber(row[10]), dPersen = extractNumber(row[11]) || 0;
          var hFinal = hDiskon > 0 ? Math.ceil(hDiskon / 1000) * 1000 : hNormal;
          jenisData[key] = { optName: j, hargaNormal: hNormal, hargaFinal: hFinal, diskon: dPersen };
        }
      }
    });
  }
  if(rawSilverFix.length < 4) return result; 
  for (var i = 3; i < rawSilverFix.length; i++) { 
    var row = rawSilverFix[i]; if (!row || row.length < 18) continue;
    var namaSheet = (row[3] || '').toLowerCase(); if (!namaSheet.includes(baseName.toLowerCase())) continue;
    var rowJenis = null; jenisList.forEach(function(j){ if (namaSheet.includes(j.toLowerCase())) rowJenis = j; });
    var jKey = rowJenis ? normalize(rowJenis) : null, jData = jKey && jenisData[jKey] ? jenisData[jKey] : null;
    var optNameJenis = rowJenis ? rowJenis.charAt(0).toUpperCase() + rowJenis.slice(1) : (namaSheet.split(' ')[1] || 'Varian');
    var pNormalSilver = extractNumber(row[25]), finalNormal = 0, finalHarga = 0, finalDiskon = 0;
    if (jData && jData.hargaFinal > 0) { finalNormal = jData.hargaNormal; finalHarga = jData.hargaFinal; finalDiskon = jData.diskon;
    } else if (fallbackMetaPrice.final > 0) { finalNormal = fallbackMetaPrice.normal; finalHarga = fallbackMetaPrice.final; finalDiskon = fallbackMetaPrice.diskon;
    } else { finalNormal = pNormalSilver; finalHarga = pNormalSilver; finalDiskon = 0; }
    var mutiaraList = []; [11, 12, 13, 14].forEach(function(idx) { var val = (row[idx] || '').trim(); if (val) mutiaraList.push(val); }); if (mutiaraList.length === 0) mutiaraList = [null];
    var rangkaList = []; if (extractNumber(row[15]) > 0) rangkaList.push("White"); if (extractNumber(row[16]) > 0) rangkaList.push("Yellow"); if (rangkaList.length === 0) rangkaList = [null];
    var batuList = []; var batuRaw = (row[17] || '').trim(); if (batuRaw && batuRaw.includes(',')) { batuList = batuRaw.split(',').map(function(s) { return s.trim(); }); } else if (batuRaw) { batuList = [batuRaw]; } else { batuList = [null]; }
    mutiaraList.forEach(function(m) { rangkaList.forEach(function(r) { batuList.forEach(function(b) {
          var partsFormat = ["Jenis: " + optNameJenis]; if (m) partsFormat.push("Mutiara: " + m); if (r) partsFormat.push("Rangka: " + r); if (b) partsFormat.push("Batu: " + b);
          var gabungan = partsFormat.join(' - '); 
          var partsKey = [optNameJenis]; if (m) partsKey.push(m); if (r) partsKey.push(r); if (b) partsKey.push(b);
          var key = normalize(partsKey.join('-'));
          if (!result[key]) { result[key] = { optName: gabungan, hargaNormal: finalNormal, hargaFinal: finalHarga, diskon: finalDiskon, jenis: optNameJenis, mutiara: m, rangka: r, batu: b }; }
        }); }); });
  }
  return result;
}

window.vollaSelected = { jenis: null, mutiara: null, rangka: null, batu: null, fallback: null };

function fetchAllData(callback){
  function parseCSVRobust(str) {
      var arr = []; var row = []; var col = ''; var inQ = false;
      for (var i = 0; i < str.length; i++) {
          var c = str[i];
          if (inQ) { if (c === '"' && str[i+1] === '"') { col += '"'; i++; } else if (c === '"') { inQ = false; } else { col += c; }
          } else { if (c === '"') { inQ = true; } else if (c === ',') { row.push(col.trim()); col = ''; } else if (c === '\n') { row.push(col.trim()); arr.push(row); col = ''; row = []; } else if (c !== '\r') { col += c; } }
      }
      row.push(col.trim()); arr.push(row); return arr;
  }

  Promise.all([ getSheetData(GID_META), getSheetData(GID_SHOPEE), getSheetData(GID_SILVER_FIX), fetch(VOUCHER_PUB_URL + "&t=" + Date.now()).then(r => r.text()), getSheetData(GID_MANUAL_VOUCHER) ]).then(results => {
    var data = {};
    if(results[0]) rawMetaFeed = parseCSVRobust(results[0]);
    if(results[2]) rawSilverFix = parseCSVRobust(results[2]);
    if(results[3]) {
        var vRows = parseCSVRobust(results[3]);
        validSheetVouchers = {}; 
        for(var k = 1; k < vRows.length; k++) {
            var c20 = (vRows[k][1] || "").trim().toUpperCase();
            var c30 = (vRows[k][2] || "").trim().toUpperCase();
            if(c20) validSheetVouchers[c20] = 20;
            if(c30) validSheetVouchers[c30] = 30;
        }
    }
    
    ALL_VOUCHERS = {}; 
    if(results[4]) {
        var vmRows = parseCSVRobust(results[4]);
        for(var m = 1; m < vmRows.length; m++) {
            var code = (vmRows[m][0] || "").trim().toUpperCase(); 
            var diskonNominal = extractNumber(vmRows[m][1]);      
            var minBelanja = extractNumber(vmRows[m][2]);         
            var maxDiskon = extractNumber(vmRows[m][3]);       
            var statusPakai = (vmRows[m][4] || "").trim().toUpperCase(); 
            
            if(code && diskonNominal > 0 && !statusPakai.includes("TERPAKAI")) {
                var type = diskonNominal <= 100 ? "percent" : "fixed"; 
                ALL_VOUCHERS[code] = { 
                    type: type, 
                    value: diskonNominal, 
                    minPurchase: minBelanja,
                    maxDiscount: type === "percent" && maxDiskon > 0 ? maxDiskon : null 
                };
            }
        }
    }
    
    if(rawMetaFeed.length > 0) {
      for(var i = 1; i < rawMetaFeed.length; i++){
        var cols = rawMetaFeed[i]; if(cols.length < 13) continue;
        var title = cols[1] || ''; var hargaNormal = extractNumber(cols[3]); var hargaDiskon = extractNumber(cols[10]); 
        if (hargaDiskon > 0) { hargaDiskon = Math.ceil(hargaDiskon / 1000) * 1000; }
        var diskonPersen = extractNumber(cols[11]); var hargaFinal = hargaDiskon > 0 ? hargaDiskon : hargaNormal;
        if(!title || hargaFinal <= 0) continue;
        var titleClean = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim(); var parts = titleClean.split(' '); var baseName = parts[0].toLowerCase(); var varName = (parts[1] || 'Default').toLowerCase(); 
        var namaElegan = cleanFrontendTitle(title);
        if(!data[baseName]) { data[baseName] = { id: baseName, namaUtama: namaElegan, desc: cols[2] || '', hargaNormal: hargaNormal, hargaDiskon: hargaDiskon, hargaFinal: hargaFinal, diskon: diskonPersen, label: "Pilih Varian:", variants: {}, fromShopee: false }; data[baseName.replace(/\s+/g, '')] = data[baseName]; }
        if(hargaFinal < data[baseName].hargaFinal) { data[baseName].hargaNormal = hargaNormal; data[baseName].hargaDiskon = hargaDiskon; data[baseName].hargaFinal = hargaFinal; data[baseName].diskon = diskonPersen; }
        data[baseName].variants[varName] = { nama: namaElegan, optName: varName.charAt(0).toUpperCase() + varName.slice(1), hargaNormal: hargaNormal, hargaDiskon: hargaDiskon, hargaFinal: hargaFinal, diskon: diskonPersen };
      }
    }
    
    if(results[1]) {
      var rowsS = parseCSVRobust(results[1]);
      for(var j = 1; j < rowsS.length; j++){
        var colsS = rowsS[j]; if(colsS.length < 16) continue;
        var titleS = colsS[2] || ''; if(!titleS) continue;
        var titleCleanS = titleS.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim(); var partsS = titleCleanS.split(' '); var baseNameS = partsS[0].toLowerCase(); 
        if (data[baseNameS]) {
           var labelVarian = colsS[15] || "Varian"; var optIndices = [14, 16, 18, 20, 22, 24, 26, 28]; var foundOptions = [];
           optIndices.forEach(function(idx) { if (idx < colsS.length) { var val = colsS[idx] ? colsS[idx].replace(/^"|"$/g, '').trim() : ""; if (val && !val.startsWith('http')) { foundOptions.push(val); } } });
           foundOptions = [...new Set(foundOptions)];
           if (foundOptions.length > 0) {
               if (!data[baseNameS].fromShopee) { data[baseNameS].variants = {}; data[baseNameS].fromShopee = true; if (labelVarian && labelVarian !== "Varian" && labelVarian !== "") { data[baseNameS].label = "Pilih " + labelVarian + ":"; } else { data[baseNameS].label = "Pilih Varian:"; } }
               foundOptions.forEach(function(opt) { 
                   var varKey = opt.toLowerCase(); var d = getVariationData(baseNameS, opt, titleS); var namaEleganS = cleanFrontendTitle(titleS);
                   data[baseNameS].variants[varKey] = { nama: namaEleganS, optName: opt, hargaNormal: d.normal, hargaDiskon: d.discount > 0 ? d.final : 0, hargaFinal: d.final, diskon: d.discount }; 
               });
           }
        }
      }
    }
    allProducts = data; callback(data);
  }).catch(e => callback({}));
}

function initVariantSelection() {
  var cartBtns = [];
  document.querySelectorAll('.cta button.cart-add, .cta button.buy').forEach(function(el) {
      var clone = el.cloneNode(true); clone.classList.remove('cart-add'); clone.classList.remove('buy'); clone.classList.add('volla-add-btn'); el.parentNode.replaceChild(clone, el); 
  });
  document.querySelectorAll('.cta button.volla-add-btn').forEach(function(el) { cartBtns.push(el); });

  var oldUI = document.getElementById('volla-variant-ui'); if (oldUI) oldUI.remove();

  if (!currentProduct || !currentProduct.variants || Object.keys(currentProduct.variants).length === 0) {
     cartBtns.forEach(function(cb) { cb.style.pointerEvents = 'auto'; cb.style.opacity = '1'; cb.innerHTML = '<div style="display:flex; align-items:center; justify-content:center;">' + CART_ICON + '<span style="margin-left:8px;">+ Tambahkan</span></div>'; });
     return;
  }

  var variants = currentProduct.variants; var optionsKeys = Object.keys(variants);
  var isMultiLevel = false; if (optionsKeys.length > 0 && variants[optionsKeys[0]].jenis) { isMultiLevel = true; }
  window.vollaSelected = { jenis: null, mutiara: null, rangka: null, batu: null, fallback: null };

  if (cartBtns.length > 0) {
    var parent = cartBtns[0].parentElement; parent.style.display = 'flex'; parent.style.flexWrap = 'wrap'; parent.style.gap = '15px 10px'; parent.style.alignItems = 'stretch';
    Array.from(parent.children).forEach(function(child) {
      if (child.tagName !== 'STYLE' && child.tagName !== 'SCRIPT' && !child.classList.contains('hide') && child.id !== 'volla-variant-ui') {
        child.style.order = '2'; child.style.margin = '0';
        if (child.classList.contains('volla-add-btn')) { child.style.flex = '9'; } 
        else { child.style.flex = '1'; child.style.setProperty('display', 'flex', 'important'); child.style.setProperty('align-items', 'center', 'important'); child.style.setProperty('justify-content', 'center', 'important'); child.style.setProperty('min-width', '50px', 'important'); child.style.setProperty('max-width', '65px', 'important'); }
      }
    });

    if (optionsKeys.length <= 1) {
        var singleData = variants[optionsKeys[0]]; updateDisplayAndCart(singleData, singleData.optName || optionsKeys[0]); return;
    }

    var uiContainer = document.createElement('div'); uiContainer.id = 'volla-variant-ui'; uiContainer.style.cssText = 'margin:0 0 15px 0; padding:0; width:100%; flex:0 0 100%; order:1;';

    function renderLevel(label, list, key) {
      var cleanList = list.filter(function(x) { return x && x.trim() !== ''; });
      if (cleanList.length <= 1) { if(cleanList.length === 1) window.vollaSelected[key] = cleanList[0]; return; }
      var group = document.createElement('div'); group.innerHTML = '<div style="font-weight:600; font-size:14px; margin:10px 0 5px; color:#333;">' + label + '</div>';
      var btnWrap = document.createElement('div'); btnWrap.style.display = 'flex'; btnWrap.style.flexWrap = 'wrap'; btnWrap.style.gap = '8px';

      cleanList.forEach(function(val) {
        var btn = document.createElement('div'); btn.innerText = val; btn.className = 'variant-btn-' + key;
        btn.style.cssText = 'padding:8px 16px; border:1px solid #ccc; border-radius:4px; cursor:pointer; font-size:13px; background:#fff; color:#333; transition:0.2s;';
        btn.onclick = function() {
          var isAlreadySelected = (window.vollaSelected[key] === val);
          if (isAlreadySelected) {
              window.vollaSelected[key] = null; btn.classList.remove('active-variant'); btn.style.borderColor = '#ccc'; btn.style.color = '#333'; btn.style.background = '#fff';
          } else {
              window.vollaSelected[key] = val;
              var validVariants = Object.values(variants);
              var stillValid = validVariants.some(function(v) { return (!window.vollaSelected.jenis || v.jenis === window.vollaSelected.jenis) && (!window.vollaSelected.mutiara || v.mutiara === window.vollaSelected.mutiara) && (!window.vollaSelected.rangka || v.rangka === window.vollaSelected.rangka) && (!window.vollaSelected.batu || v.batu === window.vollaSelected.batu); });
              if (!stillValid) { window.vollaSelected = { jenis: null, mutiara: null, rangka: null, batu: null, fallback: null }; window.vollaSelected[key] = val; document.querySelectorAll('[class^="variant-btn-"]').forEach(function(b) { b.classList.remove('active-variant'); b.style.borderColor = '#ccc'; b.style.color = '#333'; b.style.background = '#fff'; });
              } else { group.querySelectorAll('.variant-btn-' + key).forEach(function(b) { b.classList.remove('active-variant'); b.style.borderColor = '#ccc'; b.style.color = '#333'; b.style.background = '#fff'; }); }
              btn.style.borderColor = VOLLA_COLOR; btn.style.color = VOLLA_COLOR; btn.classList.add('active-variant');
          } validateSelection();
        }; btnWrap.appendChild(btn);
      }); group.appendChild(btnWrap); uiContainer.appendChild(group);
    }

    var options = extractVariantOptions(variants);
    if (isMultiLevel) { renderLevel("Pilih Jenis", options.jenis, "jenis"); renderLevel("Warna Mutiara", options.mutiara, "mutiara"); renderLevel("Warna Rangka", options.rangka, "rangka"); renderLevel("Jenis Batu", options.batu, "batu");
    } else { var fallbackOptions = []; optionsKeys.forEach(function(k) { fallbackOptions.push(variants[k].optName || k); }); renderLevel(currentProduct.label || "Pilih Varian", fallbackOptions, "fallback"); }

    parent.insertBefore(uiContainer, cartBtns[0]);

    function validateSelection() {
      var sel = window.vollaSelected, found = null, validVariants = Object.values(variants);
      if (isMultiLevel) {
          ['jenis', 'mutiara', 'rangka', 'batu'].forEach(function(cat) {
              var btns = document.querySelectorAll('.variant-btn-' + cat);
              btns.forEach(function(btn) {
                  var val = btn.innerText.trim();
                  var isPossible = validVariants.some(function(v) {
                      var matchOther = true;
                      if (cat !== 'jenis' && sel.jenis && v.jenis !== sel.jenis) matchOther = false;
                      if (cat !== 'mutiara' && sel.mutiara && v.mutiara !== sel.mutiara) matchOther = false;
                      if (cat !== 'rangka' && sel.rangka && v.rangka !== sel.rangka) matchOther = false;
                      if (cat !== 'batu' && sel.batu && v.batu !== sel.batu) matchOther = false;
                      return matchOther && v[cat] === val;
                  });
                  if (!isPossible) {
                      btn.style.display = 'inline-block'; btn.style.opacity = '0.4'; btn.style.pointerEvents = 'none'; btn.style.background = '#f9f9f9'; btn.style.color = '#aaa'; btn.style.borderColor = '#eee';
                      if (sel[cat] === val) { sel[cat] = null; btn.classList.remove('active-variant'); }
                  } else {
                      btn.style.display = 'inline-block'; btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; btn.style.color = btn.classList.contains('active-variant') ? VOLLA_COLOR : '#333'; btn.style.background = '#fff';
                      if (!btn.classList.contains('active-variant')) btn.style.borderColor = '#ccc';
                  }
              });
              var groupDiv = btns.length > 0 ? btns[0].parentElement.parentElement : null; if (groupDiv) groupDiv.style.display = 'block';
          });
          var matches = validVariants.filter(function(v) { return (!sel.jenis || v.jenis === sel.jenis) && (!sel.mutiara || v.mutiara === sel.mutiara) && (!sel.rangka || v.rangka === sel.rangka) && (!sel.batu || v.batu === sel.batu); });
          if (matches.length === 1) {
              var m = matches[0], isComplete = true;
              if (m.jenis && !sel.jenis) isComplete = false; if (m.mutiara && !sel.mutiara) isComplete = false; if (m.rangka && !sel.rangka) isComplete = false; if (m.batu && !sel.batu) isComplete = false;
              if (isComplete) found = m;
          }
      } else {
          var isComplete = !!sel.fallback;
          if (isComplete) { var foundKey = Object.keys(variants).find(function(k) { return variants[k].optName === sel.fallback || k === sel.fallback; }); found = foundKey ? variants[foundKey] : null; }
      }

      if (found) { updateDisplayAndCart(found, found.optName);
      } else {
        cartBtns.forEach(function(btn) { btn.style.pointerEvents = 'none'; btn.style.opacity = '0.5'; btn.style.setProperty('background', 'var(--key)', 'important'); btn.innerHTML = '<span style="margin-left:8px;">Pilih Detail Dulu</span>'; });
        var priceDisplay = document.querySelector('.is_single article.is_post .price, .price, .product-price');
        if (priceDisplay && currentProduct && currentProduct.hargaFinal) priceDisplay.innerHTML = '<b style="color:' + VOLLA_COLOR + ';">' + formatRupiah(currentProduct.hargaFinal) + '</b>'; 
      }
    }

    function updateDisplayAndCart(finalData, variantName) {
        var priceDisplay = document.querySelector('.is_single article.is_post .price, .price, .product-price');
        var pageTitleEl = document.querySelector('h1.post-title, h1.product-title, .post-title h1, .product-title h1, h1[itemprop="name"], h1');
        var finalTitle = pageTitleEl ? pageTitleEl.innerText.trim() : currentProduct.namaUtama;

        if (priceDisplay) {
          var html = '', hNormal = finalData.hargaNormal || 0, hFinal = finalData.hargaFinal || hNormal, dPersen = finalData.diskon || 0;
          if(hNormal > hFinal){ html = '<s style="opacity:0.6; font-size:0.9em; margin-right:10px;">' + formatRupiah(hNormal) + '</s><b style="color:' + VOLLA_COLOR + ';">' + formatRupiah(hFinal) + '</b>'; if(dPersen > 0) html += ' <small style="background:#ee4d2d; color:white; padding:2px 8px; border-radius:4px; margin-left:10px;">-' + dPersen + '%</small>'; 
          } else { html = '<b style="color:' + VOLLA_COLOR + ';">' + formatRupiah(hFinal) + '</b>'; }
          priceDisplay.innerHTML = html;
          priceDisplay.setAttribute('data-harga-final', hFinal); priceDisplay.setAttribute('data-harga-normal', hNormal); priceDisplay.setAttribute('data-nama-final', finalTitle); priceDisplay.setAttribute('data-varian-final', variantName); 
        }
        var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'), baseId = currentProduct.id || window.location.pathname.replace(/[\/\.]/g, '-'), checkId = baseId + (variantName ? '-' + normalize(variantName) : ''), isAdded = cart.items.some(function(it){ return it.id === checkId; });
        cartBtns.forEach(function(cb) { cb.style.pointerEvents = 'auto'; cb.style.opacity = '1'; if(isAdded){ cb.style.setProperty('background', '#27ae60', 'important'); } else { cb.style.setProperty('background', 'var(--key)', 'important'); } cb.innerHTML = '<div style="display:flex; align-items:center; justify-content:center;">' + (isAdded ? '✓<span style="margin-left:8px;">Di Keranjang</span>' : CART_ICON + '<span style="margin-left:8px;">+ Tambahkan</span>') + '</div>'; });
    }
    validateSelection(); 
  }
}

function updateIndexPrices(produkData){
  if(!produkData || Object.keys(produkData).length === 0) return;
  document.querySelectorAll('.product, .item, article, li, .related-post-item, .post, .card, .grid-item').forEach(container => {
     var titleEl = container.querySelector('.title, h2, h3, h4, .post-title, .product-title');
     if (!titleEl) { var links = container.querySelectorAll('a'); for (var i = 0; i < links.length; i++) { if (links[i].innerText.trim().length > 3) { titleEl = links[i]; break; } } }
     if (titleEl) {
         var fullTitle = titleEl.innerText || "", keyword = fullTitle.toLowerCase().replace(/[^\w\s]/g, '').split(' ')[0].trim(), data = produkData[keyword] || produkData[keyword.replace(/\s+/g, '')];
         if (data) {
             var priceEls = container.querySelectorAll('.price, .product-price, .item-price, .harga');
             priceEls.forEach(priceEl => {
                 if (priceEl.getAttribute("data-auto-price") === "true" && !priceEl.innerText.includes('NaN')) return;
                 var hNormal = data.hargaNormal, hDiskon = data.hargaDiskon, hFinal = data.hargaFinal, dPersen = data.diskon, isSet = fullTitle.toLowerCase().includes('set'), spec = getVariationData(keyword, '', fullTitle);
                 if (!isSet && spec.normal > 0) { hNormal = spec.normal; hFinal = spec.final; hDiskon = spec.discount > 0 ? spec.final : 0; dPersen = spec.discount; }
                 var html = '';
                 if(hDiskon > 0 && hNormal > hDiskon){ html = '<s style="opacity:0.6; font-size:0.85em; margin-right:8px;">' + formatRupiah(hNormal) + '</s><b style="color:' + VOLLA_COLOR + ';">' + formatRupiah(hDiskon) + '</b>'; if(dPersen > 0) html += ' <small style="background:#ee4d2d; color:white; padding:2px 6px; border-radius:4px; margin-left:8px; font-size:0.75em;">-' + dPersen + '%</small>';
                 } else { html = '<b style="color:' + VOLLA_COLOR + ';">' + formatRupiah(hFinal) + '</b>'; }
                 priceEl.innerHTML = html; priceEl.setAttribute("data-auto-price", "true");
             });
         }
     }
  });
}

function updateSingleProduct(data){
  currentProduct = data; var baseName = data.id, silverFixVariants = buildVariantMatrixFromSilverFix(baseName);
  if (Object.keys(silverFixVariants).length > 0) { currentProduct.variants = silverFixVariants; } else { currentProduct.variants = data.variants || {}; }
  var pageTitleEl = document.querySelector('h1.post-title, h1.product-title, .post-title h1, .product-title h1, h1[itemprop="name"], h1'), pageTitle = pageTitleEl ? pageTitleEl.innerText.trim() : document.title, spec = getVariationData(data.id, '', pageTitle);
  if(spec.normal > 0) { currentProduct.hargaNormal = spec.normal; currentProduct.hargaFinal = spec.final; currentProduct.hargaDiskon = spec.discount > 0 ? spec.final : 0; currentProduct.diskon = spec.discount; }
  var target = document.querySelector(".post-body, .entry-content");
  if(target && data.desc){
    var savedElements = []; target.querySelectorAll('table.variant, table.image').forEach(function(el){ if(el.classList.contains('image') || el.querySelector('td[data-id]')) { savedElements.push(el.cloneNode(true)); } });
    target.innerHTML = data.desc.replace(/\n/g, '<br>').replace(/\. /g, '.<br><br>'); savedElements.forEach(function(el){ target.appendChild(el); });
  }
  var priceEl = document.querySelector('.is_single article.is_post .price, .price, .product-price');
  if(priceEl){
    var html = '';
    if(data.hargaDiskon > 0 && data.hargaNormal > data.hargaDiskon){ html = '<s style="opacity:0.6; font-size:0.9em; margin-right:10px;">' + formatRupiah(data.hargaNormal) + '</s><b style="color:' + VOLLA_COLOR + ';">' + formatRupiah(data.hargaDiskon) + '</b>'; if(data.diskon > 0) html += ' <small style="background:#ee4d2d; color:white; padding:2px 8px; border-radius:4px; margin-left:10px;">-' + data.diskon + '%</small>'; priceEl.innerHTML = html; priceEl.setAttribute('data-harga-final', data.hargaDiskon); priceEl.setAttribute('data-harga-normal', data.hargaNormal); } else { priceEl.innerHTML = '<b style="color:' + VOLLA_COLOR + ';">' + formatRupiah(data.hargaFinal) + '</b>'; priceEl.setAttribute('data-harga-final', data.hargaFinal); priceEl.setAttribute('data-harga-normal', data.hargaNormal); }
  }
  var priceTextShare = "Harga: " + formatRupiah(data.hargaFinal);
  if(data.hargaDiskon > 0 && data.hargaNormal > data.hargaDiskon) { priceTextShare = "Promo: " + formatRupiah(data.hargaDiskon) + " (Diskon " + data.diskon + "%)"; }
  setTimeout(function() { initVariantSelection(); }, 300);
}

function buildCartUI(){
    var html = '<div class="volla-modal-content"><div style="background:#fff; padding:14px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 1px 2px rgba(0,0,0,0.05); z-index:10;"><button id="close-cart-modal" style="border:none; background:none; font-size:24px; cursor:pointer; padding:0; color:#333;">&#8592;</button><div style="font-weight:600; font-size:16px; flex:1; color:#333;">Halaman Checkout <span id="cart-item-count-mobile" style="color:#888; font-weight:normal; font-size:14px;"></span></div><button id="close-cart-modal-x" style="border:none; background:none; font-size:20px; font-weight:bold; cursor:pointer; color:#999; padding:0;">✕</button></div><div class="volla-scroll-area"><div class="volla-card"><div class="volla-card-title"><span style="color:#ee4d2d; font-size:16px;">📍</span> Alamat Pengiriman</div><input type="text" id="form-nama" class="volla-input-modern" placeholder="Nama Lengkap Penerima" value="'+formData.nama+'"><input type="tel" id="form-hp" class="volla-input-modern" placeholder="No. Telepon / WhatsApp" value="'+formData.hp+'"><textarea id="form-alamat" class="volla-input-modern" placeholder="Detail Alamat (Nama Jalan, No. Rumah, RT/RW)" rows="2" style="resize:vertical;">'+formData.alamat+'</textarea><div style="position:relative; margin-top:4px;"><input type="text" id="ship-search" class="volla-input-modern" placeholder="Kelurahan (contoh: Kemayoran)" autocomplete="off"><div id="ship-results" style="position:absolute; top:100%; left:0; width:100%; background:#fff; border:1px solid #ddd; border-radius:0 0 8px 8px; max-height:160px; overflow-y:auto; z-index:99; display:none; box-shadow:0 4px 6px rgba(0,0,0,0.1);"></div></div><div id="ship-loader" class="ship-loading">Mencari lokasi...</div><div id="ship-info-box" style="margin-top:12px; display:none; padding:10px; background:#fff5f5; border:1px solid #fadbd8; border-radius:8px; font-size:12px; color:#e74c3c;"></div></div><div class="volla-card"><div class="volla-card-title"><span style="color:#ee4d2d; font-size:16px;">📦</span> Detail Produk</div><div id="cart-items-section"></div></div><div class="volla-card"><div class="volla-card-title"><span style="color:#ee4d2d; font-size:16px;">🎟️</span> Voucher / Promo</div><div id="voucher-chip-list" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:8px;"></div><div style="display:flex; gap:8px; align-items:center;"><input type="text" id="voucher-input" class="volla-input-modern" placeholder="Masukkan Kode Voucher" style="flex:1; padding:8px 0;"><button id="apply-voucher-btn" style="background:#f5f5f5; border:1px solid #ddd; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer; color:#333; height:fit-content;">Pakai</button></div><div id="voucher-message" style="font-size:12px; margin-top:6px;"></div><div id="active-voucher-info" style="display:none; margin-top:12px; padding:10px; background:#e8edf5; border-radius:8px; border-left:4px solid #1a2b4c;"><div style="display:flex; justify-content:space-between; align-items:center;"><div><span style="font-weight:600; color:#1a2b4c;" id="active-voucher-code"></span><div id="active-voucher-desc" style="color:#666; font-size:12px; margin-top:2px;"></div></div><button onclick="window.removeVoucher()" style="background:none; border:none; color:#e74c3c; font-size:12px; font-weight:bold; cursor:pointer;">Hapus</button></div></div></div><div class="volla-card"><div class="volla-card-title"><span style="color:#ee4d2d; font-size:16px;">🧾</span> Rincian Pembayaran</div><div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#555;"><span>Subtotal Produk</span><span id="cart-total-normal">Rp0</span></div><div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#555;"><span>Diskon Produk</span><span id="cart-total-diskon" style="color:#ee4d2d;">-Rp0</span></div><div id="voucher-discount-row" style="display:none; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#555;"><span>Diskon Voucher</span><span id="voucher-discount-amount" style="color:#ee4d2d;">-Rp0</span></div><div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#555;"><span id="shipping-name-display">Ongkos Kirim</span><span id="shipping-cost">Rp0</span></div><div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#555;"><span>Kode Unik</span><span id="kode-unik-amount" style="color:#27ae60;">Rp0</span></div></div></div><div class="volla-sticky-bottom"><div style="display:flex; align-items:center; gap:8px;"><label style="display:flex; align-items:center; gap:6px; cursor:pointer; margin:0;"><input type="checkbox" id="select-all-cart" style="accent-color:#1a2b4c; width:18px; height:18px; cursor:pointer;"> <span style="font-size:13px; color:#555; font-weight:500;">Semua</span></label><button id="delete-selected-btn" style="color:#ee4d2d; background:none; border:none; font-size:13px; font-weight:600; cursor:pointer; padding:4px;">Hapus</button></div><div style="display:flex; align-items:center; gap:12px;"><div style="text-align:right;"><div style="font-size:11px; color:#666;">Total Pembayaran</div><div id="cart-total" style="font-size:16px; font-weight:700; color:#1a2b4c;">Rp0</div></div><button id="checkout-btn" style="background:#1a2b4c; color:#fff; border:none; border-radius:6px; padding:10px 6px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(238,77,45,0.3);">Checkout (<span id="selected-count">0</span>)</button></div></div><div id="empty-cart-state" style="display:none; flex:1; flex-direction:column; align-items:center; justify-content:center; background:#fff; text-align:center;"><div style="font-size:64px; margin-bottom:16px; opacity:0.8;">🛒</div><h3 style="color:#333; margin-bottom:8px; font-size:18px;">Keranjang Kosong</h3><p style="color:#888; font-size:14px; margin-bottom:24px;">Pilih produk cantikmu dulu yuk!</p><button id="start-shopping-btn" style="background:#1a2b4c; color:#fff; border:none; border-radius:24px; padding:12px 32px; font-weight:600; font-size:14px; cursor:pointer; box-shadow:0 4px 10px rgba(26,43,76,0.2);">Mulai Belanja</button></div></div>';
    return html;
}

function initCart(){
      if(cartInitialized) return; cartInitialized = true;
      
      var btn = document.createElement('div'); btn.id = 'custom-cart-btn'; 
      btn.style.cssText = 'position:fixed; bottom:20px; right:20px; width:56px; height:56px; background:transparent; z-index:9999; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:transform 0.2s ease;'; 
      btn.innerHTML = '<span style="position:absolute; top:2px; right:0px; background:#ee4d2d; color:white; border-radius:50%; min-width:18px; height:18px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; border:1px solid #fff;" id="custom-cart-count">0</span><svg width="24" height="24" viewBox="0 0 24 24" fill="' + VOLLA_COLOR + '"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>'; 
      document.body.appendChild(btn);
      
      var moveAttempts = 0;
      var moveCartInterval = setInterval(function() {
        moveAttempts++;
        var oldCart = document.querySelector('.cart-button, #cart-btn, .cart-btn-head, .cart-icon, .header-cart');
        var searchIcon = document.querySelector('.show-search, .search-icon, .header-search, .search-button, .search-toggle');
        var headerRight = document.querySelector('.header-right, .header-action, .top-right');
        var targetEl = oldCart || searchIcon;
        
        if (targetEl && targetEl.parentNode) {
           btn.style.position = 'relative'; btn.style.bottom = 'auto'; btn.style.right = 'auto'; btn.style.width = '38px'; btn.style.height = '38px'; btn.style.margin = '12px 20px 0 10px'; btn.style.boxShadow = 'none'; btn.style.flexShrink = '0'; btn.style.display = 'inline-flex'; btn.style.verticalAlign = 'middle';
           var svg = btn.querySelector('svg'); if(svg) { svg.setAttribute('width', '24'); svg.setAttribute('height', '24'); }
           var count = document.getElementById('custom-cart-count'); if(count) { count.style.minWidth = '16px'; count.style.height = '16px'; count.style.fontSize = '9px'; count.style.top = '2px'; count.style.right = '0px'; }
           targetEl.parentNode.insertBefore(btn, targetEl.nextSibling); clearInterval(moveCartInterval);
        } else if (headerRight) {
           btn.style.position = 'relative'; btn.style.bottom = 'auto'; btn.style.right = 'auto'; btn.style.width = '38px'; btn.style.height = '38px'; btn.style.margin = '12px 20px 0 10px'; btn.style.boxShadow = 'none'; btn.style.flexShrink = '0'; btn.style.display = 'inline-flex'; btn.style.verticalAlign = 'middle';
           var svg = btn.querySelector('svg'); if(svg) { svg.setAttribute('width', '24'); svg.setAttribute('height', '24'); }
           var count = document.getElementById('custom-cart-count'); if(count) { count.style.minWidth = '16px'; count.style.height = '16px'; count.style.fontSize = '9px'; count.style.top = '2px'; count.style.right = '0px'; }
           headerRight.appendChild(btn); clearInterval(moveCartInterval);
        }
        if (moveAttempts > 15) clearInterval(moveCartInterval); 
      }, 400);

      var isMobile = window.innerWidth <= 768; var modal = document.createElement('div'); modal.id = 'cart-modal'; modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999; display:none; align-items:center; justify-content:center;'; var modalContent = document.createElement('div'); modalContent.style.cssText = isMobile ? 'width:100%; height:100%; background:white; overflow:hidden;' : 'width:480px; max-width:95%; height:100vh; max-height:100vh; background:white; overflow:hidden; display:flex; flex-direction:column; margin:0;'; modalContent.innerHTML = buildCartUI(); modal.appendChild(modalContent); document.body.appendChild(modal);
      
      function openCart(){ modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden'; var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'); toggleEmptyState(cart); if(cart.items.length > 0){ document.getElementById('form-nama').value = formData.nama; document.getElementById('form-alamat').value = formData.alamat; document.getElementById('form-hp').value = formData.hp; renderCart(); } }
      function closeCart(){ var namaEl = document.getElementById('form-nama'); if(namaEl) formData.nama = namaEl.value; var alamatEl = document.getElementById('form-alamat'); if(alamatEl) formData.alamat = alamatEl.value; var hpEl = document.getElementById('form-hp'); if(hpEl) formData.hp = hpEl.value; modal.style.display = 'none'; document.body.style.overflow = ''; document.documentElement.style.overflow = ''; }
      
      modal.addEventListener('click', function(e){ if(e.target === modal) closeCart(); });
      btn.addEventListener('click', openCart);
      
      var closeBtnLeft = document.getElementById('close-cart-modal'); if(closeBtnLeft) closeBtnLeft.addEventListener('click', closeCart);
      var closeBtnRight = document.getElementById('close-cart-modal-x'); if(closeBtnRight) closeBtnRight.addEventListener('click', closeCart);
      var startBtn = document.getElementById('start-shopping-btn'); if(startBtn) startBtn.addEventListener('click', closeCart);

      document.getElementById('ship-search').addEventListener('input', function(e) {
        var val = e.target.value; var resDiv = document.getElementById('ship-results');
        if(val.length < 3) { resDiv.style.display = 'none'; return; }
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
          document.getElementById('ship-loader').innerText = 'Mencari lokasi...'; document.getElementById('ship-loader').style.display = 'block';
          fetch(RAJAONGKIR_URL + '?action=search&keyword=' + encodeURIComponent(val)).then(r => r.json()).then(data => {
             document.getElementById('ship-loader').style.display = 'none';
             if(data.data && data.data.length > 0) {
                let html = ''; data.data.forEach(loc => { html += `<div class="loc-item" onclick="window.selectLocation('${loc.id}', '${loc.label.replace(/'/g, "\\'")}')" style="padding:10px 12px; border-bottom:1px solid #eee; cursor:pointer; font-size:12px; line-height:1.4; color:#333;">${loc.label}</div>`; });
                resDiv.innerHTML = html; resDiv.style.display = 'block';
             } else { resDiv.innerHTML = '<div style="padding:10px; font-size:12px; color:#999; text-align:center;">Lokasi tidak ditemukan</div>'; resDiv.style.display = 'block'; }
          }).catch(err => { document.getElementById('ship-loader').style.display = 'none'; });
        }, 800);
      });

      window.selectLocation = function(id, label) {
         document.getElementById('ship-search').value = label; document.getElementById('ship-results').style.display = 'none'; document.getElementById('ship-loader').innerText = 'Menghitung Ongkir JNE REG...'; document.getElementById('ship-loader').style.display = 'block'; document.getElementById('ship-info-box').style.display = 'none'; activeShipping.locationLabel = label;
         fetch(RAJAONGKIR_URL + '?action=cost&destination=' + id).then(r => r.json()).then(data => {
            document.getElementById('ship-loader').style.display = 'none';
            if(data.data && data.data.length > 0) {
               var reg = data.data.find(c => c.service.toUpperCase().includes("REG") || c.service.toUpperCase().includes("EZ")); if(!reg) reg = data.data[0]; 
               activeShipping.cost = reg.cost;
               document.getElementById('ship-info-box').innerHTML = `JNE ${reg.service}: ${formatRupiah(reg.cost)}<br><small style="color:#333;">Estimasi waktu tiba: ${reg.etd} hari kerja</small>`; document.getElementById('ship-info-box').style.display = 'block';
               var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'); updateSummary(cart);
            } else { alert("Ongkir JNE ke lokasi ini belum tersedia di sistem. Coba pilih lokasi yang lebih umum."); }
         }).catch(err => { document.getElementById('ship-loader').style.display = 'none'; alert("Gagal menghitung ongkir."); });
      }

      document.addEventListener('click', function(e) { var resDiv = document.getElementById('ship-results'); if(resDiv && e.target.id !== 'ship-search' && !resDiv.contains(e.target)) { resDiv.style.display = 'none'; } });
      
      function toggleEmptyState(cart){ 
        var scrollArea = document.querySelector('.volla-scroll-area'), stickyBottom = document.querySelector('.volla-sticky-bottom'), emptyState = document.getElementById('empty-cart-state'); 
        if(cart && cart.items && cart.items.length === 0){ 
            if(scrollArea) scrollArea.style.setProperty('display', 'none', 'important'); 
            if(stickyBottom) stickyBottom.style.setProperty('display', 'none', 'important'); 
            if(emptyState) emptyState.style.setProperty('display', 'flex', 'important'); 
        } else { 
            if(scrollArea) scrollArea.style.setProperty('display', 'block', 'important'); 
            if(stickyBottom) stickyBottom.style.setProperty('display', 'flex', 'important'); 
            if(emptyState) emptyState.style.setProperty('display', 'none', 'important'); 
        } 
      }
      
      function renderCart(){
        var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}');
        toggleEmptyState(cart); updateCartCount(cart); if(cart.items.length === 0) return; 
        var container = document.getElementById('cart-items-section'); cart.items.forEach(item => { if(selectedItems[item.id] === undefined) selectedItems[item.id] = true; });
        var html = '';
        for(var i = 0; i < cart.items.length; i++){
          var item = cart.items[i]; item.price = parseInt(item.price) || 0; item.qty = parseInt(item.qty) || 1; 
          var hargaNormal = item.hargaNormal || item.price, adaDiskon = hargaNormal > item.price;
          var img = item.image || 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg181NKy2wqqqz9obS6i7dbVBbHq0A1bwoaGUxJhcpnfFmDNKZRkHBgscfe9k9nKdtkFAdVaheKaCnl2f3oHKxavk5pPAbUY6-fAw5BgR32pQCQrzjdHD6P5zrnk1eknGY82TzVUj6gtpH0/w100-c-h100/no-image-icon.png';
          var checked = selectedItems[item.id] ? 'checked' : '', variantDisplay = item.variant;
          if(variantDisplay && !variantDisplay.includes('Jenis:')) { variantDisplay = 'Varian: ' + variantDisplay; }
          var variantHtml = item.variant ? '<div style="font-size:11px; color:#333; background:#f5f5f5; padding:4px 8px; border-radius:4px; display:inline-block; margin-top:4px;">' + variantDisplay + '</div>' : '';
          var itemLink = item.link || 'javascript:void(0);';

          html += '<div class="volla-cart-item"><input type="checkbox" class="cart-item-checkbox" data-id="' + item.id + '" ' + checked + ' style="width:18px; height:18px; accent-color:#1a2b4c; margin-top:28px; cursor:pointer;"><a href="' + itemLink + '" style="display:block;"><img src="' + img + '" class="volla-cart-img"></a><div style="flex:1; min-width:0; display:flex; flex-direction:column; justify-content:space-between;"><div><a href="' + itemLink + '" style="font-size:13px; font-weight:600; color:#333; text-decoration:none; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.4;">' + item.name + '</a>' + variantHtml + '</div><div style="display:flex; justify-content:space-between; align-items:flex-end;"><div>';
          if(adaDiskon) { html += '<div style="font-size:11px; color:#999; text-decoration:line-through;">' + formatRupiah(hargaNormal) + '</div><div style="font-size:14px; font-weight:700; color:#ee4d2d;">' + formatRupiah(item.price) + '</div>';
          } else { html += '<div style="font-size:14px; font-weight:700; color:#ee4d2d;">' + formatRupiah(item.price) + '</div>'; }
          html += '</div><div style="display:flex; align-items:center; border:1px solid #e0e0e0; border-radius:4px; overflow:hidden;"><button onclick="window.updateCartQty(\'' + item.id + '\', ' + (item.qty - 1) + ')" class="volla-qty-btn">−</button><span style="width:32px; text-align:center; font-size:13px; color:#333; font-weight:500;">' + item.qty + '</span><button onclick="window.updateCartQty(\'' + item.id + '\', ' + (item.qty + 1) + ')" class="volla-qty-btn">+</button></div></div></div></div>';
        }
        container.innerHTML = html;
        document.querySelectorAll('.cart-item-checkbox').forEach(cb => { cb.addEventListener('change', function(){ selectedItems[this.dataset.id] = this.checked; updateSelectAll(); updateSummary(cart); }); }); 
        document.getElementById('select-all-cart').addEventListener('change', function(){ var checked = this.checked; document.querySelectorAll('.cart-item-checkbox').forEach(cb => { cb.checked = checked; selectedItems[cb.dataset.id] = checked; }); updateSelectAll(); updateSummary(cart); }); 
        updateSelectAll(); updateSummary(cart);
      }

      function updateSelectAll(){ var all = document.querySelectorAll('.cart-item-checkbox'), checked = document.querySelectorAll('.cart-item-checkbox:checked'), selectAll = document.getElementById('select-all-cart'), delBtn = document.getElementById('delete-selected-btn'); if(selectAll && all.length > 0){ selectAll.checked = all.length === checked.length; selectAll.indeterminate = checked.length > 0 && all.length !== checked.length; } if(delBtn) { delBtn.style.display = checked.length > 0 ? 'block' : 'none'; } }
      
      function updateSummary(cart){
        var subtotal = 0, totalNormal = 0, totalDiskon = 0, selectedCount = 0;
        for(var i = 0; i < cart.items.length; i++){ var item = cart.items[i]; item.price = parseInt(item.price) || 0; item.qty = parseInt(item.qty) || 1; if(selectedItems[item.id]){ subtotal += item.price * item.qty; var normal = parseInt(item.hargaNormal) || item.price; totalNormal += normal * item.qty; totalDiskon += (normal - item.price) * item.qty; selectedCount++; } }
        var voucherDiscount = 0; if(activeVoucher){ voucherDiscount = calculateVoucherDiscount(subtotal, activeVoucher); if(voucherDiscount === -1){ voucherDiscount = 0; activeVoucher = null; } }
        var finalTotal = subtotal - voucherDiscount + activeShipping.cost; if(finalTotal < 0) finalTotal = activeShipping.cost;
        var uniqueCode = 0; if (selectedCount > 0) { uniqueCode = getUniqueCode(); finalTotal += uniqueCode; }

        document.getElementById('cart-total').innerText = formatRupiah(finalTotal); document.getElementById('cart-total-normal').innerText = formatRupiah(totalNormal);
        document.getElementById('cart-total-diskon').innerText = '- ' + formatRupiah(totalDiskon); document.getElementById('shipping-cost').innerText = formatRupiah(activeShipping.cost); document.getElementById('selected-count').innerText = selectedCount;
        var kodeUnikEl = document.getElementById('kode-unik-amount'); if(kodeUnikEl) kodeUnikEl.innerText = formatRupiah(uniqueCode);
        var shipNameEl = document.getElementById('shipping-name-display'); if(shipNameEl) shipNameEl.innerText = activeShipping.cost > 0 ? "Ongkos Kirim JNE REG" : "Ongkos Kirim";
        
        var voucherRow = document.getElementById('voucher-discount-row'), voucherAmount = document.getElementById('voucher-discount-amount'), activeInfo = document.getElementById('active-voucher-info');
        if(voucherDiscount > 0){ 
            voucherRow.style.display = 'flex'; voucherAmount.innerText = '- ' + formatRupiah(voucherDiscount); activeInfo.style.display = 'block'; document.getElementById('active-voucher-code').innerText = activeVoucher; 
            var codeStr = String(activeVoucher).toUpperCase();
            if(validSheetVouchers[codeStr]){
                document.getElementById('active-voucher-desc').innerText = 'Potongan ' + validSheetVouchers[codeStr] + '% (Member)';
            } else {
                var v = ALL_VOUCHERS[codeStr];
                if(v) {
                   var desc = 'Potongan ' + (v.type === 'percent' ? v.value + '%' : formatRupiah(v.value));
                   if(v.maxDiscount) desc += ' (Maks. ' + formatRupiah(v.maxDiscount) + ')';
                   document.getElementById('active-voucher-desc').innerText = desc;
                }
            }
        } else { voucherRow.style.display = 'none'; activeInfo.style.display = 'none'; }
      }
      
      function updateCartCount(cart){ var count = cart.items.reduce((s, i) => s + (i.qty || 1), 0); var countEl = document.getElementById('custom-cart-count'); if(countEl) countEl.innerText = count; var mobileCount = document.getElementById('cart-item-count-mobile'); if(mobileCount) mobileCount.innerText = '(' + count + ')'; }
      
      function calculateVoucherDiscount(subtotal, voucherCode){ 
        var code = String(voucherCode).toUpperCase();
        if(validSheetVouchers[code]) return Math.round(subtotal * validSheetVouchers[code] / 100);
        var v = ALL_VOUCHERS[code]; if(!v) return 0; if(v.minPurchase && subtotal < v.minPurchase) return -1; 
        var discount = 0; 
        if(v.type === "percent"){ 
            discount = Math.round(subtotal * v.value / 100); 
            if(v.maxDiscount && discount > v.maxDiscount) discount = v.maxDiscount; 
        } else if(v.type === "fixed"){ discount = v.value; } 
        return discount > subtotal ? subtotal : discount; 
      }
      
      function applyVoucher(code){ 
          var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'), subtotal = getSelectedSubtotal(cart), codeStr = String(code).toUpperCase();
          var usedVouchers = JSON.parse(localStorage.getItem('volla_used_vouchers') || '[]');
          
          if (usedVouchers.includes(codeStr)) return { success: false, message: 'Voucher ini sudah Kakak gunakan sebelumnya' };

          if (validSheetVouchers[codeStr]) {
              activeVoucher = codeStr; var persen = validSheetVouchers[codeStr];
              return { success: true, discount: Math.round(subtotal * persen / 100), message: 'Voucher Member '+persen+'% digunakan!' };
          }
          var v = ALL_VOUCHERS[codeStr];
          if(!v) return { success: false, message: 'Kode tidak valid atau tidak terdaftar' };
          if(v.minPurchase && subtotal < v.minPurchase) return { success: false, message: 'Min. belanja ' + formatRupiah(v.minPurchase) }; 
          
          activeVoucher = codeStr; 
          var diskonInfo = v.type === 'percent' ? v.value + '%' : formatRupiah(v.value);
          return { success: true, discount: calculateVoucherDiscount(subtotal, codeStr), message: 'Voucher Diskon '+ diskonInfo +' digunakan!' };
      }
      
      function getSelectedSubtotal(cart){ var subtotal = 0; for(var i = 0; i < cart.items.length; i++){ var item = cart.items[i]; if(selectedItems[item.id]) subtotal += (item.price || 0) * (item.qty || 1); } return subtotal; }

      document.getElementById('apply-voucher-btn').addEventListener('click', function(){ var code = document.getElementById('voucher-input').value.trim().toUpperCase(); if(!code) return; var result = applyVoucher(code); var msg = document.getElementById('voucher-message'); if(result.success){ msg.style.color = '#27ae60'; msg.innerText = result.message; renderCart(); } else { msg.style.color = '#e74c3c'; msg.innerText = ' ' + result.message; } });
      window.removeVoucher = function(){ activeVoucher = null; document.getElementById('voucher-message').innerHTML = ''; document.getElementById('voucher-input').value = ''; var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'); renderCart(); };
      window.updateCartQty = function(id, qty){ if(qty <= 0){ window.removeCartItem(id); return; } var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'); for(var i = 0; i < cart.items.length; i++){ if(cart.items[i].id === id){ cart.items[i].qty = qty; break; } } localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); };
      window.removeCartItem = function(id){ var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'); cart.items = cart.items.filter(it => it.id !== id); delete selectedItems[id]; if(cart.items.length === 0) activeVoucher = null; localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); initVariantSelection(); };
      document.getElementById('delete-selected-btn').addEventListener('click', function(){ var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'); cart.items = cart.items.filter(it => !selectedItems[it.id]); if(cart.items.length === 0) activeVoucher = null; localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); initVariantSelection(); });
      
      document.addEventListener('click', function(e){
        var btn = e.target.closest('.volla-add-btn'); if(!btn) return; e.preventDefault(); e.stopPropagation(); if(!currentProduct) return;
        var priceDisplay = document.querySelector('.is_single article.is_post .price, .price, .product-price');
        var rawPrice = priceDisplay ? priceDisplay.getAttribute('data-harga-final') : null, rawNormal = priceDisplay ? priceDisplay.getAttribute('data-harga-normal') : null;
        var price = parseInt(rawPrice) || currentProduct.hargaFinal, hNormal = parseInt(rawNormal) || currentProduct.hargaNormal || price;
        var pageTitleEl = document.querySelector('h1.post-title, h1.product-title, .post-title h1, .product-title h1, h1[itemprop="name"], h1');
        var fullName = pageTitleEl ? pageTitleEl.innerText.trim() : (currentProduct ? currentProduct.namaUtama : 'Produk');
        if(price <= 0) { alert("Maaf, harga produk belum tersedia."); return; }

        var variantName = priceDisplay ? priceDisplay.getAttribute('data-varian-final') : '';
        if (!variantName) { var activeVariants = document.querySelectorAll('#volla-variant-ui .active-variant'); if (activeVariants.length > 0) { variantName = activeVariants[0].textContent.trim(); } } else { if(currentProduct.variants && currentProduct.variants[variantName]){ variantName = currentProduct.variants[variantName].optName; } else { variantName = variantName.charAt(0).toUpperCase() + variantName.slice(1); } }

        var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'), found = false, baseId = currentProduct.id || window.location.pathname.replace(/[\/\.]/g, '-'), id = baseId + (variantName ? '-' + normalize(variantName) : '');
        for(var i = 0; i < cart.items.length; i++){ if(cart.items[i].id === id){ cart.items[i].qty = (cart.items[i].qty || 1) + 1; found = true; break; } }
        if(!found){ cart.items.push({ id: id, name: fullName, variant: variantName, price: price, hargaNormal: hNormal, image: getProductImageFromPage(), link: window.location.pathname, qty: 1 }); }
        localStorage.setItem(CART_KEY, JSON.stringify(cart)); selectedItems[id] = true; updateCartCount(cart);
        
        btn.style.setProperty('background', '#27ae60', 'important'); btn.innerHTML = '<div style="display:flex; align-items:center; justify-content:center;">✓<span style="margin-left:8px;">Di Keranjang</span></div>';
        showNotification(variantName ? fullName + ' (' + variantName + ')' : fullName);
        var cartNode = document.getElementById('custom-cart-btn');
        if (cartNode) {
          var btnRect = btn.getBoundingClientRect(), cartRect = cartNode.getBoundingClientRect(), flyingItem = document.createElement('div');
          flyingItem.className = 'volla-flying-item'; flyingItem.style.left = (btnRect.left + btnRect.width / 2 - 10) + 'px'; flyingItem.style.top = (btnRect.top + btnRect.height / 2 - 10) + 'px'; document.body.appendChild(flyingItem);
          void flyingItem.offsetWidth; flyingItem.style.left = (cartRect.left + cartRect.width / 2 - 10) + 'px'; flyingItem.style.top = (cartRect.top + cartRect.height / 2 - 10) + 'px'; flyingItem.style.transform = 'scale(0.1)'; flyingItem.style.opacity = '0';
          setTimeout(function() { if(document.body.contains(flyingItem)) document.body.removeChild(flyingItem); cartNode.style.transform = 'scale(1.2)'; setTimeout(function(){ cartNode.style.transform = 'scale(1)'; }, 200); }, 600);
        }
      });
      
      document.getElementById('checkout-btn').addEventListener('click', function(){ 
        var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'), selected = cart.items.filter(it => selectedItems[it.id]); 
        if(selected.length === 0){ alert('Pilih produk!'); return; } 
        var nama = document.getElementById('form-nama').value.trim(), alamat = document.getElementById('form-alamat').value.trim(), hp = document.getElementById('form-hp').value.trim();
        if(!nama || !alamat || !hp){ alert('Mohon lengkapi data pengiriman'); return; }
        if(activeShipping.cost === 0) { alert('Mohon pilih lokasi pengiriman untuk ongkir'); return; }

        var btnCheckout = document.getElementById('checkout-btn'), originalBtnText = btnCheckout.innerHTML;
        btnCheckout.innerText = "Memproses Pesanan..."; btnCheckout.style.pointerEvents = "none";

        var orderDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
        var uniqueCodeVal = getUniqueCode(), alamatLengkap = alamat;
        if(activeShipping.locationLabel && !alamat.includes(activeShipping.locationLabel)) { alamatLengkap += ', ' + activeShipping.locationLabel; }

        var subtotal = 0, totalNormal = 0, listPesananWA = '', detailPesananSheet = ''; 
        selected.forEach((it, index) => { 
          var normalPerItem = parseInt(it.hargaNormal) || it.price, variantText = it.variant ? ' (' + it.variant + ')' : '';
          detailPesananSheet += (index + 1) + ". " + it.name + variantText + "\n   Jml: " + it.qty + " pcs\n";
          if (normalPerItem > it.price) { var diskonPersen = Math.round(((normalPerItem - it.price) / normalPerItem) * 100); detailPesananSheet += "   Harga: " + formatRupiah(normalPerItem) + " -> " + formatRupiah(it.price) + " (-" + diskonPersen + "%)\n"; } else { detailPesananSheet += "   Harga: " + formatRupiah(it.price) + "\n"; }
          detailPesananSheet += "   Total: " + formatRupiah(it.price * it.qty) + "\n\n";

          listPesananWA += '• ' + it.name + variantText + '%0A'; 
          if(normalPerItem > it.price) { listPesananWA += '  ~' + formatRupiah(normalPerItem) + '~ - Rp ' + formatRupiah(normalPerItem - it.price).replace('Rp','') + ' = ' + formatRupiah(it.price) + '%0A'; } else { listPesananWA += '  ' + formatRupiah(it.price) + '%0A'; }
          if(it.qty > 1) listPesananWA += '  Jumlah: ' + it.qty + ' pcs = ' + formatRupiah(it.price * it.qty) + '%0A';
          listPesananWA += '%0A'; 
          subtotal += it.price * it.qty; totalNormal += normalPerItem * it.qty;
        }); 

        var voucherDiscount = activeVoucher ? calculateVoucherDiscount(subtotal, activeVoucher) : 0;
        var finalTotal = subtotal - voucherDiscount + activeShipping.cost + uniqueCodeVal;

        fetch(SCRIPT_GABUNGAN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ nama: nama, hp: hp, alamat: alamatLengkap, total_normal: totalNormal, subtotal: subtotal, ongkir: activeShipping.cost, total_bayar: finalTotal, kode_voucher: activeVoucher || "-", detail_pesanan: detailPesananSheet })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.status === "error_voucher") {
                alert(data.message); window.removeVoucher(); btnCheckout.innerHTML = originalBtnText; btnCheckout.style.pointerEvents = "auto";
                return Promise.reject("VOUCHER_DITOLAK"); 
            } 
            else if (data && data.status === "success") {
                if (activeVoucher && validSheetVouchers[activeVoucher]) {
                    var usedVouchers = JSON.parse(localStorage.getItem('volla_used_vouchers') || '[]');
                    if(!usedVouchers.includes(activeVoucher)) { usedVouchers.push(activeVoucher); localStorage.setItem('volla_used_vouchers', JSON.stringify(usedVouchers)); }
                }

                var memberMsg = '';
                if (data.isLevelUp) {
                    if (data.memberStatus === "VIP") { memberMsg = '🎉 *WOW LUAR BIASA!* Di pesanan ke-' + data.orderCount + ' ini, status Kakak resmi naik menjadi *Member VIP*! 👑%0A%0A🎁 *Voucher Khusus VIP:* Gunakan kode *' + data.promoCode + '* untuk tambahan diskon 30% di pesanan selanjutnya!';
                    } else if (data.memberStatus === "Gold") { memberMsg = '🎉 *SELAMAT!* Karena ini pesanan ke-' + data.orderCount + ' Kakak, status Kakak resmi naik jadi *Member GOLD*! 🌟%0A%0A🎁 *Voucher Khusus Gold:* Gunakan kode *' + data.promoCode + '* untuk tambahan diskon 20% di pesanan selanjutnya!'; }
                } else if (data.orderCount > 1) {
                    var diskonNominal = data.memberStatus === "VIP" ? "30%" : "20%";
                    memberMsg = '🌟 Senang melihat Kakak kembali! Terima kasih sudah belanja yang ke-' + data.orderCount + ' kalinya, *Member ' + data.memberStatus + '*! 🥰%0A%0A🎁 *Pengingat Voucher:* Jangan lupa gunakan kode *' + data.promoCode + '* untuk diskon ' + diskonNominal + ' di pesanan selanjutnya!';
                }

                var text = 'Halo Kak ' + nama + '!%0ABerikut detail pesanannya:%0A%0ATanggal : ' + orderDate + '%0ANo. Pesanan : ' + data.orderNumber + '%0APesanan via : Website%0A%0A*Penerima :*%0A——————%0ANama : ' + nama + '%0ANo hp : ' + hp + '%0AAlamat : ' + alamatLengkap + '%0A%0A*List Pesanan:*%0A——————%0A' + listPesananWA + '*Harga*%0A————%0A' + formatRupiah(totalNormal) + '%0A%0A';
                if(totalNormal > subtotal) { text += '*Diskon Produk*%0A————%0A' + formatRupiah(totalNormal - subtotal) + '%0A%0A'; }
                if(voucherDiscount > 0) { text += '*Voucher*%0A————%0A' + activeVoucher + ' - ' + formatRupiah(voucherDiscount) + '%0A%0A'; }
                text += '*Ongkir*%0A————%0AJNE REG - ' + formatRupiah(activeShipping.cost) + '%0A%0A*Kode Unik*%0A————%0A' + formatRupiah(uniqueCodeVal) + '%0A%0A*Total Bayar*%0A————%0A*' + formatRupiah(finalTotal) + '*%0A%0A*Catatan*%0A————%0A';
                if(memberMsg !== '') text += memberMsg + '%0A%0A'; else text += '%0A';
                text += 'Silakan transfer pembayaran ke:%0A💳 *Bank BCA*%0AA/N : Nur Afifah%0ARek : 7255186507%0A%0A_Pesanan akan di proses setelah pembayaran diterima._';

                var fonnteAPI = 'https://api.fonnte.com/send', formPayload = new FormData();
                formPayload.append('target', hp); formPayload.append('message', text.replace(/%0A/g, '\n')); formPayload.append('countryCode', '62');
                var orderSummary = { nama: nama, hp: hp, alamat: alamat, lokasi: activeShipping.locationLabel, timestamp: new Date().getTime(), items: selected, subtotal: subtotal, diskon: totalNormal - subtotal, voucher: voucherDiscount, voucherCode: activeVoucher || null, ongkir: activeShipping.cost, total: finalTotal, date: new Date().toLocaleDateString('id-ID') };
                localStorage.setItem('volla_last_order', JSON.stringify(orderSummary));
                return fetch(fonnteAPI, { method: 'POST', headers: { 'Authorization': '5dRUkEauBfcm5dax81CU' }, body: formPayload });
            } else { throw new Error("Gagal menyimpan ke Sheet"); }
        })
        .then((res) => { if(res) { incrementUniqueCode(); localStorage.setItem(CART_KEY, JSON.stringify({items:[],subtotal:0,totalQty:0})); window.location.href = '/p/thank-you.html'; } })
        .catch(err => { if(err !== "VOUCHER_DITOLAK") { alert('Terjadi kesalahan proses pesanan. Cek koneksi internet Anda.'); btnCheckout.innerHTML = originalBtnText; btnCheckout.style.pointerEvents = "auto"; } });
      });
      
      modal.addEventListener('input', function(e){ if(e.target.id === 'form-nama') formData.nama = e.target.value; if(e.target.id === 'form-alamat') formData.alamat = e.target.value; if(e.target.id === 'form-hp') formData.hp = e.target.value; });
      var cart = JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'); updateCartCount(cart);
    }

    setTimeout(function(){
      fetchAllData(function(allData){
        var isSingle = window.location.pathname.includes('.html');
        if(isSingle){ 
          var slug = getSlug(), slugSpaces = slug.replace(/-/g, ' '), foundKey = Object.keys(allData).find(k => k === slugSpaces || k === slug);
          if (!foundKey) { var possibleKeys = Object.keys(allData).filter(k => slugSpaces.startsWith(k) || slug.startsWith(k)); if (possibleKeys.length > 0) { possibleKeys.sort((a,b) => b.length - a.length); foundKey = possibleKeys[0]; } }
          var found = foundKey ? allData[foundKey] : null; if(found){ updateSingleProduct(found); initCart(); } 
          setTimeout(function(){ forceLoadImages(); }, 500);
        } else { 
          updateIndexPrices(allData); initCart(); forceLoadImages(); setTimeout(function(){ forceLoadImages(); }, 500); setTimeout(function(){ forceLoadImages(); }, 1000);
        }
        setInterval(function() { updateIndexPrices(allData); }, 1500);
      });
    }, 300);

    function forceLoadImages(){
      document.querySelectorAll('img[data-src]').forEach(function(img){ var src = img.getAttribute('data-src'); if(src && !img.src.includes(src)){ img.src = src; img.removeAttribute('data-src'); img.style.opacity = '1'; } });
      document.querySelectorAll('img').forEach(function(img){ if(!img.src || img.src === '' || img.src.includes('data:image')){ var dataSrc = img.getAttribute('data-src'); if(dataSrc){ img.src = dataSrc; } } if(img.style.opacity === '0'){ img.style.opacity = '1'; } });
      if(typeof window.applyLazyLoad === 'function') window.applyLazyLoad();
      if(typeof window.initLazyLoad === 'function') window.initLazyLoad();
      if(typeof window.lazyLoadInstance !== 'undefined') window.lazyLoadInstance.update();
    }
})();
