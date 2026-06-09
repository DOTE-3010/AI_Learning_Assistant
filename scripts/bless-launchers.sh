#!/bin/zsh
# bless-launchers.sh
#
# Strip the kernel-managed com.apple.provenance / com.apple.macl xattrs
# from the .command launcher stubs by copying them onto fresh inodes.
# macOS adds those xattrs whenever Cursor (or any other GUI app) writes
# the files, and AppleSystemPolicy then kills the script with SIGKILL
# when you double-click it from Finder, before the launcher log file is
# even created.
#
# This script must be run from YOUR OWN Terminal.app, NOT from inside
# Cursor's terminal. If you run it from Cursor, macOS will immediately
# re-tag the new files with the same provenance and the bless has no
# lasting effect. Invoke with the explicit interpreter so the script
# itself is never execve'd directly:
#
#   bash scripts/bless-launchers.sh
#
# Safe to re-run.

set -u

cd "$(cd "$(dirname "$0")/.." && pwd)" || exit 1

bless_one() {
  local f="$1"
  if [ ! -f "$f" ]; then
    echo "skip:    $f does not exist"
    return
  fi
  local tmp="${f}.bless.$$"
  if /bin/cp "$f" "$tmp" \
       && /bin/rm "$f" \
       && /bin/mv "$tmp" "$f" \
       && /bin/chmod 0755 "$f"; then
    echo "blessed: $f"
  else
    echo "fail:    $f"
    [ -f "$tmp" ] && /bin/rm "$tmp"
  fi
}

for f in run_web.command run_desktop.command; do
  bless_one "$f"
done

echo
echo "Resulting xattrs (should NOT include com.apple.provenance):"
for f in run_web.command run_desktop.command; do
  if [ -f "$f" ]; then
    printf '  %s ->\n' "$f"
    /usr/bin/xattr -l "$f" 2>/dev/null | sed 's/^/    /' || echo "    (no xattrs)"
  fi
done

echo
echo "If com.apple.provenance still appears above, you ran this script"
echo "from inside Cursor or another sandboxed GUI app. Re-run it from"
echo "your own Terminal.app window."
