
# Node Koa

Koa website on custom subdomain.

## Setup

```
npm i

// to request SSL cert and create Route53 records
up stack plan
up stack apply
```

## Deploy

```
up
```

## Notes

By default Up only gzips responses which are larger than 512 bytes, unless
the response is already compressed by the origin server (your server).
