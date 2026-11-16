/**
 * Astrojit Isolated Element Printing Utility
 * Opens a dedicated, isolated print frame containing ONLY the targeted element.
 * Guarantees zero page bleed from background dashboards, multi-page dossiers, or app chrome.
 */
export function printElementById(elementId, customTitle = 'Astrojit_Document') {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Find or create the hidden print iframe
  let iframe = document.getElementById('astrojit-print-frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'astrojit-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '794px';
    iframe.style.height = '1123px';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);
  } else {
    iframe.style.width = '794px';
    iframe.style.height = '1123px';
  }

  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();

  // Extract all active link stylesheets and style tags
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((s) => s.outerHTML)
    .join('\n');

  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${customTitle}</title>
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .print\\:hidden, .no-print {
            display: none !important;
          }
          .astrojit-isolated-print-target {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        <div class="astrojit-isolated-print-target">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  iframeDoc.close();

  // Allow styles and any SVGs/fonts to load, then trigger native print dialog on iframe
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn('Iframe print failed, falling back to window.print():', e);
      window.print();
    }
  }, 350);
}
