
import Post from "./post";

const Posts = () => {

  return (
    <>
      {[1, 2, 3, ].map((item, index) => (
        <Post key={index}/>
      ))}
    </>
  );
};

export default Posts;
