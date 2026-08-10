# Connecting the contact form to Google Sheets

About five minutes. No third-party service, no row cap, no extra processor
touching names, emails and phone numbers — the data lands straight in a Sheet
Josh already knows how to use.

Until step 5 is done the form disables its own submit button and says so on the
page. That is deliberate: a form that accepts messages and drops them is the
exact defect `AUDIT.md` raises against the current live site.

---

## 1. Create the Sheet

New Google Sheet. Name it something like **Hometown Mortgage — Leads**.

Put these headers in row 1, in this order:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Timestamp | Form | Name | Email | Phone | Message | Page |

## 2. Open Apps Script

In the Sheet: **Extensions → Apps Script**. Delete whatever is in `Code.gs`.

## 3. Paste this

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialise concurrent submissions
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    sheet.appendRow([
      new Date(),
      data.form || 'contact',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.message || '',
      data.page || ''
    ]);

    // Email Josh so a lead is never sitting unseen in a spreadsheet.
    MailApp.sendEmail({
      to: 'REPLACE_WITH_JOSH_EMAIL',
      subject: 'New website enquiry — ' + (data.name || 'unknown'),
      replyTo: data.email || '',
      body:
        'Name:  ' + (data.name || '') + '\n' +
        'Email: ' + (data.email || '') + '\n' +
        'Phone: ' + (data.phone || '') + '\n\n' +
        (data.message || '') + '\n\n' +
        'Sent from: ' + (data.page || '')
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

**Replace `REPLACE_WITH_JOSH_EMAIL`** with his real address, or delete the whole
`MailApp.sendEmail({...});` call if he only wants the Sheet.

## 4. Deploy

**Deploy → New deployment → Select type → Web app**

| Field | Value |
|---|---|
| Execute as | **Me** |
| Who has access | **Anyone** |

"Anyone" is required — visitors are not signed into Google. It exposes only
this `doPost`, which appends a row; it does not expose the Sheet.

Authorise when prompted. Google will warn the app is unverified because it is
your own script; continue through **Advanced → Go to (project)**.

Copy the **Web app URL**. It ends in `/exec`.

## 5. Paste the URL into the site

`web/site.config.ts`:

```ts
export const forms = {
  contactEndpoint: "https://script.google.com/macros/s/AKfy…/exec",
} as const;
```

Rebuild and deploy. The submit button enables itself and the demo notice
disappears.

---

## Why the request looks odd

The form posts `Content-Type: text/plain` with a JSON string as the body, which
looks wrong but is required. Apps Script Web Apps do not answer CORS preflight
requests, so any header that triggers one — including
`Content-Type: application/json` — makes the request fail in the browser.
`text/plain` is CORS-safelisted, so no preflight is sent and the POST goes
straight through. The script does its own `JSON.parse`.

Do not "fix" the content type.

## Testing it

Submit once from the live site and confirm a row appears. If nothing arrives:

1. Apps Script → **Executions** shows every invocation and its error.
2. Re-check **Who has access = Anyone**. This is the usual culprit.
3. After ANY edit to the script you must **Deploy → Manage deployments → Edit →
   New version**. Saving alone does not update the live endpoint — this catches
   people out constantly.

## Before launch

- Josh should confirm where leads go and who monitors them.
- Add a privacy note if he starts using submissions for marketing rather than
  replying directly.
- Consider a honeypot field if spam becomes a problem; the form has no captcha
  by design, since captchas cost real conversions on a lead-gen page.
