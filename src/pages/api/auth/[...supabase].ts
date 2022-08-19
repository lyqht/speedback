import { Database } from '@/types/DatabaseDefinitions';
import { handleAuth } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ``;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ``;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default handleAuth({ logout: { returnTo: `/` } });
