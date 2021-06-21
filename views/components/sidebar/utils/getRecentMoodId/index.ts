import postAPI from 'common/api/postAPI';

const getRecentMoodId = async () => {
  const data = await postAPI.getAllPostsByPage(1);
  if (!data) return 1;

  const { posts } = data;
  if (!posts.length) return 1;

  return posts[0].moodId;
};

export default getRecentMoodId;
