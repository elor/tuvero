#!/usr/bin/env python2

import os, sys, re
from collections import deque

template_dirs = ["../core/templates", "templates"]
string_files = ["../legacy/scripts/ui/strings.js", "scripts/strings.js"]
version_file = "../Version"

templates = {}
strings = {}
templateStack = {}

for template_dir in template_dirs:
    if not os.path.isdir(template_dir):
        if template_dir != "templates":
            sys.stderr.write("ERROR: %s is not a directory"%template_dir)
            exit(1)
    else:
        for template in os.listdir(template_dir):
            template_path = os.path.join(template_dir, template)
            if os.path.isfile(template_path):
                key = template.replace('.html', '')
                value = open(template_path).read()
                templates[key] = value

regex=re.compile('''^[ \t]*(['"]?[a-z_]*['"]?)[ \t]*:[ \t]*['"](.*)['"],?[ \t]*$''')
for string_file in string_files:
    if not os.path.isfile(string_file):
        sys.stderr.write("ERROR: This file has to be run from inside a build target directory, e.g. boule/ or tac/!\n");
        exit(1)
    for line in open(string_file):
        m = regex.search(line)
        if m:
            key = m.group(1)
            string = m.group(2)
            strings[key] = string

try:
    strings["version"] = open(version_file).read().strip('\n')
except:
    sys.stderr.write("ERROR: Cannot open version file for reading: %s\n"%version_file)

def get_string(key):
    try:
        return strings[key]
    except:
        sys.stderr.write("string cannot be found: '%s'"%key)
        exit(1)

def replace_strings(lines):
    out_lines = []
    regex=re.compile('%([a-z_]+)%')
    for line in lines:
        while True:
            m = regex.search(line)
            if not m:
                break;
            key = m.group(1)
            string = get_string(key)
            line = line.replace("%%%s%%"%key, string)
        out_lines.append(line)
    return out_lines

def parse_template(template):
    regex = re.compile('^([ \t]*)\{\{([a-z]*)\}\}$')
    out_lines = []
    try:
        raw_template = templates[template]
    except:
        sys.stderr.write("template %s does not exist!"%template)

    in_lines = deque(raw_template.split('\n'))
    while len(in_lines) > 0:
        line = in_lines.popleft()
        m = regex.search(line)
        if m:
            spaces = m.group(1)
            subtemplate = m.group(2)
            sub_lines = parse_template(subtemplate)
            sub_lines = [ spaces + sub_line for sub_line in sub_lines ]
            sub_lines.reverse()
            in_lines.extendleft(sub_lines)
        else:
            out_lines.append(line)
        
    return out_lines

lines = parse_template("index")
lines = replace_strings(lines)
lines = [ line.rstrip() for line in lines ]
lines = [ line for line in lines if len(line) > 0 ]

open("index.html", "w").write("\n".join(lines))
