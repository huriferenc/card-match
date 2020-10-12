import { environment } from 'src/environments/environment';

export class LocalStorage {
  constructor() {}

  static setItem(key: string, value: any): void {
    localStorage.setItem(`${environment.store_prefix}-${key}`, JSON.stringify(value));
  }

  static getItem(key: string): any {
    return JSON.parse(localStorage.getItem(`${environment.store_prefix}-${key}`));
  }

  static removeItem(key: string): void {
    localStorage.removeItem(`${environment.store_prefix}-${key}`);
  }

  static clearAll(): void {
    // localStorage.clear();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.indexOf(environment.store_prefix) !== -1) {
        localStorage.removeItem(key);
      }
    }
  }
}
