#!/bin/zsh
# Blog Studio — double-click to launch.
cd "$(dirname "$0")" || exit 1
# Finder gives a minimal PATH; node is not on it by default.
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

PORT=4455
URL="http://localhost:$PORT"

if [ ! -d node_modules ]; then
  echo "First run — installing dependencies…"
  npm install
fi

# Restart rather than reuse, so a process left from an earlier launch cannot keep
# serving code loaded at its startup. -sTCP:LISTEN matters: a bare port query
# also returns browser processes that merely have a tab open on it.
OLD_PID=$(lsof -ti tcp:$PORT -sTCP:LISTEN 2>/dev/null)
if [ -n "$OLD_PID" ]; then
  kill $OLD_PID 2>/dev/null
  for i in 1 2 3 4 5 6; do
    sleep 0.5
    lsof -ti tcp:$PORT -sTCP:LISTEN >/dev/null 2>&1 || break
  done
  lsof -ti tcp:$PORT -sTCP:LISTEN >/dev/null 2>&1 && {
    lsof -ti tcp:$PORT -sTCP:LISTEN | xargs kill -9 2>/dev/null; sleep 1
  }
fi

# Start detached and exit. Holding the foreground keeps this Terminal window on
# top of the browser, so the tab opens behind it and looks like nothing happened.
mkdir -p logs
BLOG_STUDIO_NO_OPEN=1 nohup node studio/server.mjs >> logs/_studio.log 2>&1 &
disown

for i in {1..60}; do
  if lsof -ti tcp:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
    "$HOME/clinic-hub/bin/open-url.sh" "$URL"
    echo "Blog Studio is running at $URL — you can close this window."
    exit 0
  fi
  sleep 0.25
done

echo "Blog Studio did not start. See $(pwd)/logs/_studio.log"
sleep 10
exit 1
