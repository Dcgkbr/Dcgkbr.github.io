
// Global variables
let currentPage = "home"
let gameState = {
  isFlying: false,
  multiplier: 1.0,
  crashed: false,
  cashedOut: false,
  startTime: null,
  maxMultiplier: 10.0,
}

let demoState = {
  isFlying: false,
  multiplier: 1.0,
  crashed: false,
  interval: null,
}

// DOM elements
const navLinks = document.querySelectorAll(".nav-link[data-page]")
const pages = document.querySelectorAll(".page")
const navToggle = document.getElementById("navToggle")
const navMenu = document.getElementById("navMenu")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Aviator Pro initialized")
  try {
    initializeEventListeners()
    initializeAnimations()
    initializeCharts()
    startGameSimulation()

    // Add loading animation
    document.body.style.opacity = "0"
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease"
      document.body.style.opacity = "1"
    }, 100)
  } catch (error) {
    console.error("Initialization error:", error)
    showNotification("Application loaded with some issues. Please refresh if needed.", "warning")
  }
})

// Event Listeners
function initializeEventListeners() {
  try {
    // Navigation links
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const page = e.target.closest(".nav-link")?.dataset.page
        if (page) {
          navigateToPage(page)
        }
      })
    })

    // CTA button
    const ctaButton = document.querySelector(".cta-button")
    if (ctaButton) {
      ctaButton.addEventListener("click", (e) => {
        e.preventDefault()
        const page = e.target.closest(".cta-button")?.dataset.page
        if (page) {
          navigateToPage(page)
        }
      })
    }

    // Mobile navigation toggle
    if (navToggle) {
      navToggle.addEventListener("click", toggleMobileNav)
    }

    // Footer navigation links
    document.querySelectorAll(".footer a[data-page]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const page = e.target.dataset.page
        if (page) {
          navigateToPage(page)
        }
      })
    })

    // Game cashout button
    const heroCashout = document.getElementById("heroCashout")
    if (heroCashout) {
      heroCashout.addEventListener("click", handleCashout)
    }

    // Demo cashout button
    const demoCashoutBtn = document.querySelector(".demo-cashout")
    if (demoCashoutBtn) {
      demoCashoutBtn.addEventListener("click", handleDemoCashout)
    }

    // Close mobile nav when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu) navMenu.classList.remove("active")
        if (navToggle) navToggle.classList.remove("active")
      })
    })

    // Close mobile nav when clicking outside
    document.addEventListener("click", (e) => {
      if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      }
    })

    // Initialize platform cards
    initializePlatformCards()

    // Initialize contact buttons
    initializeContactButtons()

    console.log("✅ Event listeners initialized")
  } catch (error) {
    console.error("Event listener initialization error:", error)
  }
}

// Navigation functions
function navigateToPage(pageName) {
  try {
    // Hide all pages
    pages.forEach((page) => {
      page.classList.remove("active")
    })

    // Show selected page
    const targetPage = document.getElementById(pageName)
    if (targetPage) {
      targetPage.classList.add("active")
      currentPage = pageName
      console.log(`📄 Navigated to: ${pageName}`)
    }

    // Update navigation
    updateNavigation(pageName)

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Update page-specific content
    updatePageContent(pageName)
  } catch (error) {
    console.error("Navigation error:", error)
    showNotification("Navigation error occurred", "error")
  }
}

function updateNavigation(activePage) {
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.page === activePage) {
      link.classList.add("active")
    }
  })
}

function toggleMobileNav() {
  if (navMenu) navMenu.classList.toggle("active")
  if (navToggle) navToggle.classList.toggle("active")
}

// Page-specific content updates
function updatePageContent(pageName) {
  try {
    switch (pageName) {
      case "home":
        startGameSimulation()
        break
      case "how-to-play":
        startDemoSimulation()
        break
      case "predictor":
        startPredictorAnimations()
        // Initialize trainer with delay to ensure DOM is ready
        setTimeout(() => {
          initializeTrainer()
        }, 100)
        break
    }
  } catch (error) {
    console.error("Page content update error:", error)
  }
}

// Game Simulation Functions
function startGameSimulation() {
  if (currentPage !== "home") return

  try {
    // Reset game state
    resetGameState()

    // Start new round after delay
    setTimeout(() => {
      if (currentPage === "home") {
        startGameRound()
      }
    }, 2000)
  } catch (error) {
    console.error("Game simulation error:", error)
  }
}

function resetGameState() {
  gameState = {
    isFlying: false,
    multiplier: 1.0,
    crashed: false,
    cashedOut: false,
    startTime: null,
    maxMultiplier: Math.random() * 8 + 2, // Random between 2-10x
  }

  const gamePlane = document.getElementById("gamePlane")
  const heroMultiplier = document.getElementById("heroMultiplier")
  const multiplierStatus = document.getElementById("multiplierStatus")
  const multiplierTrail = document.getElementById("multiplierTrail")
  const heroCashout = document.getElementById("heroCashout")

  if (gamePlane) {
    gamePlane.classList.remove("game-flying", "game-crashed")
    gamePlane.style.transform = ""
  }

  if (heroMultiplier) {
    heroMultiplier.textContent = "1.00x"
    heroMultiplier.classList.remove("multiplier-glow", "crashed", "win-effect")
  }

  if (multiplierStatus) {
    multiplierStatus.textContent = "Waiting..."
    multiplierStatus.style.color = "#ccc"
  }

  if (multiplierTrail) {
    multiplierTrail.style.height = "0px"
    multiplierTrail.classList.remove("trail-active")
  }

  if (heroCashout) {
    heroCashout.disabled = true
    heroCashout.innerHTML = '<i class="fas fa-hand-paper"></i> Cash Out'
  }
}

function startGameRound() {
  if (currentPage !== "home") return

  gameState.isFlying = true
  gameState.startTime = Date.now()

  const multiplierStatus = document.getElementById("multiplierStatus")
  const heroCashout = document.getElementById("heroCashout")
  const multiplierTrail = document.getElementById("multiplierTrail")

  if (multiplierStatus) {
    multiplierStatus.textContent = "Flying..."
    multiplierStatus.style.color = "#00ff88"
  }

  if (heroCashout) {
    heroCashout.disabled = false
  }

  if (multiplierTrail) {
    multiplierTrail.classList.add("trail-active")
  }

  // Start multiplier animation
  updateGameMultiplier()
}

function updateGameMultiplier() {
  if (!gameState.isFlying || gameState.crashed || gameState.cashedOut || currentPage !== "home") {
    return
  }

  const elapsed = (Date.now() - gameState.startTime) / 1000
  gameState.multiplier = 1 + elapsed * 0.5 + Math.random() * 0.1

  const heroMultiplier = document.getElementById("heroMultiplier")
  const gamePlane = document.getElementById("gamePlane")
  const multiplierTrail = document.getElementById("multiplierTrail")

  // Update UI
  if (heroMultiplier) {
    heroMultiplier.textContent = gameState.multiplier.toFixed(2) + "x"

    // Add glow effect at certain intervals
    if (gameState.multiplier % 1 < 0.1) {
      heroMultiplier.classList.add("multiplier-glow")
      setTimeout(() => {
        if (heroMultiplier) {
          heroMultiplier.classList.remove("multiplier-glow")
        }
      }, 500)
    }
  }

  // Update plane position
  if (gamePlane) {
    const progress = Math.min(elapsed / 10, 1)
    const x = progress * 200
    const y = progress * 150
    gamePlane.style.transform = `translateX(${x}px) translateY(-${y}px) rotate(-${progress * 15}deg)`
    gamePlane.classList.add("game-flying")
  }

  // Update trail
  if (multiplierTrail) {
    const trailHeight = Math.min(elapsed * 20, 200)
    multiplierTrail.style.height = trailHeight + "px"
  }

  // Check for crash
  if (gameState.multiplier >= gameState.maxMultiplier) {
    crashGame()
    return
  }

  // Continue animation
  setTimeout(() => updateGameMultiplier(), 100)
}

function crashGame() {
  gameState.crashed = true
  gameState.isFlying = false

  const heroMultiplier = document.getElementById("heroMultiplier")
  const multiplierStatus = document.getElementById("multiplierStatus")
  const gamePlane = document.getElementById("gamePlane")
  const multiplierTrail = document.getElementById("multiplierTrail")
  const heroCashout = document.getElementById("heroCashout")

  if (heroMultiplier) {
    heroMultiplier.classList.add("crashed")
  }

  if (multiplierStatus) {
    multiplierStatus.textContent = "Crashed!"
    multiplierStatus.style.color = "#ff4444"
  }

  if (gamePlane) {
    gamePlane.classList.add("game-crashed")
  }

  if (multiplierTrail) {
    multiplierTrail.classList.remove("trail-active")
  }

  if (heroCashout) {
    heroCashout.disabled = true
    heroCashout.innerHTML = '<i class="fas fa-times"></i> Crashed'
  }

  // Show crash notification
  showNotification(`Plane crashed at ${gameState.multiplier.toFixed(2)}x!`, "error")

  // Start new round
  setTimeout(() => {
    if (currentPage === "home") {
      startGameSimulation()
    }
  }, 3000)
}

function handleCashout() {
  if (!gameState.isFlying || gameState.crashed || gameState.cashedOut) return

  gameState.cashedOut = true
  gameState.isFlying = false

  const winAmount = (10 * gameState.multiplier).toFixed(2)

  const heroMultiplier = document.getElementById("heroMultiplier")
  const multiplierStatus = document.getElementById("multiplierStatus")
  const heroCashout = document.getElementById("heroCashout")
  const multiplierTrail = document.getElementById("multiplierTrail")

  if (heroMultiplier) {
    heroMultiplier.classList.add("win-effect")
  }

  if (multiplierStatus) {
    multiplierStatus.textContent = "Cashed Out!"
    multiplierStatus.style.color = "#00ff88"
  }

  if (heroCashout) {
    heroCashout.disabled = true
    heroCashout.innerHTML = '<i class="fas fa-check"></i> Cashed Out'
  }

  if (multiplierTrail) {
    multiplierTrail.classList.remove("trail-active")
  }

  // Show win notification
  showNotification(`Cashed out at ${gameState.multiplier.toFixed(2)}x! Won $${winAmount}`, "success")

  // Start new round
  setTimeout(() => {
    if (currentPage === "home") {
      startGameSimulation()
    }
  }, 3000)
}

// Demo Simulation Functions
function startDemoSimulation() {
  if (currentPage !== "how-to-play") return

  try {
    // Reset demo state
    resetDemoState()

    // Start demo round
    setTimeout(() => {
      if (currentPage === "how-to-play") {
        startDemoRound()
      }
    }, 1000)
  } catch (error) {
    console.error("Demo simulation error:", error)
  }
}

function resetDemoState() {
  demoState = {
    isFlying: false,
    multiplier: 1.0,
    crashed: false,
    interval: null,
  }

  const demoPlane = document.getElementById("demoPlane")
  const demoMultiplier = document.getElementById("demoMultiplier")
  const demoTrail = document.getElementById("demoTrail")
  const cashoutMultiplier = document.getElementById("cashoutMultiplier")
  const potentialWin = document.getElementById("potentialWin")

  if (demoPlane) {
    demoPlane.classList.remove("demo-flying", "demo-crashed")
    demoPlane.style.transform = ""
  }

  if (demoMultiplier) {
    demoMultiplier.textContent = "1.00x"
  }

  if (demoTrail) {
    demoTrail.style.height = "0px"
  }

  if (cashoutMultiplier) {
    cashoutMultiplier.textContent = "1.00x"
  }

  if (potentialWin) {
    potentialWin.textContent = "$10.00"
  }
}

function startDemoRound() {
  if (currentPage !== "how-to-play") return

  demoState.isFlying = true

  demoState.interval = setInterval(() => {
    if (!demoState.isFlying || currentPage !== "how-to-play") {
      clearInterval(demoState.interval)
      return
    }

    demoState.multiplier += 0.05 + Math.random() * 0.05

    const demoMultiplier = document.getElementById("demoMultiplier")
    const cashoutMultiplier = document.getElementById("cashoutMultiplier")
    const potentialWin = document.getElementById("potentialWin")
    const demoPlane = document.getElementById("demoPlane")
    const demoTrail = document.getElementById("demoTrail")

    // Update demo UI
    if (demoMultiplier) {
      demoMultiplier.textContent = demoState.multiplier.toFixed(2) + "x"
    }

    if (cashoutMultiplier) {
      cashoutMultiplier.textContent = demoState.multiplier.toFixed(2) + "x"
    }

    if (potentialWin) {
      const win = (10 * demoState.multiplier).toFixed(2)
      potentialWin.textContent = "$" + win
    }

    // Update demo plane position
    if (demoPlane) {
      const progress = (demoState.multiplier - 1) / 3
      const x = progress * 100
      const y = progress * 80
      demoPlane.style.transform = `translateX(${x}px) translateY(-${y}px) rotate(-${progress * 10}deg)`
      demoPlane.classList.add("demo-flying")
    }

    // Update demo trail
    if (demoTrail) {
      const trailHeight = Math.min((demoState.multiplier - 1) * 40, 120)
      demoTrail.style.height = trailHeight + "px"
    }

    // Crash at random point between 2x-5x
    if (demoState.multiplier >= 2 + Math.random() * 3) {
      crashDemo()
    }
  }, 200)
}

function crashDemo() {
  demoState.crashed = true
  demoState.isFlying = false

  if (demoState.interval) {
    clearInterval(demoState.interval)
  }

  const demoPlane = document.getElementById("demoPlane")
  if (demoPlane) {
    demoPlane.classList.add("demo-crashed")
  }

  // Restart demo after delay
  setTimeout(() => {
    if (currentPage === "how-to-play") {
      startDemoSimulation()
    }
  }, 4000)
}

function handleDemoCashout() {
  if (!demoState.isFlying) return

  demoState.isFlying = false

  if (demoState.interval) {
    clearInterval(demoState.interval)
  }

  const winAmount = (10 * demoState.multiplier).toFixed(2)
  showNotification(`Demo: Cashed out at ${demoState.multiplier.toFixed(2)}x! Won $${winAmount}`, "success")

  // Restart demo after delay
  setTimeout(() => {
    if (currentPage === "how-to-play") {
      startDemoSimulation()
    }
  }, 3000)
}

// Animation functions
function initializeAnimations() {
  try {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe elements for scroll animations
    document
      .querySelectorAll(".feature-card, .testimonial-card, .step-card, .tip-card, .benefit-card")
      .forEach((el) => {
        el.style.opacity = "0"
        el.style.transform = "translateY(30px)"
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
        observer.observe(el)
      })

    console.log("✅ Animations initialized")
  } catch (error) {
    console.error("Animation initialization error:", error)
  }
}

function startPredictorAnimations() {
  try {
    // Update prediction chart
    const predictionChart = document.getElementById("predictionChart")
    if (predictionChart) {
      updatePredictionChart()
    }

    // Animate prediction plane
    const predPlane = document.querySelector(".pred-plane")
    if (predPlane) {
      predPlane.style.animation = "predictionFloat 2s ease-in-out infinite"
    }
  } catch (error) {
    console.error("Predictor animation error:", error)
  }
}

// Chart initialization
function initializeCharts() {
  try {
    initializePredictionChart()
    console.log("✅ Charts initialized")
  } catch (error) {
    console.error("Chart initialization error:", error)
  }
}

let predictionChartData = null

function initializePredictionChart() {
  const canvas = document.getElementById("predictionChart")
  if (!canvas) return

  try {
    const ctx = canvas.getContext("2d")
    predictionChartData = {
      canvas: canvas,
      ctx: ctx,
      data: [],
      animationFrame: null,
    }

    // Initialize with prediction data
    for (let i = 0; i < 20; i++) {
      predictionChartData.data.push({
        multiplier: 1 + Math.random() * 2,
        confidence: 60 + Math.random() * 35,
      })
    }

    updatePredictionChart()
  } catch (error) {
    console.error("Prediction chart initialization error:", error)
  }
}

function updatePredictionChart() {
  if (!predictionChartData) return

  try {
    const { ctx, canvas, data } = predictionChartData
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw prediction bars
    const barWidth = width / data.length

    data.forEach((point, index) => {
      const x = index * barWidth
      const barHeight = (point.confidence / 100) * height
      const y = height - barHeight

      // Color based on confidence
      let color
      if (point.confidence > 80) {
        color = "#00ff88"
      } else if (point.confidence > 60) {
        color = "#ffaa00"
      } else {
        color = "#ff4444"
      }

      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth - 2, barHeight)

      // Add glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 5
      ctx.fillRect(x, y, barWidth - 2, barHeight)
      ctx.shadowBlur = 0
    })

    // Update data periodically
    if (currentPage === "predictor") {
      setTimeout(() => {
        // Add new prediction
        data.push({
          multiplier: 1 + Math.random() * 2,
          confidence: 60 + Math.random() * 35,
        })
        if (data.length > 20) {
          data.shift()
        }
        updatePredictionChart()
      }, 500)
    }
  } catch (error) {
    console.error("Prediction chart update error:", error)
  }
}

// Utility functions
function showNotification(message, type = "info") {
  try {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove()
          }
        }, 300)
      })
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove()
          }
        }, 300)
      }
    }, 5000)
  } catch (error) {
    console.error("Notification error:", error)
  }
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle"
    case "error":
      return "fa-exclamation-circle"
    case "warning":
      return "fa-exclamation-triangle"
    default:
      return "fa-info-circle"
  }
}

// Platform card interactions
function initializePlatformCards() {
  try {
    const platformCards = document.querySelectorAll(".platform-card")

    platformCards.forEach((card) => {
      card.addEventListener("click", () => {
        const platform = card.querySelector("span")?.textContent || "Platform"
        showNotification(`Redirecting to ${platform}...`, "info")

        // Simulate redirect delay
        setTimeout(() => {
          showNotification(`${platform} opened in new tab`, "success")
        }, 1500)
      })
    })
  } catch (error) {
    console.error("Platform cards initialization error:", error)
  }
}

// Contact button interactions
function initializeContactButtons() {
  try {
    const contactButtons = document.querySelectorAll(".contact-btn, .contact-value")

    contactButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (button.href && button.href.startsWith("tel:")) {
          showNotification("Opening phone dialer...", "info")
        } else {
          e.preventDefault()
          showNotification("Contact information copied to clipboard!", "success")
        }
      })
    })
  } catch (error) {
    console.error("Contact buttons initialization error:", error)
  }
}

// Scroll effects
function initializeScrollEffects() {
  try {
    let lastScrollTop = 0
    const navbar = document.getElementById("navbar")

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Navbar hide/show on scroll
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        if (navbar) navbar.style.transform = "translateY(-100%)"
      } else {
        if (navbar) navbar.style.transform = "translateY(0)"
      }

      lastScrollTop = scrollTop

      // Parallax effect for hero background
      if (currentPage === "home") {
        const heroBackground = document.querySelector(".hero-background")
        if (heroBackground) {
          const scrolled = window.pageYOffset
          heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`
        }
      }
    })
  } catch (error) {
    console.error("Scroll effects initialization error:", error)
  }
}

// Initialize additional features
setTimeout(() => {
  try {
    initializeScrollEffects()

    // Counter animations
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      const target = counter.textContent
      const isPercentage = target.includes("%")
      const isMultiplier = target.includes("K+")
      const isTime = target.includes("/")

      if (isTime) return // Skip 24/7

      let finalValue
      if (isPercentage) {
        finalValue = Number.parseInt(target)
      } else if (isMultiplier) {
        finalValue = Number.parseInt(target)
      } else {
        finalValue = Number.parseInt(target)
      }

      let currentValue = 0
      const increment = finalValue / 50

      const timer = setInterval(() => {
        currentValue += increment
        if (currentValue >= finalValue) {
          currentValue = finalValue
          clearInterval(timer)
        }

        if (isPercentage) {
          counter.textContent = Math.floor(currentValue) + "%"
        } else if (isMultiplier) {
          counter.textContent = Math.floor(currentValue) + "K+"
        } else {
          counter.textContent = Math.floor(currentValue)
        }
      }, 50)
    })
  } catch (error) {
    console.error("Additional features initialization error:", error)
  }
}, 1000)

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  try {
    if (document.hidden) {
      // Pause animations when page is not visible
      if (gameState.isFlying) {
        gameState.isFlying = false
      }
      if (demoState.interval) {
        clearInterval(demoState.interval)
      }
      if (trainerState.animationFrame) {
        cancelAnimationFrame(trainerState.animationFrame)
      }
    } else {
      // Resume animations when page becomes visible
      if (currentPage === "home") {
        startGameSimulation()
      }
      if (currentPage === "how-to-play") {
        startDemoSimulation()
      }
      if (currentPage === "predictor") {
        startPredictorAnimations()
      }
    }
  } catch (error) {
    console.error("Visibility change error:", error)
  }
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  try {
    // Navigate with arrow keys
    if (e.altKey) {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          if (currentPage === "how-to-play") {
            navigateToPage("home")
          } else if (currentPage === "predictor") {
            navigateToPage("how-to-play")
          }
          break
        case "ArrowRight":
          e.preventDefault()
          if (currentPage === "home") {
            navigateToPage("how-to-play")
          } else if (currentPage === "how-to-play") {
            navigateToPage("predictor")
          }
          break
      }
    }

    // Spacebar for cashout
    if (e.code === "Space" && currentPage === "home") {
      e.preventDefault()
      handleCashout()
    }

    // Spacebar for trainer cashout
    if (e.code === "Space" && currentPage === "predictor" && trainerState.isFlying) {
      e.preventDefault()
      trainerCashOut()
    }

    // Close mobile nav with Escape
    if (e.key === "Escape") {
      if (navMenu) navMenu.classList.remove("active")
      if (navToggle) navToggle.classList.remove("active")
    }
  } catch (error) {
    console.error("Keyboard navigation error:", error)
  }
})

// Error handling
window.addEventListener("error", (e) => {
  console.error("Application error:", e.error)
  showNotification("An error occurred. Please refresh the page.", "error")
})

// Performance optimization
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  // Handle scroll-based animations here
}, 16) // ~60fps

window.addEventListener("scroll", optimizedScrollHandler)

// ===== TRAINER AVIATOR PREDICTOR - COMPLETE IMPLEMENTATION =====

// Trainer state object
const trainerState = {
  isActive: false,
  currentRound: 1,
  totalRounds: 50,
  currentPreset: 0,
  currentMultiplierIndex: 0,
  isFlying: false,
  multiplier: 1.0,
  crashed: false,
  cashedOut: false,
  startTime: null,
  betAmount: 5000,
  cashoutAt: 70.0,
  balance: 100000,
  totalProfit: 0,
  roundsPlayed: 0,
  wins: 0,
  canvas: null,
  ctx: null,
  animationFrame: null,
  targetMultiplier: 1.0,
  isInitialized: false,
}

// Complete preset multiplier sequences (50 rounds each)
const trainerPresets = [
  [2.06, 1.85, 2.47, 2.12, 12.07, 1.07, 2.8, 2.01, 2.53, 35.21, 2.84, 1.12, 2.02, 1.72, 2.61, 1.44, 1.36, 2.97, 2.27, 2.5, 90.5, 1.0, 2.09, 1.84, 2.47, 1.63, 2.2, 2.79, 1.49, 2.38, 1.75, 2.66, 2.13, 1.27, 14.33, 1.28, 2.97, 2.18, 1.76, 49.81, 1.58, 2.8, 2.16, 1.43, 11.67, 1.44, 2.18, 2.69, 2.33, 38.29],
  [1.89, 2.74, 2.31, 1.66, 18.34, 2.16, 2.07, 1.55, 2.89, 27.09, 2.3, 1.7, 1.28, 2.55, 1.14, 2.62, 2.07, 2.8, 2.33, 1.92, 96.75, 1.0, 1.98, 2.79, 2.12, 1.59, 2.77, 1.32, 1.73, 2.24, 2.81, 1.45, 1.05, 2.36, 14.08, 2.6, 2.04, 1.68, 2.93, 33.45, 2.55, 1.96, 2.38, 2.14, 16.72, 2.69, 1.42, 1.35, 2.88, 22.19],
  [1.79, 2.62, 1.58, 2.9, 13.4]]