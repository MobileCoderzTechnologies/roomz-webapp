export interface Amenity {
  id: number;
  uid: string;
  type: 'normal' | 'safety' | 'space';
  name: string;
  description: string | null;
}
