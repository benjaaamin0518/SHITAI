import { Request, Response } from "express";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
}

export interface Participant {
  userId: string;
  joinedAt: string;
  participationAnswers?: { datetime: string; note: string };
  postAnswers?: { datetime: string; note: string };
}

export type ParticipationSchemaType = "none" | "datetime" | "note" | "mixed";

export interface ParticipationSchema {
  type: ParticipationSchemaType;
  required?: boolean;
  datetimeLabel?: string;
  datetimeRequired?: boolean;
  noteLabel?: string;
  noteRequired?: boolean;
}

export interface Wish {
  id: string;
  groupId: string;
  creatorId: string;
  category: string;
  imageData?: string;
  title: string;
  displayDate?: string;
  displayText?: string;
  notes?: string;
  deadline?: string;
  minParticipants: number;
  maxParticipants?: number;
  actionLabel: string;
  participationConfirmSchema: ParticipationSchema;
  postConfirmSchema: ParticipationSchema;
  participants: Participant[];
  withdrawn: boolean;
  createdAt: string;
}

export interface WishFormData {
  category: string;
  newCategory?: string;
  imageData?: string;
  title: string;
  displayDate?: string;
  displayText?: string;
  notes?: string;
  deadline?: string;
  minParticipants: number;
  maxParticipants?: number;
  actionLabel: string;
  participationConfirmType: ParticipationSchemaType;
  participationDatetimeLabel?: string;
  participationDatetimeRequired?: boolean;
  participationNoteLabel?: string;
  participationNoteRequired?: boolean;
  postConfirmType: ParticipationSchemaType;
  postDatetimeLabel?: string;
  postDatetimeRequired?: boolean;
  postNoteLabel?: string;
  postNoteRequired?: boolean;
}

export type loginAuthRequest = {
  userId: string;
  password: string;
};

export type loginAuthApiRequest = Request<loginAuthRequest>;
export type loginAuthResponse =
  | {
      status: number;
      result: {
        accessToken: string;
        refreshToken: string;
        id: number | null;
        name: string;
        email: string;
      };
    }
  | { error: string; status: number };
export type loginAuthApiResponse = Response<loginAuthResponse>;
export type accessTokenAuthRequest = {
  userInfo: { accessToken: string };
};
export type refreshTokenAuthRequest = {
  userInfo: { refreshToken: string };
};
export type accessTokenAuthApiRequest = Request<accessTokenAuthRequest>;
export type accessTokenAuthResponse =
  | {
      status: number;
      result: { id: number | null; name: string; email: string };
    }
  | { error: string; status: number };
export type accessTokenAuthApiResponse = Response<accessTokenAuthResponse>;

export type refreshTokenAuthApiRequest = Request<refreshTokenAuthRequest>;
export type refreshTokenAuthResponse =
  | { status: number; result: { accessToken: string; refreshToken: string } }
  | { error: string; status: number };
export type refreshTokenAuthApiResponse = Response<refreshTokenAuthResponse>;
export type insertUserInfoRequest = {
  email: string;
  password: string;
  name?: string;
};
export type insertUserInfoApiRequest = Request<insertUserInfoRequest>;
export type insertUserInfoResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type insertUserInfoApiResponse = Response<insertUserInfoResponse>;
