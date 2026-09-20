// Plain constants — deliberately NOT in a 'use server' file. Next.js
// requires every export of a 'use server' file to be an async function, so
// these enums/status lists live here instead and get imported by both the
// server action files (admin-admissions.ts, admin-complaints.ts,
// admin-gallery.ts) and the client components that render them as <select>
// options.

export const admissionStatuses = [
  'Submitted',
  'Under Review',
  'Approved',
  'Rejected',
  'Additional Information Required',
] as const;

export const complaintStatuses = ['Received', 'Under Review', 'In Progress', 'Resolved'] as const;

export const galleryCategories = [
  'School Life',
  'Academics',
  'Sports',
  'Music',
  'Events',
  'Graduation',
  'Facilities',
  'Students',
  'Staff',
  'Community',
] as const;

export const calendarEventTypes = [
  'Term',
  'Opening Date',
  'Closing Date',
  'Half Term',
  'Exam',
  'Holiday',
  'Other',
] as const;

export const tenderStatuses = ['Open', 'Closing Soon', 'Closed', 'Awarded', 'Archived'] as const;

export const vacancyStatuses = ['Open', 'Closed', 'Archived'] as const;

export const applicationModes = ['internal', 'external'] as const;
