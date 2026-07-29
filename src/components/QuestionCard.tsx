import React from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import Link from "next/link";
import slugify from "@/utils/slugify";
import convertDateToRelativeTime from "@/utils/relativeTime";

const QuestionCard = ({ ques }: { ques: any }) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border bg-white p-4 shadow-md duration-200 hover:shadow-lg sm:flex-row 
            border-gray-200 dark:border-white/20 dark:bg-gray-900 dark:shadow-none dark:hover:shadow-md"
    >
      <BorderBeam size={height} duration={12} delay={9} />
      <div className="relative shrink-0 text-sm sm:text-right">
        <p>{ques.totalVotes} votes</p>
        <p>{ques.totalAnswers} answers</p>
      </div>
      <div className="relative w-full">
        <Link
          href={`/questions/${ques._id?.toString() || "unknown"}/${slugify(
            ques.title || "untitled"
          )}`}
          className="text-orange-500 duration-200 hover:text-orange-600"
        >
          <h2 className="text-xl font-semibold">{ques.title}</h2>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {ques.tags?.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-lg bg-gray-100 px-2 py-0.5 duration-200 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20"
            >
              #{tag}
            </Link>
          ))}

          <div className="ml-auto flex items-center gap-1">
            <picture>
              <img
                src={ques?.authorId?.profileImg || "/default-avatar.png"}
                alt={ques?.authorId?.username || "Unknown Author"}
                className="rounded-lg w-6 h-6"
              />
            </picture>
            <Link
              href={`/users/${ques.authorId?._id?.toString() || "unknown"}/${slugify(
                ques.authorId?.username || "anonymous"
              )}`}
              className="text-orange-500 hover:text-orange-600"
            >
              {ques.authorId?.username || "Anonymous"}
            </Link>
            <strong>&quot;{ques.authorId?.reputation ?? "N/A"}&quot;</strong>
          </div>

          <span>
            asked {convertDateToRelativeTime(new Date(ques.createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
