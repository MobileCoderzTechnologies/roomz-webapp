export interface PropertyBed {
  bed_id: number;
  serial_number: number;
  bedroom_name: string;
  count: number;
  property_id?: string;
  bed_type?: {
    bed_type: string;
    id: number;
  } | null;
}
