# 🎟️ Microservice Ticket Booking System
VERSION 1.0

A cloud-native event ticket booking platform built using **Spring Boot Microservices**, **Spring Cloud**, **Kafka**, **PostgreSQL**, and **Next.js**.

The system is designed with scalability, fault tolerance, and domain-driven microservice architecture.

---

# Features

## User Services

* User registration and login (will shift this to Identity Provider in later versions)
* JWT authentication
* Role-based authorization
* Profile management

## Event Services

* Create and update events
* Event categories and metadata
* Multiple event sessions
* Create venues, Venue sections, Seat (Venue Management in later versions)
* Seat map support
* Seat availability tracking

## Booking Services

* Ticket reservation
* Seat locking (Database-driven, will shift to Redis in later versions)
* Booking confirmation
* Booking cancellation

## Payment Services

* Razorpay integration
* Payment verification
* Webhook support

## Notification Services

* Email notifications
* Booking confirmations
* Payment status notifications

## API Gateway

* Single entry point
* Authentication filter
* Routing to services
* CORS support

## Service Discovery (Eureka Service)

* Eureka server
* Dynamic registration
* Load balancing

## Configuration Management (Config Server)

* Centralized configuration
* Git-backed Config Server
* Environment-specific properties

---

# Architecture

```text
Client (Next.js)
        |
        ▼
+----------------+          +-----------------------+
| API Gateway    |   --->   | Eureka Discovery      |
+----------------+          +-----------------------+
        |
        ▼
---------------------------------------------         +----------------+
|         |          |         |            |         | config-server  |
▼         ▼          ▼         ▼            ▼         +----------------+

User     Event     Booking   Payment    Notification   
Service  Service   Service   Service      Service     
```

---

# Microservices

| Service              | Description                        |
| -------------------- | ---------------------------------- |
| API Gateway          | Entry point for all requests       |
| Discovery Service    | Eureka server                      |
| Config Server        | Centralized configuration          |
| User Service         | Authentication and user management |
| Event Service        | Event and venue management         |
| Booking Service      | Ticket reservations                |
| Payment Service      | Payment processing                 |
| Notification Service | Email notifications                |

---

# Tech Stack

## Backend

* Java 25
* Spring Boot 4
* Spring Cloud
* Spring Security
* Spring Data JPA
* Hibernate
* Kafka
* PostgreSQL
* OpenFeign
* Maven / Gradle
* Lombok

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Shadcn UI
* TanStack Query
* Axios
* Zustand

## Infrastructure

* Docker
* Docker Compose
* Kafka
* Zookeeper
* Eureka
* Config Server
* Google Jib

---

# 📂 Project Structure

```text
DistributedTicketBookingSystem
│
├── gateway-server
├── eureka-service
├── config-server
├── user-service
├── event-service
├── booking-service
├── payment-service
├── notification-service
├── web-frontend
├── docker-compose
└── README.md
```

---

# Prerequisites

Install:

* Java 25+
* Maven
* Node.js
* PostgreSQL
* Docker
* Docker Compose
* Git

---

# Running the Project

## 1. Clone Repository

```bash
git clone https://github.com/1820ANKIT2029/DistributedTicketBookingSystem.git

cd DistributedTicketBookingSystem
```

---

## 2. Start Infrastructure

```bash
docker compose up -d
```

Starts:

* Redis
* Kafka
* Zookeeper

---

## 3. Start Config Server

```bash
cd config-server

mvn spring-boot:run
```

---

## 4. Start Discovery Service

```bash
cd gateway-server

mvn spring-boot:run
```

---

## 5. Start Backend Services

Start each service:

```bash
user-service
event-service
booking-service
payment-service
notification-service
```

Example:

```bash
cd user-service

mvn spring-boot:run
```

---

## 6. Start Frontend

```bash
cd web-frontend
docker build -t frontend-service .
docker run -p 3000:80 frontend-service
```

Application:

```text
http://localhost:3000
```

---

# 🔐 Authentication

JWT-based authentication.

Public APIs:

```text
POST /auth/signup

POST /auth/login
```

Protected APIs:

```text
GET /users/profile

POST /bookings

POST /payments
```

---

# Event Driven Communication

Kafka Topics:

```text
booking-created

payment-successful

payment-failed

notification-email
```

---

# Service Ports

| Service              | Port |
| -------------------- | ---- |
| API Gateway          | 8087 |
| Config Server        | 8888 |
| Eureka Server        | 8761 |
| User Service         | 8081 |
| Event Service        | 8082 |
| Booking Service      | 8083 |
| Payment Service      | 8084 |
| Notification Service | 8085 |
| Frontend             | 3000 |

---

# Future Improvements

* Redis caching
* Elasticsearch integration
* Recommendation engine
* Real-time seat locking
* WebSocket notifications
* Prometheus monitoring
* Grafana dashboards
* Kubernetes deployment
* CI/CD pipeline with GitHub Actions
* Distributed tracing

---

# Screenshots

Will add later


---

# License

MIT License

---

# Author

Ankit Kumar

### Connect With Me

* GitHub ![](https://img.shields.io/badge/-@1820ANKIT2029-181717?style=flat-square&logo=Github&logoColor=white&link=https://github.com/1820ANKIT2029)
* LinkedIn ![](https://img.shields.io/badge/-ankit--3057--cse-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/ankit-3057-cse/)
* LeetCode ![](https://img.shields.io/badge/-Ankit3057cse-orange?style=flat-square&logo=LeetCode&logoColor=white&link=https://leetcode.com/u/Ankit3057cse/)
* Codeforces ![](https://img.shields.io/badge/-AGENTVEER-red?style=flat-square&logo=Codeforces&logoColor=white&link=https://codeforces.com/profile/AGENTVEER)

---

⭐ If you found this project useful, consider giving it a star.
