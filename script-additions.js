
// Additional JavaScript for new features

// Demo banner functionality
document.addEventListener("DOMContentLoaded", () => {
  const demoBannerClose = document.getElementById("demoBannerClose")
  const demoBanner = document.querySelector(".demo-banner")

  if (demoBannerClose && demoBanner) {
    demoBannerClose.addEventListener("click", () => {
      demoBanner.style.display = "none"
      // Adjust page padding
      document.querySelectorAll(".page").forEach((page) => {
        page.style.paddingTop = "80px"
      })
    })
  }
})

// Betting sites functionality
function openSite(siteName) {
  showNotification(`Kufungua ${siteName}... Kumbuka kucheza kwa busara!`, "warning")

  // Simulate opening site (in real implementation, you'd open actual URLs)
  setTimeout(() => {
    showNotification(`${siteName} imefunguliwa katika tab mpya`, "info")
  }, 1500)
}

// Purchase page functionality
let selectedPlan = null
const planPrices = {
  basic: 50000,
  premium: 120000,
  pro: 200000,
}

function selectPlan(planType) {
  selectedPlan = planType
  const price = planPrices[planType]

  // Update payment amount
  const paymentAmount = document.getElementById("paymentAmount")
  if (paymentAmount) {
    paymentAmount.textContent = `TSh ${price.toLocaleString()}`
  }

  // Show payment section
  const paymentSection = document.getElementById("paymentSection")
  if (paymentSection) {
    paymentSection.style.display = "block"
    paymentSection.scrollIntoView({ behavior: "smooth" })
  }

  // Generate unique account number
  const accountNumber = document.getElementById("accountNumber")
  if (accountNumber) {
    const uniqueId = Math.random().toString(36).substr(2, 6).toUpperCase()
    accountNumber.textContent = `AV${planType.toUpperCase()}${uniqueId}`
  }

  showNotification(`Umechagua mpango wa ${planType}. Fuata maelekezo ya malipo.`, "success")
}

function copyBusinessNumber() {
  const businessNumber = document.getElementById("businessNumber").textContent
  copyToClipboard(businessNumber)
  showNotification("Nambari ya biashara imenakiliwa!", "success")
}

function copyAccountNumber() {
  const accountNumber = document.getElementById("accountNumber").textContent
  copyToClipboard(accountNumber)
  showNotification("Nambari ya akaunti imenakiliwa!", "success")
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
  }
}

// Enhanced trainer with Kiswahili messages
function updateTrainerMessages() {
  // Override existing notification messages with Kiswahili
  const originalShowNotification = window.showNotification

  window.showNotification = (message, type) => {
    // Translate common messages to Kiswahili
    const translations = {
      "Cashed out at": "Umetoa pesa kwa",
      Won: "Umeshinda",
      "Plane crashed at": "Ndege imeanguka kwa",
      Lost: "Umepoteza",
      "Training Complete!": "Mafunzo Yamekamilika!",
      "Final Profit:": "Faida ya Mwisho:",
      "Win Rate:": "Kiwango cha Ushindi:",
      "Start a new training session?": "Anza kipindi kipya cha mafunzo?",
    }

    let translatedMessage = message
    Object.keys(translations).forEach((key) => {
      translatedMessage = translatedMessage.replace(key, translations[key])
    })

    // Add demo reminder to all trainer messages
    if (typeof currentPage !== "undefined" && currentPage === "predictor") {
      translatedMessage += " (DEMO)"
    }

    originalShowNotification(translatedMessage, type)
  }
}

// Initialize enhanced features
document.addEventListener("DOMContentLoaded", () => {
  updateTrainerMessages()

  // Add upgrade button functionality
  document.querySelectorAll(".upgrade-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const page = btn.dataset.page
      if (page) {
        if (typeof navigateToPage !== "undefined") {
          navigateToPage(page)
        }
      }
    })
  })

  // Add demo reminders to all game interactions
  const originalHandleCashout = window.handleCashout
  window.handleCashout = () => {
    showNotification("Hii ni demo tu - si mchezo wa kweli!", "warning")
    setTimeout(() => {
      originalHandleCashout()
    }, 1000)
  }
})

// Enhanced trainer state with Kiswahili
const enhancedTrainerState = {
  ...(typeof trainerState !== "undefined" ? trainerState : {}),
  messages: {
    waiting: "Inasubiri...",
    flying: "Inaruka...",
    crashed: "Imeanguka!",
    cashedOut: "Umetoa Pesa!",
    betPlaced: "Dau Limewekwa",
    roundComplete: "Raundi Imekamilika",
    trainingComplete: "Mafunzo Yamekamilika!",
  },
}

// Update trainer display with Kiswahili
function updateTrainerDisplayKiswahili() {
  const elements = {
    currentRound: document.getElementById("currentRound"),
    totalRounds: document.getElementById("totalRounds"),
    trainerBalance: document.getElementById("trainerBalance"),
    totalProfit: document.getElementById("totalProfit"),
    winRate: document.getElementById("winRate"),
    roundsPlayed: document.getElementById("roundsPlayed"),
    betAmount: document.getElementById("betAmount"),
    cashoutAt: document.getElementById("cashoutAt"),
    betBtnAmount: document.getElementById("betBtnAmount"),
    cashoutBtnAmount: document.getElementById("cashoutBtnAmount"),
  }

  // Update with current values and Kiswahili formatting
  if (elements.currentRound) elements.currentRound.textContent = enhancedTrainerState.currentRound
  if (elements.totalRounds) elements.totalRounds.textContent = enhancedTrainerState.totalRounds
  if (elements.trainerBalance)
    elements.trainerBalance.textContent = `${enhancedTrainerState.balance.toLocaleString()} TSh`

  if (elements.totalProfit) {
    const profit = enhancedTrainerState.totalProfit
    elements.totalProfit.textContent = `${profit >= 0 ? "+" : ""}${profit.toLocaleString()} TSh`
    elements.totalProfit.className = `stat-value ${profit >= 0 ? "profit" : "loss"}`
  }

  if (elements.winRate) {
    const rate =
      enhancedTrainerState.roundsPlayed > 0
        ? Math.round((enhancedTrainerState.wins / enhancedTrainerState.roundsPlayed) * 100)
        : 0
    elements.winRate.textContent = `${rate}%`
  }

  if (elements.roundsPlayed) elements.roundsPlayed.textContent = enhancedTrainerState.roundsPlayed
  if (elements.betAmount) elements.betAmount.textContent = enhancedTrainerState.betAmount.toLocaleString()
  if (elements.cashoutAt) elements.cashoutAt.textContent = enhancedTrainerState.cashoutAt.toFixed(2)
  if (elements.betBtnAmount)
    elements.betBtnAmount.textContent = `${enhancedTrainerState.betAmount.toLocaleString()} TSh`

  if (elements.cashoutBtnAmount) {
    const amount = Math.floor(enhancedTrainerState.betAmount * enhancedTrainerState.multiplier)
    elements.cashoutBtnAmount.textContent = `${amount.toLocaleString()} TSh`
  }
}

// Demo reminder system
function showDemoReminder() {
  const reminders = [
    "Kumbuka: Hii ni demo ya kujifunza tu!",
    "Matokeo haya si ya kweli - ni ya mafunzo tu!",
    "Kwa mchezo wa kweli, nunua app yetu!",
    "Demo hii ni kwa ajili ya kujifunza tu!",
  ]

  const randomReminder = reminders[Math.floor(Math.random() * reminders.length)]
  showNotification(randomReminder, "info")
}

// Show demo reminder every 2 minutes
setInterval(() => {
  if (typeof currentPage !== "undefined" && (currentPage === "predictor" || currentPage === "home")) {
    showDemoReminder()
  }
}, 120000)

// Enhanced error handling with Kiswahili messages
window.addEventListener("error", (e) => {
  console.error("Hitilafu ya programu:", e.error)
  showNotification("Hitilafu imetokea. Tafadhali onyesha ukurasa upya.", "error")
})

console.log("🇹🇿 Aviator Pro Tanzania: Mfumo wote uko tayari!")