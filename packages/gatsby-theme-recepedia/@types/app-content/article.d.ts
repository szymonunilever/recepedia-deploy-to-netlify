declare namespace AppContent.Article {
  interface Content {
    title: string;
    shortDescription?: string;
    articleText: RichTextContent;
    creationTime?: string;
    content: string;
    assets: Asset<ImageContent | VideoPlayer.Content>[];
    tagGroups: RMSData.TagGroupings[];
    brand?: string;
    brandTheme?: string;
    tags: number[];
  }
}
