import { Request, Response } from "express";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TestUser {
  name: string;
  email: string;
  password: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
}

export interface Participant {
  userId: string;
  joinedAt: string;
  participationAnswers?: answer;
  postAnswers?: answer;
}
export type answer = { datetime?: string; note?: string };
export type ParticipationSchemaType = "none" | "datetime" | "note" | "mixed";

export interface ParticipationSchema {
  type: ParticipationSchemaType;
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
  implementationDatetime?: string;
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
  implementationDatetime?: string;
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
export type schemaType = "participation" | "post";

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

export type insertWishRequest = accessTokenAuthRequest &
  Omit<Wish, "id" | "participants" | "withdrawn" | "createdAt">;

export type insertWishApiRequest = Request<insertWishRequest>;
export type insertWishResponse =
  | {
      result: { id: string };
      status: number;
    }
  | { error: string; status: number };
export type insertWishApiResponse = Response<insertWishResponse>;
export type getWishByIdRequest = accessTokenAuthRequest & { id: string };
export type getWishByIdApiRequest = Request<getWishByIdRequest>;
export type getWishByIdResponse =
  | {
      result: { wish: Wish };
      status: number;
    }
  | { error: string; status: number };
export type getWishByIdApiResponse = Response<getWishByIdResponse>;

export type insertAnswerRequest = accessTokenAuthRequest & {
  id: string;
} & Omit<Participant, "userId" | "joinedAt">;

export type insertAnswerApiRequest = Request<insertAnswerRequest>;
export type insertAnswerResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type insertAnswerApiResponse = Response<insertAnswerResponse>;
export type updateWishRequest = accessTokenAuthRequest & {
  id: string;
} & Partial<Omit<Wish, "id">>;

export type updateWishApiRequest = Request<updateWishRequest>;
export type updateWishResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type updateWishApiResponse = Response<updateWishResponse>;
export type getWishesRequest = accessTokenAuthRequest & Pick<Group, "id">;
export type getWishesApiRequest = Request<getWishesRequest>;
export type getWishesResponse =
  | {
      result: { wishes: Wish[] };
      status: number;
    }
  | { error: string; status: number };
export type getWishesApiResponse = Response<getWishesResponse>;

export type getGroupsRequest = accessTokenAuthRequest;
export type getGroupsApiRequest = Request<getGroupsRequest>;
export type getGroupsResponse =
  | {
      result: { groups: Group[] };
      status: number;
    }
  | { error: string; status: number };
export type getGroupsApiResponse = Response<getGroupsResponse>;

export type insertGroupRequest = accessTokenAuthRequest & Pick<Group, "name">;
export type insertGroupApiRequest = Request<insertGroupRequest>;
export type insertGroupResponse =
  | {
      result: { id: string };
      status: number;
    }
  | { error: string; status: number };
export type insertGroupApiResponse = Response<insertGroupResponse>;

export type invitationGroupRequest = accessTokenAuthRequest & {
  invitationUserId: string;
  groupId: string;
};
export type invitationGroupApiRequest = Request<invitationGroupRequest>;
export type invitationGroupResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type invitationGroupApiResponse = Response<invitationGroupResponse>;

export type joinWishRequest = accessTokenAuthRequest & {
  wishId: string;
};
export type joinWishApiRequest = Request<joinWishRequest>;
export type joinWishResponse =
  | {
      result: string;
      status: number;
    }
  | { error: string; status: number };
export type joinWishApiResponse = Response<joinWishResponse>;

// Comments API
export interface Comment {
  id: string;
  wishId?: string;
  userId: string;
  userName: string;
  text: string;
  quote?: string;
  createdAt: string;
  quoteAbsoluteStart?: number;
  quoteAbsoluteEnd?: number;
}

export type getCommentsRequest = accessTokenAuthRequest & { wishId: string };
export type getCommentsApiRequest = Request<getCommentsRequest>;
export type getCommentsResponse =
  | {
      result: { comments: Comment[] };
      status: number;
    }
  | { error: string; status: number };
export type getCommentsApiResponse = Response<getCommentsResponse>;

export type postCommentRequest = accessTokenAuthRequest & {
  wishId: string;
  text: string;
  quote?: string;
  quoteAbsoluteStart?: number;
  quoteAbsoluteEnd?: number;
};
export type postCommentApiRequest = Request<postCommentRequest>;
export type postCommentResponse =
  | {
      result: { comment: Comment };
      status: number;
    }
  | { error: string; status: number };
export type postCommentApiResponse = Response<postCommentResponse>;
