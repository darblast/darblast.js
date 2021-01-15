/// <reference path="Loader.ts" />


namespace Darblast {


class Pool {
  private readonly _elements: HTMLAudioElement[];

  public constructor(audio: HTMLAudioElement) {
    audio.addEventListener('ended', Pool._resetElement);
    this._elements = [audio];
  }

  private static _resetElement(event: Event): void {
    if (event.target) {
      (<HTMLMediaElement>(event.target)).currentTime = 0;
    }
  }

  public async play(): Promise<void> {
    for (let i = 0; i < this._elements.length; i++) {
      if (!this._elements[i].currentTime) {
        await this._elements[i].play();
        return;
      }
    }
    const newElement = <HTMLAudioElement>(this._elements[0].cloneNode(false));
    newElement.addEventListener('ended', Pool._resetElement);
    this._elements.push(newElement);
    await newElement.play();
  }
}


export class Sound {
  private readonly _pools: {[name: string]: Pool} = Object.create(null);

  private async _initialize(basePath: string, names: string[]): Promise<void> {
    basePath = basePath.replace(/\/$/, '');
    const elements = await Loader.loadSounds(
        names.map(name => `${basePath}/${name}`));
    names.forEach((name, index) => {
      const strippedName = name.replace(/\.[^.\/]+$/, '');
      if (strippedName in this._pools) {
        throw new Error(`duplicate sound entry: ${strippedName}`);
      } else {
        this._pools[strippedName] = new Pool(elements[index]);
      }
    }, this);
  }

  public constructor(basePath: string, names: string[]) {
    this._initialize(basePath, names);
  }

  public async play(name: string): Promise<boolean> {
    if (name in this._pools) {
      await this._pools[name].play();
      return true;
    } else {
      return false;
    }
  }
}


}  // namespace Darblast
