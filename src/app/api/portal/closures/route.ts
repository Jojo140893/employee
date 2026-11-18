import { NextResponse } from "next/server";
import { DatabaseStore, ClosureDealRecord } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    let deals = DatabaseStore.getClosureDeals();

    if (stage && stage !== "ALL") {
      deals = deals.filter((d) => d.stage === stage);
    }

    const totalPipelineValue = deals.reduce((acc, d) => acc + d.dealValue, 0);
    const totalCashCollected = deals.reduce((acc, d) => acc + d.cashCollected, 0);
    const closedWonCount = deals.filter((d) => d.stage === "CLOSED_WON" || d.stage === "CONTRACT_SIGNED").length;
    const winRate = deals.length > 0 ? Math.round((closedWonCount / deals.length) * 100) : 0;

    const metrics = {
      totalPipelineValue,
      totalCashCollected,
      closedWonCount,
      winRate,
      dealsCount: deals.length,
      averageDealSize: deals.length > 0 ? Math.round(totalPipelineValue / deals.length) : 0,
    };

    return NextResponse.json({ success: true, metrics, count: deals.length, data: deals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDeal: ClosureDealRecord = {
      id: `deal-${Date.now()}`,
      dealName: body.dealName || `${body.company || "Client"} Deal`,
      clientName: body.clientName,
      company: body.company,
      dealValue: Number(body.dealValue) || 10000,
      cashCollected: Number(body.cashCollected) || 0,
      stage: body.stage || "QUALIFIED",
      closerId: body.closerId || "emp-04",
      closerName: body.closerName || "Aneeqa Nadeem (Closer)",
      setterId: body.setterId || "emp-05",
      setterName: body.setterName || "Zainab Tariq (Setter)",
      closeDate: body.closeDate || new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
      contractUrl: body.contractUrl || "/contracts/standard_agreement.pdf",
      notes: body.notes || "",
    };

    DatabaseStore.addClosureDeal(newDeal);
    return NextResponse.json({ success: true, data: newDeal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, stage, cashCollected } = await request.json();
    const deal = DatabaseStore.getClosureDeals().find((d) => d.id === id);
    if (!deal) {
      return NextResponse.json({ success: false, error: "Deal not found" }, { status: 404 });
    }
    if (stage) deal.stage = stage;
    if (cashCollected !== undefined) deal.cashCollected = Number(cashCollected);

    return NextResponse.json({ success: true, data: deal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
