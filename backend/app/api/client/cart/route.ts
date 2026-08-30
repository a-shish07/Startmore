import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
export async function PUT(req: NextRequest) {
  try { const userId = req.headers.get("x-user-id"); const body = await req.json(); if (!userId || !Array.isArray(body.items)) return NextResponse.json({ success:false, message:"Authenticated cart items are required." }, { status:400 });
    const user = await pool.query("SELECT email FROM users WHERE id=$1", [userId]); if (!user.rows[0]?.email) return NextResponse.json({ success:false, message:"Customer email is required." }, {status:400});
    if (!body.items.length) { await pool.query("UPDATE abandoned_carts SET completed_at=NOW(), updated_at=NOW() WHERE user_id=$1 AND completed_at IS NULL",[userId]); return NextResponse.json({success:true}); }
    await pool.query(`INSERT INTO abandoned_carts(user_id,customer_email,items,updated_at,completed_at) VALUES($1,$2,$3,NOW(),NULL) ON CONFLICT (user_id) WHERE completed_at IS NULL DO UPDATE SET customer_email=EXCLUDED.customer_email,items=EXCLUDED.items,updated_at=NOW()`,[userId,user.rows[0].email,JSON.stringify(body.items)]);
    return NextResponse.json({success:true});
  } catch(error) { console.error("Cart persistence error",error); return NextResponse.json({success:false,message:"Could not save cart."},{status:500}); }
}
