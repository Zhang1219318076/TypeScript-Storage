interface StorageOption {
  name: string;
  value?: any;
  expored?: number;
  startTime?: number;
}

class Storage {
  // 定义 storage 全局变量
  storage: any;
  constructor(type: string) {
    if (type === 'localStorage') {
      this.storage = window.localStorage;
    } else {
      this.storage = window.sessionStorage;
    }
  }

  /**
   * 设置存储数据
   * @param options
   * @param name 键
   * @param value 值
   * @param startTime 起始时间
   * @param expored 过期时间
   */
  public setTimeItem(options: StorageOption): void {
    Object.assign(options, { startTime: new Date().getTime() });
    if (options.expored) {
      this.storage.setItem(options.name, JSON.stringify(options));
    } else {
      const type = Object.prototype.toString.call(options.value).slice(8, -1).toLowerCase();
      if (type === 'object' || type === 'array') {
        options.value = JSON.stringify(options.value);
      }
      this.storage.setItem(options.name, options.value);
    }
  }

  /**
   * 取值
   * @param name 键
   */

  public getTimeItem(name: string) {
    let item = this.storage.getItem(name);
    if (!item || item === 'null' || item === 'undefined') return;
    try {
      item = JSON.parse(item);
    } catch (error) {
      throw new Error(name + ' is not a');
    }
    if (item.startTime) {
      const now = new Date().getTime();
      if (now - item.startTime > item.expored) {
        this.storage.removeItem(name);
        return;
      } else {
        return item.value;
      }
    } else {
      return item;
    }
  }
  /**
   * 删除
   * @param name 键
   */
  public removeTimeItem(name: string): void {
    this.storage.removeItem(name);
  }
  /**
   * 清除全部
   */
  public clearTimeItem(): void {
    this.storage.claer();
  }
}

const local = new Storage('localStorage');
const session = new Storage('sessionStorage');
export { local, session };
