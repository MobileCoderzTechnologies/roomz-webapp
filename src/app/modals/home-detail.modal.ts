export interface HomeDetail {
  id: number;
  uid: string;
  name: string;
  description: string | null;
  isChecked: boolean | null;
  explanation?: string | null;
  isError?: boolean;
  isTouched?: boolean;
}
