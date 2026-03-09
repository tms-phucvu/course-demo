/**
 * Mock board members for Kanban header.
 * Avatars: /image/avatar_men.png, /image/avatar_girl.png
 */
export interface BoardMember {
  id: string;
  name: string;
  avatar: string;
}

export const MOCK_BOARD_MEMBERS: BoardMember[] = [
  { id: "m1", name: "Alex Brown", avatar: "/image/avatar_men.png" },
  { id: "m2", name: "Chris Davis", avatar: "/image/avatar_girl.png" },
  { id: "m3", name: "Emma Wilson", avatar: "/image/avatar_girl.png" },
  { id: "m4", name: "James Lee", avatar: "/image/avatar_men.png" },
  { id: "m5", name: "Maria Garcia", avatar: "/image/avatar_girl.png" },
  { id: "m6", name: "Tom Smith", avatar: "/image/avatar_men.png" },
  { id: "m7", name: "Sarah Kim", avatar: "/image/avatar_girl.png" },
  { id: "m8", name: "David Nguyen", avatar: "/image/avatar_men.png" },
];

/** Number of avatars to show before "+N" overflow. */
export const BOARD_MEMBERS_VISIBLE = 4;
