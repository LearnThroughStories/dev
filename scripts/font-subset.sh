#!/bin/bash

# A typical google font has thousands of unicode code points, of which we are only interested in the
# English subset plus some punctuation. Even with that subset, we are not interested in rendering 
# fractions, numerator, denominator etc ... just plain text with kerning, ligatures etc.

# Usage: font-subset.sh hepta-slab-400.woff hepta-slab-400-lean.woff 

# Process: Download the CSS file that describes fonts like this
# https://fonts.googleapis.com/css2?family=Hepta+Slab:wght@400;500;700
# In the css file is the corresponding font file. 

BASIC_LATIN=U+0020-007F
TIMES=U+0D7   # The multiply symbol (from the extended Latin-A set)
COPYRIGHT=U+OA9  #
FANCY_SINGLE_QUOTES=U+2018,U+2019,U+201C,U+201D
RUPEE=U+20B9
EURO=U+20AC
TRADEMARK=U+2122
MINUS=U+2212
MISSING=U+FFFD

pyftsubset\
    "$1" \
  --output-file="$2" \
  --flavor=woff2 \
  --layout-features-="dnom,frac,numr,pnum,tnum"\
  --unicodes="U+0020-007F,U+0D7,U+0A9,U+2018,U+2019,U+201C,U+201D,U+20AC,U+2122,U+2212,U+FFFD"

#  --unicodes="$BASIC_LATIN,$TIMES,$COPYRIGHT,$FANCY_QUOTES,$RUPEE,$MINUS,$NO_BRK_SPC,$MISSING"
  