# 🚚 Rate Integration Service

A **carrier-agnostic shipping rate integration service** built with **TypeScript**, **Express**, and **Clean Architecture principles**.

This service fetches shipping rates from external carriers (currently **UPS**, with **FedEx, DHL, USPS** easily pluggable) while keeping **business logic fully isolated from third‑party APIs**.

---

## ✨ Key Features

* **Carrier-agnostic design** (UPS now, FedEx later without refactors)
* **Clean Architecture** with strict separation of concerns
* **Strong TypeScript typing + runtime validation**
* **OAuth 2.0 token lifecycle management**
* **Structured, retry-aware error handling**
* **Stubbed integration tests (no real API keys needed)**
* **Production-ready extensibility**

---

## 🏗️ Architecture Overview

The system is designed to be **open for extension, closed for modification**.

```
Controller → Service → Carrier Interface → Infrastructure (UPS/FedEx)
```

Each layer has a **single responsibility** and does not leak implementation details upward.

---

## 📁 Project Structure

```
src/
 ├─ domain/
 │   ├─ Core business models
 │   ├─ Carrier contracts & enums
 │   ├─ Rate request / response models
 │   └─ Custom error definitions
 │
 ├─ services/
 │   ├─ Application-level business logic
 │   ├─ Orchestrates rate fetching
 │   └─ Depends only on domain interfaces
 │
 ├─ infra/
 │   ├─ Carrier implementations (UPS)
 │   ├─ OAuth clients
 │   ├─ HTTP clients
 │   └─ Request builders & response parsers
 │
 ├─ factory/
 │   └─ CarrierFactory (UPS, FedEx, etc.)
 │
 ├─ controller/
 │   └─ API controllers (no business logic)
 │
 ├─ routes/
 │   └─ Express route definitions
 │
 └─ tests/
     ├─ Integration tests
     └─ Error-handling scenarios
```

---

## 🧠 Design Principles

* **Domain-first**: Business logic is independent of frameworks and vendors
* **Dependency inversion**: Services depend on interfaces, not implementations
* **Explicit boundaries**: No UPS logic leaks into controllers or services
* **Testability**: All external calls are stubbed in tests

---

## 🔐 Authentication

* Uses **OAuth 2.0 Client Credentials flow**
* Access tokens are:

  * Cached in memory
  * Reused until expiry
  * Automatically refreshed
* Authentication is **transparent to callers**

---

## ⚠️ Error Handling

All carrier failures are wrapped in a unified `CarrierError`.

### Error Classification

* `AUTH_FAILED`
* `NETWORK_ERROR`
* `RATE_LIMITED`
* `MALFORMED_RESPONSE`
* `VALIDATION_ERROR`

Each error explicitly defines:

* **Carrier source** (UPS, FedEx, etc.)
* **Retryability**
* **HTTP status mapping**

A **central Express error handler** converts domain errors into API responses.

---

## 🧪 Testing Strategy

This project uses **stubbed API responses** — no real UPS credentials are required.

### Integration Tests Cover

* Rate request payload construction
* UPS OAuth token acquisition & reuse
* Token refresh on expiry
* Successful rate normalization
* 4xx / 5xx error handling
* Network timeouts
* Malformed API responses

Tests validate **end-to-end logic**, not just units.

---

## ➕ Adding a New Carrier (Example: FedEx)

To add a new carrier, **no existing services or controllers need to change**.

### Steps

1. Implement the `Carrier` interface in `infra/carrier/fedex`
2. Add FedEx OAuth + HTTP client
3. Create request builders & response parsers
4. Register FedEx in `CarrierFactory`
5. Add integration tests for FedEx

This keeps the system **scalable and maintainable**.

---

## 🔧 Environment Setup

Create a `.env` file or rely on `.env.example` for local development.

```
NODE_ENV=development
PORT=3000

UPS_CLIENT_ID=
UPS_CLIENT_SECRET=
UPS_OAUTH_URL=https://onlinetools.ups.com/security/v1/oauth/token
UPS_API_BASE_URL=https://onlinetools.ups.com/api
```

---

## ▶️ Running the Project

```bash
npm install
npm run dev
```

Run tests:

```bash
npm test
```

---

## 🚀 Future Improvements

* Persistent token caching (Redis)
* Circuit breakers & retries
* Additional carriers (FedEx, DHL, USPS)
* Rate comparison & optimization
* Metrics & tracing

---

## 📌 Summary

This project demonstrates:

* Clean, extensible architecture
* Strong domain modeling
* Production-grade error handling
* Testable integrations without real APIs

It is designed to **scale with new carriers and features** without increasing complexity.

---

**Built with maintainability, clarity, and real-world shipping systems in mind.**
