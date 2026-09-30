export const communityDemos = [
  {
    id: 'e313b44a', slug: 'skylark-cafe', title: 'Skylark Cafe', category: 'Cafe', location: 'Seattle, USA',
    creator: 'tosolini', creatorUrl: 'https://superspl.at/user/tosolini',
    description: 'A real cafe captured with an XGRIDS PortalCam.',
    image: 'community/skylark-cafe.webp'
  },
  {
    id: '2380253c', slug: 'modlinek-villa', title: 'Modlinek Villa', category: 'Hospitality', location: 'Poland',
    creator: 'andriishramko', creatorUrl: 'https://superspl.at/user/andriishramko',
    extraCredit: 'https://www.linkedin.com/in/andrii-shramko/',
    description: 'A detailed room scan from a villa and guest accommodation.',
    image: 'community/modlinek-villa.webp'
  },
  {
    id: 'dac6e508', slug: 'pantheon-interior', title: 'The Pantheon Interior', category: 'Heritage', location: 'Rome, Italy',
    creator: 'artfletch', creatorUrl: 'https://superspl.at/user/artfletch',
    description: 'A photographic reconstruction of the historic Roman interior.',
    image: 'community/pantheon-interior.webp'
  },
  {
    id: '04ff1ba2', slug: 'repc-museum', title: 'RE-PC Computer Museum', category: 'Museum', location: 'Seattle, USA',
    creator: 'tosolini', creatorUrl: 'https://superspl.at/user/tosolini',
    description: 'Walk through a collection of vintage computers and electronics.',
    image: 'community/repc-museum.webp'
  },
  {
    id: 'ac397573', slug: 'avoncroft-postmill', title: 'Avoncroft Postmill', category: 'Heritage', location: 'England, UK',
    creator: 'ijenko', creatorUrl: 'https://superspl.at/user/ijenko',
    description: 'A historic windmill captured from aerial imagery.',
    image: 'community/avoncroft-postmill.webp'
  },
  {
    id: '17c8391f', slug: 'olio-cafe', title: 'Olio Cafe & Restaurant', category: 'Hospitality', location: 'Düsseldorf, Germany',
    creator: 'axel-sb', creatorUrl: 'https://superspl.at/user/axel-sb',
    description: 'An interactive cafe and restaurant scan captured with an iPhone.',
    image: 'community/olio-cafe.webp'
  },
  {
    id: 'eed8f458', slug: 'full-apartment', title: 'Full Apartment', category: 'Residential', location: 'Creator showcase',
    creator: 'dima_kuz', creatorUrl: 'https://superspl.at/user/dima_kuz',
    description: 'An apartment scan captured with an iPhone.',
    image: 'community/full-apartment.webp'
  }
];

export const sceneUrl = id => `https://superspl.at/scene/${id}`;
export const embedUrl = id => `https://superspl.at/s?id=${id}`;
