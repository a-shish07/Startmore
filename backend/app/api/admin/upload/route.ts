import { NextRequest, NextResponse } from "next/server";
import { storeImage } from "@/lib/image-storage";

/* ==========================================
   UPLOAD IMAGE
   POST /api/admin/upload
========================================== */

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File | null;

    const folder =
      (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select an image.",
        },
        {
          status: 400,
        }
      );
    }

    const image = await storeImage(file, folder);

    return NextResponse.json(
      {
        success: true,

        image,
      },
      {
        status: 201,
      }
    );

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );

  }
}
