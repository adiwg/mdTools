# mdTools

### Review and Update

**Note: This application needs to be reviewed and updated with respect to its dependencies.**

The json-schema-viewer is an example of a dependency that needs to be reviewed. In this case, it looks like the relevant code should be brought directly into this repository, so the code can be native to this repository instead of relying on an unpredictable dependency.

Bower has also been deprecated, so all the bower dependencies need to be updated to be npm dependencies instead.

There are likely to be other changes needed in addition to those.

## What is mdTools

JavaScript tool for visualizing [json-schemas](http://json-schema.org/), includes validator and support for the [mdTranslator](https://github.com/adiwg/mdTranslator) via the [API](https://api.sciencebase.gov/mdTranslator).

The [live application](http://www.adiwg.org/mdJson-schema-viewer/) is rendering the
[mdJson-schemas](https://github.com/adiwg/mdJson-schemas).

Built using:

- [d3js](http://d3js.org/)
- [jQUery](http://jquery.com/)
- [jQUery Mobile](http://jquerymobile.com/)
- [tv4](http://geraintluff.github.io/tv4/)
- [FileReader.js](http://bgrins.github.io/filereader.js/)
- [highlight.js](https://highlightjs.org/)
- [jsonpointer.js](https://github.com/alexeykuzmin/jsonpointer.js)
- [Grunt HTML Boiler](https://github.com/mhulse/grunt-html-boiler)
- [URI.js](https://github.com/medialize/URI.js)

## Developer Guide

This project uses the command line tool `grunt` to build the production version. At the moment, the dev parts appear to be a little broken but they have not been tested recently.

In order to build and deploy this application you should use the `npm` scripts rather than trying to do anything directly.

### Install and Build

As usual, install npm dependencies first, then build the application.

1. `npm install`
2. `npm run build`

This will build the application into the docs/ directory, ready for production.

### Deploy to GitHub Pages

Use the `npm` script:

`npm run deploy`

### Build and Run with Docker

Build docker:

1. `docker build -t mdtools .`
2. `docker run --rm -d -p 8043:8043 mdtools`
