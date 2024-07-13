# jb push the local directory
rm -rf _build
pip install -r requirements.txt && jb build .
cp -r part1/app/* _build/html/part1/app
cd ~/documents/rhythm
local/kitabo/ensi/scripts/jbp-https.sh