import DBPool from './config';
import { Post, PagedPosts, PostCountsByMoodId, PostRequestBody } from '../../share/interfaces/post';
import { parseRawData } from '../utils/parseRawData';
import { POSTS_PER_PAGE } from '../../share/constant';

export default class PostService {
  public static async getAllPostsByPage(userId: number, page: number): Promise<PagedPosts> {
    const take = POSTS_PER_PAGE;
    const skip = (page - 1) * POSTS_PER_PAGE;

    const [postsData] = await DBPool.query(
      `select * from post where userId = ? 
       ORDER BY id DESC LIMIT ? OFFSET ?`,
      [userId, take, skip]
    ).catch((err) => {
      console.error(err.message);
      throw new Error();
    });

    const [totalData] = await DBPool.query(`select count(*) as total from post where userId = ?`, [
      userId,
    ]);

    const [data] = parseRawData(totalData);
    data.posts = parseRawData(postsData);

    return data;
  }

  // 기분별 보기
  public static async getPostsByMoodId(
    userId: number,
    moodId: number,
    page: number
  ): Promise<PagedPosts> {
    const take = POSTS_PER_PAGE;
    const skip = (page - 1) * POSTS_PER_PAGE;

    const [postsData] = await DBPool.query(
      `select * from post where userId = ? and moodId = ? 
       ORDER BY id DESC LIMIT ? OFFSET ?`,
      [userId, moodId, take, skip]
    ).catch((err) => {
      console.error(err.message);
      throw new Error();
    });

    const [totalData] = await DBPool.query(
      `select count(*) as total from post where userId = ? and moodId = ?`,
      [userId, moodId]
    );

    const [data] = parseRawData(totalData);
    data.posts = parseRawData(postsData);

    return data;
  }

  // 검색기능
  public static async getPostsByKeyword(
    userId: number,
    keyword: string,
    page: number
  ): Promise<PagedPosts> {
    const take = POSTS_PER_PAGE;
    const skip = (page - 1) * POSTS_PER_PAGE;

    const [postsData] = await DBPool.query(
      `SELECT * FROM post WHERE userId =? and pureContent LIKE '%${keyword}%'
       ORDER BY id DESC LIMIT ? OFFSET ?`,
      [userId, take, skip]
    ).catch((err) => {
      console.error(err.message);
      throw new Error();
    });

    const [totalData] = await DBPool.query(
      `select count(*) as total FROM post WHERE userId =? and pureContent LIKE '%${keyword}%'
    ORDER BY id DESC`,
      userId
    );

    const [data] = parseRawData(totalData);
    data.posts = parseRawData(postsData);

    return data;
  }

  public static async getPostById(userId: number, postId: number): Promise<Post> {
    const [data] = await DBPool.query(`select * from post where id = ? and userId = ? limit 1`, [
      postId,
      userId,
    ]).catch((err) => {
      console.error(err.message);
      throw new Error();
    });

    const [post] = parseRawData(data);
    return post;
  }

  public static async createPost(userId: number, body: PostRequestBody): Promise<Post> {
    const connection = await DBPool.getConnection();
    await connection.beginTransaction();

    return await connection
      .query(`insert into post values (NULL, ?, ?, default, default, ?,?)`, [
        userId,
        body.rawContent,
        body.moodId,
        body.pureContent,
      ])
      .then(async () => {
        const [data] = await connection.query(
          `select * from post where id = (select last_insert_id())`
        );
        await connection.commit();

        const [newPost] = parseRawData(data);
        return newPost;
      })
      .catch(async (err) => {
        await connection.rollback();

        console.log(err.message);
        throw new Error();
      })
      .finally(() => {
        connection.release();
      });
  }

  public static async updatePost(
    userId: number,
    postId: number,
    body: Partial<PostRequestBody>
  ): Promise<Post> {
    const connection = await DBPool.getConnection();
    await connection.beginTransaction();

    const { rawContent, pureContent, moodId } = body;
    const hasContent = rawContent != undefined;
    const hasMoodId = moodId != undefined;

    return await connection
      .query(
        `update post set 
         content = (case when ? THEN ? ELSE content END), 
         moodId = (case when ? THEN ? ELSE moodId END),
         pureContent = (case when ? THEN ? ELSE pureContent END)
        where id = ? and userId = ?`,
        [hasContent, rawContent, hasMoodId, moodId, hasContent, pureContent, postId, userId]
      )
      .then(async () => {
        const [data] = await connection.query(`select * from post where id = ? and userId = ?`, [
          postId,
          userId,
        ]);
        const [post] = parseRawData(data);
        await connection.commit();

        return post;
      })
      .catch(async (err) => {
        console.log(err);
        await connection.rollback();
        throw new Error();
      })
      .finally(() => {
        connection.release();
      });
  }

  public static async deletePost(userId: number, postId: number): Promise<boolean> {
    await DBPool.query(`delete from post where id = ? and userId = ?`, [postId, userId]).catch(
      async (err) => {
        console.log(err.message);
        throw new Error();
      }
    );

    return true;
  }

  // 월별로 기분별 게시글 개수 조회
  public static async getMoodPostCountsByYearMonth(
    userId: number,
    yearMonth: string
  ): Promise<PostCountsByMoodId[]> {
    const [data] = await DBPool.query(
      `SELECT mood.id as moodId, COUNT(p.id) as count FROM 	
      (select id, moodId from post 
		    where userId = ?
        AND DATE_FORMAT(createdAt, '%Y%m') = ?) 
      as p 
      RIGHT JOIN mood 
      ON mood.id = p.moodId
      GROUP BY mood.id;`,
      [userId, yearMonth]
    ).catch((err) => {
      console.error(err.message);
      throw new Error();
    });

    return parseRawData(data);
  }

  public static async getPostsAndCountsByYearMonth(userId: number, yearMonth: string) {
    const [postsData] = await DBPool.query(
      `select * from post 
		    where userId = ?
        AND DATE_FORMAT(createdAt, '%Y%m') = ?`,
      [userId, yearMonth]
    );

    const [countsData] = await DBPool.query(
      `SELECT mood.id as moodId, COUNT(p.id) as count FROM 	
      (select id, moodId from post 
		    where userId = ?
        AND DATE_FORMAT(createdAt, '%Y%m') = ?) 
      as p 
      RIGHT JOIN mood 
      ON mood.id = p.moodId
      GROUP BY mood.id;`,
      [userId, yearMonth]
    );

    const data = {};
    const posts = parseRawData(postsData);
    const counts = parseRawData(countsData);
    data['posts'] = posts;
    data['counts'] = counts;

    return data;
  }
}
