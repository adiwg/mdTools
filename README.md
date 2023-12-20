# mdTools

This branch is not to be merged, it was for testing how the json-schema-viewer works with respect to the mdTools application to present the schema viewer.

In addition to the changes in this branch, I manually modified the node_modules/mdjson-schemas/ directory to contain the changes to the schema that I wanted to test.

I also (sort of) verified that the version number probably comes from the schemas/schema.json file.

Alternatively, you could modify the docs/ directory after it's built and add the desired changes in there, I think it does the same thing because it appears to be loaded in real time, not handled during the build process.
