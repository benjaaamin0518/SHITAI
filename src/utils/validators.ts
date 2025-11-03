import { z } from 'zod';

export const wishFormSchema = z.object({
  category: z.string().min(1),
  newCategory: z.string().optional(),
  imageData: z.string().optional(),
  title: z.string().min(1),
  displayDate: z.string().optional(),
  displayText: z.string().optional(),
  notes: z.string().optional(),
  deadline: z.string().optional(),
  minParticipants: z.number().min(1),
  maxParticipants: z.number().optional(),
  actionLabel: z.string().min(1),
  participationConfirmType: z.enum(['none', 'datetime', 'note', 'mixed']),
  participationDatetimeLabel: z.string().optional(),
  participationDatetimeRequired: z.boolean().optional(),
  participationNoteLabel: z.string().optional(),
  participationNoteRequired: z.boolean().optional(),
  postConfirmType: z.enum(['none', 'datetime', 'note', 'mixed']),
  postDatetimeLabel: z.string().optional(),
  postDatetimeRequired: z.boolean().optional(),
  postNoteLabel: z.string().optional(),
  postNoteRequired: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.participationConfirmType === 'datetime' || data.participationConfirmType === 'mixed') {
    if (!data.participationDatetimeLabel || data.participationDatetimeLabel.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '日時項目名は必須です',
        path: ['participationDatetimeLabel'],
      });
    }
  }

  if (data.participationConfirmType === 'note' || data.participationConfirmType === 'mixed') {
    if (!data.participationNoteLabel || data.participationNoteLabel.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '備考項目名は必須です',
        path: ['participationNoteLabel'],
      });
    }
  }

  if (data.postConfirmType === 'datetime' || data.postConfirmType === 'mixed') {
    if (!data.postDatetimeLabel || data.postDatetimeLabel.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '日時項目名は必須です',
        path: ['postDatetimeLabel'],
      });
    }
  }

  if (data.postConfirmType === 'note' || data.postConfirmType === 'mixed') {
    if (!data.postNoteLabel || data.postNoteLabel.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '備考項目名は必須です',
        path: ['postNoteLabel'],
      });
    }
  }
});

export const groupFormSchema = z.object({
  name: z.string().min(1),
});

export const inviteFormSchema = z.object({
  email: z.string().email(),
});
