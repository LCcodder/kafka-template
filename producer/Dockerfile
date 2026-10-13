# === Этап 1: Сборка бинарника ===
FROM golang:1.23.6-alpine AS builder

WORKDIR /build

# Скачиваем зависимости (кешируется докером)
COPY go.mod go.sum ./
RUN go mod download

# Копируем код
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main ./cmd/main.go

# === Этап 2: Финальный минимальный образ ===
FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/main .

CMD ["./main"]
