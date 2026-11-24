# Ashley Furniture × Cimulate

Executive microsite illustrating how Salesforce Agentic Commerce Search could support Ashley’s product discovery. The comparison pairs original Ashley Furniture and Living Spaces captures. The Shopper Agent is a scripted demonstration using genuine Ashley product photography.

## Local development

Use Node 24 and npm 11.

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:deployment
```

The deployment check runs the production server locally and verifies that the build retains all eight original screenshots by SHA-256.

## Sources

The layout, technology cards, customer examples, and viewport-triggered conversation were adapted from the supplied [reference implementation at commit 59a3121](https://github.com/jennamangia/american-girl-doll-cimulate/tree/59a3121915e94a05b973d21532e49d2ab51f1c79). The search images come from the supplied Ashley Furniture ZIP.

- Altari Sofa product and [lifestyle photograph](https://images.furnituredealer.net/b/p/a1e18853-5f6b-4575-b42b-6c376b416583/assets/d769a8729ffa4146816783d7af77a860.jpg). [Ashley product page](https://www.ashleyfurniture.com/p/altari_sofa/8721338.html)
- Altari Loveseat [photograph](https://linqcdn.avbportal.com/images/d36b5ecd-067d-4f1c-ba78-437d10df89ea.jpg?h=600). [Ashley product page](https://www.ashleyfurniture.com/p/altari_loveseat/8721335.html)
- Darcy Sofa [photograph](https://levinfurniture.com/cdn/shop/files/f7aadd5c21c155c82e74cd1a36ef06938a772a07_61a604f8-935e-45d2-a7cb-feff5104a8e5.jpg?v=1734627854). [Ashley product page](https://www.ashleyfurniture.com/p/darcy_sofa/7500538.html)
- Mahoney Sofa [Ashley photograph](https://cdn.ashley.com/assets/31004-38.jpg). [Ashley product page](https://www.ashleyfurniture.com/p/mahoney_sofa/3100438.html)
