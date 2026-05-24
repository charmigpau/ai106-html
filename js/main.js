/**
 * AI106 HTML — Language Toggle & Main Logic
 *
 * Implements bilingual support (English & Traditional Chinese)
 * with localStorage persistence and data-lang attribute switching.
 */

(function () {
  "use strict";

  // ========================================================================
  // Language Toggle System
  // ========================================================================

  const STORAGE_KEY = "app-language";
  const DEFAULT_LANGUAGE = "en";
  let currentLanguage = DEFAULT_LANGUAGE;

  /**
   * Get the current language, checking localStorage first
   */
  function getCurrentLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["en", "zh"].includes(stored)) {
      return stored;
    }
    return DEFAULT_LANGUAGE;
  }

  /**
   * Set language and update all UI elements
   */
  function setLanguage(lang) {
    if (!["en", "zh"].includes(lang)) return;
    
    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    
    // Update all elements with data-lang attributes
    updateAllLanguageContent();
    
    // Update toggle button state
    updateToggleState();
  }

  /**
   * Update all content with data-lang-en and data-lang-zh attributes
   */
  function updateAllLanguageContent() {
    const attributeKey = currentLanguage === "en" ? "data-lang-en" : "data-lang-zh";
    const elements = document.querySelectorAll("[data-lang-en], [data-lang-zh]");
    
    elements.forEach((el) => {
      const content = el.getAttribute(attributeKey);
      if (content) {
        el.textContent = content;
      }
    });
  }

  /**
   * Update toggle button visual state
   */
  function updateToggleState() {
    const langOptions = document.querySelectorAll(".lang-option");
    langOptions.forEach((option) => {
      const lang = option.getAttribute("data-lang");
      if (lang === currentLanguage) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });
  }

  /**
   * Initialize language toggle button
   */
  function initLanguageToggle() {
    const langToggle = document.getElementById("lang-toggle");
    if (!langToggle) return;

    // Set initial language
    currentLanguage = getCurrentLanguage();
    updateToggleState();
    updateAllLanguageContent();

    // Set up toggle click handlers
    const langOptions = langToggle.querySelectorAll(".lang-option");
    langOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        const lang = option.getAttribute("data-lang");
        if (lang !== currentLanguage) {
          setLanguage(lang);
        }
      });
    });
  }

  // ========================================================================
  // Demo & Year Display
  // ========================================================================

  const yearEl = document.getElementById("year");
  const demoButton = document.getElementById("demo-button");
  const demoOutput = document.getElementById("demo-output");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (demoButton && demoOutput) {
    let clickCount = 0;

    demoButton.addEventListener("click", () => {
      clickCount += 1;
      demoOutput.textContent =
        clickCount === 1
          ? "JavaScript is wired up. Replace this with your own logic."
          : `Button clicked ${clickCount} times.`;
    });
  }

  // ========================================================================
  // Appointment Booking Form
  // ========================================================================

  const appointmentForm = document.getElementById("appointment-form");
  const formMessage = document.getElementById("form-message");

  if (appointmentForm) {
    /**
     * Update placeholder text based on language
     */
    function updateFormPlaceholders() {
      const textareaEl = document.getElementById("appointment-notes");
      if (textareaEl) {
        const placeholderKey = currentLanguage === "en" 
          ? "data-lang-placeholder-en" 
          : "data-lang-placeholder-zh";
        const placeholder = textareaEl.getAttribute(placeholderKey);
        if (placeholder) {
          textareaEl.placeholder = placeholder;
        }
      }

      // Update select options display text
      const selectEl = document.getElementById("appointment-service");
      if (selectEl) {
        const options = selectEl.querySelectorAll("option");
        options.forEach((option) => {
          if (option.hasAttribute("data-lang-en")) {
            const textKey = currentLanguage === "en" ? "data-lang-en" : "data-lang-zh";
            const text = option.getAttribute(textKey);
            if (text) {
              option.textContent = text;
            }
          }
        });
      }
    }

    /**
     * Validate form inputs
     */
    function validateForm(formData) {
      const errors = [];

      if (!formData.name.trim()) {
        errors.push(currentLanguage === "en" ? "Name is required" : "名字是必需的");
      }

      if (!formData.email.includes("@")) {
        errors.push(currentLanguage === "en" ? "Valid email is required" : "需要有效的電子郵件");
      }

      if (!formData.phone.trim()) {
        errors.push(currentLanguage === "en" ? "Phone is required" : "電話是必需的");
      }

      if (!formData.date) {
        errors.push(currentLanguage === "en" ? "Date is required" : "日期是必需的");
      }

      if (!formData.time) {
        errors.push(currentLanguage === "en" ? "Time is required" : "時間是必需的");
      }

      if (!formData.service) {
        errors.push(currentLanguage === "en" ? "Service type is required" : "服務類型是必需的");
      }

      return errors;
    }

    /**
     * Show form message
     */
    function showMessage(message, isSuccess) {
      if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${isSuccess ? "success" : "error"}`;
      }
    }

    /**
     * Handle form submission
     */
    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById("appointment-name").value,
        email: document.getElementById("appointment-email").value,
        phone: document.getElementById("appointment-phone").value,
        date: document.getElementById("appointment-date").value,
        time: document.getElementById("appointment-time").value,
        service: document.getElementById("appointment-service").value,
        notes: document.getElementById("appointment-notes").value,
      };

      const errors = validateForm(formData);

      if (errors.length > 0) {
        showMessage(errors[0], false);
        return;
      }

      // Show success message
      const successMsg = currentLanguage === "en" 
        ? "Thank you! We will contact you soon to confirm your appointment."
        : "感謝您！我們將很快與您聯繫以確認您的預約。";
      
      showMessage(successMsg, true);

      // Log the form data (in a real app, this would be sent to a server)
      console.log("Appointment booking submitted:", formData);

      // Reset form after 2 seconds
      setTimeout(() => {
        appointmentForm.reset();
        if (formMessage) {
          formMessage.textContent = "";
          formMessage.className = "form-message";
        }
      }, 2000);
    });

    // Update form placeholders when language changes
    // Override the original setLanguage function to also update form placeholders
    const originalSetLanguage = setLanguage;
    window.setLanguage = function(lang) {
      originalSetLanguage(lang);
      updateFormPlaceholders();
    };

    // Initialize form placeholders on page load
    updateFormPlaceholders();
  }

  // ========================================================================
  // Initialize
  // ========================================================================

  initLanguageToggle();
})();
