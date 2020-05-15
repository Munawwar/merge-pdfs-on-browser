# Merge PDFs on browser

## Run the demo

```sh
npm i -g http-server
http-server public
```

There are two implementations of PDF merging in this repo:

1. Using canvas - http://localhost:8080/canvas-approach/

2. Using pdfjs - http://localhost:8080/pdfjs-approach/

## For building canvas appraoch

No steps needed. Used Mozilla's pdf.js library from CDN.
(Note "pdfjs" is not same as Mozilla's pdf.js. Former is name of an npm module written by "Markus Ast")

## For building pdfjs approach

```sh
npm i -g parcel-bundler
cd public/pdf-approach/
parcel pdf-merger-js-adapted.js dist/
```