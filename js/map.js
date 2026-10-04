/* =========================================================
   map.js — интерактивная карта с точкой кабинета
   Использует Leaflet + светлые тайлы OpenStreetMap
   ========================================================= */

/* Координаты кабинета в Ярославле.
   Замени на реальный адрес, когда заказчик его даст.
   Найти координаты: открыть Google Maps → правый клик по точке
   → скопировать первые два числа. */
const OFFICE_COORDS = [57.626579, 39.893787];
const OFFICE_ZOOM = 16;

const OFFICE_TITLE = "Психолог Елена Морозова";
const OFFICE_ADDRESS = "Ярославль, ул. Примерная, 10";

/* =========================================================
   Инициализация карты
   ========================================================= */

export function initMap() {
  const mapElement = document.querySelector("#map");

  if (!mapElement) return;

  if (typeof L === "undefined") {
    console.warn("Leaflet не загрузился — карта пропущена.");
    return;
  }

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  }).setView(OFFICE_COORDS, OFFICE_ZOOM);

  /* Светлые тайлы OpenStreetMap — без API-ключа */

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      subdomains: "abc",
      maxZoom: 19,
      attribution: "&copy; участники OpenStreetMap",
    }
  ).addTo(map);

  /* Кастомный маркер через divIcon — чтобы не тянуть картинки */

  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div class="custom-marker__pin">
        <span class="custom-marker__dot"></span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const marker = L.marker(OFFICE_COORDS, {
    icon: markerIcon,
    title: OFFICE_TITLE,
  }).addTo(map);

  marker.bindPopup(
    `<strong>${OFFICE_TITLE}</strong><br>${OFFICE_ADDRESS}`
  );

  /* Разрешаем скролл-зум только после клика по карте.
     Иначе страница «залипает» при скролле мимо карты. */

  mapElement.addEventListener("click", () => {
    map.scrollWheelZoom.enable();
  });

  mapElement.addEventListener("mouseleave", () => {
    map.scrollWheelZoom.disable();
  });

  return map;
}
