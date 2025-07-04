import { type NextRequest, NextResponse } from "next/server";
// import { backupSvg } from "../storage";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  // const nextReqUrl = req.nextUrl;
  // const searchParams = nextReqUrl.searchParams;
  console.log("req.url", req.url);

  try {
    // after(backupSvg(searchParams));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "SVG backup failed", errorMessage: error?.toString() },
      { status: 500 }
    );
  }
}
