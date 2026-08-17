const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".nav a")];
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const sections = [...document.querySelectorAll("main section[id]")];
const langButtons = [...document.querySelectorAll("[data-lang]")];
const artModal = document.querySelector("[data-art-modal]");
const artModalTitle = document.querySelector("[data-art-title]");
const artModalKicker = document.querySelector("[data-art-kicker]");
const artModalCopy = document.querySelector("[data-art-copy]");
const artDetailButtons = [...document.querySelectorAll("[data-art]")];
let currentLang = "es";

const translations = {
  es: {
    "nav.home": "Inicio",
    "nav.about": "Quiénes somos",
    "nav.arts": "Artes marciales",
    "nav.teachers": "Maestros",
    "nav.schedule": "Horario",
    "nav.pricing": "Precios",
    "nav.contact": "Contacto",
    "hero.title": "El camino hacia<br />el dominio personal",
    "hero.copy":
      "Club tradicional de artes marciales en Valle de Bravo, inspirado en las virtudes del Bushido.",
    "hero.group.alt": "Grupo de practicantes en el tatami de El Dojo",
    "cta.visit": "Agenda una visita",
    "cta.know": "Conoce el dojo",
    "cta.classes": "Ver clases",
    "cta.learn": "Conocer arte",
    "cta.profile": "Ver perfil",
    "cta.plan": "Elegir plan",
    "cta.whatsapp": "Habla con Coach Arturo",
    "whatsapp.coach": "Habla con Coach Arturo",
    "kicker.philosophy": "01 / Filosofía",
    "philosophy.title": "Inspirado en Bushido,<br />el camino del guerrero.",
    "philosophy.copy":
      "Bushido significa “el camino del guerrero”. En El Dojo, esta filosofía inspira una práctica basada en justicia, valor, compasión, respeto, sinceridad, honor, lealtad y autocontrol.",
    "virtue.gi.title": "Gi — Justicia",
    "virtue.gi.copy": "Actuar con rectitud dentro y fuera del tatami.",
    "virtue.yu.title": "Yu — Valor",
    "virtue.yu.copy": "Enfrentar el miedo con calma y decisión.",
    "virtue.jin.title": "Jin — Compasión",
    "virtue.jin.copy": "Usar la fuerza con cuidado y humanidad.",
    "virtue.rei.title": "Rei — Respeto",
    "virtue.rei.copy": "Honrar al maestro, al compañero y a uno mismo.",
    "virtue.makoto.title": "Makoto — Sinceridad",
    "virtue.makoto.copy": "Practicar con palabra clara e intención honesta.",
    "virtue.meiyo.title": "Meiyo — Honor",
    "virtue.meiyo.copy": "Cuidar la conducta incluso cuando nadie observa.",
    "virtue.chugi.title": "Chugi — Lealtad",
    "virtue.chugi.copy": "Comprometerse con el camino, el grupo y la práctica.",
    "virtue.jisei.title": "Jisei — Autodominio",
    "virtue.jisei.copy": "Responder con dominio propio, no con impulso.",
    "kicker.dojo": "02 / Nuestro dojo",
    "dojo.title": "Un espacio para entrenar cuerpo, mente y carácter.",
    "dojo.copy":
      "En el corazón de Valle de Bravo, El Dojo ofrece un espacio dedicado al camino marcial: un lugar para aprender, entrenar, respirar, caer, levantarse y crecer.",
    "kicker.arts": "03 / Artes marciales",
    "arts.title": "Cinco disciplinas. Un mismo camino.",
    "arts.copy": "Disciplina, técnica y espíritu en cada práctica.",
    "art.bjj.copy": "Suelo, palancas, control, paciencia y calma bajo presión.",
    "art.bjj.for": "Ideal para: adultos, jóvenes y defensa personal.",
    "art.bjj.teacher": "Maestro: Gabriel",
    "art.judo.copy": "Proyecciones, balance, timing, caídas seguras y disciplina.",
    "art.judo.for": "Ideal para: niños, adultos y familias.",
    "art.judo.teacher": "Maestro: Tal",
    "art.karate.copy": "Golpeo, postura, precisión, enfoque, formas y espíritu marcial.",
    "art.karate.for": "Ideal para: niños, principiantes y practicantes técnicos.",
    "art.aikido.copy": "Redirección, armonía, movimiento, respiración y control sin agresión.",
    "art.aikido.for": "Ideal para: adultos, movilidad y práctica contemplativa.",
    "art.sambo.copy": "Derribos, grappling, resiliencia, adaptación y movimiento práctico.",
    "art.sambo.for": "Ideal para: atletas, jóvenes y practicantes de grappling.",
    "kicker.teachers": "04 / Maestros",
    "teachers.title": "Maestros y guías.",
    "teacher.gabriel.role": "Maestro de Jiu Jitsu",
    "teacher.gabriel.alt": "Gabriel, maestro de Jiu Jitsu",
    "teacher.tal.role": "Maestro de Judo",
    "teacher.tal.alt": "Tal, maestro de Judo",
    "kicker.schedule": "05 / Horario",
    "schedule.title": "Horario de clases",
    "filter.adults": "Adultos",
    "filter.families": "Familias",
    "day.mon": "Lunes",
    "day.tue": "Martes",
    "day.wed": "Miércoles",
    "day.thu": "Jueves",
    "day.fri": "Viernes",
    "day.sat": "Sábado",
    "agenda.adults": "Adultos",
    "agenda.kids": "Kids",
    "agenda.families": "Familias",
    "schedule.note": "Horarios sujetos a cambios. Consulta actualizaciones en nuestras redes.",
    "kicker.pricing": "06 / Membresías",
    "pricing.title": "Membresías",
    "pricing.basic": "Básica",
    "pricing.complete": "Completa",
    "pricing.family": "Familiar",
    "pricing.month": "/mes",
    "pricing.basic.copy": "Acceso a 1 disciplina",
    "pricing.complete.copy": "Acceso a todas las disciplinas",
    "pricing.family.copy": "Para 2 integrantes de la misma familia",
    "pricing.group": "Clases grupales",
    "pricing.regular": "Horario regular",
    "pricing.locker": "Vestidor y regaderas",
    "pricing.unlimited": "Clases ilimitadas",
    "pricing.allDisciplines": "Todas las disciplinas",
    "pricing.communityDojo": "Comunidad Dojo",
    "pricing.extended": "Horarios extendidos",
    "pricing.events": "Eventos de comunidad",
    "feature.visit.title": "Visita inicial",
    "feature.visit.copy": "Conoce el espacio y encuentra tu disciplina.",
    "feature.contract.title": "Sin contrato",
    "feature.contract.copy": "Cancela cuando quieras.",
    "feature.community.title": "Comunidad",
    "feature.community.copy": "Más que un dojo, una familia.",
    "feature.location.title": "Ubicación",
    "feature.location.copy": "Valle de Bravo, rodeado de naturaleza.",
    "kicker.contact": "07 / Contacto",
    "contact.title": "Agenda una visita",
    "contact.copy":
      "Habla directamente con Coach Arturo por WhatsApp. Él te ayudará a elegir la disciplina y el horario ideales para comenzar.",
    "footer.copy": "Club de artes marciales<br />Valle de Bravo",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.arts": "Martial arts",
    "nav.teachers": "Teachers",
    "nav.schedule": "Schedule",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",
    "hero.title": "The path toward<br />personal mastery",
    "hero.copy":
      "A traditional martial arts club in Valle de Bravo, inspired by the virtues of Bushido.",
    "hero.group.alt": "El Dojo martial arts group on the tatami",
    "cta.visit": "Schedule a visit",
    "cta.know": "Discover the dojo",
    "cta.classes": "View classes",
    "cta.learn": "Learn more",
    "cta.profile": "View profile",
    "cta.plan": "Choose plan",
    "cta.whatsapp": "Talk to Coach Arturo",
    "whatsapp.coach": "Talk to Coach Arturo",
    "kicker.philosophy": "01 / Philosophy",
    "philosophy.title": "Inspired by Bushido,<br />the way of the warrior.",
    "philosophy.copy":
      "Bushido means “the way of the warrior.” At El Dojo, this philosophy inspires a practice rooted in justice, courage, compassion, respect, sincerity, honor, loyalty, and self-control.",
    "virtue.gi.title": "Gi — Justice",
    "virtue.gi.copy": "Act with integrity on and off the tatami.",
    "virtue.yu.title": "Yu — Courage",
    "virtue.yu.copy": "Meet fear with calm and determination.",
    "virtue.jin.title": "Jin — Compassion",
    "virtue.jin.copy": "Use strength with care and humanity.",
    "virtue.rei.title": "Rei — Respect",
    "virtue.rei.copy": "Honor the teacher, the partner, and the self.",
    "virtue.makoto.title": "Makoto — Sincerity",
    "virtue.makoto.copy": "Practice with clear words and honest intent.",
    "virtue.meiyo.title": "Meiyo — Honor",
    "virtue.meiyo.copy": "Protect your conduct even when no one is watching.",
    "virtue.chugi.title": "Chugi — Loyalty",
    "virtue.chugi.copy": "Commit to the path, the group, and the practice.",
    "virtue.jisei.title": "Jisei — Self-mastery",
    "virtue.jisei.copy": "Respond with self-mastery, not impulse.",
    "kicker.dojo": "02 / Our dojo",
    "dojo.title": "A space to train body, mind, and character.",
    "dojo.copy":
      "In the heart of Valle de Bravo, El Dojo offers a space dedicated to the martial path: a place to learn, train, breathe, fall, rise, and grow.",
    "kicker.arts": "03 / Martial arts",
    "arts.title": "Five disciplines. One path.",
    "arts.copy": "Discipline, technique, and spirit in every practice.",
    "art.bjj.copy": "Ground work, leverage, control, patience, and calm under pressure.",
    "art.bjj.for": "Best for: adults, youth, and self-defense.",
    "art.bjj.teacher": "Teacher: Gabriel",
    "art.judo.copy": "Throws, balance, timing, safe falling, and discipline.",
    "art.judo.for": "Best for: kids, adults, and families.",
    "art.judo.teacher": "Teacher: Tal",
    "art.karate.copy": "Striking, posture, precision, focus, forms, and martial spirit.",
    "art.karate.for": "Best for: kids, beginners, and technical practitioners.",
    "art.aikido.copy": "Redirection, harmony, movement, breath, and control without aggression.",
    "art.aikido.for": "Best for: adults, mobility, and contemplative practice.",
    "art.sambo.copy": "Takedowns, grappling, resilience, adaptability, and practical movement.",
    "art.sambo.for": "Best for: athletes, youth, and grappling practitioners.",
    "kicker.teachers": "04 / Teachers",
    "teachers.title": "Teachers and Guides",
    "teacher.gabriel.role": "Jiu Jitsu teacher",
    "teacher.gabriel.alt": "Gabriel, Jiu Jitsu teacher",
    "teacher.tal.role": "Judo teacher",
    "teacher.tal.alt": "Tal, Judo teacher",
    "kicker.schedule": "05 / Schedule",
    "schedule.title": "Class schedule",
    "filter.adults": "Adults",
    "filter.families": "Families",
    "day.mon": "Monday",
    "day.tue": "Tuesday",
    "day.wed": "Wednesday",
    "day.thu": "Thursday",
    "day.fri": "Friday",
    "day.sat": "Saturday",
    "agenda.adults": "Adults",
    "agenda.kids": "Kids",
    "agenda.families": "Families",
    "schedule.note": "Schedules may change. Check our social channels for updates.",
    "kicker.pricing": "06 / Memberships",
    "pricing.title": "Memberships",
    "pricing.basic": "Basic",
    "pricing.complete": "Complete",
    "pricing.family": "Family",
    "pricing.month": "/mo",
    "pricing.basic.copy": "Access to 1 discipline",
    "pricing.complete.copy": "Access to all disciplines",
    "pricing.family.copy": "For 2 members of the same family",
    "pricing.group": "Group classes",
    "pricing.regular": "Regular schedule",
    "pricing.locker": "Changing room and showers",
    "pricing.unlimited": "Unlimited classes",
    "pricing.allDisciplines": "All disciplines",
    "pricing.communityDojo": "Dojo community",
    "pricing.extended": "Extended schedule",
    "pricing.events": "Community events",
    "feature.visit.title": "Initial visit",
    "feature.visit.copy": "See the space and find your discipline.",
    "feature.contract.title": "No contract",
    "feature.contract.copy": "Cancel whenever you want.",
    "feature.community.title": "Community",
    "feature.community.copy": "More than a dojo, a family.",
    "feature.location.title": "Location",
    "feature.location.copy": "Valle de Bravo, surrounded by nature.",
    "kicker.contact": "07 / Contact",
    "contact.title": "Schedule a visit",
    "contact.copy":
      "Talk directly with Coach Arturo on WhatsApp. He will help you choose the right discipline and schedule to begin.",
    "footer.copy": "Martial arts club<br />Valle de Bravo",
  },
};

const artDetails = {
  es: {
    bjj: {
      title: "Brazilian Jiu-Jitsu",
      paragraphs: [
        "Brazilian Jiu-Jitsu nace de la evolución del judo y el jiu-jitsu japonés en Brasil, donde la familia Gracie y otros maestros adaptaron la técnica al combate en el suelo, la distancia corta y el uso eficiente de la palanca.",
        "Su sabiduría central es que la calma, la posición y la técnica pueden superar a la fuerza bruta. Enseña paciencia, humildad y atención al detalle, porque cada avance depende de respirar, escuchar el peso del cuerpo y tomar decisiones bajo presión.",
        "En la práctica se trabaja derribo, control, escapes, guardia, pases, estrangulaciones y luxaciones de manera progresiva y segura. Es una disciplina ideal para desarrollar defensa personal, confianza corporal y serenidad en situaciones difíciles.",
      ],
    },
    judo: {
      title: "Judo",
      paragraphs: [
        "El judo fue creado en Japón por Jigoro Kano a finales del siglo XIX como una forma moderna de educación física, ética y marcial. Su nombre suele traducirse como “el camino de la suavidad”.",
        "La enseñanza profunda del judo es usar la energía de manera eficiente. En lugar de chocar contra la fuerza, el practicante aprende a sentir el equilibrio, entrar en el momento correcto y transformar la resistencia en movimiento.",
        "Prácticamente, el judo incluye proyecciones, barridos, agarres, caídas seguras, inmovilizaciones y trabajo de control. Es excelente para niños y adultos porque desarrolla coordinación, respeto, postura, disciplina y confianza al caer y levantarse.",
      ],
    },
    karate: {
      title: "Karate",
      paragraphs: [
        "El karate se desarrolló en Okinawa y después se consolidó en Japón como un arte marcial de golpeo, forma y carácter. Su historia combina influencias locales de Okinawa con prácticas marciales chinas y japonesas.",
        "La sabiduría del karate está en la precisión. Cada postura, golpe y respiración entrena presencia, autocontrol y claridad mental. No se trata de agresión, sino de cultivar una respuesta firme, medida y consciente.",
        "En clase se practican golpes, bloqueos, patadas, desplazamientos, kata, trabajo con compañero y ejercicios de enfoque. Es una vía directa para desarrollar postura, coordinación, concentración y espíritu marcial.",
      ],
    },
    aikido: {
      title: "Aikido",
      paragraphs: [
        "El aikido fue desarrollado en Japón por Morihei Ueshiba durante el siglo XX. Su nombre puede entenderse como el camino de armonizar la energía, y su práctica busca resolver el conflicto sin responder con agresión directa.",
        "Su sabiduría está en la redirección. El practicante aprende a no endurecerse ante la fuerza, sino a moverse, respirar, entrar en armonía y conducir la energía hacia una resolución controlada.",
        "En la práctica se trabajan desplazamientos circulares, controles articulares, proyecciones, caídas, respiración y sensibilidad con el compañero. Es una disciplina profunda para movilidad, presencia, equilibrio y control sin violencia.",
      ],
    },
    sambo: {
      title: "Sambo",
      paragraphs: [
        "El sambo surgió en la Unión Soviética en el siglo XX como una síntesis práctica de lucha, judo y sistemas regionales de combate. Su nombre proviene de una expresión rusa relacionada con la defensa personal sin armas.",
        "Su sabiduría es la adaptabilidad. El practicante aprende a resolver situaciones cambiantes con decisión, resiliencia y claridad táctica, integrando derribos, agarres y controles de forma directa.",
        "En clase se practican entradas a derribo, control de cuerpo, transiciones, inmovilizaciones, escapes y sumisiones según el nivel. Es una disciplina intensa y técnica para construir resistencia, confianza y capacidad de reacción.",
      ],
    },
  },
  en: {
    bjj: {
      title: "Brazilian Jiu-Jitsu",
      paragraphs: [
        "Brazilian Jiu-Jitsu grew from the evolution of judo and Japanese jiu-jitsu in Brazil, where the Gracie family and other teachers adapted the art toward ground fighting, close contact, and efficient leverage.",
        "Its central wisdom is that calm, position, and technique can overcome brute strength. It teaches patience, humility, and attention to detail because every advance depends on breathing, feeling body weight, and making decisions under pressure.",
        "In practice, students work takedowns, control, escapes, guard, passing, chokes, and joint locks in a progressive and safe way. It is ideal for self-defense, body confidence, and composure in difficult situations.",
      ],
    },
    judo: {
      title: "Judo",
      paragraphs: [
        "Judo was created in Japan by Jigoro Kano in the late nineteenth century as a modern form of physical, ethical, and martial education. Its name is often translated as “the gentle way.”",
        "The deeper teaching of judo is efficient use of energy. Instead of colliding with force, the practitioner learns to feel balance, enter at the right moment, and transform resistance into movement.",
        "Practically, judo includes throws, sweeps, gripping, safe falling, pins, and control work. It is excellent for children and adults because it develops coordination, respect, posture, discipline, and confidence in falling and rising again.",
      ],
    },
    karate: {
      title: "Karate",
      paragraphs: [
        "Karate developed in Okinawa and later took shape in Japan as an art of striking, form, and character. Its history blends Okinawan traditions with Chinese and Japanese martial influences.",
        "The wisdom of karate is precision. Every stance, strike, and breath trains presence, self-mastery, and mental clarity. It is not about aggression, but about cultivating a firm, measured, and conscious response.",
        "Classes include strikes, blocks, kicks, footwork, kata, partner drills, and focus exercises. It is a direct path for building posture, coordination, concentration, and martial spirit.",
      ],
    },
    aikido: {
      title: "Aikido",
      paragraphs: [
        "Aikido was developed in Japan by Morihei Ueshiba during the twentieth century. Its name can be understood as the way of harmonizing energy, and its practice seeks to resolve conflict without direct aggression.",
        "Its wisdom is redirection. The practitioner learns not to harden against force, but to move, breathe, harmonize, and guide energy toward a controlled resolution.",
        "Practice includes circular footwork, joint controls, throws, falling, breathing, and partner sensitivity. It is a deep discipline for mobility, presence, balance, and control without violence.",
      ],
    },
    sambo: {
      title: "Sambo",
      paragraphs: [
        "Sambo emerged in the Soviet Union in the twentieth century as a practical synthesis of wrestling, judo, and regional combat systems. Its name comes from a Russian expression connected to self-defense without weapons.",
        "Its wisdom is adaptability. The practitioner learns to solve changing situations with decision, resilience, and tactical clarity, integrating takedowns, grips, and controls in a direct way.",
        "Classes include takedown entries, body control, transitions, pins, escapes, and submissions according to level. It is an intense and technical discipline for building endurance, confidence, and reaction ability.",
      ],
    },
  },
};

const setLanguage = (lang) => {
  const dictionary = translations[lang] || translations.es;
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title =
    lang === "es"
      ? "El Dojo - Club de Artes Marciales en Valle de Bravo"
      : "El Dojo - Martial Arts Club in Valle de Bravo";
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      "content",
      lang === "es"
        ? "Club tradicional de artes marciales en Valle de Bravo inspirado en Bushido. Brazilian Jiu-Jitsu, Judo, Karate, Aikido y Sambo."
        : "Traditional martial arts club in Valle de Bravo inspired by Bushido. Brazilian Jiu-Jitsu, Judo, Karate, Aikido, and Sambo."
    );
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = dictionary[node.dataset.i18n];
    if (value) node.textContent = value;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const value = dictionary[node.dataset.i18nHtml];
    if (value) node.innerHTML = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const value = dictionary[node.dataset.i18nAria];
    if (value) node.setAttribute("aria-label", value);
  });
  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
  menuButton.setAttribute("aria-label", lang === "es" ? "Abrir menu" : "Open menu");
  localStorage.setItem("eldojo-lang", lang);
};

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 26);
};

const setParallax = () => {
  const viewport = window.innerHeight;
  parallaxItems.forEach((item) => {
    if (window.innerWidth <= 820 && item.classList.contains("hero-media")) {
      item.style.transform = "none";
      return;
    }
    const speed = Number(item.dataset.parallax || 0);
    const rect = item.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewport) return;
    const travel = (viewport / 2 - rect.top) * speed;
    item.style.transform = item.classList.contains("enso-hero")
      ? `translateX(-50%) translateY(${travel}px) rotate(-16deg)`
      : `translateY(${travel}px)`;
  });
};

const setActiveNav = () => {
  const current = sections
    .map((section) => ({
      id: section.id,
      distance: Math.abs(section.getBoundingClientRect().top - 130),
      top: section.getBoundingClientRect().top,
    }))
    .filter((section) => section.top < window.innerHeight * 0.72)
    .sort((a, b) => a.distance - b.distance)[0];

  if (!current) return;
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
};

const onScroll = () => {
  setHeaderState();
  setParallax();
  setActiveNav();
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

menuButton.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-active");
  document.body.classList.toggle("menu-open", isOpen);
  const lang = document.documentElement.lang === "en" ? "en" : "es";
  menuButton.setAttribute(
    "aria-label",
    isOpen ? (lang === "es" ? "Cerrar menu" : "Close menu") : lang === "es" ? "Abrir menu" : "Open menu"
  );
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    header.classList.remove("menu-active");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-label", document.documentElement.lang === "en" ? "Open menu" : "Abrir menu");
  }
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

const openArtModal = (art) => {
  const detail = artDetails[currentLang]?.[art] || artDetails.es[art];
  if (!detail) return;
  artModalTitle.textContent = detail.title;
  artModalKicker.textContent = currentLang === "en" ? "Martial arts" : "Artes marciales";
  artModalCopy.innerHTML = detail.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
  artModal.classList.add("open");
  artModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
};

const closeArtModal = () => {
  artModal.classList.remove("open");
  artModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
};

artDetailButtons.forEach((button) => {
  button.addEventListener("click", () => openArtModal(button.dataset.art));
});

document.querySelectorAll("[data-art-close]").forEach((button) => {
  button.addEventListener("click", closeArtModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && artModal.classList.contains("open")) closeArtModal();
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

setLanguage(localStorage.getItem("eldojo-lang") || "es");
onScroll();
