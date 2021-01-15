namespace Darblast {
export namespace Loader {

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

export function loadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map(url => loadImage(url)));
}

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

export function loadSounds(urls: string[]): Promise<HTMLAudioElement[]> {
  return Promise.all(urls.map(url => Loader.loadSound(url)));
}

}  // namespace Loader
}  // namespace Darblast
