declare namespace AppContent {
  interface ContactCard extends BaseContent {
    title: string;
    texts: string[];
    type: 'phone' | 'address' | 'text';
    cta?: AppContent.CTAContent;
  }
}
