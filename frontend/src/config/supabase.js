import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://uukspxewtgvhtugfkvdh.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1a3NweGV3dGd2aHR1Z2ZrdmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMTE5MTIsImV4cCI6MjAzMTc4NzkxMn0.JnMGxLbkHgbVeBmqXFq9B7GzVoxwZ3SxpHuw7dzY6Uc"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase;