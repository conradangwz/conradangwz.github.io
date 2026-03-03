/**
 * Conrad Ang Portfolio — Contact Form
 * Uses EmailJS to send messages directly from the browser.
 *
 * SETUP (Reminder):
 *  1. Go to https://www.emailjs.com and sign in.
 *  2. Create an Email Service (Gmail, Outlook, etc.) → copy the Service ID.
 *  3. Create an Email Template with these variables:
 *       {{from_name}}   — sender's name
 *       {{from_email}}  — sender's email
 *       {{subject}}     — subject line
 *       {{message}}     — message body
 *     Copy the Template ID.
 *  4. Replace EMAILJS_SERVICE_ID and EMAILJS_TEMPLATE_ID below with your IDs.
 *  5. Your Public Key is already initialised in the <head> of index.html.
 */

const EMAILJS_SERVICE_ID  = 'service_u92qnyo';   // ← replace
const EMAILJS_TEMPLATE_ID = 'template_jevzfm5';  // ← replace

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function setStatus(msg, type) {
  const el = document.getElementById('form-status');
  el.textContent = msg;
  const classMap = { 'status-error': 'error', 'status-success': 'success' };
  el.className = 'form-status';
  if (msg) {
    el.classList.add('visible');
    if (classMap[type]) el.classList.add(classMap[type]);
  }
}

function setLoading(isLoading) {
  const btn = document.getElementById('form-submit');
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Sending…' : 'Send Message →';
  btn.style.opacity = isLoading ? '0.7' : '';
  btn.style.cursor  = isLoading ? 'not-allowed' : '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getField(id) {
  return document.getElementById(id).value.trim();
}

function shakeField(id) {
  const el = document.getElementById(id);
  el.classList.add('input-error');
  el.addEventListener('input', () => el.classList.remove('input-error'), { once: true });
}

/* ------------------------------------------------------------------ */
/*  Main send function (called by the button's onclick)                */
/* ------------------------------------------------------------------ */

async function sendEmail() {
  const name    = getField('cf-name');
  const email   = getField('cf-email');
  const subject = getField('cf-subject');
  const message = getField('cf-message');

  // ── Validation ──────────────────────────────────────────────────
  if (!name) {
    setStatus('Please enter your name.', 'status-error');
    shakeField('cf-name');
    return;
  }
  if (!email || !validateEmail(email)) {
    setStatus("Please enter a valid email address.", "status-error");
    shakeField("cf-email");
    return;
  }
  if (!subject) {
    setStatus("Please add a subject.", "status-error");
    shakeField("cf-subject");
    return;
  }
  if (!message) {
    setStatus('Please write a message.', 'status-error');
    shakeField('cf-message');
    return;
  }

  // ── Send ─────────────────────────────────────────────────────────
  setLoading(true);
  setStatus('');

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      subject:    subject,
      message:    message,
    });

    setStatus("✓ Message sent!", 'status-success');
    // Clear the form
    ['cf-name', 'cf-email', 'cf-subject', 'cf-message'].forEach(id => {
      document.getElementById(id).value = '';
    });
  } catch (err) {
    console.error('EmailJS error:', err);
    setStatus("Something went wrong. Try emailing me directly at conradang2004@gmail.com", 'status-error');
  } finally {
    setLoading(false);
  }
}
