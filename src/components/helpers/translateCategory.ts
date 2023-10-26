function translateCategory(category: string): string | undefined {
    switch (category) {
      case "animated-series":
        return "мультсериал";
      case "anime":
        return "аниме";
      case "cartoon":
        return "мультфильм";
      case "movie":
        return "фильм";
      case "tv-series":
        return "сериал";
      default:
        return undefined; // Если передана некорректная строка, можно вернуть undefined или другое значение по умолчанию
    }
  }

  export default translateCategory;