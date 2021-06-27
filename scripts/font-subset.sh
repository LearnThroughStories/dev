#!/bin/sh

# A typical google font has thousands of unicode code points, out of which we are only interested in the
# English subset and some punctuation. Even with that subset, we are not interested in rendering 
# fractions, numerator, denominator etc ... just plain text (of course with kerning, ligatures etc)
# Usage: font-subset.sh hepta-slab-400.woff hepta-slab-400-lean.woff 

# Process: Download the CSS file that describes fonts like this
# https://fonts.googleapis.com/css2?family=Hepta+Slab:wght@400;500;700
# In the css file is the corresponding font file. 


pyftsubset\
    "$1" \
  --output-file="$2" \
  --flavor=woff2 \
  --layout-features-="dnom,frac,numr,pnum,tnum"\
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,\
  U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,\
  U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
