# Dance experience galleries

Each experience has a dedicated folder under `public/img/danceExperience`:

- `exploria-party`
- `ronja-raubertochter`
- `movie-park`
- `anatevka`
- `circus-harryson`
- `studio-ldi`
- `ezgi-events`
- `parker-taihu`
- `ballet-art-moana`
- `ballet-art-hunchback`

To add photos:

1. Copy the image files into the matching folder.
2. Open `utils/danceExperienceGallery.ts`.
3. Add each filename to that gallery's `items` array, for example `"1.webp"`.
4. Keep the existing event cover in the feed. It is used automatically while `items` is empty.

The experience image opens the gallery. Inside it, visitors can use the arrows, thumbnails, keyboard arrows, or `Escape` to close it.
