"use client";

import { useSession } from "next-auth/react";
import axios from "axios";
import React, { useState } from "react";
import Comments from "./Comments";
import VoteButtons from "./VoteButtons";
import { IconTrash, IconCheck, IconRobot } from "@tabler/icons-react";
import { MarkdownPreview } from "./RTE";
import slugify from "@/utils/slugify";
import Link from "next/link";

const Answer = ({
  answer,
  questionAuthorId,
  onDelete,
}: {
  answer: any;
  questionAuthorId: string;
  onDelete: (id: string) => void;
}) => {
  const { data: session } = useSession();
  const [isAccepted, setIsAccepted] = useState(answer.isAccepted);

  // Function to accept an answer
  const handleAcceptAnswer = async () => {
    if (!session) return;

    try {
      const response = await axios.post("/api/answer/accept", {
        questionId: answer.questionId,
        answerId: answer._id,
        userId: session?.user?._id,
      });

      if (response.data.success) {
        setIsAccepted(true);
      }
    } catch (error) {
      console.error("Error accepting answer:", error);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Votes & Actions */}
      <div className="flex shrink-0 flex-col items-center gap-4">
        <VoteButtons
          type="answer"
          id={answer._id}
          upvotesCount={answer.totalUpvotes}
          downvotesCount={answer.totalDownvotes}
          autherId={answer.authorId}
        />

        {/* Accept Answer Button (Visible to Question Author) */}
        {(session?.user?._id === questionAuthorId || isAccepted )&& (
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full border p-1 text-green-500 duration-200 
              ${isAccepted ? "bg-green-500 text-white" : "border-green-500 hover:bg-green-500/10"}`}
            onClick={handleAcceptAnswer}
            disabled={isAccepted}
          >
            <IconCheck className="h-4 w-4" />
          </button>
        )}

        {/* Delete Answer Button (Visible to Answer Author) */}
        {session?.user?._id === answer.authorId._id && (
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
            onClick={() => onDelete(answer._id)}
          >
            <IconTrash className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Answer Content */}
      <div className="w-full overflow-auto">
        {answer.isAiGenerated && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
            <IconRobot className="h-3 w-3" />
            AI-generated answer
          </span>
        )}
        <div className="rounded-xl p-4">
          <MarkdownPreview source={answer.content} />
        </div>

        {/* Author Info */}
        <div className="mt-4 flex items-center justify-end gap-1">
          <picture>
            <img
              src={answer.authorId.profileImg || "/default-avatar.png"}
              alt={answer.authorId.username || "User"}
              className="rounded-lg w-9 h-9"
            />
          </picture>
          <div className="block leading-tight">
            <Link
              href={`/users/${answer.authorId._id}/${slugify(answer.authorId.username || "anonymous")}`}
              className="text-orange-500 hover:text-orange-600"
            >
              {answer.authorId.username || "Anonymous"}
            </Link>
            <p>
              <strong>{answer.authorId.reputation || 0}</strong>
            </p>
          </div>
        </div>

        {/* Comments */}
        <Comments
          initialComments={answer.comments}
          className="mt-4"
          type="answer"
          typeId={answer._id}
        />
        <hr className="my-4 border-white/40" />
      </div>
    </div>
  );
};

export default Answer;
