import type { Email } from '../../shared/types/email';

export const useExportEmail = () => {
  const _isExporting = ref(false);

  const _generateEml = (email: Email): string => {
    const date = new Date().toUTCString();
    const boundary = `----=_Part_${Date.now()}`;

    return `From: ${email.from}
To: ${email.to || ''}
Subject: ${email.subject}
Date: ${date}
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

${email.body}
`;
  };

  const exportAsEml = (email: Email): void => {
    _isExporting.value = true;

    const emlContent = _generateEml(email);
    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${email.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${email.id}.eml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    _isExporting.value = false;
  };

  const exportAsHtml = (email: Email): void => {
    _isExporting.value = true;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${email.subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
    .header { border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
    .subject { font-size: 24px; font-weight: 600; margin-bottom: 16px; }
    .meta { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="subject">${email.subject}</div>
    <div class="meta">From: ${email.from}<br>To: ${email.to || ''}<br>Date: ${email.time}</div>
  </div>
  <div>${email.body}</div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${email.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${email.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    _isExporting.value = false;
  };

  const exportAsJson = (emails: Email[]): void => {
    _isExporting.value = true;

    const jsonContent = JSON.stringify(emails, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `emails_export_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    _isExporting.value = false;
  };

  // PDF export using browser's print to PDF
  const exportAsPdf = (email: Email): void => {
    _isExporting.value = true;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      _isExporting.value = false;
      return;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${email.subject}</title>
  <style>
    @media print {
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
      .header { border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
      .subject { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
      .meta { color: #666; font-size: 12px; }
    }
    body { max-width: 800px; margin: 40px auto; padding: 20px; }
    .header { border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
    .subject { font-size: 24px; font-weight: 600; margin-bottom: 16px; }
    .meta { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="subject">${email.subject}</div>
    <div class="meta">From: ${email.from}<br>To: ${email.to || ''}<br>Date: ${email.time}</div>
  </div>
  <div>${email.body}</div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 100); };</script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    _isExporting.value = false;
  };

  return {
    isExporting: _isExporting,
    exportAsEml,
    exportAsHtml,
    exportAsJson,
    exportAsPdf,
  };
};
