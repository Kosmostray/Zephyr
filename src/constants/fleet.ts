import { VehicleSpec } from '../types';

export const vehicleImages: Record<string, string> = {
  "Standard": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/dfyj5emyiaisjgou1fxmedvu?v=1759389843093",
  "Business": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/k9xjbij03csxlt5orlu7veka?v=1759390357228",
  "Luxury": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/a4qhtccckpqtot4p49c2sr42?v=1759390176281",
  "Standard Van": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/ad46vgkfw6cu7e5zgd1c0fj1?v=1759392152829",
  "Business Van": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/bdlnqmk2bpzp7sx7k5qpa3ca?v=1759390205057",
  "Business Van Plus": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/i2yvneq3xe9t2h7865rb0emv?v=1759390217493",
  "Minibus 10 pax": "https://s3.typebot.io/public/workspaces/cm3uh0rsn00043dqso62t0m80/typebots/b1sh10gypk6y8ttbhgoorzkw/blocks/z7xzd6hytaejjjnyupsadvpu/items/ajv5hkm578ixo66moc0mkcvi?v=1759390229893"
};

export const vehicleSpecs: Record<string, VehicleSpec> = {
  "Standard": { model: "Mercedes-Benz CLA / C-Class", capacity: "3 Passengers", luggage: "2 Bags", desc: "Sleek and efficient for city hops." },
  "Business": { model: "Mercedes-Benz E-Class", capacity: "3 Passengers", luggage: "2 Bags", desc: "The executive benchmark of discretion and luxury." },
  "Luxury": { model: "Mercedes-Benz S-Class", capacity: "3 Passengers", luggage: "3 Bags", desc: "First-class travel with extended legroom and privacy." },
  "Standard Van": { model: "Mercedes-Benz Vito", capacity: "6 Passengers", luggage: "6 Bags", desc: "Spacious group travel with pristine comfort." },
  "Business Van": { model: "Mercedes-Benz V-Class", capacity: "7 Passengers", luggage: "7 Bags", desc: "The ultimate lounge on wheels for families & teams." },
  "Business Van Plus": { model: "Mercedes-Benz V-Class Extra Long", capacity: "8 Passengers", luggage: "8 Bags", desc: "Maximum luggage space and supreme seating." },
  "Minibus 10 pax": { model: "Mercedes-Benz Sprinter VIP", capacity: "10 Passengers", luggage: "10 Bags", desc: "Exclusive private transporter for delegations." }
};
