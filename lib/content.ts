// All copy here is verified from the live site (cliffsidemotariacademy.com).
// Nothing invented. Fields with no verified value are left out rather than
// filled with placeholder text — see CMS_PENDING notes on the pages that
// reference them (leadership, staff, history, detailed curriculum).
// Once the CMS/Supabase tables exist, this file's exports should be
// replaced by server-side data fetches with the same shape.

export const site = {
  name: 'Cliffside Motari Academy',
  shortName: 'CMA',
  phone: '+254 117 225 220',
  phoneHref: 'tel:+254117225220',
  email: 'info@cliffsidemotariacademy.com',
  location: 'Manga, Nyamira County, Kenya',
  locationNote: 'Next to Sengera Manga High School',
};

export const mission =
  'To build future-ready learners through high-quality education, technology integration, and values-based learning.';

export const vision =
  'To become the leading center of academic excellence and digital innovation in Nyamira and beyond.';

export const whyChooseUs = [
  {
    title: 'Technology-Driven Learning',
    body: 'Every learner works with their own laptop and iPad as part of daily instruction.',
  },
  {
    title: 'Personalized CBE Progression',
    body: 'A competency-based curriculum that meets each learner where they are.',
  },
  {
    title: 'Qualified Teachers',
    body: 'CBE-trained, dedicated educators guiding every stage of learning.',
  },
  {
    title: 'Safe Environment',
    body: 'A secure, supportive setting for every learner on campus.',
  },
  {
    title: 'Modern Facilities',
    body: 'A campus and library built to support research, creativity and exploration.',
  },
  {
    title: 'Character Development',
    body: 'Strong focus on values-based learning alongside academics.',
  },
];

export const learningTools = [
  {
    title: 'Digital Learning Devices',
    body: 'Every student receives a laptop and an iPad for technology-driven learning.',
  },
  {
    title: 'Books & Library',
    body: 'A modern library supporting research, creativity, and academic exploration.',
  },
  {
    title: 'Qualified Teachers',
    body: 'CBE-trained, dedicated, and passionate educators who guide every learner.',
  },
];

export type Program = {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  image: string;
};

export const programs: Program[] = [
  {
    slug: 'kindergarten',
    tag: 'EARLY YEARS',
    title: 'Kindergarten',
    summary: 'The foundation of creativity, confidence, and early learning through guided play.',
    image:
      'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923092-1710643585691412542edb0!_MG_4391.JPG',
  },
  {
    slug: 'pre-primary',
    tag: 'CBE',
    title: 'Pre-Primary (PP1 & PP2)',
    summary: 'Strong development in literacy, numeracy, social skills and digital exposure.',
    image:
      'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923092-38749316169141254c8b50!_MG_4396.JPG',
  },
  {
    slug: 'primary',
    tag: 'CBE',
    title: 'Primary School',
    summary: 'Critical thinking, creativity, teamwork and digital learning across all subjects.',
    image:
      'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923091-40056715569141253ea7ea!_MG_4390.JPG',
  },
  {
    slug: 'junior-high',
    tag: 'ADVANCED CBE',
    title: 'Junior High School',
    summary: 'Preparing young teens for secondary school with strong academic and digital skills.',
    image:
      'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923091-1303314521691412538f154!_MG_4370.JPG',
  },
];

// Real CMA photography from the live site. This now serves only as a
// fallback shown by lib/actions/gallery.ts's getGalleryImages() when the
// `gallery_images` Supabase table is still empty — once photos are
// uploaded via /admin/gallery, those take over automatically.
export const galleryImages: { src: string; alt: string }[] = [
  {
    src: 'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923091-1626326247691412530d03f!_MG_4361.JPG',
    alt: 'Cliffside Motari Academy campus',
  },
  {
    src: 'https://cliffsidemotariacademy.com/uploads/gallery/media/1763226098-9181482306918b1f2b5d2c!_MG_5315.JPG',
    alt: 'Students at Cliffside Motari Academy',
  },
  {
    src: 'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923093-15729198786914125517184!_MG_4404.JPG',
    alt: 'CMA campus life',
  },
  {
    src: 'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923092-38749316169141254c8b50!_MG_4396.JPG',
    alt: 'Pre-primary learners',
  },
  {
    src: 'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923092-1710643585691412542edb0!_MG_4391.JPG',
    alt: 'Kindergarten learners',
  },
  {
    src: 'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923091-40056715569141253ea7ea!_MG_4390.JPG',
    alt: 'Primary school learners',
  },
  {
    src: "https://cliffsidemotariacademy.com/uploads/gallery/media/1741334417-113069947667caa791340ca!WhatsApp Image 2025-03-07 at 10.55.26 AM.jpeg",
    alt: 'CMA community',
  },
  {
    src: 'https://cliffsidemotariacademy.com/uploads/gallery/media/1762923091-1303314521691412538f154!_MG_4370.JPG',
    alt: 'Junior high learners',
  },
  {
    src: "https://cliffsidemotariacademy.com/uploads/gallery/media/1741334839-14368723867caa9379b468!WhatsApp Image 2025-03-07 at 11.02.08 AM.jpeg",
    alt: 'CMA campus life',
  },
  {
    src: "https://cliffsidemotariacademy.com/uploads/gallery/media/1741157072-143042940467c7f2d0eab50!WhatsApp Image 2025-03-05 at 9.34.45 AM.jpeg",
    alt: 'CMA students',
  },
];

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/academics', label: 'Academics' },
  { href: '/news', label: 'News' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];
