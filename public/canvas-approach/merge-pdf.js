/* eslint-disable new-cap */
/* eslint-disable no-await-in-loop */
/* global pdfjsLib, jsPDF, document, window */

// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
//
const urls = [
  'http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  'http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
];

// Disable workers to avoid yet another cross-origin issue (workers need
// the URL of the script to be loaded, and dynamically loading a cross-origin
// script does not work).
//
// pdfjsLib.disableWorker = true;

// In cases when the pdf.worker.js is located at the different folder than the
// pdf.js's one, or the pdf.js is executed via eval(), the workerSrc property
// shall be specified.
//
// pdfjsLib.workerSrc = 'pdf.worker.js';

/**
 * @typedef {Object} PageInfo
 * @property {number} documentIndex
 * @property {number} pageNumber
 */

const pdfDocs = [];
const scale = 1;
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('the-canvas');
const ctx = canvas.getContext('2d');

function getTotalPageCount() {
  let totalPageCount = 0;
  for (let index = 0; index < pdfDocs.length; index += 1) {
    totalPageCount += pdfDocs[index].numPages;
  }
  return totalPageCount;
}

async function renderPages() {
  const mergedPdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
  });
  mergedPdf.deletePage(1); // make doc empty

  let pagesProcessed = 0;
  for (let docIndex = 0; docIndex < pdfDocs.length; docIndex += 1) {
    const pdfDoc = pdfDocs[docIndex];
    const total = pdfDoc.numPages;
    for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
      // Using promise to fetch the page
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      console.log(viewport.width, 'x', viewport.height);

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: ctx,
        viewport,
      };
      await page.render(renderContext).promise;

      // PNG is noticably slower than JPEG but better quality images
      const imgData = canvas.toDataURL('image/png', 1.0);

      mergedPdf.addPage([
        viewport.width,
        viewport.height,
      ]);
      mergedPdf.addImage(imgData, 'PNG', 0, 0, viewport.width, viewport.height);

      pagesProcessed += 1;
      // Update page counters
      document.getElementById('page_num').textContent = String(pagesProcessed);
    }
  }
  mergedPdf.save('download.pdf');
}


let loadedCount = 0;
async function load() {
  // Load PDFs one after another
  const doc = await pdfjsLib.getDocument(urls[loadedCount]).promise;
  console.log(`loaded PDF ${loadedCount}`);
  pdfDocs.push(doc);
  loadedCount += 1;
  if (loadedCount !== urls.length) {
    load();
    return;
  }

  console.log('Finished loading');

  document.getElementById('page_count').textContent = String(getTotalPageCount());
  await renderPages();
}

window.load = load;
