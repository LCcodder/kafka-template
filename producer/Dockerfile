FROM golang:1.23.6-alpine

WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of your app
COPY . .

# Run your app with `go run cmd/main.go`
CMD ["go", "run", "cmd/main.go"]