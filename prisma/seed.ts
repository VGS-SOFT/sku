import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('\ud83c\udf31 Seeding database...');

  // ── Admin user ────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL    || 'admin@example.com';
  const adminPass  = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  const adminName  = process.env.SEED_ADMIN_NAME     || 'Administrator';
  const rounds     = parseInt(process.env.BCRYPT_ROUNDS || '12');

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash(adminPass, rounds);
    await prisma.user.create({
      data: { email: adminEmail, passwordHash: hash, name: adminName, role: Role.ADMIN },
    });
    console.log('\u2705 Admin created:', adminEmail);
  } else {
    console.log('\u23ed\ufe0f  Admin already exists:', adminEmail);
  }

  // ── Masters ────────────────────────────────────────────────────
  const masters = [
    { name: 'Laddu Gopal ji', code: 'LG',  sortOrder: 10 },
    { name: 'Pooja Samagri',  code: 'PS',  sortOrder: 20 },
    { name: 'Mandir & Decor', code: 'MD',  sortOrder: 30 },
    { name: 'Idols',          code: 'IDL', sortOrder: 40 },
  ];
  const masterMap: Record<string, number> = {};
  for (const m of masters) {
    const rec = await prisma.master.upsert({ where: { code: m.code }, update: {}, create: m });
    masterMap[m.code] = rec.id;
    console.log(`\u2705 Master: ${m.name}`);
  }

  // ── Category helper ────────────────────────────────────────────────
  async function upsertCat(
    name: string, code: string, masterId: number,
    parentId: number | null, parentPath: string | null, depth: number,
  ) {
    const ex = await prisma.category.findFirst({ where: { code, parentId: parentId ?? undefined } });
    if (ex) return ex;
    const c = await prisma.category.create({
      data: { name, code, masterId, parentId, depth, path: '0', sortOrder: 0, isActive: true },
    });
    const path = parentPath ? `${parentPath}.${c.id}` : `${c.id}`;
    return prisma.category.update({ where: { id: c.id }, data: { path } });
  }

  const lgId = masterMap['LG'];
  const vsr = await upsertCat('Vastra & Shringar', 'VSR', lgId, null, null, 0);
  const psk = await upsertCat('Poshak', 'PSK', lgId, vsr.id, vsr.path, 1);
  for (const [n, c] of [['Silk','SLK'],['Cotton','CTN'],['Velvet','VLT'],['Zari','ZRI']])
    await upsertCat(n, c, lgId, psk.id, psk.path, 2);
  for (const [n, c] of [['Kundal','KND'],['Kangan','KNG'],['Mala','MLA'],['Bansuri','BNS'],['Pagdi','PGD']])
    await upsertCat(n, c, lgId, vsr.id, vsr.path, 1);
  for (const [n, c] of [['Singhasan','SNG'],['Jhula','JHL'],['Bajot','BJT'],['Asan','ASN']])
    await upsertCat(n, c, lgId, null, null, 0);
  console.log('\u2705 Categories seeded under LG');

  // ── Variant types & values ──────────────────────────────────────────
  const variantData = [
    { name: 'Material',       sortOrder: 10, values: [['Brass','BRS'],['Silver Plated','SVP'],['Gold Plated','GLP'],['Marble','MRB'],['Resin','RSN'],['Sandalwood','SNW'],['Crystal','CRS'],['Tulsi Wood','TLW'],['Clay','CLY'],['Cotton','CTN'],['Velvet','VLT'],['Silk','SLK'],['Zari','ZRI']] },
    { name: 'Finish / Polish', sortOrder: 20, values: [['Gold Polish','GP'],['Silver Polish','SP'],['Antique','ANT'],['Meenakari','MNK'],['Embroidered','EMB'],['Plain','PLN']] },
    { name: 'Color / Pattern', sortOrder: 30, values: [['Red','RD'],['Yellow','YL'],['Blue','BL'],['Green','GR'],['Pink','PNK'],['Golden','GLD'],['Silver','SLV'],['White','WHT'],['Maroon','MRN'],['Purple','PRP'],['Multicolor','MCL'],['Brown','BRN'],['Orange','ORG'],['Transparent w/ Red Dots','TRD']] },
    { name: 'Occasion',        sortOrder: 40, values: [['Janmashtami','JNM'],['Navratri','NVR'],['Diwali','DWL'],['Daily','DLY'],['Winter','WIN'],['Summer','SUM'],['Holi','HOL'],['Bridal','BRD']] },
    { name: 'Size',            sortOrder: 50, values: [['Size 1','S1'],['Size 2','S2'],['Size 3','S3'],['Size 4','S4'],['Size 5','S5'],['Small','SM'],['Medium','MD'],['Large','LG']] },
    { name: 'Pack / Weight',   sortOrder: 60, values: [['25g','P25G'],['50g','P50G'],['100g','P100G'],['250g','P250G'],['Pack of 5','PK5'],['Pack of 10','PK10'],['Pack of 25','PK25'],['Pack of 100','PK100'],['108 Beads','B108']] },
  ];

  for (const vt of variantData) {
    const type = await prisma.variantType.upsert({
      where: { name: vt.name }, update: {},
      create: { name: vt.name, sortOrder: vt.sortOrder },
    });
    for (let i = 0; i < vt.values.length; i++) {
      const [name, code] = vt.values[i];
      await prisma.variantValue.upsert({
        where: { code_variantTypeId: { code, variantTypeId: type.id } },
        update: {},
        create: { name, code, variantTypeId: type.id, sortOrder: (i + 1) * 10 },
      });
    }
    console.log(`\u2705 Variant: ${vt.name} (${vt.values.length} values)`);
  }

  console.log('\n\ud83c\udf89 Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
