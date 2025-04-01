#!/bin/bash

# Older version of the script

mkdir -p _build/html/pdfs _build/html/figures _build/html/media _build/html/testbin  _build/html/nis # _build/html/testbin_dec2024 _build/html/data
cp -r figures/* _build/html/figures/
cp -r pdfs/* _build/html/pdfs/
cp -r media/* _build/html/media/
# cp -r act1/app/* _build/html/act1/app
# cp -r data/* _build/html/data
cp -r testbin/* _build/html/testbin
# cp -r testbin_dec2024/* _build/html/testbin_dec2024
cp -r nis/* _build/html/nis



