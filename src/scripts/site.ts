// Small page-wide behaviours: scroll reveals and preview form handling.
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Forms validate in the browser and show a thank-you message.
// Connect each form to the email/CRM tool (e.g. Simplero) at launch.
document.querySelectorAll<HTMLFormElement>('form[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[required]').forEach((input) => {
      const err = input.closest('.field')?.querySelector<HTMLElement>('[data-error]');
      let msg = '';
      if (!input.value.trim()) msg = 'Please fill this in.';
      else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = 'That email doesn’t look quite right.';
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      if (msg && ok) {
        input.focus();
        ok = false;
      }
    });
    if (ok) form.classList.add('is-sent');
  });
});
