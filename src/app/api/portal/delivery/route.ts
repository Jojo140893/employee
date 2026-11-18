import { NextResponse } from "next/server";
import { DatabaseStore, ProjectDeliveryRecord } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    let projects = DatabaseStore.getProjectDeliveries();

    if (status && status !== "ALL") {
      projects = projects.filter((p) => p.status === status);
    }

    const metrics = {
      totalProjects: projects.length,
      inProgress: projects.filter((p) => p.status === "IN_PROGRESS").length,
      onboarding: projects.filter((p) => p.status === "ONBOARDING").length,
      delivered: projects.filter((p) => p.status === "DELIVERED").length,
      onTrackCount: projects.filter((p) => p.health === "ON_TRACK").length,
      atRiskCount: projects.filter((p) => p.health === "AT_RISK").length,
      avgCsat: 4.9,
    };

    return NextResponse.json({ success: true, metrics, count: projects.length, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProj: ProjectDeliveryRecord = {
      id: `proj-${Date.now()}`,
      projectName: body.projectName,
      clientName: body.clientName,
      company: body.company,
      status: body.status || "ONBOARDING",
      health: body.health || "ON_TRACK",
      progressPercent: 10,
      startDate: new Date().toISOString(),
      targetDeliveryDate: body.targetDeliveryDate || new Date(Date.now() + 14 * 24 * 3600000).toISOString(),
      deliveryLeadId: body.deliveryLeadId || "emp-03",
      deliveryLeadName: body.deliveryLeadName || "Ahsan Masood (Automation Engineer)",
      milestones: [
        { id: "m1", title: "Client Onboarding & Scope Sign-off", completed: true, dueDate: "Week 1" },
        { id: "m2", title: "Infrastructure & Technical Provisioning", completed: false, dueDate: "Week 2" },
        { id: "m3", title: "QA Testing & User Acceptance", completed: false, dueDate: "Week 3" },
        { id: "m4", title: "Final Handover & SLA Sign-off", completed: false, dueDate: "Week 4" },
      ],
      notes: body.notes || "Project initiated via Project Delivery Portal.",
    };

    DatabaseStore.addProjectDelivery(newProj);
    return NextResponse.json({ success: true, data: newProj }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { projectId, milestoneId } = await request.json();
    const updated = DatabaseStore.toggleMilestone(projectId, milestoneId);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
