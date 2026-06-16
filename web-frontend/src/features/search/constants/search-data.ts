import { SearchResultEvent } from "../types/search";

export const MOCK_SEARCH_EVENTS: SearchResultEvent[] = [
  {
    id: "london-t20-cup-finals",
    title: "London T20 Cup: Finals",
    category: "Sports",
    price: 85,
    priceText: "$85",
    date: "2026-10-12T14:00:00.000Z", // Saturday
    dateText: "Sat, Oct 12 • 14:00",
    location: "Lord's Stadium, London",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAC8ZkBwl8LP9J01jSKQSyIw3AxB2PnkkS-Pnk40XRsmLtGPnGqL_flG6veKYzuK3kjbsuUBoxrkpvA503q8U0Bw3oqH08srdNvUR8AeTcDEndx3QoxBBjkNVuaCCja0UT5Fem_5G8ZYHYaeMZfFEaQPrkaNulBZpWokS71bj8XGkYid32PXANMsR8Nha8ZJsrs_si6LiAF7AXJ7xtP1rQGJig4Mw77Wq8sm9ejOmZEufFTavhWJOPzCWDm6he7Iwf0RxubX7d2EUJO",
    imageAlt: "A wide-angle cinematic shot of a professional cricket match at dusk",
    venue: "Lord's Stadium",
  },
  {
    id: "charity-invitational",
    title: "Charity Invitational",
    category: "Sports",
    price: 45,
    priceText: "$45",
    date: "2026-10-13T10:00:00.000Z", // Sunday
    dateText: "Sun, Oct 13 • 10:00",
    location: "The Oval, London",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW2sijr2gwFk4CpEkSihEjHeSoMsxAiiLQgt-v1ewfLyLT53x5WJmPdMYXXoTeLFV5s107B4fF-lMT5MFqJUjOTPGwUAB4w72dWXA4Lr9XGgWMMr_9Vsl_jK3XQLNQ7lDyq036GSk-AD_WkWDhhgrdm4Xy4Nu6rlHj4ZJNDdwRAGUgDYinK_HuzcAD6rw2I3Rm8asvDDcbrvau1DjGYdj3oYRT3jYZ-oLsOVJH3rqfNysAWrCRrRKSsiS6iWVTyuD4fVc4PRXsxZLr",
    imageAlt: "A high-intensity action shot of a cricket bowler delivering the ball on a sunny day",
    venue: "The Oval",
  },
  {
    id: "under-19-regionals",
    title: "Under-19 Regionals",
    category: "Sports",
    price: 0,
    priceText: "Free",
    date: "2026-10-14T09:00:00.000Z", // Monday
    dateText: "Mon, Oct 14 • 09:00",
    location: "Crystal Palace Park",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUMku4nmG38MumxZlVI2hBB1yO2reBecAwokiP4GGLOEoNXgA7_bG4dw3vlpDHuTeiCZ-F-cb-U3YF81HZUGhbj-m4tmfmveQdaBUiGCF_NJDHdSq7eXoxsGnazrse-C5_W1VMbdfwHagqQlLKeK5MsfWJsfssMsqK0XTpL4GxbHCCGjpNgxMMgefnZHylwKJe1iSSuK4OrLbnqzFB9khkCZKr6hi3kPonC_b6gNqJYqTyo8iDoNuYEDCWySoqAikRiYDQ5qV0cYog",
    imageAlt: "An artistic close-up of a red leather cricket ball resting on a pristine grass field",
    venue: "Crystal Palace Park",
  },
  {
    id: "masterclass-with-pros",
    title: "Masterclass with Pros",
    category: "Training",
    price: 120,
    priceText: "$120",
    date: "2026-10-16T18:00:00.000Z", // Wednesday
    dateText: "Wed, Oct 16 • 18:00",
    location: "Elite Sports Hub",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyMbGSh48Z2sNdmbFZKLlZx619HDZbul65UsXLxGC6LvS3tp5hpxLWkKypRwsC4oQq4bIoRRwWTfbQvZRPliKbyunl3m3t-2FH33qK1PGifCXv2FiW1hg6MwKcg25i3XU9WNdnMVYPytgGFZ69wctLZjXlDPPYWuqPB3SuHkZ82t54mRwdEnHauePU3ErYNqNJyA8FluZNy2jYQfAfa2OXVDmZ_4tiukhwVYZ6JeIJd6LR59fgFxMFPL5BwnqHgcB8VQu-frHixEni",
    imageAlt: "An interior view of a modern cricket training academy with high-tech equipment",
    venue: "Elite Sports Hub",
  },
  {
    id: "summer-symphony-concert",
    title: "Summer Symphony Concert",
    category: "Music",
    price: 150,
    priceText: "$150",
    date: "2026-10-12T19:30:00.000Z", // Saturday (Today)
    dateText: "Sat, Oct 12 • 19:30",
    location: "Royal Albert Hall, London",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEK_8V0Y1KP18N9Nd9esHPhsQRaU5jCOWA6GpnVXU6uyueSnwAZM3JzuIogmZMvGMEK3SIuaN-pDaFrhSyQquu15k5VDiqWWTqzWJFXXJsJCZW2VW1tFnn-OzSVTyzNRBsHakSbXG-P1IuqquLL_fjX5iqsfFUWwvS4TiQTJXuf8e-hTTxT9lzzwGQn0EIW5PMHVwYQz7AzmUkQcGiwifypk0Mddbn5U3mlCNT_Q33fA9du7-hP-kYflCycHkFiVchfYYm6SjRxWL1",
    imageAlt: "A high-energy concert stage with laser light shows and a silhouetted crowd",
    venue: "The Oval",
  },
  {
    id: "street-food-carnival",
    title: "Street Food Carnival",
    category: "Food",
    price: 15,
    priceText: "$15",
    date: "2026-10-13T11:00:00.000Z", // Sunday (Tomorrow)
    dateText: "Sun, Oct 13 • 11:00",
    location: "Old Trafford, Manchester",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTlCSpjYjo-sE5uDzeRUsy3o2b2vNXCPTykT2X_6GSFF_g_tx1pu2VCHntZYoCEwjncsHXiCYaiqfXdACaHYfVHc3VUZVgKhoqjYHWe9cNKPpxdrjuSkXmF25wvasSf7YZZ0SxKY36-7yRIPl-oCjcbZIQx_0lGW7zay6J1Ay9QSYk98Q2S5o2CqkhJmeyEHkMGaxc9e5uukDyoxUe52yaCBZ0v6jcbhCsBsbtoawZeINpcqaPflZPM7anuO1L3b0-ROg3NIr8kwK7",
    imageAlt: "Brightly lit modern watch lounge with display tables and food options",
    venue: "Old Trafford",
  },
  {
    id: "modern-art-exposition",
    title: "Modern Art Exposition",
    category: "Arts",
    price: 25,
    priceText: "$25",
    date: "2026-10-15T10:00:00.000Z", // Next Tuesday
    dateText: "Tue, Oct 15 • 10:00",
    location: "Tate Modern, London",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH3lDCi6ayOv_CehPERnXuuYlwZg9YxjwNkK9FioVK3XIhcTreIMSPSx5Ny6IhtMS8xVKtm50iNaBasltFSxqC8P8qGHztULPnudemU9OyrUyiCcrk648j-7hmwdA_ozXcFoycjaCpCvMfCLMiJ_N35eFAKO1ARxIFMkELWeKOW75H-Bp7LwYeLzPJ9EyoZW1N9e79qubbEjiipNjFLk0v8UpSp-vppUoa9LBPn9Cyce3riF1sHxYpVTOWP5bFdpFWoUDXYmI97fS1",
    imageAlt: "A traditional plush cinema theater interior with low atmospheric lighting",
    venue: "Lord's Stadium",
  },
  {
    id: "wembley-stadium-rock-night",
    title: "Wembley Stadium Rock Night",
    category: "Music",
    price: 180,
    priceText: "$180",
    date: "2026-10-12T20:00:00.000Z", // Saturday (Today)
    dateText: "Sat, Oct 12 • 20:00",
    location: "Wembley Stadium, London",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEK_8V0Y1KP18N9Nd9esHPhsQRaU5jCOWA6GpnVXU6uyueSnwAZM3JzuIogmZMvGMEK3SIuaN-pDaFrhSyQquu15k5VDiqWWTqzWJFXXJsJCZW2VW1tFnn-OzSVTyzNRBsHakSbXG-P1IuqquLL_fjX5iqsfFUWwvS4TiQTJXuf8e-hTTxT9lzzwGQn0EIW5PMHVwYQz7AzmUkQcGiwifypk0Mddbn5U3mlCNT_Q33fA9du7-hP-kYflCycHkFiVchfYYm6SjRxWL1",
    imageAlt: "Laser light shows in vibrant purple and blue with silhouetted crowds",
    venue: "The Oval",
  }
];
