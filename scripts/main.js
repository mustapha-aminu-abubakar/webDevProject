/**
 * MedCare Hospital - Main JavaScript
 * Handles navigation, accessibility, and common functionality
 */

;(() => {
  // DOM Elements
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const body = document.body

  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    initNavigation()
    initAccessibility()
    initSmoothScrolling()
    initAnimations()
  })

  /**
   * Initialize mobile navigation
   */
  function initNavigation() {
    if (!navToggle || !navMenu) return

    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true"

      // Toggle menu visibility
      navMenu.classList.toggle("active")

      // Update ARIA attributes
      navToggle.setAttribute("aria-expanded", !isExpanded)

      // Prevent body scroll when menu is open
      if (!isExpanded) {
        body.style.overflow = "hidden"
      } else {
        body.style.overflow = ""
      }
    })

    // Close menu when clicking on nav links
    const navLinks = navMenu.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        navToggle.setAttribute("aria-expanded", "false")
        body.style.overflow = ""
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active")
        navToggle.setAttribute("aria-expanded", "false")
        body.style.overflow = ""
      }
    })

    // Handle escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        navToggle.setAttribute("aria-expanded", "false")
        body.style.overflow = ""
        navToggle.focus()
      }
    })
  }

  /**
   * Initialize accessibility features
   */
  function initAccessibility() {
    // Add focus indicators for keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        body.classList.add("keyboard-navigation")
      }
    })

    document.addEventListener("mousedown", () => {
      body.classList.remove("keyboard-navigation")
    })

    // Announce page changes for screen readers
    announcePageChange()
  }

  /**
   * Announce page changes for screen readers
   */
  function announcePageChange() {
    const pageTitle = document.querySelector("h1")
    if (pageTitle) {
      // Create announcement for screen readers
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "polite")
      announcement.setAttribute("aria-atomic", "true")
      announcement.className = "sr-only"
      announcement.textContent = `Page loaded: ${pageTitle.textContent}`
      document.body.appendChild(announcement)

      // Remove announcement after it's been read
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }
  }

  /**
   * Initialize smooth scrolling for anchor links
   */
  function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]')

    anchorLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href")
        const target = document.querySelector(href)

        if (target) {
          e.preventDefault()

          const headerHeight = document.querySelector(".header").offsetHeight
          const targetPosition = target.offsetTop - headerHeight - 20

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })

          // Focus the target for accessibility
          target.focus()
        }
      })
    })
  }

  /**
   * Initialize scroll animations
   */
  function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in")
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      ".service-card, .doctor-card, .stat-item, .value-card, .leader-card, .contact-card",
    )

    animatedElements.forEach((el) => {
      observer.observe(el)
    })
  }

  /**
   * Utility function to show success message
   */
  window.showSuccessMessage = (messageId) => {
    const message = document.getElementById(messageId)
    if (message) {
      message.style.display = "block"
      message.scrollIntoView({ behavior: "smooth" })

      // Focus the message for screen readers
      message.focus()
    }
  }

  /**
   * Utility function to hide success message
   */
  window.hideSuccessMessage = (messageId) => {
    const message = document.getElementById(messageId)
    if (message) {
      message.style.display = "none"
    }
  }

  /**
   * Utility function for form validation
   */
  window.validateField = (field, errorElementId, validationRules) => {
    const errorElement = document.getElementById(errorElementId)
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    // Required field validation
    if (validationRules.required && !value) {
      isValid = false
      errorMessage = "This field is required."
    }
    // Email validation
    else if (validationRules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address."
      }
    }
    // Phone validation
    else if (validationRules.phone && value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/[\s\-$$$$]/g, ""))) {
        isValid = false
        errorMessage = "Please enter a valid phone number."
      }
    }
    // Date validation
    else if (validationRules.date && value) {
      const selectedDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        isValid = false
        errorMessage = "Please select a future date."
      }
    }

    // Update field appearance and error message
    if (isValid) {
      field.classList.remove("error")
      errorElement.textContent = ""
    } else {
      field.classList.add("error")
      errorElement.textContent = errorMessage
    }

    return isValid
  }

  /**
   * Utility function to format phone numbers
   */
  window.formatPhoneNumber = (input) => {
    const value = input.value.replace(/\D/g, "")
    const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    input.value = formattedValue
  }

  /**
   * Handle window resize events
   */
  window.addEventListener("resize", () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      body.style.overflow = ""
    }
  })
})()
