import 'next';
import { Session } from 'next-iron-session';

declare module 'next' {
  export interface NextApiRequest {
    session: Session;
  }
}
