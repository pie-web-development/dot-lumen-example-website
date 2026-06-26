export interface Service {
  name: string;
  description: string;
  price: string;
}

export interface Benefit {
  title: string;
  body: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const services: Service[] = [
  {
    name: "Consultație și plan personalizat",
    description:
      "30 de minute pentru evaluare, radiografie panoramică și un plan scris pe care îl primești acasă.",
    price: "150 RON",
  },
  {
    name: "Igienizare profesională",
    description:
      "Detartraj cu ultrasunete, airflow și fluorizare. Fără disconfort, fără grabă.",
    price: "250 RON",
  },
  {
    name: "Albire profesională",
    description:
      "Albire în cabinet cu protocol german, două ședințe, rezultat de durată.",
    price: "1.200 RON",
  },
  {
    name: "Implant dentar",
    description:
      "Implanturi premium cu garanție pe viață a fixturii. Ghidare digitală pentru precizie.",
    price: "de la 3.500 RON",
  },
  {
    name: "Stomatologie pediatrică",
    description:
      "Programări dedicate pentru copii, într-un ritm pe care îl pot duce.",
    price: "",
  },
];

export const benefits: Benefit[] = [
  {
    title: "Aceeași echipă la fiecare vizită",
    body: "Fără rotație de medici. Vei cunoaște persoanele care îți vor face tratamentul și vei reveni la ele.",
  },
  {
    title: "Plan scris, costuri clare, înainte",
    body: "Primești acasă planul de tratament cu prețurile defalcate. Nimic nu apare pe parcurs, fără să fi fost discutat.",
  },
  {
    title: "Programări la oră fixă",
    body: "Dacă întârziem noi, ședința este din partea noastră. Timpul tău contează la fel de mult ca al nostru.",
  },
  {
    title: "Tehnologie 3D pentru diagnostic",
    body: "Radiografie panoramică digitală și ghidare 3D pentru implantologie, pentru precizie reală nu reclamă.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Prima dată într-un cabinet stomatologic unde nu m-am simțit grăbită. Dr. Pop mi-a explicat fiecare pas și am plătit exact cât scria pe plan.",
    name: "Ioana M.",
    role: "Pacient din 2022",
  },
  {
    quote:
      "Am venit cu copilul de 6 ani panicat. Am plecat cu el cerând să mai vină. Asta spune tot.",
    name: "Andrei T.",
    role: "Tată, pacient de 3 ani",
  },
  {
    quote:
      "Implantul făcut aici în 2021 nu mi-a dat niciun fir de bătaie de cap. Recomand cu încredere.",
    name: "Maria D.",
    role: "",
  },
];

export const site = {
  name: "Cabinet Dental Lumen",
  phone: "+40 364 123 456",
  phoneHref: "tel:+40364123456",
  email: "salut@dentallumen.ro",
  emailHref: "mailto:salut@dentallumen.ro",
  address: "Strada Avram Iancu 14, Cluj-Napoca",
  hoursLines: ["Luni - Vineri 9:00 - 19:00", "Sâmbătă 10:00 - 14:00", "Duminică închis"],
  socials: {
    instagram: "https://instagram.com/dentallumen",
    facebook: "https://facebook.com/dentallumen",
  },
  images: {
    hero: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=80&auto=format&fit=crop",
    atmosphere: "https://picsum.photos/seed/lumen-atmosphere/1200/1400?grayscale",
    serviciiHero: "https://picsum.photos/seed/lumen-servicii/1200/1400?grayscale",
    despreHero: "https://picsum.photos/seed/lumen-despre/1200/1400?grayscale",
    despreInterior: "https://picsum.photos/seed/lumen-interior/1200/1000?grayscale",
    contactExterior: "https://picsum.photos/seed/lumen-exterior/1200/900?grayscale",
    finalCta: "https://picsum.photos/seed/lumen-cta/1600/900?grayscale",
  },
};
