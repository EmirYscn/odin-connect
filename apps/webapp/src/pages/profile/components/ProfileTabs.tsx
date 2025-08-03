export type ProfileTabContext = "posts" | "replies" | "media";

type ProfileTabsProps = {
  context: ProfileTabContext;
  setContext: React.Dispatch<React.SetStateAction<ProfileTabContext>>;
};

function ProfileTabs({ context, setContext }: ProfileTabsProps) {
  return (
    <div className="flex justify-center w-full cursor-pointer mb-3 shadow-sm backdrop-blur-sm rounded-md ">
      <div
        onClick={() => setContext("posts")}
        className={`text-center w-full py-2 px-3 border-b ${
          context === "posts"
            ? "border-b-4 border-[var(--color-brand-100)]"
            : "border-gray-400/40"
        } hover:bg-[var(--color-brand-100)]/30 transition-all duration-300 ease-in-out rounded-bl-md rounded-tl-md`}
      >
        <span>Posts</span>
      </div>
      <div
        onClick={() => setContext("replies")}
        className={`text-center w-full py-2 px-3 border-b ${
          context === "replies"
            ? "border-b-4 border-[var(--color-brand-100)]"
            : "border-gray-400/40"
        } hover:bg-[var(--color-brand-100)]/30 transition-all duration-300 ease-in-out`}
      >
        <span>Replies</span>
      </div>
      <div
        onClick={() => setContext("media")}
        className={`text-center w-full py-2 px-3 border-b ${
          context === "media"
            ? "border-b-4 border-[var(--color-brand-100)]"
            : "border-gray-400/40"
        } hover:bg-[var(--color-brand-100)]/30 transition-all duration-300 ease-in-out rounded-br-md rounded-tr-md`}
      >
        <span>Media</span>
      </div>
    </div>
  );
}

export default ProfileTabs;
