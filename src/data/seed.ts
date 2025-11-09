// import { useAppStore } from "../store/useAppStore";
// import { useGroupStore } from "../store/useGroupStore";
// import { useWishStore } from "../store/useWishStore";
// import { User } from "../types/NeonApiInterface";

// export const initializeData = () => {
//   const appStore = useAppStore.getState();
//   const groupStore = useGroupStore.getState();
//   const wishStore = useWishStore.getState();

//   if (groupStore.groups.length > 0) {
//     return;
//   }

//   const demoUser1: User = {
//     id: "user-1",
//     name: "田中太郎",
//     email: "tanaka@example.com",
//   };

//   const demoUser2: User = {
//     id: "user-2",
//     name: "佐藤花子",
//     email: "sato@example.com",
//   };

//   const demoUser3: User = {
//     id: "user-3",
//     name: "鈴木一郎",
//     email: "suzuki@example.com",
//   };

//   const group1Id = groupStore.createGroup("友達グループ", demoUser1);
//   groupStore.inviteUser(group1Id, demoUser2);
//   groupStore.inviteUser(group1Id, demoUser3);

//   const group2Id = groupStore.createGroup("趣味グループ", demoUser1);

//   const wish1Id = wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser1.id,
//     category: "イベント",
//     title: "お花見に行きたい",
//     displayDate: "2025年4月上旬",
//     displayText: "桜の季節に公園でお花見をしたいです",
//     notes:
//       "持ち物：お弁当、飲み物、レジャーシート\n場所：代々木公園または上野公園\n雨天の場合は延期",
//     deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 3,
//     maxParticipants: 10,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "datetime",
//       datetimeLabel: "希望日時",
//       datetimeRequired: true,
//     },
//     postConfirmSchema: { type: "note", noteLabel: "感想", noteRequired: false },
//   });

//   wishStore.joinWish(wish1Id, {
//     userId: demoUser2.id,
//     joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//     participationAnswers: { datetime: "2025年4月5日 10:00", note: "" },
//   });

//   wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser2.id,
//     category: "旅行",
//     title: "温泉旅行に行きたい",
//     displayDate: "2025-05-12",
//     displayText: "週末に1泊2日で温泉旅行に行きたい",
//     notes: "予算：1人15,000円程度\n場所：箱根または熱海\n温泉宿を予約します",
//     deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 2,
//     maxParticipants: 6,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "mixed",
//       datetimeLabel: "希望日程",
//       datetimeRequired: true,
//       noteLabel: "食事の希望",
//       noteRequired: false,
//     },
//     postConfirmSchema: {
//       type: "note",
//       noteLabel: "旅行の感想",
//       noteRequired: false,
//     },
//   });

//   const wish3Id = wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser2.id,
//     category: "食事",
//     title: "焼肉パーティーしたい",
//     displayDate: "2025-05-12",
//     displayText: "みんなで焼肉を食べに行きましょう",
//     notes: "予算：1人4,000円程度\n食べ放題のお店を予約します",
//     deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 4,
//     maxParticipants: 8,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "note",
//       noteLabel: "アレルギー情報",
//       noteRequired: false,
//     },
//     postConfirmSchema: { type: "none" },
//   });

//   wishStore.joinWish(wish3Id, {
//     userId: demoUser1.id,
//     joinedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
//   });

//   wishStore.joinWish(wish3Id, {
//     userId: demoUser3.id,
//     joinedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
//   });

//   const wish4Id = wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser3.id,
//     category: "スポーツ",
//     title: "フットサルしたい",
//     displayDate: "2025-05-12",
//     displayText: "週末にフットサルを楽しみたいです",
//     notes:
//       "場所：近所のフットサル場\n初心者歓迎\n運動しやすい服装でお越しください",
//     deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 6,
//     maxParticipants: 12,
//     actionLabel: "参加する",
//     participationConfirmSchema: { type: "none" },
//     postConfirmSchema: { type: "none" },
//   });

//   wishStore.joinWish(wish4Id, {
//     userId: demoUser1.id,
//     joinedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
//   });

//   wishStore.joinWish(wish4Id, {
//     userId: demoUser2.id,
//     joinedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
//   });

//   const wish5Id = wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser2.id,
//     category: "映画",
//     title: "映画鑑賞会したい",
//     displayDate: "2025-05-12",
//     displayText: "話題の新作映画を一緒に見に行きたい",
//     notes: "上映時間は現地で相談\n鑑賞後にカフェで感想を語り合いましょう",
//     deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 2,
//     maxParticipants: 5,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "datetime",
//       datetimeLabel: "希望日時",
//       datetimeRequired: true,
//     },
//     postConfirmSchema: {
//       type: "note",
//       noteLabel: "映画の感想",
//       noteRequired: true,
//     },
//   });

//   wishStore.joinWish(wish5Id, {
//     userId: demoUser3.id,
//     joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//     participationAnswers: { datetime: "2025年3月15日 14:00", note: "" },
//   });

//   wishStore.createWish({
//     groupId: group2Id,
//     creatorId: demoUser1.id,
//     category: "読書",
//     title: "読書会を開催したい",
//     displayDate: "2025-05-12",
//     displayText: "好きな本を持ち寄って感想を共有しましょう",
//     notes: "カフェで開催予定\nジャンルは問いません",
//     minParticipants: 3,
//     maxParticipants: 8,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "note",
//       noteLabel: "読んでいる本",
//       noteRequired: true,
//     },
//     postConfirmSchema: { type: "none" },
//   });

//   wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser2.id,
//     category: "音楽",
//     title: "カラオケに行きたい",
//     displayDate: "2025-05-12",
//     displayText: "みんなでカラオケで盛り上がりたいです",
//     notes: "2時間飲み放題付きプラン\n予算：1人3,000円程度",
//     deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 3,
//     maxParticipants: 8,
//     actionLabel: "参加する",
//     participationConfirmSchema: { type: "none" },
//     postConfirmSchema: { type: "none" },
//   });

//   wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser3.id,
//     category: "観光",
//     title: "日帰り旅行に行きたい",
//     displayDate: "2025年4月中旬",
//     displayText: "鎌倉や江ノ島を観光したい",
//     notes: "朝9時集合、夕方解散\n交通費込みで5,000円程度",
//     deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 2,
//     maxParticipants: 6,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "datetime",
//       datetimeLabel: "希望日",
//       datetimeRequired: true,
//     },
//     postConfirmSchema: { type: "none" },
//   });

//   wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser2.id,
//     category: "アート",
//     title: "美術館に行きたい",
//     displayDate: "2025年3月",
//     displayText: "話題の展覧会を見に行きましょう",
//     notes: "上野や六本木の美術館を予定\n入館料は各自負担",
//     deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 2,
//     maxParticipants: 4,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "mixed",
//       datetimeLabel: "希望日時",
//       datetimeRequired: true,
//       noteLabel: "見たい展覧会",
//       noteRequired: false,
//     },
//     postConfirmSchema: { type: "note", noteLabel: "感想", noteRequired: false },
//   });

//   wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser3.id,
//     category: "スポーツ",
//     title: "ジムで一緒に運動したい",
//     displayDate: "毎週平日夜",
//     displayText: "仕事帰りにジムで運動しませんか",
//     notes: "場所：近所のスポーツジム\n会員割引あり\n初回は見学無料",
//     deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 2,
//     maxParticipants: 5,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "note",
//       noteLabel: "運動経験",
//       noteRequired: false,
//     },
//     postConfirmSchema: { type: "none" },
//   });

//   wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser2.id,
//     category: "料理",
//     title: "料理教室に参加したい",
//     displayDate: "2025年4月",
//     displayText: "イタリアン料理を学びたい",
//     notes: "参加費：1人5,000円\n作った料理は持ち帰れます",
//     deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
//     minParticipants: 3,
//     maxParticipants: 6,
//     actionLabel: "参加する",
//     participationConfirmSchema: {
//       type: "note",
//       noteLabel: "アレルギー情報",
//       noteRequired: true,
//     },
//     postConfirmSchema: { type: "none" },
//   });

//   const withdrawnWishId = wishStore.createWish({
//     groupId: group1Id,
//     creatorId: demoUser1.id,
//     category: "イベント",
//     title: "キャンプに行きたい（取り下げ済み）",
//     displayDate: "2025-05-12",
//     displayText: "アウトドアでキャンプを楽しみたかったのですが...",
//     notes: "都合により中止になりました",
//     minParticipants: 4,
//     actionLabel: "参加する",
//     participationConfirmSchema: { type: "none" },
//     postConfirmSchema: { type: "none" },
//   });

//   wishStore.withdrawWish(withdrawnWishId);
// };
