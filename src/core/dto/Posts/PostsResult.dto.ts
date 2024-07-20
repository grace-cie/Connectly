import { PostsDto } from "./Posts.dto";

export class PostsResultDto {
  constructor(
    public currentPage: number,
    public maxPage: number,
    public postsList: PostsDto[]
  ) {}
}
