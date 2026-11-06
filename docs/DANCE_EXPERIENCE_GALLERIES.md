# Dance experience galleries

Each photo-backed experience has a dedicated folder under `public/img/danceExperience`:

- `exploria-party`
- `ronja-raubertochter`
- `movie-park`
- `movie-park-26`
- `anatevka`
- `circus-harryson`
- `studio-ldi`
- `ezgi-events`
- `parker-taihu`
- `ballet-art-moana`
- `ballet-art-hunchback`
- `endstation-sehnsucht`
- `paul-die-laterne`

To add photos:

1. Copy the image files into the matching folder.
2. Open `utils/danceExperienceGallery.ts`.
3. Add each filename to that gallery's `items` array, for example `"1.webp"`.
4. Set the experience image in the feed to a photo from that folder.

Experiences without photos can use `img: null` in the feed. They display a branded background until photos are added and do not open an empty gallery.

The experience image opens the gallery. Inside it, visitors can use the arrows, thumbnails, keyboard arrows, or `Escape` to close it.
