/**
 * MedCare Hospital - Doctors Page JavaScript
 * Handles doctor filtering functionality
 */

;(() => {
  // Doctor data with departments
  const doctorData = {
    cardiology: ["Dr. Emily Carter", "Dr. James Wilson"],
    neurology: ["Dr. Lisa Park", "Dr. Robert Kim"],
    orthopedics: ["Dr. Maria Gonzalez", "Dr. David Thompson"],
    pediatrics: ["Dr. Jennifer Lee", "Dr. Michael Brown"],
    emergency: ["Dr. Sarah Davis", "Dr. Kevin Martinez"],
  }

  document.addEventListener("DOMContentLoaded", () => {
    initDoctorFilter()
  })

  /**
   * Initialize doctor filtering functionality
   */
  function initDoctorFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn")
    const doctorCards = document.querySelectorAll(".doctor-card")

    if (!filterButtons.length || !doctorCards.length) return

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter")

        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")

        // Filter doctor cards
        filterDoctors(filter, doctorCards)

        // Announce filter change for screen readers
        announceFilterChange(filter)
      })
    })
  }

  /**
   * Filter doctor cards based on department
   */
  function filterDoctors(filter, doctorCards) {
    doctorCards.forEach((card) => {
      const department = card.getAttribute("data-department")

      if (filter === "all" || department === filter) {
        card.classList.remove("hidden")
        card.style.display = "block"
      } else {
        card.classList.add("hidden")
        card.style.display = "none"
      }
    })

    // Add stagger animation to visible cards
    const visibleCards = document.querySelectorAll(".doctor-card:not(.hidden)")
    visibleCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("fade-in")
    })
  }

  /**
   * Announce filter changes for screen readers
   */
  function announceFilterChange(filter) {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.className = "sr-only"

    const filterText = filter === "all" ? "all doctors" : `${filter} doctors`
    announcement.textContent = `Showing ${filterText}`

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
})()
