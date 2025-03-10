import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const payload = {
      access_key: process.env.UPBIT_ACCESS_KEY,
      nonce: uuidv4(),
    };

    const token = sign(payload, process.env.UPBIT_SECRET_KEY || "");
    const orders = await fetchOrders();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

async function fetchOrders() {
  const res = await fetch(`${process.env.UPBIT_SERVER_URL}/v1/accounts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sign(
        {
          access_key: process.env.UPBIT_ACCESS_KEY,
          nonce: uuidv4(),
        },
        process.env.UPBIT_SECRET_KEY || ""
      )}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await res.json();
  return data;
}
