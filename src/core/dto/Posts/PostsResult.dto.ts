import { PostsData } from "../../entity/PostsData.entity";

export class PostsResultDto {
  constructor(
    public currentPage: number,
    public maxPage: number,
    public postsList: PostsData[]
  ) {}
}
