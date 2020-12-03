import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  constructor() {}

  public isValidImageUrl(imageUrl: string): boolean {
    return (
      imageUrl.endsWith('.jpg') ||
      imageUrl.endsWith('.png') ||
      imageUrl.endsWith('.jpeg')
    );
  }

  public isValidUrl(str: string) {
    try {
      const url = new URL(str);
    } catch (_) {
      return false;
    }

    return true;
  }
}
