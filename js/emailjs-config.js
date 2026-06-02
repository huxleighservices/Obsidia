/*
  OBSIDIA — EmailJS Configuration
  ─────────────────────────────────
  Setup steps (one time):

  1. Create a free account at https://www.emailjs.com
  2. Add an Email Service (Gmail / Outlook / etc.)
     → Copy the Service ID into EMAILJS_SERVICE_ID below
  3. Create an Email Template with these exact variables:
       {{from_name}}   {{from_email}}   {{from_phone}}
       {{piece_type}}  {{description}}  {{materials}}
       {{timeline}}    {{referral}}     {{notes}}
       {{submitted_at}}
     Set "To Email" to: sales@huxleigh.com
     → Copy the Template ID into EMAILJS_TEMPLATE_ID below
  4. Go to Account → General → copy your Public Key
     → Paste it into EMAILJS_PUBLIC_KEY below
*/

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'AbCdEfGhIjKlMnOp'
