export interface Concert {
  id:          string;
  title:       string;
  subtitle:    string;
  description?: string;
  imageUrl:    string;
  imageAlt:    string;
  gradient:    string;
  badge?:      string;
  variant:     "featured" | "compact";
}
