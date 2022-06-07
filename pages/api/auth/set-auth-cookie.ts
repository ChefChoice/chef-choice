import { supabase } from '../../../utils/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

const AuthHandler = (req: NextApiRequest, res: NextApiResponse) => {
  supabase.auth.api.setAuthCookie(req, res);
};

export default AuthHandler;
