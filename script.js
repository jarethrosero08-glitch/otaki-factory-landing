(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile navigation */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  const setMenuState = (open) => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mainNav.classList.toggle('is-open', open);
    const label = menuToggle.querySelector('.sr-only');
    if (label) label.textContent = open ? 'Cerrar menú' : 'Abrir menú';
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (event) => {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuState(false);
    });
  }

  /* Scroll reveals */
  const revealItems = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* Header state */
  const header = document.querySelector('.site-header');
  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* 360° viewer and pose tabs */
  const galleryStage = document.querySelector('#gallery-stage');
  const galleryFigure = document.querySelector('.gallery-figure');
  const rotationRange = document.querySelector('#rotation-range');
  const rotationOutput = document.querySelector('#rotation-output');
  const poseIndex = document.querySelector('#pose-index');
  const poseTitle = document.querySelector('#pose-title');
  const poseDescription = document.querySelector('#pose-description');
  const poseButtons = document.querySelectorAll('.pose-tab');

  const poseCopy = {
    frente: {
      index: '01',
      rotation: 0,
      title: 'La primera impresión.',
      description: 'Una silueta poderosa, esculpida para funcionar incluso a contraluz.'
    },
    perfil: {
      index: '02',
      rotation: 14,
      title: 'La línea que sostiene la pose.',
      description: 'El perfil revela el trabajo del cuello, la mandíbula y la continuidad de las placas dorsales.'
    },
    accion: {
      index: '03',
      rotation: 352,
      title: 'La energía, contenida.',
      description: 'Una pose de ataque con la tensión correcta: visible en el gesto, invisible en el mecanismo.'
    },
    macro: {
      index: '04',
      rotation: 5,
      title: 'Acércate. Ahí está la diferencia.',
      description: 'Pigmentación, profundidad y pequeños detalles concentrados para una mirada de cerca.'
    }
  };

  const normalizeRotation = (value) => {
    const number = Number(value) || 0;
    return ((number % 360) + 360) % 360;
  };

  const setRotation = (value) => {
    if (!galleryStage || !galleryFigure) return;
    const rotation = normalizeRotation(value);
    galleryStage.dataset.rotation = String(Math.round(rotation));
    galleryFigure.dataset.rotation = String(Math.round(rotation));
    galleryFigure.style.setProperty('--rotation', `${rotation}deg`);

    if (rotationRange) {
      rotationRange.value = String(Math.round(rotation));
      rotationRange.style.setProperty('--range-progress', `${(rotation / 360) * 100}%`);
    }
    if (rotationOutput) {
      rotationOutput.textContent = `${String(Math.round(rotation)).padStart(3, '0')}°`;
    }
  };

  const setPose = (pose) => {
    const data = poseCopy[pose] || poseCopy.frente;
    if (!galleryFigure) return;
    galleryFigure.dataset.pose = pose;
    setRotation(data.rotation);

    if (poseIndex) poseIndex.textContent = data.index;
    if (poseTitle) poseTitle.textContent = data.title;
    if (poseDescription) poseDescription.textContent = data.description;

    poseButtons.forEach((button) => {
      const active = button.dataset.pose === pose;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
  };

  if (galleryStage && galleryFigure) {
    setRotation(0);
    setPose('frente');

    if (rotationRange) {
      rotationRange.addEventListener('input', (event) => {
        setRotation(event.target.value);
      });
    }

    poseButtons.forEach((button) => {
      button.addEventListener('click', () => setPose(button.dataset.pose));
    });

    let dragging = false;
    let pointerStartX = 0;
    let rotationStart = 0;

    galleryStage.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button, input, a')) return;
      dragging = true;
      pointerStartX = event.clientX;
      rotationStart = Number(galleryStage.dataset.rotation) || 0;
      galleryStage.setPointerCapture(event.pointerId);
      galleryStage.style.cursor = 'grabbing';
    });

    galleryStage.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const delta = (event.clientX - pointerStartX) * 0.85;
      setRotation(rotationStart + delta);
    });

    const stopDragging = (event) => {
      if (!dragging) return;
      dragging = false;
      galleryStage.style.cursor = '';
      if (event && event.pointerId !== undefined && galleryStage.hasPointerCapture(event.pointerId)) {
        galleryStage.releasePointerCapture(event.pointerId);
      }
    };

    galleryStage.addEventListener('pointerup', stopDragging);
    galleryStage.addEventListener('pointercancel', stopDragging);
    galleryStage.addEventListener('pointerleave', (event) => {
      if (dragging && event.buttons === 0) stopDragging(event);
    });

    galleryStage.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const current = Number(galleryStage.dataset.rotation) || 0;
      setRotation(current + (event.key === 'ArrowRight' ? 8 : -8));
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* Reservation form */
  const form = document.querySelector('#reserve-form');
  const success = document.querySelector('#form-success');
  const successMessage = document.querySelector('#success-message');
  const resetReservation = document.querySelector('#reset-reservation');

  const fields = form ? Array.from(form.querySelectorAll('input, select')) : [];
  const getErrorText = (field) => {
    if (field.validity.valueMissing) {
      return field.type === 'checkbox' ? 'Confirma que quieres recibir información de la preventa.' : 'Este campo es obligatorio.';
    }
    if (field.type === 'email' && field.validity.typeMismatch) return 'Introduce un email válido.';
    if (field.minLength > 0 && field.validity.tooShort) return `Escribe al menos ${field.minLength} caracteres.`;
    return 'Revisa este campo.';
  };

  const setFieldError = (field) => {
    const error = form.querySelector(`[data-error-for="${field.id}"]`);
    if (!error) return;
    if (field.checkValidity()) {
      field.removeAttribute('aria-invalid');
      error.textContent = '';
    } else {
      field.setAttribute('aria-invalid', 'true');
      error.textContent = getErrorText(field);
    }
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => setFieldError(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') setFieldError(field);
    });
    field.addEventListener('change', () => {
      if (field.type === 'checkbox' || field.tagName === 'SELECT') setFieldError(field);
    });
  });

  if (form && success) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let firstInvalid = null;
      fields.forEach((field) => {
        setFieldError(field);
        if (!field.checkValidity() && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const name = form.elements.name.value.trim().split(' ')[0];
      form.hidden = true;
      success.hidden = false;
      if (successMessage) {
        successMessage.textContent = `Gracias, ${name}. Hemos preparado tu solicitud para la edición 001. Te avisaremos cuando llegue el momento.`;
      }
      success.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    });
  }

  if (resetReservation && form && success) {
    resetReservation.addEventListener('click', () => {
      form.reset();
      fields.forEach((field) => {
        field.removeAttribute('aria-invalid');
        const error = form.querySelector(`[data-error-for="${field.id}"]`);
        if (error) error.textContent = '';
      });
      success.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }
})();
