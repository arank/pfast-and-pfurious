# pfast-and-pfurious
Scraper and data analysis for Transloc shuttle times.

The main file here is index.js this file is a node program that depends on phantomjs to continuously log (to cloud mongo) the positions of every shuttle from the live feed given by harvard.transloc.com (this can be changed in the config.json file). 

The data analysis code will be found in the analysis subfolder and we plan to publish a blog with the patterns we found.
