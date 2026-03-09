"use client";

import {
  INITIAL_KANBAN_STATE,
  KanbanBoard,
  getEmptyBoardState,
} from "@/features/kanban";
import { useState } from "react";

export type BoardItem = { id: string; nameKey?: string; name?: string };

const DEFAULT_BOARD_IDS = ["b1", "b2"] as const;

export function KanbanPageClient() {
  const [boards, setBoards] = useState<BoardItem[]>(() => [
    { id: "b1", nameKey: "boardWork" },
    { id: "b2", nameKey: "boardEmail" },
  ]);
  const [currentBoardId, setCurrentBoardId] = useState<string>(
    DEFAULT_BOARD_IDS[0]
  );
  const [boardStates, setBoardStates] = useState<
    Record<string, typeof INITIAL_KANBAN_STATE>
  >(() => ({
    [DEFAULT_BOARD_IDS[0]]: INITIAL_KANBAN_STATE,
    [DEFAULT_BOARD_IDS[1]]: getEmptyBoardState(),
  }));

  const state = boardStates[currentBoardId] ?? getEmptyBoardState();

  const setState = (next: typeof state) => {
    setBoardStates((prev) => ({ ...prev, [currentBoardId]: next }));
  };

  const handleCreateBoard = (name: string) => {
    const id = `b${Date.now()}`;
    setBoards((prev) => [...prev, { id, name }]);
    setBoardStates((prev) => ({ ...prev, [id]: getEmptyBoardState() }));
    setCurrentBoardId(id);
  };

  const handleDeleteBoard = () => {
    setBoards((prev) => prev.filter((b) => b.id !== currentBoardId));
    setBoardStates((prev) => {
      const next = { ...prev };
      delete next[currentBoardId];
      return next;
    });
    const remaining = boards.filter((b) => b.id !== currentBoardId);
    setCurrentBoardId(remaining[0]?.id ?? DEFAULT_BOARD_IDS[0]);
  };

  return (
    <KanbanBoard
      state={state}
      onStateChange={setState}
      boards={boards}
      currentBoardId={currentBoardId}
      onSwitchBoard={setCurrentBoardId}
      onCreateBoard={handleCreateBoard}
      onDeleteBoard={handleDeleteBoard}
    />
  );
}
