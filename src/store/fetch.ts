import axios from "axios";
import { API_URL, db } from "../component/utils";
import {
  TPostCardData,
  TPostCardFetch,
  TPostCardFetchWithLiked,
} from "../component/ui/PostCard";

export const fetchMoreInfo = async (token: string) => {
  return await axios({
    url: `${API_URL}/api/signin/user`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return res.data as {
          limit: number;
          uploaded: number;
        };
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchImages = async (
  userId: string,
  indexFiles: Array<TPostCardData>,
  isAuth: boolean,
  query: (records: number) => string
) => {
  const files = await db
    .use({ ns: "test", db: "test" })
    .then(async () => {
      const count = indexFiles.length;
      const original = `select *, (select * from $parent.publicUser) as user, ((select count() from publicUser where ->like->(presignedImage where id=$parent.id) group all) || [{count: 0}]) as like, (select count() from like where in=${userId} and out=$parent.id) as liked from presignedImage order by createdTime, name limit 16 start ${count};`;
      const queryPhrase = isAuth ? original : query(count);
      const images = (
        (await db.query(queryPhrase))[0].result as
          | TPostCardFetch[]
          | TPostCardFetchWithLiked[]
      ).map((el) => {
        let liked = false;
        if (isAuth) {
          if ((el as TPostCardFetchWithLiked).liked.length > 0) {
            liked = true;
          }
        }
        return { ...el, liked };
      });
      return images;
    })
    .catch((err) => {
      console.log(err);
      return [] as Array<TPostCardData>;
    });
  return files as Array<TPostCardData>;
};
