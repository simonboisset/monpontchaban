FROM node:18-alpine AS base
 
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@chaban/web --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn install
RUN yarn turbo run build --filter=@chaban/web...
RUN yarn install --production=true --ignore-scripts

FROM base AS runner
RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
COPY --from=installer /app/packages/db/prisma ./prisma
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/web/package.json .
COPY --from=installer /app/apps/web/build ./build
COPY --from=installer /app/apps/web/public ./public

CMD ["yarn", "start"]