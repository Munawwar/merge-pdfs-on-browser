/**
 * Written using pdfjs module, and code snippets taken from pdf-merger-js.
 * The finally output compiled to browser using parcel.
 *
 * Thanks
 * https://www.npmjs.com/package/pdfjs
 * https://www.npmjs.com/package/pdf-merger-js
 */

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* global fetch, Blob, document, window */
// @ts-check
const pdf = require('pdfjs');

function downloadBuffer({ buffer, fileName }) {
  // Create an invisible A element
  const a = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the buffer to be downloaded
  a.href = window.URL.createObjectURL(
    new Blob([buffer]),
  );
  // Use download attribute to set set desired file name
  a.setAttribute('download', fileName);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

/**
 * @param {_Readable} readable
 */
async function readableToBuffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function mergePdfs(inputUrls, outputFileName = 'merged.pdf') {
  const doc = new pdf.Document();

  console.log('dowloading pdfs..');
  const inputFiles = await Promise.all(
    inputUrls
      .map(async (url) => {
        const res = await fetch(url);
        return res.arrayBuffer();
      }),
  );

  inputFiles.forEach((inputFileBuffer) => {
    console.log('adding pdf..');
    const ext = new pdf.ExternalDocument(inputFileBuffer);
    doc.setTemplate(ext);
    doc.addPagesOf(ext);
  });
  doc.end();

  // download
  console.log('gathering chunks..');
  // @ts-ignore
  const buffer = await readableToBuffer(doc);
  downloadBuffer({
    buffer,
    fileName: outputFileName,
  });
}

// @ts-ignore
window.mergePdfs = mergePdfs;
