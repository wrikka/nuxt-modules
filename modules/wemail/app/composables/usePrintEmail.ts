export const usePrintEmail = () => {
  const _isPrinting = ref(false);

  const printEmail = (email: {
    subject: string;
    from: string;
    to?: string;
    time: string;
    body: string;
  }): void => {
    _isPrinting.value = true;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      _isPrinting.value = false;
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${email.subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
    }
    .header {
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .subject {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .meta {
      color: #666;
      font-size: 14px;
    }
    .meta-row {
      margin: 4px 0;
    }
    .label {
      font-weight: 500;
      display: inline-block;
      width: 60px;
    }
    .body {
      margin-top: 24px;
    }
    @media print {
      body {
        margin: 0;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="subject">${email.subject}</div>
    <div class="meta">
      <div class="meta-row"><span class="label">From:</span> ${email.from}</div>
      ${email.to ? `<div class="meta-row"><span class="label">To:</span> ${email.to}</div>` : ''}
      <div class="meta-row"><span class="label">Date:</span> ${email.time}</div>
    </div>
  </div>
  <div class="body">${email.body}</div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      _isPrinting.value = false;
    }, 250);
  };

  return {
    isPrinting: _isPrinting,
    printEmail,
  };
};
