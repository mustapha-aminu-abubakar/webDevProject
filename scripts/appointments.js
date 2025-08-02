/**
 * MedCare Hospital - Appointments Page JavaScript
 * Handles appointment form functionality and validation
 */

;(() => {
  // Doctor data by department
  const doctorsByDepartment = {
    cardiology: [
      { value: "dr-carter", text: "Dr. Emily Carter" },
      { value: "dr-wilson", text: "Dr. James Wilson" },
    ],
    neurology: [
      { value: "dr-park", text: "Dr. Lisa Park" },
      { value: "dr-kim", text: "Dr. Robert Kim" },
    ],
    orthopedics: [
      { value: "dr-gonzalez", text: "Dr. Maria Gonzalez" },
      { value: "dr-thompson", text: "Dr. David Thompson" },
    ],
    pediatrics: [
      { value: "dr-lee", text: "Dr. Jennifer Lee" },
      { value: "dr-brown", text: "Dr. Michael Brown" },
    ],
    oncology: [
      { value: "dr-anderson", text: "Dr. Sarah Anderson" },
      { value: "dr-taylor", text: "Dr. Michael Taylor" },
    ],
    radiology: [
      { value: "dr-white", text: "Dr. Jennifer White" },
      { value: "dr-garcia", text: "Dr. Carlos Garcia" },
    ],
    surgery: [
      { value: "dr-johnson", text: "Dr. Robert Johnson" },
      { value: "dr-miller", text: "Dr. Lisa Miller" },
    ],
    "womens-health": [
      { value: "dr-davis", text: "Dr. Amanda Davis" },
      { value: "dr-wilson-ob", text: "Dr. Michelle Wilson" },
    ],
    general: [
      { value: "dr-smith", text: "Dr. John Smith" },
      { value: "dr-jones", text: "Dr. Mary Jones" },
    ],
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAppointmentForm()
    initDepartmentDoctorFilter()
    initDateValidation()
  })

  /**
   * Initialize appointment form functionality
   */
  function initAppointmentForm() {
    const form = document.getElementById("appointmentForm")
    if (!form) return

    form.addEventListener("submit", (e) => {
      e.preventDefault()

      if (validateAppointmentForm()) {
        submitAppointmentForm()
      }
    })

    // Add real-time validation
    const fields = form.querySelectorAll("input, select, textarea")
    fields.forEach((field) => {
      field.addEventListener("blur", function () {
        validateSingleField(this)
      })
    })

    // Format phone number as user types
    const phoneField = document.getElementById("phone")
    if (phoneField) {
      phoneField.addEventListener("input", function () {
        window.formatPhoneNumber(this)
      })
    }
  }

  /**
   * Initialize department-doctor filtering
   */
  function initDepartmentDoctorFilter() {
    const departmentSelect = document.getElementById("department")
    const doctorSelect = document.getElementById("doctor")

    if (!departmentSelect || !doctorSelect) return

    departmentSelect.addEventListener("change", function () {
      const selectedDepartment = this.value
      updateDoctorOptions(selectedDepartment, doctorSelect)
    })
  }

  /**
   * Update doctor options based on selected department
   */
  function updateDoctorOptions(department, doctorSelect) {
    // Clear existing options except the first one
    doctorSelect.innerHTML = '<option value="">Any Available Doctor</option>'

    if (department && doctorsByDepartment[department]) {
      const doctors = doctorsByDepartment[department]
      doctors.forEach((doctor) => {
        const option = document.createElement("option")
        option.value = doctor.value
        option.textContent = doctor.text
        doctorSelect.appendChild(option)
      })
    }
  }

  /**
   * Initialize date validation
   */
  function initDateValidation() {
    const dateField = document.getElementById("appointmentDate")
    if (!dateField) return

    // Set minimum date to today
    const today = new Date()
    const todayString = today.toISOString().split("T")[0]
    dateField.setAttribute("min", todayString)

    // Set maximum date to 3 months from now
    const maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() + 3)
    const maxDateString = maxDate.toISOString().split("T")[0]
    dateField.setAttribute("max", maxDateString)
  }

  /**
   * Validate the entire appointment form
   */
  function validateAppointmentForm() {
    let isValid = true
    const form = document.getElementById("appointmentForm")

    // Required fields validation
    const requiredFields = [
      { id: "firstName", rules: { required: true } },
      { id: "lastName", rules: { required: true } },
      { id: "email", rules: { required: true, email: true } },
      { id: "phone", rules: { required: true, phone: true } },
      { id: "dateOfBirth", rules: { required: true } },
      { id: "department", rules: { required: true } },
      { id: "appointmentDate", rules: { required: true, date: true } },
      { id: "appointmentTime", rules: { required: true } },
      { id: "appointmentType", rules: { required: true } },
    ]

    requiredFields.forEach((fieldConfig) => {
      const field = document.getElementById(fieldConfig.id)
      const errorId = fieldConfig.id + "-error"

      if (field && !window.validateField(field, errorId, fieldConfig.rules)) {
        isValid = false
      }
    })

    // Consent checkbox validation
    const consentCheckbox = document.getElementById("consent")
    if (consentCheckbox && !consentCheckbox.checked) {
      isValid = false
      showFieldError("consent", "You must consent to receive appointment reminders.")
    }

    return isValid
  }

  /**
   * Validate a single field
   */
  function validateSingleField(field) {
    const fieldId = field.id
    const errorId = fieldId + "-error"
    let rules = {}

    // Define validation rules based on field
    switch (fieldId) {
      case "firstName":
      case "lastName":
      case "department":
      case "appointmentDate":
      case "appointmentTime":
      case "appointmentType":
        rules = { required: true }
        break
      case "email":
        rules = { required: true, email: true }
        break
      case "phone":
        rules = { required: true, phone: true }
        break
      case "dateOfBirth":
        rules = { required: true }
        break
      case "appointmentDate":
        rules = { required: true, date: true }
        break
    }

    return window.validateField(field, errorId, rules)
  }

  /**
   * Show field error message
   */
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId)
    const errorElement = document.getElementById(fieldId + "-error")

    if (field && errorElement) {
      field.classList.add("error")
      errorElement.textContent = message
    }
  }

  /**
   * Submit appointment form
   */
  function submitAppointmentForm() {
    const form = document.getElementById("appointmentForm")
    const submitButton = form.querySelector('button[type="submit"]')

    // Show loading state
    submitButton.classList.add("loading")
    submitButton.disabled = true
    submitButton.textContent = "Submitting..."

    // Simulate form submission
    setTimeout(() => {
      // Hide form and show success message
      form.style.display = "none"
      window.showSuccessMessage("successMessage")

      // Reset form
      form.reset()

      // Reset button state
      submitButton.classList.remove("loading")
      submitButton.disabled = false
      submitButton.textContent = "Book Appointment"

      // Clear any error states
      const errorMessages = form.querySelectorAll(".error-message")
      errorMessages.forEach((error) => (error.textContent = ""))

      const errorFields = form.querySelectorAll(".error")
      errorFields.forEach((field) => field.classList.remove("error"))
    }, 2000)
  }
})()
