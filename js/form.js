/* =========================================================
   form.js — валидация и отправка формы заявки
   Отправка через Web3Forms (https://web3forms.com)
   ========================================================= */

const WEB3FORMS_ACCESS_KEY = "7f099b30-7877-48f7-abbb-95e2a2254b37";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/* ---------------------------------------------------------
   Регулярные выражения
   --------------------------------------------------------- */

/* Имя: буквы (рус/лат), пробел, дефис. 2–60 символов. */
const NAME_REGEX = /^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\s-]{1,59}$/;

/* Email */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/* Telegram: @username, 5–32 символа, начинается с буквы */
const TELEGRAM_REGEX = /^@[A-Za-z][A-Za-z0-9_]{4,31}$/;

/* Гласные и согласные — для отсева «ааааа» */
const VOWELS_REGEX = /[аеёиоуыэюяaeiouy]/i;
const CONSONANTS_REGEX = /[бвгджзйклмнпрстфхцчшщbcdfghjklmnpqrstvwxz]/i;

/* =========================================================
   Инициализация формы
   ========================================================= */

export function initForm() {
  const form = document.querySelector("#contact-form");
  const messageEl = document.querySelector("#form-message");

  if (!form || !messageEl) return;

  const nameInput = form.querySelector("#contact-name");
  const contactInput = form.querySelector("#contact-contact");
  const submitButton = form.querySelector('button[type="submit"]');

  /* Подсказки под полями */
  ensureHint(nameInput, "Только буквы, пробел или дефис.");
  ensureHint(contactInput, "Телефон · Email · @username в Telegram");

  /* Живая валидация при потере фокуса */
  nameInput?.addEventListener("blur", () => validateName(nameInput));

  contactInput?.addEventListener("blur", () =>
    validateContact(contactInput)
  );

  /* Сбрасываем ошибку, пока пользователь печатает */
  nameInput?.addEventListener("input", () => {
    nameInput.setCustomValidity("");
    clearFieldError(nameInput);
  });

  /* Автоформат телефона — только если начинается с цифры или + */
  contactInput?.addEventListener("input", () => {
    contactInput.setCustomValidity("");
    clearFieldError(contactInput);

    const value = contactInput.value;
    const firstChar = value.charAt(0);

    if (!/[\d+]/.test(firstChar)) return;

    const digits = getPhoneDigits(value);

    if (digits.length === 0) {
      contactInput.value = "";
      return;
    }

    contactInput.value = formatRussianPhone(digits);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageEl);

    const isNameValid = validateName(nameInput);
    const isContactValid = validateContact(contactInput);

    if (!isNameValid || !isContactValid) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "Новая заявка с сайта психолога");
    formData.append("from_name", "Сайт Елены Морозовой");

    const originalButtonText = submitButton
      ? submitButton.textContent
      : "";

    setLoading(submitButton, true);
    showMessage(messageEl, "Отправляем заявку…", "loading");

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        form.reset();
        clearAllErrors(form);
        showMessage(
          messageEl,
          "Спасибо! Заявка отправлена. Я свяжусь с вами в течение дня.",
          "success"
        );
      } else {
        console.error("Web3Forms ответил ошибкой:", result);
        showMessage(
          messageEl,
          "Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.",
          "error"
        );
      }
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
      showMessage(
        messageEl,
        "Сеть недоступна. Проверьте интернет и попробуйте снова.",
        "error"
      );
    } finally {
      setLoading(submitButton, false, originalButtonText);
    }
  });
}

/* =========================================================
   Валидация имени
   ========================================================= */

function validateName(input) {
  if (!input) return true;

  const value = input.value.trim();
  const formField = input.closest(".form-field");

  if (value.length === 0) {
    return setFieldError(input, formField, "Введите имя.");
  }

  if (!NAME_REGEX.test(value)) {
    return setFieldError(
      input,
      formField,
      "Имя: только буквы, пробел и дефис (2–60 символов)."
    );
  }

  /* Отсев «ааааа», «ыыыы», «ббб» — нет гласных или нет согласных */
  if (!VOWELS_REGEX.test(value) || !CONSONANTS_REGEX.test(value)) {
    return setFieldError(
      input,
      formField,
      "Похоже, это не настоящее имя. Введите его как в жизни."
    );
  }

  /* Хотя бы 2 разные буквы */
  const uniqueLetters = new Set(value.toLowerCase().replace(/[\s-]/g, ""));

  if (uniqueLetters.size < 2) {
    return setFieldError(
      input,
      formField,
      "Имя слишком короткое или состоит из одной повторяющейся буквы."
    );
  }

  clearFieldError(input);
  return true;
}

/* =========================================================
   Валидация контакта
   ========================================================= */

function validateContact(input) {
  if (!input) return true;

  const value = input.value.trim();
  const formField = input.closest(".form-field");

  if (value.length === 0) {
    return setFieldError(
      input,
      formField,
      "Укажите телефон, email или @username."
    );
  }

  /* Email или Telegram */
  if (value.includes("@")) {
    if (EMAIL_REGEX.test(value) || TELEGRAM_REGEX.test(value)) {
      clearFieldError(input);
      return true;
    }

    return setFieldError(
      input,
      formField,
      "Похоже на email или Telegram, но формат неверный. Пример: test@mail.ru или @username."
    );
  }

  /* Телефон */
  if (isRussianPhone(value)) {
    clearFieldError(input);
    return true;
  }

  return setFieldError(
    input,
    formField,
    "Введите российский номер (+7 999 123-45-67), email или @username."
  );
}

/* =========================================================
   Помощники валидации
   ========================================================= */

function getPhoneDigits(value) {
  let digits = String(value).replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  }

  if (digits.startsWith("7")) {
    return digits.slice(1, 11);
  }

  return digits.slice(0, 10);
}

function formatRussianPhone(digits) {
  if (!digits) return "";

  let result = "+7";

  if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) result += ")";
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;

  return result;
}

function isRussianPhone(value) {
  const digits = getPhoneDigits(value);
  if (digits.length !== 10) return false;
  return digits[0] === "9";
}

function setFieldError(input, formField, message) {
  input.setCustomValidity(message);
  formField?.classList.add("has-error");
  return false;
}

function clearFieldError(input) {
  input.setCustomValidity("");
  input.closest(".form-field")?.classList.remove("has-error");
}

function clearAllErrors(form) {
  form.querySelectorAll(".form-field").forEach((field) => {
    field.classList.remove("has-error");
  });

  form.querySelectorAll("input, textarea").forEach((el) => {
    el.setCustomValidity("");
  });
}

function ensureHint(input, text) {
  if (!input) return;

  const formField = input.closest(".form-field");
  if (!formField) return;

  if (formField.querySelector(".form-hint")) return;

  const hint = document.createElement("p");
  hint.className = "form-hint";
  hint.textContent = text;
  formField.appendChild(hint);
}

/* =========================================================
   Кнопка и сообщения
   ========================================================= */

function setLoading(button, isLoading, originalText = "") {
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Отправляем…";
  } else {
    button.disabled = false;
    button.textContent =
      originalText || button.dataset.originalText || "Отправить заявку";
  }
}

function showMessage(el, text, type = "success") {
  if (!el) return;

  el.className = `form-message form-message--${type}`;
  el.textContent = text;
}

function clearMessage(el) {
  if (!el) return;

  el.className = "form-message";
  el.textContent = "";
}
