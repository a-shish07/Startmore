import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* ==========================================
   GET SINGLE BANNER
   GET /api/admin/banners/:id
========================================== */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bannerId = Number(id);

    /* ==========================================
       VALIDATE ID
    ========================================== */

    if (
      !Number.isInteger(bannerId) ||
      bannerId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Banner ID",
        },
        { status: 400 }
      );
    }


    /* ==========================================
       GET BANNER
    ========================================== */

    const result = await pool.query(
      `
      SELECT
        id,
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_link,
        sort_order,
        status,
        created_at
      FROM hero_banners
      WHERE id = $1
      `,
      [bannerId]
    );


    /* ==========================================
       NOT FOUND
    ========================================== */

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        { status: 404 }
      );
    }


    /* ==========================================
       SUCCESS
    ========================================== */

    return NextResponse.json(
      {
        success: true,
        banner: result.rows[0],
      },
      { status: 200 }
    );

  } catch (error) {

    console.error(
      "GET Banner Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch banner.",
      },
      { status: 500 }
    );
  }
}


/* ==========================================
   UPDATE BANNER
   PUT /api/admin/banners/:id

   IMPORTANT:
   This endpoint expects FormData.
========================================== */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const bannerId = Number(id);


    /* ==========================================
       VALIDATE ID
    ========================================== */

    if (
      !Number.isInteger(bannerId) ||
      bannerId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Banner ID",
        },
        { status: 400 }
      );
    }


    /* ==========================================
       GET EXISTING BANNER
       
       We need this because the user may
       update the banner without selecting
       a new image.
    ========================================== */

    const existingResult =
      await pool.query(
        `
        SELECT
          id,
          image_url
        FROM hero_banners
        WHERE id = $1
        `,
        [bannerId]
      );


    /* ==========================================
       BANNER NOT FOUND
    ========================================== */

    if (
      existingResult.rows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found.",
        },
        { status: 404 }
      );
    }


    const existingImageUrl =
      existingResult.rows[0].image_url;


    /* ==========================================
       READ FORMDATA

       DO NOT USE:
       await req.json()
    ========================================== */

    const formData =
      await req.formData();


    /* ==========================================
       GET TEXT FIELDS
    ========================================== */

    const title =
      formData
        .get("title")
        ?.toString() || "";

    const subtitle =
      formData
        .get("subtitle")
        ?.toString() || "";

    const description =
      formData
        .get("description")
        ?.toString() || "";

    const buttonText =
      formData
        .get("button_text")
        ?.toString() || "";

    const buttonLink =
      formData
        .get("button_link")
        ?.toString() || "";

    const sortOrderValue =
      formData
        .get("sort_order")
        ?.toString() || "1";

    const statusValue =
      formData
        .get("status")
        ?.toString() || "false";


    /* ==========================================
       CONVERT VALUES
    ========================================== */

    const sortOrder =
      Number(sortOrderValue);

    const status =
      statusValue === "true";


    /* ==========================================
       VALIDATE TITLE
    ========================================== */

    if (!title.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Banner title is required.",
        },
        { status: 400 }
      );
    }


    /* ==========================================
       VALIDATE SORT ORDER
    ========================================== */

    if (!Number.isFinite(sortOrder)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid sort order.",
        },
        { status: 400 }
      );
    }


    /* ==========================================
       IMAGE
       
       If user selected a new image,
       formData.get("image") will be File.

       If no new image was selected,
       it will be null.
    ========================================== */

    const image =
      formData.get("image");


    let finalImageUrl =
      existingImageUrl;


    /* ==========================================
       NEW IMAGE SELECTED
    ========================================== */

    if (
      image &&
      image instanceof File &&
      image.size > 0
    ) {

      /*
       * IMPORTANT
       *
       * We upload the new image using
       * your existing upload API.
       */

      const uploadForm =
        new FormData();


      uploadForm.append(
        "image",
        image
      );


      uploadForm.append(
        "folder",
        "banners"
      );


      const uploadResponse =
        await fetch(
          `${req.nextUrl.origin}/api/admin/upload`,
          {
            method: "POST",
            body: uploadForm,
          }
        );


      const uploadData =
        await uploadResponse.json();


      /* ==========================================
         UPLOAD FAILED
      ========================================== */

      if (!uploadResponse.ok) {

        return NextResponse.json(
          {
            success: false,
            message:
              uploadData.message ||
              "Image upload failed.",
          },
          { status: 400 }
        );
      }


      /* ==========================================
         USE NEW IMAGE PATH
      ========================================== */

      finalImageUrl =
        uploadData.image?.id
          ? `/api/images/${uploadData.image.id}`
          : existingImageUrl;
    }


    /* ==========================================
       DEBUG LOG
    ========================================== */

    console.log(
      "UPDATE BANNER:",
      {
        id: bannerId,
        title,
        subtitle,
        description,
        image_url: finalImageUrl,
        button_text: buttonText,
        button_link: buttonLink,
        sort_order: sortOrder,
        status,
      }
    );


    /* ==========================================
       UPDATE DATABASE
    ========================================== */

    const result =
      await pool.query(
        `
        UPDATE hero_banners
        SET
          title = $1,
          subtitle = $2,
          description = $3,
          image_url = $4,
          button_text = $5,
          button_link = $6,
          sort_order = $7,
          status = $8
        WHERE id = $9
        RETURNING *
        `,
        [
          title.trim(),

          subtitle.trim(),

          description.trim(),

          finalImageUrl,

          buttonText.trim(),

          buttonLink.trim(),

          sortOrder,

          status,

          bannerId,
        ]
      );


    /* ==========================================
       CHECK UPDATE
    ========================================== */

    if (
      result.rows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Banner not found.",
        },
        { status: 404 }
      );
    }


    /* ==========================================
       SUCCESS
    ========================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "Banner updated successfully.",

        banner:
          result.rows[0],
      },
      { status: 200 }
    );

  } catch (error: any) {

    console.error(
      "UPDATE Banner Error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to update banner.",
      },
      { status: 500 }
    );
  }
}


/* ==========================================
   DELETE BANNER
   DELETE /api/admin/banners/:id
========================================== */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const bannerId = Number(id);


    /* ==========================================
       VALIDATE ID
    ========================================== */

    if (
      !Number.isInteger(bannerId) ||
      bannerId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Banner ID",
        },
        { status: 400 }
      );
    }


    /* ==========================================
       DELETE
    ========================================== */

    const result =
      await pool.query(
        `
        DELETE FROM hero_banners
        WHERE id = $1
        RETURNING *
        `,
        [bannerId]
      );


    /* ==========================================
       NOT FOUND
    ========================================== */

    if (
      result.rows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Banner not found",
        },
        { status: 404 }
      );
    }


    /* ==========================================
       SUCCESS
    ========================================== */

    return NextResponse.json(
      {
        success: true,
        message:
          "Banner deleted successfully.",
      },
      { status: 200 }
    );

  } catch (error) {

    console.error(
      "DELETE Banner Error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete banner.",
      },
      { status: 500 }
    );
  }
}
