# 🎟️ Microservice Ticket Booking System
VERSION 2.0

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

## Inventory Services

* Create venues, Venue sections, Seat 
* Seat map support
* Seat availability tracking
* Seat locking with Redis and Database

## Booking Services

* Ticket reservation
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
+----------------+          +-----------------------+       +----------------+
| API Gateway    |   --->   | Eureka Discovery      |       | config-server  |
+----------------+          +-----------------------+       +----------------+
        |
        ▼
----------------------------------------------------
|         |         |        |           |         |         
▼         ▼         ▼        ▼           ▼         ▼         

User     Event    Booking  Inventory   Payment  Notification   
Service  Service  Service   Service    Service   Service     
```

---

# Microservices

| Service              | Description                        |
| -------------------- | ---------------------------------- |
| API Gateway          | Entry point for all requests       |
| Discovery Service    | Eureka server                      |
| Config Server        | Centralized configuration          |
| User Service         | Authentication and user management |
| Event Service        | Event management                   |
| Inventory Service    | venue management                   |
| Booking Service      | Ticket reservations                |
| Payment Service      | Payment processing                 |
| Notification Service | Email notifications                |

---

# Tech Stack

## Backend

* Java 21
* Spring Boot 4
* Spring Cloud
* Spring Security
* Spring Data JPA
* Hibernate
* Kafka
* Redis
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
├── inventory-service
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

* Java 21+
* Maven/Gradle
* Node.js
* Docker
* Docker Compose
* Git

---

# Running the Project

## 1. Clone Repository

```bash
git clone https://github.com/1820ANKIT2029/DistributedTicketBookingSystem.git
```

---

## 2. Start Infrastructure

```bash
cd DistributedTicketBookingSystem
cd docker-compose/default

docker compose up -d
```

OR 

Open Docker and then Command line
```bash
cd DistributedTicketBookingSystem

./gradlew clean compileJava --parallel
./gradlew jibDockerBuild --parallel

cd DistributedTicketBookingSystem
cd docker-compose/default

docker compose up -d
```

Application:

```text
http://localhost:3000
```

Stop:
```bash
docker compose down -v
```

---

# 🔐 Authentication

JWT-based authentication.

Public APIs:

```text
POST /auth/api/signup

POST /auth/api/login
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
| API Gateway          | 8080 |
| Config Server        | 8888 |
| Eureka Server        | 8761 |
| User Service         | 8081 |
| Event Service        | 8082 |
| Inventory Service    | 8083 |
| Booking Service      | 8084 |
| Payment Service      | 8085 |
| Notification Service | 8086 |
| Frontend             | 3000 |

---

# Future Improvements

* Redis caching
* Elasticsearch integration
* Recommendation engine
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
