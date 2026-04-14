/* Ticker JS — Static Marketing Text */
const updateTicker = () => {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;

    tickerContent.innerHTML = `
        <div class="ticker-item">
            <span class="ticker-label">💎 INVEST NOW</span>
            <span class="ticker-value">START AT ₹1000/Month</span>
        </div>
        <div class="ticker-item">
            <span class="ticker-label">📞 START TODAY</span>
            <span class="ticker-value">+91 90994 22402</span>
        </div>
        <div class="ticker-item">
            <span class="ticker-label">💎 INVEST NOW</span>
            <span class="ticker-value">START AT ₹1000/Month</span>
        </div>
        <div class="ticker-item">
            <span class="ticker-label">📞 START TODAY</span>
            <span class="ticker-value">+91 90994 22402</span>
        </div>
        <!-- Duplicates for seamless scroll -->
        <div class="ticker-item">
            <span class="ticker-label">💎 INVEST NOW</span>
            <span class="ticker-value">START AT ₹1000/Month</span>
        </div>
        <div class="ticker-item">
            <span class="ticker-label">📞 START TODAY</span>
            <span class="ticker-value">+91 90994 22402</span>
        </div>
    `;
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTicker();
});
