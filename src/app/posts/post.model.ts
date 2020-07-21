import { Comment } from './../comments/comment.model';
import { Rating } from "./rating.model";

export interface Post {
  id: string;
  description: string;
  imagePath: string;
  creator: string;
  tags: string[];
  dateTaken: string;
  location: string;
  comments?: Comment[];
  ratings?: Rating[];
}
