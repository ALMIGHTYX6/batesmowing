const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const form = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.querySelector(".sr-only").textContent = isOpen ? "Close menu" : "Open menu";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector(".sr-only").textContent = "Open menu";
    });
  });
}

// Smooth-scroll anchors that account for sticky header height
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const headerOffset = document.querySelector('.site-header')?.offsetHeight || 72;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset - 8;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    document.body.classList.remove('menu-open');
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('.sr-only').textContent = 'Open menu';
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const nombre = String(data.get("nombre") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const correo = String(data.get("correo") || "").trim();
    const servicio = String(data.get("servicio") || "").trim();
    const mensaje = String(data.get("message") || "").trim();

    if (!nombre || !telefono || !servicio || !mensaje) {
      formStatus.textContent = "Please complete the required fields to prepare your request.";
      return;
    }

    const request =
      [
        "Hello Bates Mowing,",
        "",
        "I would like to request lawn care service.",
        "",
        `Name: ${nombre}`,
        `Phone: ${telefono}`,
        `Email: ${correo || "Not provided"}`,
        `Service needed: ${servicio}`,
        "",
        "Message:",
        mensaje,
      ].join("\n");

    const subject = encodeURIComponent(`Quote request from ${nombre}`);
    const body = encodeURIComponent(request);

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(request).then(() => {
        formStatus.textContent = "Your request has been copied. You can paste it into an email to Bates Mowing.";
      }, () => {});
    }

    window.location.href = `mailto:wbatesmowing@gmail.com?subject=${subject}&body=${body}`;
  });
}
