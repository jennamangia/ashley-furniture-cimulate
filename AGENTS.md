## Architecture

- Query copy, customer examples and qualified metrics live in `src/config/accounts/ashley.ts`.
- The root route owns the selection shared by the hero and comparison.
- Preserve the original Ashley and Living Spaces screenshot files and their retailer/query pairings.
- The Shopper Agent is a scripted demonstration using verified Ashley products.

## Development

Use Node 24 and npm 11. Install with `npm ci`. Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:deployment`.
