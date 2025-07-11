# step 1: build vite frontend with bun
FROM oven/bun:1.1 AS client

WORKDIR /client
COPY client/ .
RUN bun install
RUN bun run build  # outputs to /client/dist

# step 2: build fastapi app
FROM python:3.11-slim AS server

# install deps
WORKDIR /app
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend and frontend build
COPY server/ .
COPY --from=client /client/dist/ ./static/

# expose and run
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]