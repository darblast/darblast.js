namespace Darblast {
export namespace Loader {

/**
 * Loads an image asynchronously from the given URL.
 *
 * The returned Promise will resolve to an `HTMLImageElement`.
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      image.onload = null;
      image.onerror = null;
      resolve(image);
    };
    image.onerror = () => {
      image.onload = null;
      image.onerror = null;
      reject(`failed to load ${JSON.stringify(url)}`);
    };
    image.src = url;
  });
}

/**
 * Loads many images in parallel from the given URLs.
 *
 * The returned Promise will resolve to an array of `HTMLImageElement`s.
 */
export function loadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map(url => loadImage(url)));
}

/**
 * Loads an audio file asynchronously from the given URL.
 *
 * The returned Promise will resolve to an `HTMLAudioElement`.
 */
export function loadSound(url: string): Promise<HTMLAudioElement> {
  return new Promise<HTMLAudioElement>((resolve, reject) => {
    const audio = new Audio(url);
    audio.oncanplaythrough = () => {
      audio.oncanplaythrough = null;
      audio.onerror = null;
      resolve(audio);
    };
    audio.onerror = () => {
      audio.oncanplaythrough = null;
      audio.onerror = null;
      reject(`failed to load ${JSON.stringify(url)}`);
    };
    audio.load();
  });
}

/**
 * Loads many audio files in parallel from the given URLs.
 *
 * The returned Promise will resolve to an array of `HTMLAudioElement`s.
 */
export function loadSounds(urls: string[]): Promise<HTMLAudioElement[]> {
  return Promise.all(urls.map(url => Loader.loadSound(url)));
}

}  // namespace Loader
}  // namespace Darblast
