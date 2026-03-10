// =============================================================================
// Quiz Results Submission — Google Apps Script
// Receives quiz results via POST, stores them in a Google Sheet, and sends
// a styled HTML email with the participant's results.
// =============================================================================

const SPREADSHEET_ID = '1BsZEwlXmgLOt3NPdpQMHtgs6cCeeysx5sx1eiUpBvug';
const SHEET_NAME = 'Responses';

const DIMENSIONS = [
  { key: 'usage_quotidien',   label: 'Usage quotidien' },
  { key: 'cadrage',           label: 'Cadrage' },
  { key: 'validation',        label: 'Validation' },
  { key: 'securite',          label: 'S\u00e9curit\u00e9' },
  { key: 'qualite_code',      label: 'Qualit\u00e9 de code' },
  { key: 'collaboration',     label: 'Collaboration' },
  { key: 'impact',            label: 'Impact' },
  { key: 'human_in_the_loop', label: 'Human in the Loop' },
  { key: 'agentique',         label: 'Agentique' },
  { key: 'projection',        label: 'Projection' },
];

// -----------------------------------------------------------------------------
// POST handler — receives quiz results, stores row, sends email
// -----------------------------------------------------------------------------
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // Validate required fields
    const required = ['email', 'score', 'level', 'answers'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null) {
        return _jsonResponse({ success: false, error: 'Champ manquant : ' + field });
      }
    }
    if (!Array.isArray(payload.answers)) {
      return _jsonResponse({ success: false, error: 'answers doit \u00eatre un tableau' });
    }

    // Open spreadsheet — auto-create sheet + headers if missing
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      _writeHeaders(sheet);
    }

    // Build dimension columns — one per dimension, formatted as "Label (X/4)"
    const dimensionCells = DIMENSIONS.map(function (dim) {
      const match = payload.answers.find(function (a) {
        return a.dimension === dim.label;
      });
      if (!match) return '';
      return match.chosenLabel + ' (' + match.points + '/4)';
    });

    const planText = Array.isArray(payload.plan) ? payload.plan.join(' | ') : (payload.plan || '');

    const row = [
      new Date(),                          // Timestamp
      payload.email,                       // Email
      payload.score,                       // Score brut
      payload.scorePct || 0,               // Score %
      payload.level,                       // Niveau (number)
      payload.levelTitle || '',            // Titre du niveau
    ]
      .concat(dimensionCells)              // 10 dimension columns
      .concat([
        payload.diagnostic || '',          // Diagnostic
        payload.nextGoal || '',            // Prochain objectif
        planText,                          // Plan (joined)
        payload.recommendation || '',      // Recommandation
      ]);

    sheet.appendRow(row);

    // Send results email
    _sendResultsEmail(payload);

    return _jsonResponse({ success: true });
  } catch (err) {
    return _jsonResponse({ success: false, error: err.message });
  }
}

// -----------------------------------------------------------------------------
// GET handler — health check
// -----------------------------------------------------------------------------
function doGet(e) {
  return _jsonResponse({ status: 'ok' });
}

// -----------------------------------------------------------------------------
// setupHeaders — run once to initialise the header row
// -----------------------------------------------------------------------------
function setupHeaders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  _writeHeaders(sheet);
}

function _writeHeaders(sheet) {
  var headers = [
    'Timestamp',
    'Email',
    'Score brut',
    'Score %',
    'Niveau',
    'Titre du niveau',
  ]
    .concat(DIMENSIONS.map(function (d) { return d.label; }))
    .concat([
      'Diagnostic',
      'Prochain objectif',
      'Plan',
      'Recommandation',
    ]);

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

// -----------------------------------------------------------------------------
// Email
// -----------------------------------------------------------------------------
function _sendResultsEmail(payload) {
  const courseUrl = (payload.siteUrl || 'https://example.com/')
    + 'courses/ia-appliquee-metiers-tech';

  // Build dimension rows for the email table
  const dimensionRows = payload.answers.map(function (a) {
    const barWidth = Math.round((a.points / 4) * 100);
    return ''
      + '<tr>'
      + '  <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;font-size:14px;color:#333;">' + _esc(a.dimension) + '</td>'
      + '  <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;width:50%;">'
      + '    <div style="background:#e8e8e8;border-radius:4px;height:10px;width:100%;">'
      + '      <div style="background:#17e517;border-radius:4px;height:10px;width:' + barWidth + '%;"></div>'
      + '    </div>'
      + '  </td>'
      + '  <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;font-size:14px;color:#333;text-align:center;white-space:nowrap;">' + a.points + '/4</td>'
      + '</tr>';
  }).join('');

  // Build plan list items
  const planItems = (Array.isArray(payload.plan) ? payload.plan : []).map(function (step, i) {
    return '<li style="margin-bottom:8px;font-size:14px;color:#333;">' + _esc(step) + '</li>';
  }).join('');

  var subject = 'Vos r\u00e9sultats \u2014 Quiz de positionnement IA | AOT Academy';

  var htmlBody = ''
    + '<!DOCTYPE html>'
    + '<html lang="fr">'
    + '<head><meta charset="utf-8"></head>'
    + '<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">'
    + '<tr><td align="center" style="padding:24px 16px;">'

    // Main card
    + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">'

    // Header banner
    + '<tr>'
    + '  <td style="background:linear-gradient(135deg,#1b581c,#17e517);padding:32px 24px;text-align:center;">'
    + '    <p style="margin:0 0 8px;font-size:14px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;">Quiz de positionnement IA</p>'
    + '    <h1 style="margin:0;font-size:28px;color:#ffffff;">Vos R\u00e9sultats</h1>'
    + '  </td>'
    + '</tr>'

    // Level badge
    + '<tr>'
    + '  <td style="padding:32px 24px 0;text-align:center;">'
    + '    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">'
    + '    <tr>'
    + '      <td style="vertical-align:middle;padding:0;">'
    + '        <div style="width:56px;height:56px;line-height:56px;border-radius:28px;background:#1b581c;color:#ffffff;text-align:center;font-size:24px;font-weight:bold;mso-line-height-rule:exactly;">'
    +            payload.level
    + '        </div>'
    + '      </td>'
    + '      <td style="padding-left:16px;text-align:left;vertical-align:middle;">'
    + '        <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Niveau</p>'
    + '        <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#1b581c;">' + _esc(payload.levelTitle || '') + '</p>'
    + '      </td>'
    + '    </tr>'
    + '    </table>'
    + '  </td>'
    + '</tr>'

    // Score
    + '<tr>'
    + '  <td style="padding:24px 24px 0;text-align:center;">'
    + '    <p style="margin:0;font-size:48px;font-weight:bold;color:#17e517;">' + (payload.scorePct || 0) + '%</p>'
    + '    <p style="margin:4px 0 0;font-size:14px;color:#888;">' + payload.score + ' points</p>'
    + '  </td>'
    + '</tr>'

    // Diagnostic
    + '<tr>'
    + '  <td style="padding:24px;">'
    + '    <h2 style="margin:0 0 12px;font-size:18px;color:#1b581c;">Diagnostic</h2>'
    + '    <p style="margin:0;font-size:14px;line-height:1.6;color:#333;">' + _esc(payload.diagnostic || '') + '</p>'
    + '  </td>'
    + '</tr>'

    // Dimension scores table
    + '<tr>'
    + '  <td style="padding:0 24px 24px;">'
    + '    <h2 style="margin:0 0 12px;font-size:18px;color:#1b581c;">Scores par dimension</h2>'
    + '    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;border-collapse:separate;">'
    +        dimensionRows
    + '    </table>'
    + '  </td>'
    + '</tr>'

    // 30-day plan
    + '<tr>'
    + '  <td style="padding:0 24px 24px;">'
    + '    <h2 style="margin:0 0 12px;font-size:18px;color:#1b581c;">Votre plan d\u2019am\u00e9lioration sur 30 jours</h2>'
    + '    <ol style="margin:0;padding-left:20px;line-height:1.8;">'
    +        planItems
    + '    </ol>'
    + '  </td>'
    + '</tr>'

    // Recommendation
    + '<tr>'
    + '  <td style="padding:0 24px 24px;">'
    + '    <h2 style="margin:0 0 12px;font-size:18px;color:#1b581c;">Recommandation</h2>'
    + '    <p style="margin:0;font-size:14px;line-height:1.6;color:#333;">' + _esc(payload.recommendation || '') + '</p>'
    + '  </td>'
    + '</tr>'

    // CTA button
    + '<tr>'
    + '  <td style="padding:0 24px 32px;text-align:center;">'
    + '    <a href="' + courseUrl + '" target="_blank" style="display:inline-block;background:#17e517;color:#1b581c;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:6px;">'
    + '      D\u00e9couvrir la formation IA Appliqu\u00e9e'
    + '    </a>'
    + '  </td>'
    + '</tr>'

    // Footer
    + '<tr>'
    + '  <td style="background:#f9f9f9;padding:16px 24px;text-align:center;border-top:1px solid #e8e8e8;">'
    + '    <p style="margin:0;font-size:12px;color:#999;">AOT Academy &mdash; Quiz de positionnement IA</p>'
    + '  </td>'
    + '</tr>'

    + '</table>'
    + '</td></tr></table>'
    + '</body></html>';

  MailApp.sendEmail({
    to: payload.email,
    subject: subject,
    htmlBody: htmlBody,
  });
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function _jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function _esc(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
