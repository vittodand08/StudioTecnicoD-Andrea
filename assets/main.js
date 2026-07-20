const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuButton && mobileMenu) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.dataset.open = 'false';
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    mobileMenu.dataset.open = String(!open);
    document.body.classList.toggle('menu-open', !open);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const contactForm = document.querySelector('[data-contact-form]');

if (contactForm && window.fetch) {
  const status = contactForm.querySelector('[data-form-status]');
  const submitButton = contactForm.querySelector('[type="submit"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Invio della richiesta in corso…';
    status.dataset.state = 'loading';
    submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Invio non riuscito');

      contactForm.reset();
      status.textContent = 'Richiesta inviata correttamente. Lo Studio ti ricontatterà appena possibile.';
      status.dataset.state = 'success';
    } catch (error) {
      status.textContent = 'Non è stato possibile inviare la richiesta. Riprova oppure scrivi direttamente all’indirizzo email dello Studio.';
      status.dataset.state = 'error';
    } finally {
      submitButton.disabled = false;
    }
  });
}

const cookieNoticeKey = 'studio-dandrea-cookie-notice-v1';
let cookieNoticeSeen = false;

try {
  cookieNoticeSeen = window.localStorage.getItem(cookieNoticeKey) === 'seen';
} catch (error) {
  cookieNoticeSeen = false;
}

if (!cookieNoticeSeen) {
  const notice = document.createElement('section');
  notice.className = 'cookie-notice';
  notice.setAttribute('aria-label', 'Informazioni sui cookie');
  notice.innerHTML = `
    <div>
      <h2>Cookie e privacy</h2>
      <p>Questo sito non usa cookie di profilazione o pubblicità. Utilizza soltanto una memoria tecnica per ricordare la chiusura di questo avviso. I servizi esterni si attivano solo quando scegli di usarli. <a href="cookie-policy.html">Leggi la cookie policy</a>.</p>
    </div>
    <div class="cookie-notice__actions">
      <button class="btn btn--gold" type="button" data-cookie-close>Ho capito</button>
    </div>`;
  document.body.appendChild(notice);

  notice.querySelector('[data-cookie-close]').addEventListener('click', () => {
    try {
      window.localStorage.setItem(cookieNoticeKey, 'seen');
    } catch (error) {
      // La chiusura resta valida per la sola pagina corrente quando lo storage è bloccato.
    }
    notice.remove();
  });
}
