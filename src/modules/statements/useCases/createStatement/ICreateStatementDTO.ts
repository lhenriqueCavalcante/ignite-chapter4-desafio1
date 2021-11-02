import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'received_id' |
  'description' |
  'amount' |
  'type'
>
