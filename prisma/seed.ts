import { PrismaClient } from "@prisma/client";
import { encryptVaultData } from "../src/lib/crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DigitalX Solutions Employee CRM & Google Voice Operations Platform...");

  // 1. Create Core Users
  const founder = await prisma.user.upsert({
    where: { email: "jazib@digitalx-solutions.com" },
    update: {},
    create: {
      email: "jazib@digitalx-solutions.com",
      name: "Jazib Shahid",
      role: "SUPER_ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "sofia@digitalx-solutions.com" },
    update: {},
    create: {
      email: "sofia@digitalx-solutions.com",
      name: "Sofia",
      role: "MANAGER",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
  });

  const engineer = await prisma.user.upsert({
    where: { email: "ahsan@digitalx-solutions.com" },
    update: {},
    create: {
      email: "ahsan@digitalx-solutions.com",
      name: "Ahsan Masood",
      role: "AGENT",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: "aneeqa@digitalx-solutions.com" },
    update: {},
    create: {
      email: "aneeqa@digitalx-solutions.com",
      name: "Aneeqa Nadeem",
      role: "AGENT",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  });

  // 2. Create Employee Profiles & Encrypted Vaults
  const employeesData = [
    {
      userId: founder.id,
      code: "DX-1001",
      name: "Jazib Shahid",
      title: "Founder & Super Admin",
      dept: "Executive Leadership",
      email: "jazib@digitalx-solutions.com",
      personalEmail: "jazib.personal@gmail.com",
      phone: "+1 (202) 555-0101",
      address: "Suite 400, Tech Heights, Innovation Way, CA",
      dob: new Date("1993-08-14"),
      blood: "O+",
      emName: "Ayesha Shahid",
      emRel: "Spouse",
      emPhone: "+1 (202) 555-0199",
      ext: "101",
      gvNum: "+12025550198",
      cnic: "42101-9876543-1",
      cnicMask: "***-****-5431",
      bankMask: "JPMorgan Chase •••• •••• 1098",
      bankJson: { bank: "JPMorgan Chase", acc: "987654321098", routing: "021000021" },
    },
    {
      userId: manager.id,
      code: "DX-1002",
      name: "Sofia",
      title: "Operations Manager",
      dept: "Operations & QA",
      email: "sofia@digitalx-solutions.com",
      personalEmail: "sofia.ops@gmail.com",
      phone: "+1 (202) 555-0102",
      address: "Apt 12B, Maple Street, Brooklyn, NY",
      dob: new Date("1995-11-20"),
      blood: "A+",
      emName: "Tariq Malik",
      emRel: "Brother",
      emPhone: "+1 (202) 555-0188",
      ext: "102",
      gvNum: "+12025550142",
      cnic: "35202-1234567-2",
      cnicMask: "***-****-4567",
      bankMask: "Bank of America •••• •••• 2345",
      bankJson: { bank: "Bank of America", acc: "456789012345", routing: "026009593" },
    },
    {
      userId: engineer.id,
      code: "DX-1003",
      name: "Ahsan Masood",
      title: "Automation & SIP Engineer",
      dept: "Telephony Infrastructure",
      email: "ahsan@digitalx-solutions.com",
      personalEmail: "ahsan.sip@outlook.com",
      phone: "+1 (202) 555-0103",
      address: "Flat 4, Silicon Avenue, Austin, TX",
      dob: new Date("1994-03-12"),
      blood: "B+",
      emName: "Bilal Masood",
      emRel: "Father",
      emPhone: "+1 (202) 555-0177",
      ext: "103",
      gvNum: "+12025550155",
      cnic: "61101-7654321-3",
      cnicMask: "***-****-4321",
      bankMask: "Wells Fargo •••• •••• 5432",
      bankJson: { bank: "Wells Fargo", acc: "321098765432", routing: "121000248" },
    },
    {
      userId: sales.id,
      code: "DX-1004",
      name: "Aneeqa Nadeem",
      title: "Sales Executive",
      dept: "Sales & Client Success",
      email: "aneeqa@digitalx-solutions.com",
      personalEmail: "aneeqa.sales@gmail.com",
      phone: "+1 (202) 555-0104",
      address: "77 Park Crest Boulevard, Chicago, IL",
      dob: new Date("1996-07-25"),
      blood: "AB+",
      emName: "Farhan Nadeem",
      emRel: "Spouse",
      emPhone: "+1 (202) 555-0166",
      ext: "104",
      gvNum: "+12025550170",
      cnic: "37405-3344556-4",
      cnicMask: "***-****-4556",
      bankMask: "Citibank N.A. •••• •••• 5678",
      bankJson: { bank: "Citibank N.A.", acc: "789012345678", routing: "021000089" },
    },
  ];

  for (const emp of employeesData) {
    const profile = await prisma.employeeProfile.upsert({
      where: { employeeCode: emp.code },
      update: {},
      create: {
        userId: emp.userId,
        employeeCode: emp.code,
        fullName: emp.name,
        jobTitle: emp.title,
        department: emp.dept,
        employmentStatus: "ACTIVE",
        joiningDate: new Date("2023-01-01"),
        workEmail: emp.email,
        personalEmail: emp.personalEmail,
        personalPhone: emp.phone,
        residentialAddress: emp.address,
        dateOfBirth: emp.dob,
        bloodGroup: emp.blood,
        emergencyContactName: emp.emName,
        emergencyRelationship: emp.emRel,
        emergencyPhone: emp.emPhone,
        sipExtension: emp.ext,
        liveStatus: "AVAILABLE",
      },
    });

    // Vault
    await prisma.employeeSensitiveVault.upsert({
      where: { employeeProfileId: profile.id },
      update: {},
      create: {
        employeeProfileId: profile.id,
        encryptedCnic: encryptVaultData(emp.cnic),
        cnicLastFour: emp.cnicMask,
        encryptedBankDetails: encryptVaultData(JSON.stringify(emp.bankJson)),
        bankAccountLastFour: emp.bankMask,
        idFrontDocumentUrl: `/docs/${emp.code}_id_front.pdf`,
        idBackDocumentUrl: `/docs/${emp.code}_id_back.pdf`,
        employmentAgreementPdfUrl: `/docs/${emp.code}_agreement.pdf`,
      },
    });

    // Google Voice Line
    await prisma.googleVoiceLine.upsert({
      where: { phoneNumber: emp.gvNum },
      update: {},
      create: {
        phoneNumber: emp.gvNum,
        carrier: "Google Voice",
        mode: "SIP_LINK_TRUNK",
        sipTrunkExtension: emp.ext,
        assignedEmployeeId: profile.id,
      },
    });
  }

  // 3. Create Seed Contacts
  const contact = await prisma.contact.upsert({
    where: { phoneNumber: "+14158901234" },
    update: {},
    create: {
      name: "Marcus Vance",
      phoneNumber: "+14158901234",
      email: "marcus.vance@apexcapital.io",
      company: "Apex Capital Partners",
      status: "PROSPECT",
      notes: "High intent lead for Google Voice dual-channel recording setup.",
      tags: JSON.stringify(["Enterprise", "High Priority"]),
    },
  });

  console.log("Database seeded successfully with initial DigitalX Solutions roster!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
