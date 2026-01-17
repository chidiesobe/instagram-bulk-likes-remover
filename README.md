# Instagram Bulk Likes Remover

Browser-based JavaScript utility for bulk removing Instagram likes
from the likes activity page using Instagram’s current Bloks UI.

⚠️ **Use at your own risk. Removals are irreversible.**

## What this script does

- Enables multi-select mode on Instagram’s likes activity page
- Selects likes in small, safe batches
- Deletes them using the Bloks UI + confirmation modal
- Automatically repeats until no likes remain

The script is intentionally conservative to reduce the risk of
temporary action limits.


## Usage

1. Open Instagram in a desktop browser.
2. Go to:
   https://www.instagram.com/your_activity/interactions/likes
3. Open the browser developer console  
- **Mac:** `Cmd + Option + I`  
- **Windows/Linux:** `Ctrl + Shift + I`
4. Copy the script from `auto-remove-instagram-likes.js`
   and paste it into the console.
5. Press Enter.

## Stop execution

To stop repeated delete cycles, run:
```js
window.__STOP_IG_BULK_UNLIKE__ = true;
```

## Notes

This script is provided as-is.
No guarantees are made regarding long-term compatibility or continued functionality.

