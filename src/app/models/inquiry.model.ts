export type InquiryType = 'studio_project' | 'academy_general';

export interface InquiryPayload {
  name: string;
  email: string;
  phone: string;
  type: InquiryType;
  message: string;
}

export interface InquiryResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: InquiryType;
  message: string;
  status: string;
  createdAt: string;
}
