export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  readAt?: Date;
}

export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
};
