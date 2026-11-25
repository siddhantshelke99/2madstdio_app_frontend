export interface StudentRegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string | null;
  courseId: string;
  notes?: string | null;
  occupation?: string | null;
  collegeName?: string | null;
  degreeBranch?: string | null;
  yearOfStudy?: string | null;
  companyName?: string | null;
  jobTitle?: string | null;
  yearsExperience?: string | null;
  designTools?: string | null;
  portfolioLink?: string | null;
  city?: string | null;
  preferredBatch?: string | null;
  whyJoin?: string | null;
}

export interface StudentRegistrationResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string | null;
  courseId: string;
  status: string;
  notes?: string | null;
  registeredAt: string;
}
