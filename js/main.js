/* =========================================================
   main.js — точка входа
   Подключает модули формы и карты, вешает кнопку «Наверх»
   ========================================================= */

import { initForm } from "./form.js";
import { initMap } from "./map.js";

/* =========================================================
   Кнопка «Наверх»
   ========================================================= */

function initScrollTop() {
  const button = document.querySelector("#scroll-top");

  if (!button) return;

  const SCROLL_THRESHOLD = 400;

  function updateVisibility() {
    button.hidden = window.scrollY <= SCROLL_THRESHOLD;
  }

  window.addEventListener("scroll", updateVisibility, { passive: true });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateVisibility();
}

/* =========================================================
   Автозапуск после готовности DOM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initForm();
  initMap();
  initScrollTop();
});
