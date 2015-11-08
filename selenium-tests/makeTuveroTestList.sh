#!/bin/bash
#
# create a list of all tuvero tests

tests=$(grep -l "implements TuveroTest" src/*.java | sed -e 's/\.java$/(),/' -e 's/^\s*src\//new /' -e '$s/,$//')

cat << EOF > src/TuveroTestList.java
public class TuveroTestList {
  public static final TuveroTest[] tests = {
    $tests
  };
}
EOF
