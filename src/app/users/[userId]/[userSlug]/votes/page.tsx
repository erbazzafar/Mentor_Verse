"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";

export default function UserVotes() {
  const { userId, userSlug } = useParams();
  const searchParams = useSearchParams();
  const [votes, setVotes] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 25;
  const voteStatus = searchParams.get("voteStatus");

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/votes/user/${userId}`, {
          params: { page, limit, voteStatus },
        });

        setVotes(response.data.data);
        setTotalVotes(response.data.total);
      } catch (error) {
        console.error("Error fetching votes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [userId, page, voteStatus]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Votes</h1>

      {/* Vote Filter Options */}
      <div className="mb-4 flex justify-between">
        <p>{totalVotes} votes</p>
        <ul className="flex gap-1">
          <li>
            <Link
              href={`/users/${userId}/${userSlug}/votes`}
              className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                !voteStatus ? "bg-white/20" : "hover:bg-white/20"
              }`}
            >
              All
            </Link>
          </li>
          <li>
            <Link
              href={`/users/${userId}/${userSlug}/votes?voteStatus=upvoted`}
              className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                voteStatus === "upvoted" ? "bg-white/20" : "hover:bg-white/20"
              }`}
            >
              Upvotes
            </Link>
          </li>
          <li>
            <Link
              href={`/users/${userId}/${userSlug}/votes?voteStatus=downvoted`}
              className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                voteStatus === "downvoted" ? "bg-white/20" : "hover:bg-white/20"
              }`}
            >
              Downvotes
            </Link>
          </li>
        </ul>
      </div>

      {/* Display Votes */}
      {loading ? (
        <p className="text-gray-500">Loading votes...</p>
      ) : (
        <div className="mb-4 max-w-3xl space-y-6">
          {votes.map((vote) => (
            <div
              key={vote._id}
              className="rounded-xl border border-white/40 p-4 duration-200 hover:bg-white/10"
            >
              <div className="flex">
                <p className="mr-4 shrink-0">{vote.voteStatus}</p>

                {vote.question ? ( // ✅ Check if question exists before accessing its properties
                  <p>
                    <Link
                      href={`/questions/${vote.question._id}/${slugify(vote.question.title)}`}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      {vote.question.title}
                    </Link>
                  </p>
                ) : (
                  <p className="text-red-500">[Question Deleted]</p> // ✅ Show a fallback message
                )}
              </div>

              <p className="text-right text-sm">
                {convertDateToRelativeTime(new Date(vote.createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination total={totalVotes} limit={25} />
    </div>
  );
}
