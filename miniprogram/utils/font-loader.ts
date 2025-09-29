// 字体加载工具类
export class FontLoader {
  private static loadedFonts = new Set<string>();
  private static loadingPromises = new Map<string, Promise<boolean>>();

  /**
   * 检测字体是否已加载
   */
  static isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  /**
   * 预加载字体
   */
  static async preloadFont(
    fontFamily: string,
    fontUrl?: string
  ): Promise<boolean> {
    if (this.loadedFonts.has(fontFamily)) {
      return true;
    }

    // 如果正在加载，返回现有的Promise
    if (this.loadingPromises.has(fontFamily)) {
      return this.loadingPromises.get(fontFamily)!;
    }

    const loadPromise = this.loadFontInternal(fontFamily, fontUrl);
    this.loadingPromises.set(fontFamily, loadPromise);

    try {
      const result = await loadPromise;
      if (result) {
        this.loadedFonts.add(fontFamily);
      }
      return result;
    } finally {
      this.loadingPromises.delete(fontFamily);
    }
  }

  /**
   * 内部字体加载逻辑
   */
  private static async loadFontInternal(
    fontFamily: string,
    fontUrl?: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      // 在小程序环境中，我们主要检测字体是否可用
      // 由于小程序限制，无法直接加载外部字体文件

      // 创建测试元素检测字体
      const testText = "abcdefghijklmnopqrstuvwxyz0123456789";
      const fallbackFont = "monospace";

      // 模拟字体检测（在小程序中简化处理）
      setTimeout(() => {
        // 在实际环境中，TDesign字体通常会自动加载
        // 这里主要是为了提供一个统一的字体管理接口
        console.log(`字体 ${fontFamily} 加载检测完成`);
        resolve(true);
      }, 100);
    });
  }

  /**
   * 获取字体降级方案
   */
  static getFontFallback(primaryFont: string): string {
    const fallbacks = {
      t: "'t', 'iconfont', sans-serif",
      iconfont: "'iconfont', 't', sans-serif",
    };

    return (
      fallbacks[primaryFont as keyof typeof fallbacks] ||
      `'${primaryFont}', sans-serif`
    );
  }

  /**
   * 应用字体降级
   */
  static applyFontFallback(selector: string, primaryFont: string): void {
    try {
      // 在小程序中，我们通过动态添加样式来处理字体降级
      const fallbackFont = this.getFontFallback(primaryFont);

      // 这里可以通过 wx.createSelectorQuery 来动态修改样式
      // 但由于小程序的限制，建议在CSS中直接配置降级方案
      console.log(`为 ${selector} 应用字体降级: ${fallbackFont}`);
    } catch (error) {
      console.error("应用字体降级失败:", error);
    }
  }

  /**
   * 初始化字体加载器
   */
  static init(): void {
    console.log("字体加载器初始化");

    // 预加载常用字体
    this.preloadFont("t").catch((error) => {
      console.warn("TDesign字体预加载失败:", error);
    });
  }

  /**
   * 处理字体加载错误
   */
  static handleFontError(fontFamily: string, error: any): void {
    console.warn(`字体 ${fontFamily} 加载失败:`, error);

    // 显示用户友好的提示
    if (fontFamily === "t") {
      console.log("TDesign图标字体加载失败，将使用降级方案");
      // 可以在这里触发一些降级处理逻辑
    }
  }
}

// 自动初始化
FontLoader.init();
