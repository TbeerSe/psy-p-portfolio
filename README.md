# 🌿 Елена Морозова — психолог

Одностраничный сайт-визитка психолога. Адаптивная вёрстка, форма заявки через Web3Forms, интерактивная карта Leaflet, FAQ-аккордеон, базовое SEO.

[![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)](https://tbeerse.github.io/psychologist-portfolio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 🔗 Демо

**[Посмотреть на GitHub Pages](https://tbeerse.github.io/psychologist-portfolio/)**

## ✨ Возможности

- 🧘 Спокойный светлый дизайн под тему психологии и доверия
- 📱 Полностью адаптивная вёрстка (mobile-first)
- 📝 Форма заявки через [Web3Forms](https://web3forms.com) — без бэкенда
- 🗺 Интерактивная карта кабинета (Leaflet + OpenStreetMap)
- 📂 FAQ-аккордеон на нативных `<details>` / `<summary>`
- ♿ Доступность: ARIA, фокус-стили, `prefers-reduced-motion`, `hover: none`
- 🔍 Базовое SEO: мета-теги, Open Graph, Twitter Card, favicon
- 🖨 Версия для печати (Ctrl+P) — скрывает кнопки и карту
- 🔝 Кнопка «Наверх» при скролле
- 🎨 CSS-переменные — вся палитра меняется в одном месте

## 🛠 Технологии

- **HTML5** — семантика, Open Graph, Twitter Card, favicon
- **CSS3** — переменные, Grid, Flexbox, media queries
- **JavaScript (ES Modules)** — чистый JS без фреймворков
- **Web3Forms** — приём заявок без бэкенда
- **Leaflet 1.9.4** — интерактивная карта
- **Google Fonts** — Manrope

## 🚀 Установка и запуск

### Клонировать репозиторий

    git clone https://github.com/TbeerSe/psychologist-portfolio.git
    cd psychologist-portfolio

### Запустить локальный сервер

Для работы ES-модулей нужен HTTP-сервер (из-за политики безопасности браузера `file://` не подойдёт).

    python -m http.server 8000

или через Node.js:

    npx serve .

Затем открой http://localhost:8000 в браузере.

## 📁 Структура проекта

    psychologist-portfolio/
    ├── index.html
    ├── css/
    │   ├── base.css          # переменные, сброс, типографика, кнопки
    │   ├── layout.css        # каркас: шапка, hero, секции, подвал
    │   ├── components.css    # карточки, форма, FAQ, контакты, карта
    │   └── responsive.css    # финальные медиа-запросы
    ├── js/
    │   ├── main.js           # точка входа
    │   ├── form.js           # валидация и отправка формы
    │   └── map.js            # карта Leaflet
    ├── images/
    ├── README.md
    └── LICENSE

## ⚙️ Настройка формы (Web3Forms)

1. Зайти на [web3forms.com](https://web3forms.com).
2. Ввести email, куда должны приходить заявки.
3. Скопировать `Access Key` из письма.
4. Открыть `js/form.js` и заменить строку:

    const WEB3FORMS_ACCESS_KEY = "ЗАМЕНИ_МЕНЯ_НА_СВОЙ_КЛЮЧ";

на свой ключ.

5. Проверить отправку: заполнить форму, нажать «Отправить заявку», проверить почту.

## ⚙️ Настройка карты (Leaflet)

1. Открыть `js/map.js`.
2. Заменить координаты и адрес:

    const OFFICE_COORDS = [57.626579, 39.893787];
    const OFFICE_TITLE = "Психолог Елена Морозова";
    const OFFICE_ADDRESS = "Ярославль, ул. Примерная, 10";

Координаты найти: Google Maps → правый клик по точке → скопировать первые два числа.

## 📸 Скриншот

![Скриншот главной страницы](./images/screenshot.png)

## 🗺 Планы по развитию

- [ ] Добавить реальные фото и тексты
- [ ] Подключить Telegram-уведомления о заявках
- [ ] Добавить страницу «Блог» с полезными статьями
- [ ] Подключить онлайн-запись (Calendly / Yclients)
- [ ] Добавить отзывы с реальными именами и фото

## 📄 Лицензия

[MIT](./LICENSE) © 2026 TbeerSe
