/* ===== DHAN SURAKSHA — Interactive JavaScript ===== */
let deferredPrompt;

document.addEventListener('DOMContentLoaded', () => {

  // ========== MOBILE MENU TOGGLE ==========
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ========== STICKY NAVBAR ==========
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  });

  // ========== SCROLL REVEAL ANIMATIONS ==========
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the reveal
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== SMOOTH SCROLLING ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== ACTIVE NAV LINK HIGHLIGHTING ==========
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.style.color = '';
        });
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) {
          activeLink.style.color = '#F5E6A3';
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  // ========== COUNTER / NUMBER ANIMATION ==========
  const statElements = document.querySelectorAll('.hero-stat h3');

  const animateValue = (el, start, end, duration, prefix = '', suffix = '') => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(eased * (end - start) + start);
      el.textContent = prefix + value.toLocaleString('en-IN') + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const h3 = entry.target;
        const text = h3.textContent.trim();

        if (text.includes('₹')) {
          animateValue(h3, 0, 1000, 1500, '₹');
        } else if (text.includes('999.9')) {
          animateValue(h3, 900, 999, 1500, '', '.9');
        } else if (text.includes('100')) {
          animateValue(h3, 0, 100, 1500, '', '%');
        }

        statObserver.unobserve(h3);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => statObserver.observe(el));

  // ========== iOS DOWNLOAD DETECTION ==========
  const isIOS = () => {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  };

  if (isIOS()) {
    const iosButtons = document.querySelectorAll('.ios-download');
    iosButtons.forEach(btn => {
      btn.style.display = 'inline-flex';
      btn.addEventListener('click', (e) => {
        // If no direct link is provided, show the PWA install guide
        if (btn.getAttribute('href') === '#' || btn.getAttribute('href').startsWith('javascript:')) {
          e.preventDefault();
          alert('To install Dhan Suraksha on your iOS device:\n\n1. Tap the Share button (square with arrow) at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right corner.');
        }
      });
    });
  }

  // Handle native PWA prompts for Android/Desktop
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show buttons for non-iOS users who have PWA support
    if (!isIOS()) {
      const pwaButtons = document.querySelectorAll('.ios-download');
      pwaButtons.forEach(btn => {
        btn.style.display = 'inline-flex';
        btn.innerHTML = btn.innerHTML.replace('App', 'Install App');
      });
    }
  });

});

// ========== SERVICE WORKER REGISTRATION ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Registered'))
      .catch(err => console.log('Service Worker Failed', err));
  });
}

// ========== PWA INSTALLATION PROMPT (NON-iOS) ==========
// deferredPrompt is handled inside the DOMContentLoaded listener and global click listener
// to prevent duplicates, we'll ensure all PWA logic is centralized.

// Update the click handler for .ios-download to handle the PWA prompt if it exists
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.ios-download');
  if (btn) {
    if (deferredPrompt) {
      e.preventDefault();
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
      });
    }
  }
});

// ========== SAVINGS CALCULATOR ==========
function calculateSavings() {
  const amount = parseFloat(document.getElementById('calcAmount').value);
  const months = parseInt(document.getElementById('calcMonths').value);
  const metal = document.getElementById('calcMetal').value;

  if (!amount || amount < 1000) {
    alert('Please enter a minimum amount of ₹1,000');
    return;
  }

  const totalSaving = amount * months;

  // Approximate weight calculation (these are rough estimates)
  let metalWeight, metalUnit, metalName;
  if (metal === 'gold') {
    // Approx gold rate: ₹7,500 per gram (rough current market)
    metalWeight = (totalSaving / 7500).toFixed(2);
    metalUnit = 'grams';
    metalName = 'Gold (999.9 Fine)';
  } else {
    // Approx silver rate: ₹95 per gram (rough current market)
    metalWeight = (totalSaving / 95).toFixed(0);
    metalUnit = 'grams';
    metalName = 'Silver (999 Fine)';
  }

  const resultDiv = document.getElementById('calcResult');
  const totalAmountEl = document.getElementById('calcTotalAmount');
  const detailsEl = document.getElementById('calcDetails');

  totalAmountEl.textContent = '₹' + totalSaving.toLocaleString('en-IN');
  detailsEl.innerHTML = `
    Saving <strong>₹${amount.toLocaleString('en-IN')}/month</strong> for <strong>${months} months</strong>
  `;

  resultDiv.classList.add('show');

  // Smooth scroll to result
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========== CONTACT FORM —  WhatsApp Redirect ==========
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const phone = document.getElementById('form-phone').value.trim();
  const interest = document.getElementById('form-interest').value;
  const message = document.getElementById('form-message').value.trim();

  if (!name || !phone) {
    alert('Please fill in your name and phone number.');
    return;
  }

  let interestLabel = 'General Inquiry';
  if (interest === 'gold') interestLabel = 'Gold Savings Plan';
  else if (interest === 'silver') interestLabel = 'Silver Savings Plan';
  else if (interest === 'both') interestLabel = 'Family Wealth Plan (Gold + Silver)';

  const whatsappMessage = encodeURIComponent(
    `🏆 *New Inquiry — Dhan Suraksha*\n\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `💰 Interest: ${interestLabel}\n` +
    `${message ? `📝 Message: ${message}\n` : ''}` +
    `\n_Sent from Dhan Suraksha Website_`
  );

  window.open(`https://wa.me/919099422402?text=${whatsappMessage}`, '_blank');
}

// ========== CAREER FORM — WhatsApp Redirect ==========
function handleCareerForm(event) {
  event.preventDefault();

  const name = event.target.querySelector('input[placeholder="Full Name"]').value.trim();
  const email = event.target.querySelector('input[placeholder="Email Address"]').value.trim();
  const phone = event.target.querySelector('input[placeholder="Phone Number"]').value.trim();
  const position = event.target.querySelector('select').value;
  const message = event.target.querySelector('textarea').value.trim();

  if (!name || !phone || !position) {
    alert('Please fill in your name, phone number, and select a position.');
    return;
  }

  const whatsappMessage = encodeURIComponent(
    `💼 *New Job Application — Dhan Suraksha*\n\n` +
    `👤 Name: ${name}\n` +
    `📧 Email: ${email}\n` +
    `📞 Phone: ${phone}\n` +
    `📍 Position: ${position}\n` +
    `${message ? `📝 Why Join: ${message}\n` : ''}` +
    `\n_Sent from Dhan Suraksha Careers Page_`
  );

  window.open(`https://wa.me/919099422402?text=${whatsappMessage}`, '_blank');
}

// Attach career form listener if it exists
document.addEventListener('submit', (e) => {
  if (e.target && e.target.id === 'careerForm') {
    handleCareerForm(e);
  } else if (e.target && e.target.id === 'contactForm') {
    handleFormSubmit(e);
  }
});
