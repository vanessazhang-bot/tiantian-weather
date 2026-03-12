/**
 * 消息构建器
 * 根据用户配置个性化定制推送内容
 */
class MessageBuilder {
  constructor(userConfig, quotes) {
    this.user = userConfig;
    this.quotes = quotes || {};
  }

  /**
   * 获取带周几的日期
   */
  getDateWithWeekday() {
    const date = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    const dateStr = date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    return `${dateStr} ${weekday}`;
  }

  /**
   * 获取随机语录
   */
  getRandomQuote() {
    const quoteType = this.user.messageStyle?.quoteType || 'inspirational';
    const quotes = this.quotes[quoteType] || this.quotes.inspirational || ['今天也要加油哦！'];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  /**
   * 构建标题
   */
  buildTitle() {
    let title = this.user.messageStyle?.titleTemplate || '🌤️ 今天天气来啦～';
    // 替换{name}占位符
    title = title.replace(/{name}/g, this.user.name);
    return title;
  }

  /**
   * 构建天气内容
   */
  buildWeatherSection(weatherData) {
    if (!this.user.messageStyle?.showWeatherDetails) {
      return '';
    }

    const lines = [
      `🌡️ 气温 ${weatherData.weather.temperature}°C，${weatherData.weather.condition}～`
    ];
    return lines.join('\n');
  }

  /**
   * 构建穿衣建议
   */
  buildClothingSection(weatherData) {
    if (!this.user.messageStyle?.showClothingAdvice) {
      return '';
    }

    const lines = [
      `👗 今天穿啥：`,
      ...weatherData.clothingAdvice.map(a => `  ${a}`)
    ];
    return lines.join('\n');
  }

  /**
   * 构建出行建议
   */
  buildTravelSection(weatherData) {
    if (!this.user.messageStyle?.showTravelTips) {
      return '';
    }

    const lines = [
      `🚗 出行小贴士：`,
      `  今天适合出门溜达，记得带好心情！`
    ];
    return lines.join('\n');
  }

  /**
   * 构建语录部分
   */
  buildQuoteSection() {
    const quoteTitle = this.user.messageStyle?.quoteTitle || '🍵 今日寄语';
    const quote = this.getRandomQuote();
    
    return [
      quoteTitle,
      `「${quote}」`
    ].join('\n');
  }

  /**
   * 构建结尾
   */
  buildEnding() {
    const tone = this.user.messageStyle?.tone || 'friendly';
    
    const endings = {
      friendly: ['💕 加油哦～', '✨ 今天也要开心！', '💪 你最棒！'],
      sweet: ['💕 爱你哟～', '😘 么么哒～', '🥰 想你～'],
      playful: ['🎉 今天也要元气满满！', '🌟 记得想我哦～', '💖 爱你爱你！'],
      professional: ['祝工作顺利！', '今天也要加油！', '✊ 共勉！']
    };

    const endingList = endings[tone] || endings.friendly;
    const randomEnding = endingList[Math.floor(Math.random() * endingList.length)];
    
    return randomEnding;
  }

  /**
   * 构建完整消息
   */
  buildMessage(weatherData, city) {
    const dateWithWeekday = this.getDateWithWeekday();
    const title = this.buildTitle();
    
    const sections = [
      `📍 ${city} · ${dateWithWeekday}`,
      ''
    ];

    // 添加天气信息
    const weatherSection = this.buildWeatherSection(weatherData);
    if (weatherSection) {
      sections.push(weatherSection);
      sections.push('');
    }

    // 添加分隔线
    sections.push('─────────────────');
    sections.push('');

    // 添加穿衣建议
    const clothingSection = this.buildClothingSection(weatherData);
    if (clothingSection) {
      sections.push(clothingSection);
      sections.push('');
    }

    // 添加出行建议
    const travelSection = this.buildTravelSection(weatherData);
    if (travelSection) {
      sections.push(travelSection);
      sections.push('');
    }

    // 添加分隔线
    sections.push('─────────────────');
    sections.push('');

    // 添加语录
    sections.push(this.buildQuoteSection());
    sections.push('');

    // 添加结尾
    sections.push(this.buildEnding());

    return {
      title,
      content: sections.join('\n')
    };
  }
}

module.exports = MessageBuilder;
