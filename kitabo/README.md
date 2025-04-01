## Claude 3.5 Sonnet

```sh
cd ~/documents/rhythm/jam/kitabo/ensi
pip install -r requirements.txt && jupyter-book build .
cp -r part1/app/* _build/html/part1/app
cd ~/documents/rhythm/
new/jbb_https.sh
```

Only need the app to be present as you `ghp-import`. The embedding will still work as a webApp in its absence