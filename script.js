import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (typeof Lenis !== "undefined" && !prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.08,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    lerp: 0.08,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ---------- Cursor premium ----------
const cursor = document.querySelector(".cursor");
if (cursor && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    gsap.to(cursor, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.15,
      ease: "power2.out",
    });
  });

  document
    .querySelectorAll("a, button, input, textarea, [data-tilt]")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("active"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("active"),
      );
    });
}

// ---------- Magnetic buttons ----------
document.querySelectorAll("[data-magnetic]").forEach((el) => {
  const factor = 20;

  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * factor;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * factor;

    gsap.to(el, {
      x,
      y,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.45)",
    });
  });
});

// ---------- Menu móvil ----------
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobileMenu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", String(expanded));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });
}

// ---------- Navbar state ----------
const nav = document.querySelector(".nav");
window.addEventListener(
  "scroll",
  () => {
    nav?.classList.toggle("scrolled", window.scrollY > 20);
  },
  { passive: true },
);

// ---------- Intro + reveal ----------
gsap.to(".hero-media img", {
  scale: 1,
  duration: prefersReducedMotion ? 0.01 : 2,
  ease: "power2.out",
});

if (!prefersReducedMotion) {
  gsap.fromTo(
    ".hero-media img",
    { yPercent: -4, scale: 1.14 },
    {
      yPercent: 20,
      scale: 1.02,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}

gsap.to(".reveal-title", {
  y: 0,
  opacity: 1,
  duration: prefersReducedMotion ? 0.01 : 1.2,
  ease: "power3.out",
  delay: 0.12,
});

gsap.utils.toArray(".reveal").forEach((item) => {
  gsap.fromTo(
    item,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 86%",
      },
    },
  );
});

// ---------- Counters ----------
const counters = gsap.utils.toArray(".counter");
counters.forEach((counter) => {
  const target = Number(counter.dataset.target || 0);
  const snap = { val: 0 };

  gsap.to(snap, {
    val: target,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: counter,
      start: "top 90%",
      once: true,
    },
    onUpdate: () => {
      const suffix = target > 100 ? "+" : target === 98 ? "%" : "+";
      counter.textContent = `${Math.round(snap.val)}${suffix}`;
    },
  });
});

// ---------- Parallax cards ----------
gsap.utils.toArray(".property-card").forEach((card, i) => {
  gsap.from(card, {
    y: 120,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    delay: i * 0.08,
    scrollTrigger: {
      trigger: card,
      start: "top 88%",
    },
  });

  gsap.to(card.querySelector("img"), {
    yPercent: -30,
    ease: "none",
    scrollTrigger: {
      trigger: card,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

// ---------- Tilt interaction ----------
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    gsap.to(card, {
      rotateY: (x - 0.5) * 24,
      rotateX: (0.5 - y) * 20,
      scale: 1.05,
      transformPerspective: 600,
      duration: 0.28,
      ease: "power2.out",
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  });
});

// ---------- Three.js ambient particles ----------
const canvas = document.getElementById("luxCanvas");
if (canvas) {
  if (prefersReducedMotion) {
    canvas.style.display = "none";
  }

  if (prefersReducedMotion) {
    // Evita carga WebGL en perfiles con movimiento reducido.
    // El fondo visual se mantiene con la imagen del hero y gradientes CSS.
  } else {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 35;

    const pointsCountPrimary = window.innerWidth < 768 ? 2200 : 3500;
    const pointsCountSecondary = window.innerWidth < 768 ? 700 : 1200;

    const createField = ({
      count,
      color,
      size,
      opacity,
      spreadX,
      spreadY,
      spreadZ,
    }) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        pos[i] = (Math.random() - 0.5) * spreadX;
        pos[i + 1] = (Math.random() - 0.5) * spreadY;
        pos[i + 2] = (Math.random() - 0.5) * spreadZ;
      }

      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

      const mat = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const field = new THREE.Points(geo, mat);
      scene.add(field);
      return { field, mat };
    };

    const primary = createField({
      count: pointsCountPrimary,
      color: "#d8b36b",
      size: 0.22,
      opacity: 0.7,
      spreadX: 96,
      spreadY: 56,
      spreadZ: 70,
    });

    const secondary = createField({
      count: pointsCountSecondary,
      color: "#f6f2e8",
      size: 0.12,
      opacity: 0.45,
      spreadX: 78,
      spreadY: 46,
      spreadZ: 90,
    });

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      primary.field.rotation.y += 0.0018;
      primary.field.rotation.x += 0.00075;
      secondary.field.rotation.y -= 0.0011;
      secondary.field.rotation.x += 0.00045;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        primary.field.rotation.z = self.progress * 0.8;
        secondary.field.rotation.z = -self.progress * 0.55;
        primary.mat.opacity = 0.7 - self.progress * 0.34;
        secondary.mat.opacity = 0.45 - self.progress * 0.2;
      },
    });
  }
}

// ---------- Form UX ----------
const leadForm = document.getElementById("leadForm");
if (leadForm) {
  const feedback = leadForm.querySelector(".form-feedback");

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!(feedback instanceof HTMLElement)) return;

    feedback.textContent =
      "Excelente. Briefing enviado. Nuestro equipo premium le contactará en menos de 24 horas.";
    leadForm.reset();

    gsap.fromTo(
      feedback,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
    );
  });
}
