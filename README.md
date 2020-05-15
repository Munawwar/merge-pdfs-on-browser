# Merge PDFs on browser

## Run the demo

```sh
npm i -g http-server
http-server public
```

There are two implementations of PDF merging in this repo:

1. Using pdfjs - http://localhost:8080/pdfjs-approach/

This approach merges PDF contents. It retains text and images. Text is highlightable etc (i.e it's good, quality wise)

2. Using canvas - http://localhost:8080/canvas-approach/

This use HTML5 canvas to render the PDF content first and then convert each page to PNG or JPEG and then save it to a new PDF. But this is not only slow, the quality of images maybe not be like merging PDFs properly together.


## For building pdfjs approach

```sh
npm i -g parcel-bundler
cd public/pdf-approach/
parcel pdf-merger-js-adapted.js dist/
```

## For building canvas appraoch

No steps needed. Used Mozilla's pdf.js library from CDN.
(Note "pdfjs" is not same as Mozilla's pdf.js. Former is name of an npm module written by "Markus Ast")