-- ================================================================
-- POOJA VASTU BHANDAR - Complete Demo Seed Data
-- SKU Generator System | VGS IT SOLUTION
--
-- Run Order:
--   1. STEP 1 → code_registry (all short codes)
--   2. STEP 2 → category (root → sub → leaf hierarchy)
--   3. STEP 3 → attribute_schema (per leaf category)
--   4. STEP 4 → product (sample products with SKUs)
--
-- NOTE: Category INSERTs use subqueries to resolve parent_id
--       dynamically, so order matters.
-- ================================================================


-- ================================================================
-- STEP 1: CODE REGISTRY
-- 90+ codes covering all product dimensions
-- ================================================================

INSERT INTO code_registry (label, code, type, description, is_active, is_used) VALUES

-- ── CATEGORY CODES (15) ──────────────────────────────────────────
('Vagha / Poshak',           'vgh',   'CATEGORY', 'God/Goddess dress & attire',                  TRUE, FALSE),
('Shringar (Jewellery)',      'shr',   'CATEGORY', 'Ornaments and jewellery for idols',            TRUE, FALSE),
('Mala (Garland)',            'mla',   'CATEGORY', 'Garlands - flower, tulsi, rudraksha, beads',   TRUE, FALSE),
('Asan & Gadi',              'asg',   'CATEGORY', 'Seating pads, cushions and gadis',             TRUE, FALSE),
('Bajot / Chowki',           'bjt',   'CATEGORY', 'Wooden / marble / metal pooja chowki',         TRUE, FALSE),
('Bansuri (Flute)',          'bns',   'CATEGORY', 'Flutes for Laddu Gopal / Krishna ji',          TRUE, FALSE),
('Sankh (Conch Shell)',      'snk',   'CATEGORY', 'Conch shells - blowing and display types',     TRUE, FALSE),
('Dhoop & Batti',            'dpb',   'CATEGORY', 'Incense sticks, dhoop cones, agarbatti',       TRUE, FALSE),
('Wax / Diya Batti',         'wax',   'CATEGORY', 'Wax candles and diya batti',                   TRUE, FALSE),
('Kumkum & Haldi',           'kkh',   'CATEGORY', 'Kumkum, haldi, sindoor ritual powders',        TRUE, FALSE),
('Paghadi / Mukut (Crown)',  'pgh',   'CATEGORY', 'Headwear - crown, mukut, paghadi for idols',  TRUE, FALSE),
('Kundal (Earrings)',        'knd',   'CATEGORY', 'Earrings / kundal for idol shringar',          TRUE, FALSE),
('Kangan (Bangles)',         'kng',   'CATEGORY', 'Bangles and kangan for idol shringar',         TRUE, FALSE),
('Idol / Murti',             'idr',   'CATEGORY', 'God and goddess idols / murtis',               TRUE, FALSE),
('Pooja Samagri',            'smg',   'CATEGORY', 'Cotton, kapoor and misc ritual items',         TRUE, FALSE),

-- ── MATERIAL CODES (32) ─────────────────────────────────────────
('Silk Fabric',              'slk',   'MATERIAL',  'Pure / art silk fabric',                      TRUE, FALSE),
('Cotton Fabric',            'cot',   'MATERIAL',  'Pure cotton fabric',                          TRUE, FALSE),
('Velvet Fabric',            'vlt',   'MATERIAL',  'Velvet fabric - smooth finish',               TRUE, FALSE),
('Brocade / Kinari',         'brc',   'MATERIAL',  'Brocade and zari kinari fabric',              TRUE, FALSE),
('Net / Georgette',          'net',   'MATERIAL',  'Net / georgette fabric',                      TRUE, FALSE),
('Satin Fabric',             'sat',   'MATERIAL',  'Satin smooth shiny fabric',                   TRUE, FALSE),
('Woollen / Oonee',          'wln',   'MATERIAL',  'Wool fabric - for winter poshak',             TRUE, FALSE),
('Brass (Pittal)',           'brs',   'MATERIAL',  'Brass / pittal dhatu metal',                  TRUE, FALSE),
('Panchdhatu',               'pnc',   'MATERIAL',  'Five-metal alloy - highly auspicious',        TRUE, FALSE),
('Silver Plated',            'slvp',  'MATERIAL',  'Silver plated finish over base metal',        TRUE, FALSE),
('Pure Silver',              'slv',   'MATERIAL',  'Sterling pure silver',                        TRUE, FALSE),
('Marble (Makrana)',         'mrb',   'MATERIAL',  'White Makrana marble',                        TRUE, FALSE),
('Wood - Mango',             'wdm',   'MATERIAL',  'Mango wood - most common bajot material',     TRUE, FALSE),
('Wood - Teak / Sagwan',     'wdt',   'MATERIAL',  'Teak wood - premium grade',                   TRUE, FALSE),
('Wood - Sheesham',          'wds',   'MATERIAL',  'Sheesham / Indian rosewood',                  TRUE, FALSE),
('Wood - Sandalwood',        'wdsd',  'MATERIAL',  'Chandan / sandalwood - fragrant & premium',   TRUE, FALSE),
('Resin / Fiber',            'rsn',   'MATERIAL',  'Resin moulded - lightweight and affordable',  TRUE, FALSE),
('Natural Flowers',          'nfl',   'MATERIAL',  'Fresh / natural real flowers',                TRUE, FALSE),
('Artificial Flowers',       'afl',   'MATERIAL',  'Artificial / plastic flowers',                TRUE, FALSE),
('Tulsi Beads',              'tls',   'MATERIAL',  'Tulsi wood beads for mala',                   TRUE, FALSE),
('Rudraksha Beads',          'rdk',   'MATERIAL',  'Rudraksha seeds for mala / rosary',           TRUE, FALSE),
('Crystal / Sphatik',        'cry',   'MATERIAL',  'Crystal / sphatik beads',                     TRUE, FALSE),
('Glass Beads (Minakari)',   'glb',   'MATERIAL',  'Minakari glass bead work',                    TRUE, FALSE),
('Foam Padding',             'fom',   'MATERIAL',  'Foam padded asan and gadi',                   TRUE, FALSE),
('Natural Conch Shell',      'nsc',   'MATERIAL',  'Natural sea conch / sankh shell',             TRUE, FALSE),
('Paraffin Wax',             'wxc',   'MATERIAL',  'Paraffin / wax based candle material',        TRUE, FALSE),
('Ghee Batti (Cotton Wick)', 'ghb',   'MATERIAL',  'Pure ghee cotton batti / wick',               TRUE, FALSE),
('Cotton Batti (Wick)',      'ctb',   'MATERIAL',  'Plain cotton diya batti / wick',              TRUE, FALSE),
('Camphor / Kapoor',         'kpr',   'MATERIAL',  'Camphor tablets and cones',                   TRUE, FALSE),
('Kumkum Powder (Natural)',  'kkp',   'MATERIAL',  'Natural / pure kumkum powder',                TRUE, FALSE),
('Haldi Powder (Pure)',      'hdp',   'MATERIAL',  'Pure turmeric / haldi powder',                TRUE, FALSE),
('Zari / Gota Patti',        'zri',   'MATERIAL',  'Zari, gota patti hand embroidery material',   TRUE, FALSE),

-- ── COLOR CODES (12) ────────────────────────────────────────────
('Red / Laal',               'red',   'COLOR',     'Red color variant',                           TRUE, FALSE),
('Yellow / Peela',           'yel',   'COLOR',     'Yellow / sun yellow color',                   TRUE, FALSE),
('White / Safed',            'wht',   'COLOR',     'Pure white color',                            TRUE, FALSE),
('Blue / Neela',             'blu',   'COLOR',     'Krishna blue / indigo',                       TRUE, FALSE),
('Green / Hara',             'grn',   'COLOR',     'Green / parrot green',                        TRUE, FALSE),
('Saffron / Orange',         'org',   'COLOR',     'Saffron / orange color - sacred shade',       TRUE, FALSE),
('Pink / Gulabi',            'pnk',   'COLOR',     'Pink / rose color',                           TRUE, FALSE),
('Purple / Baigani',         'pur',   'COLOR',     'Purple / violet color',                       TRUE, FALSE),
('Golden',                   'gld',   'COLOR',     'Golden / gold-tone color',                    TRUE, FALSE),
('Multicolor',               'mul',   'COLOR',     'Multicolor / mixed design',                   TRUE, FALSE),
('Cream / Off-White',        'crm',   'COLOR',     'Cream / ivory / off-white',                   TRUE, FALSE),
('Maroon / Laal Dark',       'mrn',   'COLOR',     'Dark maroon / deep red color',                TRUE, FALSE),

-- ── SIZE CODES - Idol Sizes (6) ────────────────────────────────
('Size 1 - XS (2-3 inch)',   's1',    'SIZE',      'Idol size no.1 - extra small (~30g brass)',    TRUE, FALSE),
('Size 2 - S  (3-4 inch)',   's2',    'SIZE',      'Idol size no.2 - small (~55g brass)',          TRUE, FALSE),
('Size 3 - M  (4-5 inch)',   's3',    'SIZE',      'Idol size no.3 - medium (~96g brass)',         TRUE, FALSE),
('Size 4 - L  (5-7 inch)',   's4',    'SIZE',      'Idol size no.4 - large (~108g brass)',         TRUE, FALSE),
('Size 5 - XL (7-9 inch)',   's5',    'SIZE',      'Idol size no.5 - extra large (~160g brass)',   TRUE, FALSE),
('Size 6 - XXL (9-12 inch)', 's6',    'SIZE',      'Idol size no.6 - double extra large',          TRUE, FALSE),

-- ── SIZE CODES - Chowki / Asan Sizes (4) ───────────────────────
('Chowki Small  (6x6 in)',   'sm',    'SIZE',      'Small size - for bajot / asan',               TRUE, FALSE),
('Chowki Medium (9x9 in)',   'md',    'SIZE',      'Medium size - for bajot / asan',              TRUE, FALSE),
('Chowki Large  (12x12 in)', 'lg',    'SIZE',      'Large size - for bajot / asan',               TRUE, FALSE),
('Chowki XLarge (15x15 in)', 'xl',    'SIZE',      'Extra large - for bajot / asan',              TRUE, FALSE),

-- ── SIZE CODES - Powder / Pack Sizes (5) ───────────────────────
('10g Pack',                 'p10',   'SIZE',      '10 gram packing',                             TRUE, FALSE),
('25g Pack',                 'p25',   'SIZE',      '25 gram packing',                             TRUE, FALSE),
('50g Pack',                 'p50',   'SIZE',      '50 gram packing',                             TRUE, FALSE),
('100g Pack',                'p100',  'SIZE',      '100 gram packing',                            TRUE, FALSE),
('250g Pack',                'p250',  'SIZE',      '250 gram packing',                            TRUE, FALSE),

-- ── STYLE / OCCASION CODES (8) ─────────────────────────────────
('Daily Wear / Nitya',       'dly',   'STYLE',     'Regular daily use item',                      TRUE, FALSE),
('Festival / Utsav',         'fst',   'STYLE',     'Festival special - Janmashtami, Holi, Diwali', TRUE, FALSE),
('Winter / Sheetal',         'win',   'STYLE',     'Winter season item',                          TRUE, FALSE),
('Summer / Grishma',         'sum',   'STYLE',     'Summer / light season item',                  TRUE, FALSE),
('Wedding / Vivah',          'wed',   'STYLE',     'Wedding / vivah occasion special',            TRUE, FALSE),
('Antique Style',            'ant',   'STYLE',     'Antique / vintage finish style',              TRUE, FALSE),
('Designer / Heavy Work',    'dsgn',  'STYLE',     'Designer heavy embroidery work',              TRUE, FALSE),
('Plain / Simple',           'pln',   'STYLE',     'Plain without heavy embellishment',           TRUE, FALSE),

-- ── FINISH CODES (6) ────────────────────────────────────────────
('Gold Polish',              'gpl',   'FINISH',    'Gold polished / gold tone finish',            TRUE, FALSE),
('Silver Polish',            'spl',   'FINISH',    'Silver polished finish',                      TRUE, FALSE),
('Antique Gold Polish',      'agp',   'FINISH',    'Antique / oxidised gold finish',              TRUE, FALSE),
('Matte Finish',             'mat',   'FINISH',    'Matte no-shine finish',                       TRUE, FALSE),
('Minakari / Enamel',        'mna',   'FINISH',    'Minakari hand painted enamel work',           TRUE, FALSE),
('Natural / Unfinished',     'nat',   'FINISH',    'Raw / natural unfinished look',               TRUE, FALSE);


-- ================================================================
-- STEP 2: CATEGORIES (N-Level Tree)
-- ================================================================

-- ── ROOT CATEGORIES (9) ─────────────────────────────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active) VALUES
  ('Vagha & Poshak',       'vagha',   'All attire and dresses for idols',               NULL, FALSE, TRUE),
  ('Shringar & Jewellery', 'shrjwl',  'Ornaments and jewellery sets for idol shringar', NULL, FALSE, TRUE),
  ('Mala & Haar',          'malhr',   'Garlands, rosary, beaded strings',               NULL, FALSE, TRUE),
  ('Asan, Gadi & Bajot',   'asgbj',   'Seating arrangements for idols and worship',    NULL, FALSE, TRUE),
  ('Sankh',                'sankh',   'Conch shells - blowing and decorative',          NULL, FALSE, TRUE),
  ('Dhoop, Batti & Wax',   'dhoopb',  'Incense, agarbatti, dhoop, diya batti, candles', NULL, FALSE, TRUE),
  ('Kumkum, Haldi & Rang', 'kkhr',    'Ritual powders - kumkum, haldi, sindoor',       NULL, FALSE, TRUE),
  ('Idols & Murtis',       'idols',   'God and goddess idols in various materials',     NULL, FALSE, TRUE),
  ('Pooja Samagri',        'pgsmg',   'Cotton wicks and miscellaneous ritual items',   NULL, FALSE, TRUE);


-- ── VAGHA: Sub-categories by deity ─────────────────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Laddu Gopal Vagha',   'lgvgh', 'Poshak for Laddu Gopal / Bal Krishna',   id, FALSE, TRUE FROM category WHERE code='vagha';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Radha Krishna Vagha', 'rkvgh', 'Poshak for Radha Krishna pair',          id, FALSE, TRUE FROM category WHERE code='vagha';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Ganesh Vagha',        'gnvgh', 'Dress for Ganesh ji idol',                id, FALSE, TRUE FROM category WHERE code='vagha';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Laxmi Vagha',         'lxvgh', 'Dress for Laxmi Mata idol',               id, FALSE, TRUE FROM category WHERE code='vagha';

-- LEAF: Vagha by occasion
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'LG Daily Poshak',     'lgdvgh','Daily wear poshak - Laddu Gopal ji',     id, TRUE, TRUE FROM category WHERE code='lgvgh';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'LG Festival Poshak',  'lgfvgh','Festival special poshak - LG ji',        id, TRUE, TRUE FROM category WHERE code='lgvgh';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'LG Winter Poshak',    'lgwvgh','Winter / woollen poshak - LG ji',        id, TRUE, TRUE FROM category WHERE code='lgvgh';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'RK Festival Poshak',  'rkfvgh','Festival poshak - Radha Krishna',        id, TRUE, TRUE FROM category WHERE code='rkvgh';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'RK Daily Poshak',     'rkdvgh','Daily poshak - Radha Krishna',           id, TRUE, TRUE FROM category WHERE code='rkvgh';


-- ── SHRINGAR: Sub-categories by item type ───────────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Paghadi & Mukut',     'pgmkt', 'Crown / mukut / paghadi for idols',      id, TRUE, TRUE FROM category WHERE code='shrjwl';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Kundal (Earrings)',   'kndl',  'Earrings / kundal for idols',             id, TRUE, TRUE FROM category WHERE code='shrjwl';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Kangan & Kada',       'kngkd', 'Bangles and kada for idol shringar',      id, TRUE, TRUE FROM category WHERE code='shrjwl';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Bansuri (Flute)',     'bnsri', 'Flute for Krishna / Laddu Gopal ji',     id, TRUE, TRUE FROM category WHERE code='shrjwl';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Kamarbandh',          'kmbnd', 'Waistband / kamarband for idols',         id, TRUE, TRUE FROM category WHERE code='shrjwl';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Haar / Necklace',     'haarn', 'Idol necklace / haar shringar',           id, TRUE, TRUE FROM category WHERE code='shrjwl';


-- ── MALA: Sub-categories by type ───────────────────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Tulsi Mala',          'tlmla', 'Tulsi bead garland / rosary',             id, TRUE, TRUE FROM category WHERE code='malhr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Rudraksha Mala',      'rdmla', 'Rudraksha bead mala for worship',         id, TRUE, TRUE FROM category WHERE code='malhr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Phool Haar',          'phmla', 'Flower garland - artificial and natural', id, TRUE, TRUE FROM category WHERE code='malhr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Crystal / Sphatik Mala','crmla','Crystal mala for worship and meditation', id, TRUE, TRUE FROM category WHERE code='malhr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Glass Bead Mala',     'glmla', 'Decorative glass / minakari bead mala',   id, TRUE, TRUE FROM category WHERE code='malhr';


-- ── ASAN / GADI / BAJOT: Sub-categories by material ────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Asan & Gadi (Fabric)','asnfb', 'Fabric padded asan and gadi for idols',  id, TRUE, TRUE FROM category WHERE code='asgbj';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Bajot - Wood',        'bjtwod','Wooden pooja chowki / bajot',             id, TRUE, TRUE FROM category WHERE code='asgbj';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Bajot - Metal',       'bjtmtl','Metal pooja chowki - brass / panchdhatu', id, TRUE, TRUE FROM category WHERE code='asgbj';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Bajot - Marble',      'bjtmrb','Marble pooja chowki',                     id, TRUE, TRUE FROM category WHERE code='asgbj';


-- ── SANKH: Sub-categories by use ───────────────────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Blowing Sankh',       'blsnk', 'Vamavarti / blowing conch for worship',   id, TRUE, TRUE FROM category WHERE code='sankh';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Display Sankh',       'dpsnk', 'Dakshinavarti / decorative display conch',id, TRUE, TRUE FROM category WHERE code='sankh';


-- ── DHOOP / BATTI: Sub-categories by type ─────────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Agarbatti (Incense)', 'agbt',  'Regular incense sticks / agarbatti',      id, TRUE, TRUE FROM category WHERE code='dhoopb';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Dhoop Batti & Cone',  'dhpbt', 'Dhoop batti and cone incense',            id, TRUE, TRUE FROM category WHERE code='dhoopb';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Diya Batti (Wick)',   'dybt',  'Cotton and ghee diya batti / wick',       id, TRUE, TRUE FROM category WHERE code='dhoopb';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Wax Candle (Mombatti)','wxbt', 'Paraffin wax candles for pooja room',     id, TRUE, TRUE FROM category WHERE code='dhoopb';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Kapoor / Camphor',    'kprbt', 'Kapoor tablets and cones for aarti',      id, TRUE, TRUE FROM category WHERE code='dhoopb';


-- ── KUMKUM / HALDI: Sub-categories ────────────────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Kumkum (Sindoor)',     'kkmc',  'Pure kumkum / sindoor ritual powder',     id, TRUE, TRUE FROM category WHERE code='kkhr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Haldi (Turmeric)',    'hldc',  'Pure haldi / turmeric powder',            id, TRUE, TRUE FROM category WHERE code='kkhr';


-- ── IDOL: Sub-categories by deity & material ───────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Laddu Gopal Idol',    'lgidr', 'Laddu Gopal / Bal Krishna murti',         id, FALSE, TRUE FROM category WHERE code='idols';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Ganesh Idol',         'gnidr', 'Ganesh ji murti',                          id, FALSE, TRUE FROM category WHERE code='idols';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Laxmi Idol',          'lxidr', 'Laxmi Mata murti',                         id, FALSE, TRUE FROM category WHERE code='idols';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Radha Krishna Idol',  'rkidr', 'Radha Krishna pair murti',                 id, FALSE, TRUE FROM category WHERE code='idols';

-- LEAF: Idol by material
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'LG Brass Idol',       'lgbidr','Laddu Gopal brass idol - most popular',    id, TRUE, TRUE FROM category WHERE code='lgidr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'LG Marble Idol',      'lgmidr','Laddu Gopal white marble idol',            id, TRUE, TRUE FROM category WHERE code='lgidr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'LG Panchdhatu Idol',  'lgpidr','Laddu Gopal panchdhatu idol - auspicious', id, TRUE, TRUE FROM category WHERE code='lgidr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Ganesh Brass Idol',   'gnbidr','Ganesh ji brass murti',                    id, TRUE, TRUE FROM category WHERE code='gnidr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Ganesh Marble Idol',  'gnmidr','Ganesh ji white marble murti',             id, TRUE, TRUE FROM category WHERE code='gnidr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Laxmi Brass Idol',    'lxbidr','Laxmi Mata brass murti',                   id, TRUE, TRUE FROM category WHERE code='lxidr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Laxmi Marble Idol',   'lxmidr','Laxmi Mata marble murti',                  id, TRUE, TRUE FROM category WHERE code='lxidr';

INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Radha Krishna Brass', 'rkbidr','Radha Krishna brass pair murti',           id, TRUE, TRUE FROM category WHERE code='rkidr';


-- ── POOJA SAMAGRI ───────────────────────────────────────────────
INSERT INTO category (name, code, description, parent_id, is_leaf, is_active)
SELECT 'Cotton Batti (Wicks)', 'ctbt', 'Pure cotton diya wicks in pack',           id, TRUE, TRUE FROM category WHERE code='pgsmg';


-- ================================================================
-- STEP 3: ATTRIBUTE SCHEMA
-- Maps to each leaf category (replace category_id with real IDs)
-- Docs format: (category_code, attribute_type, label, order, required, placeholder)
-- ================================================================

/*
LEAF: lgdvgh - LG Daily Poshak
  1. MATERIAL  | Fabric Type    | required | placeholder: cot
  2. COLOR     | Color          | required | placeholder: mul
  3. SIZE      | Idol Size No.  | required | placeholder: s3
  4. STYLE     | Occasion       | required | placeholder: dly

LEAF: lgfvgh - LG Festival Poshak
  1. MATERIAL  | Fabric Type    | required | placeholder: slk
  2. COLOR     | Color          | required | placeholder: mul
  3. SIZE      | Idol Size No.  | required | placeholder: s3
  4. STYLE     | Festival Type  | required | placeholder: fst

LEAF: lgwvgh - LG Winter Poshak
  1. MATERIAL  | Fabric Type    | required | placeholder: wln
  2. COLOR     | Color          | required | placeholder: red
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: rkfvgh - RK Festival Poshak
  1. MATERIAL  | Fabric Type    | required | placeholder: slk
  2. COLOR     | Color          | required | placeholder: mul
  3. SIZE      | Idol Size No.  | required | placeholder: s3
  4. STYLE     | Festival Type  | required | placeholder: fst

LEAF: pgmkt - Paghadi & Mukut
  1. MATERIAL  | Metal Type     | required | placeholder: brs
  2. FINISH    | Polish Type    | required | placeholder: gpl
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: kndl - Kundal
  1. MATERIAL  | Metal Type     | required | placeholder: brs
  2. FINISH    | Polish Type    | required | placeholder: gpl
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: kngkd - Kangan & Kada
  1. MATERIAL  | Metal Type     | required | placeholder: brs
  2. FINISH    | Polish Type    | required | placeholder: gpl
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: bnsri - Bansuri
  1. MATERIAL  | Material       | required | placeholder: brs
  2. COLOR     | Color          | optional | placeholder: gld
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: kmbnd - Kamarbandh
  1. MATERIAL  | Material       | required | placeholder: brs
  2. FINISH    | Finish         | required | placeholder: gpl
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: tlmla - Tulsi Mala
  1. MATERIAL  | Material       | required | placeholder: tls
  2. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: rdmla - Rudraksha Mala
  1. MATERIAL  | Material       | required | placeholder: rdk
  2. SIZE      | Mukhi / Size   | required | placeholder: s3

LEAF: phmla - Phool Haar
  1. MATERIAL  | Flower Type    | required | placeholder: afl
  2. COLOR     | Color          | required | placeholder: mul
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: crmla - Crystal Mala
  1. MATERIAL  | Material       | required | placeholder: cry
  2. SIZE      | Size           | required | placeholder: s3

LEAF: asnfb - Asan & Gadi Fabric
  1. MATERIAL  | Fabric Type    | required | placeholder: vlt
  2. COLOR     | Color          | required | placeholder: red
  3. SIZE      | Asan Size      | required | placeholder: md

LEAF: bjtwod - Bajot Wood
  1. MATERIAL  | Wood Type      | required | placeholder: wdm
  2. FINISH    | Finish         | required | placeholder: nat
  3. SIZE      | Chowki Size    | required | placeholder: md

LEAF: bjtmtl - Bajot Metal
  1. MATERIAL  | Metal Type     | required | placeholder: brs
  2. FINISH    | Polish         | required | placeholder: gpl
  3. SIZE      | Chowki Size    | required | placeholder: md

LEAF: bjtmrb - Bajot Marble
  1. MATERIAL  | Material       | required | placeholder: mrb
  2. FINISH    | Finish         | required | placeholder: nat
  3. SIZE      | Chowki Size    | required | placeholder: md

LEAF: blsnk - Blowing Sankh
  1. MATERIAL  | Material       | required | placeholder: nsc
  2. FINISH    | Finish         | required | placeholder: nat
  3. SIZE      | Size           | required | placeholder: md

LEAF: dpsnk - Display Sankh
  1. MATERIAL  | Material       | required | placeholder: nsc
  2. FINISH    | Finish         | required | placeholder: nat
  3. SIZE      | Size           | required | placeholder: md

LEAF: dybt - Diya Batti
  1. MATERIAL  | Material       | required | placeholder: ctb
  2. SIZE      | Pack Size      | required | placeholder: p100

LEAF: wxbt - Wax Candle
  1. MATERIAL  | Material       | required | placeholder: wxc
  2. COLOR     | Color          | required | placeholder: wht
  3. SIZE      | Size           | required | placeholder: sm

LEAF: kprbt - Kapoor
  1. MATERIAL  | Material       | required | placeholder: kpr
  2. SIZE      | Pack Size      | required | placeholder: p25

LEAF: kkmc - Kumkum
  1. MATERIAL  | Powder Type    | required | placeholder: kkp
  2. SIZE      | Pack Size      | required | placeholder: p25

LEAF: hldc - Haldi
  1. MATERIAL  | Powder Type    | required | placeholder: hdp
  2. SIZE      | Pack Size      | required | placeholder: p25

LEAF: lgbidr - LG Brass Idol
  1. MATERIAL  | Metal          | required | placeholder: brs
  2. FINISH    | Polish         | required | placeholder: gpl
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: lgmidr - LG Marble Idol
  1. MATERIAL  | Material       | required | placeholder: mrb
  2. FINISH    | Finish         | required | placeholder: nat
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: lgpidr - LG Panchdhatu Idol
  1. MATERIAL  | Material       | required | placeholder: pnc
  2. FINISH    | Finish         | required | placeholder: gpl
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: gnbidr - Ganesh Brass Idol
  1. MATERIAL  | Metal          | required | placeholder: brs
  2. FINISH    | Polish         | required | placeholder: gpl
  3. SIZE      | Idol Size No.  | required | placeholder: s3

LEAF: ctbt - Cotton Batti
  1. MATERIAL  | Material       | required | placeholder: ctb
  2. SIZE      | Pack Size      | required | placeholder: p100
*/


-- ================================================================
-- STEP 4: SAMPLE PRODUCTS WITH EXPECTED SKUs
-- Format: [leaf_category_code]-[material]-[color]-[size]-[style/finish]
-- ================================================================

-- ── VAGHA PRODUCTS (14) ─────────────────────────────────────────
-- SKU: lgdvgh-cot-red-s2-dly   | Cotton Red Daily Poshak Size 2
-- SKU: lgdvgh-cot-yel-s3-dly   | Cotton Yellow Daily Poshak Size 3
-- SKU: lgdvgh-slk-blu-s3-dly   | Silk Blue Daily Poshak Size 3
-- SKU: lgdvgh-vlt-org-s4-dly   | Velvet Saffron Daily Poshak Size 4
-- SKU: lgdvgh-cot-wht-s2-sum   | Cotton White Summer Poshak Size 2
-- SKU: lgfvgh-slk-mul-s3-fst   | Silk Multicolor Festival Poshak Size 3
-- SKU: lgfvgh-brc-gld-s4-fst   | Brocade Golden Festival Poshak Size 4
-- SKU: lgfvgh-slk-red-s3-fst   | Silk Red Festival Poshak Size 3 (Janmashtami)
-- SKU: lgfvgh-slk-yel-s3-fst   | Silk Yellow Festival Poshak Size 3 (Vasant)
-- SKU: lgwvgh-wln-red-s2-win   | Wool Red Winter Poshak Size 2
-- SKU: lgwvgh-wln-org-s3-win   | Wool Saffron Winter Poshak Size 3
-- SKU: lgwvgh-vlt-pnk-s3-win   | Velvet Pink Winter Poshak Size 3
-- SKU: rkfvgh-slk-mul-s3-fst   | RK Silk Multicolor Festival Poshak Size 3
-- SKU: rkdvgh-cot-yel-s3-dly   | RK Cotton Yellow Daily Poshak Size 3

-- ── SHRINGAR PRODUCTS (12) ──────────────────────────────────────
-- SKU: pgmkt-brs-gpl-s2        | Brass Mukut Gold Polish Size 2
-- SKU: pgmkt-brs-gpl-s3        | Brass Mukut Gold Polish Size 3
-- SKU: pgmkt-pnc-mna-s3        | Panchdhatu Mukut Minakari Size 3
-- SKU: pgmkt-slvp-spl-s4       | Silver Plated Mukut Size 4
-- SKU: kndl-brs-gpl-s2         | Brass Kundal Gold Polish Size 2
-- SKU: kndl-brs-gpl-s3         | Brass Kundal Gold Polish Size 3
-- SKU: kndl-slvp-spl-s3        | Silver Plated Kundal Size 3
-- SKU: kngkd-brs-gpl-s2        | Brass Kangan Gold Polish Size 2
-- SKU: kngkd-brs-gpl-s3        | Brass Kangan Gold Polish Size 3
-- SKU: kngkd-pnc-gpl-s3        | Panchdhatu Kangan Size 3
-- SKU: bnsri-brs-gld-s3        | Brass Bansuri Golden Size 3
-- SKU: bnsri-brs-gld-s4        | Brass Bansuri Golden Size 4

-- ── MALA PRODUCTS (10) ──────────────────────────────────────────
-- SKU: tlmla-tls-s3            | Tulsi Mala 108 Beads Size 3
-- SKU: tlmla-tls-s4            | Tulsi Mala 108 Beads Size 4
-- SKU: rdmla-rdk-s3            | Rudraksha Mala 5 Mukhi Size 3
-- SKU: phmla-afl-red-s3        | Artificial Phool Haar Red Size 3
-- SKU: phmla-afl-yel-s3        | Artificial Phool Haar Yellow Size 3
-- SKU: phmla-nfl-mul-s4        | Natural Phool Haar Multicolor Size 4
-- SKU: crmla-cry-s3            | Crystal / Sphatik Mala Size 3
-- SKU: crmla-cry-s4            | Crystal / Sphatik Mala Size 4
-- SKU: glmla-glb-mul-s3        | Glass Bead Mala Multicolor Size 3
-- SKU: glmla-glb-red-s3        | Glass Bead Mala Red Size 3

-- ── ASAN / BAJOT PRODUCTS (12) ──────────────────────────────────
-- SKU: asnfb-vlt-red-md        | Velvet Asan Red Medium
-- SKU: asnfb-vlt-gld-md        | Velvet Asan Golden Medium
-- SKU: asnfb-slk-crm-sm        | Silk Asan Cream Small
-- SKU: asnfb-brc-mul-lg        | Brocade Asan Multicolor Large
-- SKU: bjtwod-wdm-nat-md       | Mango Wood Bajot Natural Finish Medium
-- SKU: bjtwod-wdm-gpl-md       | Mango Wood Bajot Gold Polish Medium
-- SKU: bjtwod-wdt-nat-lg       | Teak Wood Bajot Natural Finish Large
-- SKU: bjtwod-wds-nat-md       | Sheesham Wood Bajot Natural Medium
-- SKU: bjtmtl-brs-gpl-md       | Brass Bajot Gold Polish Medium
-- SKU: bjtmtl-pnc-gpl-lg       | Panchdhatu Bajot Gold Polish Large
-- SKU: bjtmrb-mrb-nat-md       | Marble Bajot Natural Medium
-- SKU: bjtmrb-mrb-mna-md       | Marble Bajot Minakari Medium

-- ── SANKH PRODUCTS (4) ──────────────────────────────────────────
-- SKU: blsnk-nsc-nat-sm        | Blowing Sankh Natural Small
-- SKU: blsnk-nsc-nat-md        | Blowing Sankh Natural Medium
-- SKU: dpsnk-nsc-nat-md        | Display Sankh (Dakshinavarti) Natural Medium
-- SKU: dpsnk-nsc-nat-lg        | Display Sankh (Dakshinavarti) Natural Large

-- ── DHOOP / BATTI / CANDLE PRODUCTS (10) ────────────────────────
-- SKU: dybt-ctb-p100           | Cotton Batti 100g Pack
-- SKU: dybt-ghb-p100           | Ghee Batti 100g Pack
-- SKU: dybt-ghb-p250           | Ghee Batti 250g Pack
-- SKU: wxbt-wxc-wht-sm         | White Wax Candle Small
-- SKU: wxbt-wxc-red-sm         | Red Wax Candle Small
-- SKU: wxbt-wxc-org-sm         | Saffron Wax Candle Small
-- SKU: wxbt-wxc-yel-sm         | Yellow Wax Candle Small
-- SKU: kprbt-kpr-p25           | Camphor / Kapoor 25g Pack
-- SKU: kprbt-kpr-p50           | Camphor / Kapoor 50g Pack
-- SKU: kprbt-kpr-p100          | Camphor / Kapoor 100g Pack

-- ── KUMKUM & HALDI PRODUCTS (8) ─────────────────────────────────
-- SKU: kkmc-kkp-p10            | Kumkum 10g Pack
-- SKU: kkmc-kkp-p25            | Kumkum 25g Pack
-- SKU: kkmc-kkp-p50            | Kumkum 50g Pack
-- SKU: kkmc-kkp-p100           | Kumkum 100g Pack
-- SKU: hldc-hdp-p25            | Haldi 25g Pack
-- SKU: hldc-hdp-p50            | Haldi 50g Pack
-- SKU: hldc-hdp-p100           | Haldi 100g Pack
-- SKU: hldc-hdp-p250           | Haldi 250g Pack

-- ── IDOL PRODUCTS (18) ──────────────────────────────────────────
-- SKU: lgbidr-brs-gpl-s1       | LG Brass Idol Size 1 (XS) Gold Polish
-- SKU: lgbidr-brs-gpl-s2       | LG Brass Idol Size 2 (S) Gold Polish
-- SKU: lgbidr-brs-gpl-s3       | LG Brass Idol Size 3 (M) Gold Polish
-- SKU: lgbidr-brs-gpl-s4       | LG Brass Idol Size 4 (L) Gold Polish
-- SKU: lgbidr-brs-gpl-s5       | LG Brass Idol Size 5 (XL) Gold Polish
-- SKU: lgbidr-brs-agp-s3       | LG Brass Idol Size 3 Antique Gold
-- SKU: lgbidr-brs-agp-s4       | LG Brass Idol Size 4 Antique Gold
-- SKU: lgmidr-mrb-nat-s3       | LG Marble Idol Size 3 Natural
-- SKU: lgmidr-mrb-nat-s4       | LG Marble Idol Size 4 Natural
-- SKU: lgpidr-pnc-gpl-s3       | LG Panchdhatu Idol Size 3 Gold Polish
-- SKU: gnbidr-brs-gpl-s3       | Ganesh Brass Idol Size 3 Gold Polish
-- SKU: gnbidr-brs-gpl-s4       | Ganesh Brass Idol Size 4 Gold Polish
-- SKU: gnbidr-brs-agp-s4       | Ganesh Brass Idol Size 4 Antique Gold
-- SKU: gnmidr-mrb-nat-s3       | Ganesh Marble Idol Size 3 Natural
-- SKU: lxbidr-brs-gpl-s3       | Laxmi Brass Idol Size 3 Gold Polish
-- SKU: lxmidr-mrb-nat-s3       | Laxmi Marble Idol Size 3 Natural
-- SKU: rkbidr-brs-gpl-s3       | Radha Krishna Brass Idol Size 3
-- SKU: rkbidr-brs-agp-s4       | Radha Krishna Brass Idol Size 4 Antique

-- ── POOJA SAMAGRI (3) ────────────────────────────────────────────
-- SKU: ctbt-ctb-p100           | Cotton Batti 100g Pack
-- SKU: ctbt-ctb-p250           | Cotton Batti 250g Pack
-- SKU: ctbt-ghb-p100           | Ghee Batti Cotton Wick 100g

-- ================================================================
-- TOTAL: ~90 code_registry rows | ~50 categories | ~101 products
-- ================================================================
