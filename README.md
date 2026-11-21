# Steven Yon Duan · Portfolio

A static site for GitHub Pages. Open this folder in VS Code.

## Preview

From this folder, run `python3 -m http.server 8000` and open
http://localhost:8000. The local server lets the page load `projects.json`.

## Update

- Edit `projects.json` for project text, stack, links, and placement. Set
  `featured` to `true` for the featured section. The file order is the display order.
- Put screenshots in `assets/` and add entries like
  `{"src":"assets/itinerary.jpg","alt":"Saved trip itinerary","caption":"Saved itinerary"}`
  to a project's `media` array. Two or more items automatically show slideshow controls.
  Update the illustration captions when you replace them with real screenshots.
- For an inline video, add a media entry such as
  `{"type":"video","src":"assets/countdown.mp4","poster":"assets/countdown-still.jpg","alt":"Two countdowns on the DE10 board","caption":"Hardware demo"}`.
  If the video has narration, add an optional `"captions":"assets/countdown.vtt"`.
  For an externally hosted video, add a link under `links`.
- For the portrait, put a photo in `assets/` and set the portrait's
  `data-src` in `index.html` to its path, such as `assets/headshot.jpg`.
- To add a public résumé, put the PDF in `assets/` and add a link to it in
  the profile links in `index.html`.

## Publish

Use a public repository named `stevenyonduan.github.io` and select
Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
Commit and push changes to `main` to update https://stevenyonduan.github.io.
