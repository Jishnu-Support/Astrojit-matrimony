/**
 * Astrojit Isolated Element Printing Utility
 * Opens a dedicated, isolated print frame containing ONLY the targeted element.
 * Guarantees zero page bleed from background dashboards, multi-page dossiers, or app chrome.
 */
export function printElementById(elementId, customTitle = 'Astrojit_Document', options = {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  const pageSize = options.pageSize || 'A4 portrait';
  const pageMargin = options.pageMargin || '4mm 5mm';

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
        <base href="${window.location.origin}/" />
        <title>${customTitle}</title>
        ${styles}
        <style>
          @page {
            size: ${pageSize};
            margin: ${pageMargin} !important;
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
          }
          .a4-booklet-sheet {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            height: 282mm !important;
            max-height: 282mm !important;
            box-sizing: border-box !important;
          }
          .a5-booklet-sheet {
            width: 140mm !important;
            max-width: 140mm !important;
            height: 202mm !important;
            min-height: 202mm !important;
            max-height: 202mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            box-sizing: border-box !important;
          }
          .half-a4-sheet {
            width: 200mm !important;
            max-width: 200mm !important;
            height: 288mm !important;
            min-height: 288mm !important;
            max-height: 288mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
          }
          #astrojit-horoscope-1page {
            width: 198mm !important;
            max-width: 198mm !important;
            height: 285mm !important;
            min-height: 285mm !important;
            max-height: 285mm !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            overflow: hidden !important;
          }
          #astrojit-horoscope-1page > div {
            height: 100% !important;
            min-height: 100% !important;
            max-height: 100% !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Allow styles, images, and fonts to load before triggering native print dialog on iframe
  const triggerPrint = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn('Iframe print failed, falling back to window.print():', e);
      window.print();
    }
  };

  const pendingImages = Array.from(iframeDoc.images || []).filter((img) => !img.complete);
  if (pendingImages.length === 0) {
    setTimeout(triggerPrint, 350);
  } else {
    let printed = false;
    const runOnce = () => {
      if (printed) return;
      printed = true;
      setTimeout(triggerPrint, 150);
    };
    Promise.all(
      pendingImages.map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
      )
    ).then(runOnce);
    setTimeout(runOnce, 1500);
  }
}
