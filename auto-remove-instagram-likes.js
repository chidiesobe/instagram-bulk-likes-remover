/**
 * Instagram Bulk Likes Removal Script
 *
 * Purpose:
 * Automates the selection and removal of liked posts using Instagram’s
 * Bloks-based UI and the confirmation modal.
 *
 * Execution:
 * 1. Open Instagram in a desktop browser.
 * 2. Navigate to the likes activity page:
 *    https://www.instagram.com/your_activity/interactions/likes
 * 3. Open the browser developer console (Chrome recommended).
 * 4. Paste this script and execute it.
 *
 * Notes:
 * - Unliking actions cannot be undone automatically.
 * - Instagram enforces rate limits on bulk actions.
 * - Smaller batches are more reliable.
 *
 * Configuration:
 * - Modify the MAX constant to control how many likes
 *   are removed per execution cycle.
 * - Adjust timing constants (CYCLE_DELAY, SELECT_DELAY,
 *   ICON_DELAY, ACTION_DELAY, MODAL_DELAY) to tune reliability.
 *
 * Troubleshooting:
 * - If pasting is blocked, type `allow pasting` in the console,
 *   press Enter, then paste the script again.
 *
 * - To stop execution at any time, run:
 *   window.__STOP_IG_BULK_UNLIKE__ = true
 *
 * Disclaimer:
 * Use at your own risk. The author assumes no responsibility for
 * account restrictions, action limits, or data loss resulting
 * from the use of this script.
 */


(async function instagramBulkUnlike() {
  window.__STOP_IG_BULK_UNLIKE__ = false;

  const MAX = 10;
  const CYCLE_DELAY = 20000;
  const SELECT_DELAY = 1200;
  const ICON_DELAY = 700;
  const ACTION_DELAY = 1200;
  const MODAL_DELAY = 1000;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Simulate a real user click event
  function realClick(el) {
    el.scrollIntoView({ block: "center" });
    ["mousedown", "mouseup", "click"].forEach((t) =>
      el.dispatchEvent(
        new MouseEvent(t, {
          bubbles: true,
          cancelable: true,
          buttons: 1,
        }),
      ),
    );
  }

  // Get an element's own text (direct text nodes only), ignoring descendants
  const ownText = (el) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join("");

  // Find the "Select" button to enter selection mode. Instagram dropped the
  // data-bloks-name wrapper around the label, so it is now a bare <span>.
  // Matching on the element's own text hits the innermost label (and not a
  // large container whose innerText merely contains "Select"); clicking it
  // works because the event bubbles to the real handler.
  function findSelectButton() {
    return [...document.querySelectorAll("span, div")].find(
      (el) => ownText(el) === "Select",
    );
  }

  // Activate selection mode by clicking the "Select" button
  async function activateSelectMode() {
    const btn = findSelectButton();
    if (!btn) throw new Error("Select button not found");
    realClick(btn);
    await sleep(SELECT_DELAY);
  }

  // Get all selectable like icons in the current view
  function getSelectableIcons() {
    return document.querySelectorAll(
      'div[data-bloks-name="ig.components.Icon"][style*="circle__outline"]',
    );
  }

  // Select likes up to the specified maximum
  async function selectLikes(max) {
    const icons = getSelectableIcons();
    let count = 0;

    for (const icon of icons) {
      if (count >= max) break;
      const btn = icon.closest('[role="button"]');
      if (!btn) continue;

      realClick(btn);
      count++;
      await sleep(ICON_DELAY);
    }

    return count;
  }

  // Find the "Unlike" button in the UI
  function findUnlikeButton() {
    const span = [...document.querySelectorAll("span")]
      .find((el) => el.innerText?.trim() === "Unlike");
    return span?.closest("button, div");
  }

  // Click the "Unlike" button to initiate unliking
  async function clickUnlike() {
    await sleep(ACTION_DELAY);
    const btn = findUnlikeButton();
    if (!btn) throw new Error("Unlike action not found");
    realClick(btn);
  }

  // Find the confirmation button in the modal dialog
  function findModalConfirmButton() {
    return [...document.querySelectorAll("button")]
      .find((btn) => btn.innerText?.trim() === "Unlike");
  }

  // Confirm the unliking action in the modal dialog
  async function confirmModal() {
    await sleep(MODAL_DELAY);
    const confirmBtn = findModalConfirmButton();
    if (!confirmBtn) throw new Error("Modal confirmation not found");
    confirmBtn.focus();
    await sleep(100);
    confirmBtn.click();
  }

  let cycle = 1;

  // Main execution loop
  while (!window.__STOP_IG_BULK_UNLIKE__) {
    try {
      await activateSelectMode();
      const selected = await selectLikes(MAX);

      if (!selected) {
        console.log("No likes remaining");
        break;
      }

      await clickUnlike();
      await confirmModal();

      console.log(`Cycle ${cycle}: unliked ${selected}`);
      cycle++;

      await sleep(CYCLE_DELAY);
    } catch (e) {
      console.warn("Stopped:", e.message);
      break;
    }
  }
})();
