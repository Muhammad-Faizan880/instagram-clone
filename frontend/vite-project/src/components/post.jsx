import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, X } from "lucide-react";

const Post = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleOpenAllComments = (e) => {
    setCommentsOpen(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between items-center pt-8">
        <div className="flex justify-start items-center">
          <div className="bg-gray-200 rounded-full w-[40px] h-[40px] flex justify-center items-center">
            MF
          </div>
          <div>username</div>
        </div>

        <div
          className="cursor-pointer text-xl font-bold"
          onClick={() => setIsOpen(true)}
        >
          ...
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              <ul className="flex flex-col items-center gap-3 mt-3">
                <li className="border border-transparent hover:border-black text-red-600 px-4 py-2 w-fit text-center rounded-md cursor-pointer">
                  Unfollow
                </li>
                <li className="hover:bg-gray-200 px-4 py-2 w-fit text-center rounded-md cursor-pointer">
                  Add to favourites
                </li>
                <li className="hover:bg-gray-200 px-4 py-2 w-fit text-center rounded-md cursor-pointer">
                  Delete
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <img
        src="https://images.unsplash.com/photo-1748015879337-ef95556c3749?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="post-images"
        className="pt-3 aspect-square object-cover w-full"
      />

      <div className="flex justify-between pb-1">
        <div className="flex items-center space-x-4 pt-3">
          <Heart className="w-6 h-6 cursor-pointer" />
          <MessageCircle className="w-6 h-6 cursor-pointer " />
          <Send className="w-6 h-6 cursor-pointer" />
        </div>
        <Bookmark className="w-6 h-6  cursor-pointer mt-3" />
      </div>
      <span className="text-sm font-medium">1k likes</span>

      <p className="pb-2 pt-2">
        <span className="font-medium">username</span> caption
      </p>

      <div onClick={() => setCommentsOpen(true)}>
        <p className="pb-3 text-xs text-gray-500 font-bold">
          View all comments
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Add a comment"
          value={text}
          onChange={handleChange}
          className="outline-none text-sm flex-1"
        />
        <button
          disabled={!text.trim()}
          className={`text-sm font-medium ${
            text.trim() ? "text-blue-500" : "text-gray-400 cursor-default"
          }`}
        >
          Post
        </button>
      </div>

      {commentsOpen && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setCommentsOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
              hjghhjhgkj
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Post;
