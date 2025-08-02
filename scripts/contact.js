/**
 * MedCare Hospital - Contact Page JavaScript
 * Handles contact form functionality and validation
 */

;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    initContactForm()
  })

  /**
   * Initialize contact form functionality
   */
  function initContactForm() {
    const form = document.getElementById("contactForm")
    if (!form) return

    form.addEventListener("submit", (e) => {
      e.preventDefault()

      if (validateContactForm()) {
        submitContactForm()
      }
    })

    // Add real-time validation
    const fields = form.querySelectorAll("input, select, textarea")
    fields.forEach((field) => {
      field.addEventListener("blur", function () {
        validateSingleContactField(this)
      })
    })

    // Format phone number as user types
    const phoneField = document.getElementById("contactPhone")
    if (phoneField) {
      phoneField.addEventListener("input", function () {
        window.formatPhoneNumber(this)
      })
    }
  }

  /**
   * Validate the entire contact form
   */
  function validateContactForm() {
    let isValid = true

    // Required fields validation
    const requiredFields = [
      { id: "contactName", rules: { required: true } },
      { id: "contactEmail", rules: { required: true, email: true } },
      { id: "contactSubject", rules: { required: true } },
      { id: "contactMessage", rules: { required: true } },
    ]

    requiredFields.forEach((fieldConfig) => {
      const field = document.getElementById(fieldConfig.id)
      const errorId = fieldConfig.id + "-error"

      if (field && !window.validateField(field, errorId, fieldConfig.rules)) {
        isValid = false
      }
    })

    // Phone validation (optional field)
    const phoneField = document.getElementById("contactPhone")
    if (phoneField && phoneField.value.trim()) {
      const phoneErrorId = "contactPhone-error"
      if (!window.validateField(phoneField, phoneErrorId, { phone: true })) {
        isValid = false
      }
    }

    // Consent checkbox validation
    const consentCheckbox = document.getElementById("contactConsent")
    if (consentCheckbox && !consentCheckbox.checked) {
      isValid = false
      showContactFieldError("contactConsent", "You must consent to being contacted.")
    }

    // Message length validation
    const messageField = document.getElementById("contactMessage")
    if (messageField && messageField.value.trim().length < 10) {
      isValid = false
      showContactFieldError("contactMessage", "Please provide a more detailed message (at least 10 characters).")
    }

    return isValid
  }

  /**
   * Validate a single contact field
   */
  function validateSingleContactField(field) {
    const fieldId = field.id
    const errorId = fieldId + "-error"
    let rules = {}

    // Define validation rules based on field
    switch (fieldId) {
      case "contactName":
      case "contactSubject":
        rules = { required: true }
        break
      case "contactEmail":
        rules = { required: true, email: true }
        break
      case "contactPhone":
        if (field.value.trim()) {
          rules = { phone: true }
        }
        break
      case "contactMessage":
        rules = { required: true }
        // Additional length check
        if (field.value.trim() && field.value.trim().length < 10) {
          showContactFieldError(fieldId, "Please provide a more detailed message (at least 10 characters).")
          return false
        }
        break
    }

    return window.validateField(field, errorId, rules)
  }

  /**
   * Show contact field error message
   */
  function showContactFieldError(fieldId, message) {
    const field = document.getElementById(fieldId)
    const errorElement = document.getElementById(fieldId + "-error")

    if (field && errorElement) {
      field.classList.add("error")
      errorElement.textContent = message
    }
  }

  /**
   * Submit contact form
   */
  function submitContactForm() {
    const form = document.getElementById("contactForm")
    const submitButton = form.querySelector('button[type="submit"]')

    // Show loading state
    submitButton.classList.add("loading")
    submitButton.disabled = true
    submitButton.textContent = "Sending..."

    // Simulate form submission
    setTimeout(() => {
      // Hide form and show success message
      form.style.display = "none"
      window.showSuccessMessage("contactSuccessMessage")

      // Reset form
      form.reset()

      // Reset button state
      submitButton.classList.remove("loading")
      submitButton.disabled = false
      submitButton.textContent = "Send Message"

      // Clear any error states
      const errorMessages = form.querySelectorAll(".error-message")
      errorMessages.forEach((error) => (error.textContent = ""))

      const errorFields = form.querySelectorAll(".error")
      errorFields.forEach((field) => field.classList.remove("error"))
    }, 2000)
  }
})()
