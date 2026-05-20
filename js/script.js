  // Year
    document.getElementById("year").textContent = new Date().getFullYear();

    // Scroll nav background (apply to header for full-width background)
    window.addEventListener('scroll', () => {
      const headerEl = document.querySelector('header');
      if (!headerEl) return;
      if (window.scrollY > 0) {
        headerEl.classList.add('scrolled');
        document.body.classList.add('header-scrolled');
      } else {
        headerEl.classList.remove('scrolled');
        document.body.classList.remove('header-scrolled');
      }
    });

    // Mobile menu
    const menuBtn = document.getElementById("menuBtn");
    const mobilePanel = document.getElementById("mobilePanel");
    let open = false;

    function closeMobile(){
      open = false;
      mobilePanel.style.display = "none";
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

    menuBtn.addEventListener("click", () => {
      open = !open;
      mobilePanel.style.display = open ? "block" : "none";
      menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu on click
    mobilePanel.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => closeMobile());
    });

    // FAQ accordion
    document.querySelectorAll(".qa").forEach(item => {
      item.querySelector(".q").addEventListener("click", () => {
        // close others
        document.querySelectorAll(".qa").forEach(x => { if(x !== item) x.classList.remove("open"); });
        item.classList.toggle("open");
      });
    });

    // Contact form submit with EmailJS.
    const leadForm = document.getElementById("leadForm");
    const formStatus = document.getElementById("formStatus");
    if (leadForm && formStatus) {
      const setFormStatus = (message, state) => {
        formStatus.textContent = message;
        formStatus.className = "formStatus";

        if (!message) {
          return;
        }

        formStatus.classList.add("is-visible");
        if (state) {
          formStatus.classList.add(`is-${state}`);
        }
      };

      leadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitButton = leadForm.querySelector('button[type="submit"]');
        if (!submitButton) return;

        const serviceId = leadForm.dataset.emailjsServiceId;
        const templateId = leadForm.dataset.emailjsTemplateId;
        const publicKey = (leadForm.dataset.emailjsPublicKey || "").trim();
        const timeField = document.getElementById("time");

        if (!publicKey) {
          setFormStatus("Email setup incomplete: add your EmailJS public key in the form data-emailjs-public-key attribute.", "error");
          return;
        }

        if (timeField) {
          timeField.value = new Date().toLocaleString();
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        setFormStatus("Sending your message...", "sending");

        try {
          emailjs.init({ publicKey: publicKey });

          await emailjs.sendForm(serviceId, templateId, leadForm, {
            publicKey: publicKey
          });

          setFormStatus("Thank you. Your message has been sent successfully.", "success");
          leadForm.reset();
        } catch (error) {
          const errorText = error?.text || error?.message || "Unknown EmailJS error";
          console.error("EmailJS send failed:", error);
          setFormStatus(`Could not send: ${errorText}`, "error");
        } finally {
          submitButton.disabled = false;
          submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send message';
        }
      });
    }

// Testimonials Carousel
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel-wrapper');
  const items = document.querySelectorAll('.review-item');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!carousel || items.length === 0) return;

  let currentIndex = 0;
  const totalItems = items.length;
  let itemsPerView = 3;

  // Function to update items per view based on screen size
  function updateItemsPerView() {
    if (window.innerWidth <= 620) {
      itemsPerView = 1;
    } else if (window.innerWidth <= 980) {
      itemsPerView = 2;
    } else {
      itemsPerView = 3;
    }
  }

  updateItemsPerView();
  window.addEventListener('resize', updateItemsPerView);

  // Create dots
  for (let i = 0; i < Math.ceil(totalItems / itemsPerView); i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll('.dot');

  function updateCarousel() {
    const translateX = -currentIndex * (100 / itemsPerView);
    carousel.style.transform = `translateX(${translateX}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % Math.ceil(totalItems / itemsPerView);
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + Math.ceil(totalItems / itemsPerView)) % Math.ceil(totalItems / itemsPerView);
    updateCarousel();
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Auto-slide
  let autoSlide = setInterval(nextSlide, 5000);

  // Pause on hover
  const carouselContainer = document.querySelector('.carousel');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
  carouselContainer.addEventListener('mouseleave', () => autoSlide = setInterval(nextSlide, 5000));
});