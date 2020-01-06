declare namespace AppContent.Article {
  interface Content {
    title: string;
    shortDescription?: string;
    articleText: RichTextContent;
    assets: Asset<ImageContent | VideoPlayer.Content>[];
    tagGroups: RMSData.TagGroupings[];
    brand?: string;
    tags: Internal.Tag[];
  }
}
