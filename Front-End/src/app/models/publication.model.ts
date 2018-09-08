import { User } from './user.model';

export class Publication {
  constructor(
    public _id: string,
    public text: string,
    public file: string,
    public created_at: string,
    public user: User
  ) {}
}
