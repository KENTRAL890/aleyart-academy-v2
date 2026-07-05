export function printElementsClean(selector: string) {
  const nodes = Array.from(document.querySelectorAll(selector));
  if (nodes.length === 0) return;

  const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  const html = nodes
    .map((node) => {
      if (!(node instanceof HTMLElement)) return '';
      return node.outerHTML;
    })
    .join('<div class="page-break-before"></div>');

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title> </title>
        ${styleTags}
        <style>
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          .page-break-before {
            page-break-before: always;
            break-before: page;
          }
          .no-print,
          header,
          nav,
          aside,
          footer {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);
  doc.close();

  const cleanup = () => {
    setTimeout(() => {
      iframe.remove();
    }, 300);
  };

  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) {
      cleanup();
      return;
    }

    try {
      win.document.title = ' ';
      win.focus();
      const afterPrint = () => {
        win.removeEventListener('afterprint', afterPrint);
        cleanup();
      };
      win.addEventListener('afterprint', afterPrint);
      win.print();
    } catch {
      cleanup();
    }
  };
}
