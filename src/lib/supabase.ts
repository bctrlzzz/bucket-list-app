import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // add web functionality supabase needs 

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// create connection
export const supabase = createClient(supabaseUrl, supabasePublishableKey);