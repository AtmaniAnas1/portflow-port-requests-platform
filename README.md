<div align="center">

# PortFlow

### Plateforme web de gestion et de traitement des demandes portuaires

*Projet de stage de 4ᵉ année — EMSI × PORTNET S.A. (Casablanca)*

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## Table des matières

- [Contexte](#contexte)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Installation et lancement](#installation-et-lancement)
- [API REST](#api-rest)
- [Modèle de données](#modèle-de-données)
- [Sécurité](#sécurité)
- [Pistes d'amélioration](#pistes-damélioration)
- [Auteur](#auteur)

---

## Contexte

**PORTNET S.A.** opère le *Guichet Unique National des Procédures du Commerce Extérieur* au Maroc, qui dématérialise les échanges entre les acteurs de la communauté portuaire (opérateurs, transitaires, douane, autorités portuaires…).

Dans le cadre de mon **stage de 4ᵉ année à l'EMSI (École Marocaine des Sciences de l'Ingénieur)** au sein de PORTNET à Casablanca, j'ai conçu et développé **PortFlow**, une application web full-stack qui digitalise le cycle de vie d'une demande portuaire :

> **Soumission** par l'opérateur ➜ **Traitement** (acceptation / refus) par la douane ➜ **Notification** automatique de l'opérateur ➜ **Supervision** globale par l'administrateur.

---

## Fonctionnalités

### Espace Opérateur (`USER`)
- Inscription et connexion sécurisée
- Création de demandes portuaires (description, port de départ, port d'arrivée)
- Suivi de l'état de ses demandes : `EN_ATTENTE`, `ACCEPTEE`, `REFUSEE`
- Réception de notifications lors du traitement d'une demande

### Espace Douane (`DOUANE`)
- Consultation de l'ensemble des demandes soumises
- Acceptation ou refus d'une demande avec commentaire
- Horodatage du traitement et notification automatique du demandeur

### Espace Administrateur (`ADMIN`)
- Gestion des comptes : liste, activation, suspension, suppression
- Création de comptes agents de douane
- Vue globale sur toutes les demandes de la plateforme

---

## Architecture

```
┌──────────────────────┐        HTTP / JSON         ┌──────────────────────────────────┐
│   Frontend React     │  ───────────────────────►  │        Backend Spring Boot       │
│   (Vite · :5173)     │   Authorization: Bearer    │            (:8080)               │
│                      │  ◄───────────────────────  │                                  │
│  • Login / Register  │                            │  JwtAuthFilter ─► SecurityConfig │
│  • Dashboard User    │                            │        │                         │
│  • Dashboard Douane  │                            │  Controllers (Auth/User/Douane/  │
│  • Dashboard Admin   │                            │               Admin)             │
└──────────────────────┘                            │        │                         │
                                                    │  Services ─► Repositories (JPA)  │
                                                    │        │                         │
                                                    │     SQLite (portnet.db)          │
                                                    └──────────────────────────────────┘
```

Architecture en couches classique : **Controller → Service → Repository → Entity**, avec une authentification *stateless* basée sur JWT et un contrôle d'accès par rôle.

---

## Stack technique

| Couche | Technologies |
|---|---|
| **Backend** | Java 17, Spring Boot 3.5, Spring Web, Spring Data JPA, Hibernate |
| **Sécurité** | Spring Security, JWT (jjwt), BCrypt |
| **Base de données** | SQLite (dialecte Hibernate Community) |
| **Frontend** | React 19, React Router 7, Vite 7 |
| **Outils** | Maven, Lombok, ESLint, Git |

---

## Structure du projet

```
portflow/
├── src/main/java/com/portnet/
│   ├── config/          # Sécurité : SecurityConfig, JwtAuthFilter, beans
│   ├── controller/      # API REST : Auth, User, Douane, Admin
│   ├── model/           # Entités JPA : User, Demande, Notification + enums
│   ├── repository/      # Interfaces Spring Data JPA
│   ├── service/         # Logique métier : UserService, JwtService, UserDetails
│   └── PortnetBackendApplication.java
├── src/main/resources/
│   └── application.properties
├── frontend/
│   └── src/
│       ├── pages/       # Home, Login, Register, User/Douane/Admin Dashboards
│       ├── App.jsx      # Routage + routes protégées par rôle
│       └── main.jsx
├── pom.xml
└── README.md
```

---

## Installation et lancement

### Prérequis
- **Java 17+**
- **Node.js 18+** et npm
- Maven (ou le wrapper `mvnw` fourni)

### 1. Cloner le dépôt
```bash
git clone https://github.com/AnnasAttt/portflow-port-requests-platform.git
cd portflow-port-requests-platform
```

### 2. Lancer le backend
```bash
# Linux / macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```
L'API démarre sur **http://localhost:8080**. La base SQLite `portnet.db` est créée automatiquement à la racine du projet.

### 3. Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```
L'interface est accessible sur **http://localhost:5173**.

---

## API REST

### Authentification — public
| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription (`nom`, `email`, `password`, `role`) → `user` + `token` |
| `POST` | `/api/auth/login` | Connexion (`email`, `password`) → `user` + `token` |

### Opérateur — rôle `USER`
| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/me` | Profil de l'utilisateur connecté |
| `POST` | `/api/user/demande` | Soumettre une nouvelle demande |
| `GET` | `/api/user/demandes` | Lister ses demandes |
| `GET` | `/api/user/notifications` | Lister ses notifications |

### Douane — rôle `DOUANE`
| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/douane/demandes` | Lister toutes les demandes |
| `POST` | `/api/douane/demande/{id}/traiter` | Traiter une demande (`acceptee`, `commentaire`) |

### Administration — rôle `ADMIN`
| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | Lister les utilisateurs |
| `POST` | `/api/admin/user/{id}/activate` | Activer un compte |
| `POST` | `/api/admin/user/{id}/suspend` | Suspendre un compte |
| `DELETE` | `/api/admin/user/{id}` | Supprimer un compte |
| `POST` | `/api/admin/user/douane` | Créer un agent de douane |
| `GET` | `/api/admin/demandes` | Lister toutes les demandes |

<details>
<summary><b>Exemple d'utilisation avec cURL</b></summary>

```bash
# Connexion
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"operateur@exemple.ma","password":"motdepasse"}'

# Soumission d'une demande
curl -X POST http://localhost:8080/api/user/demande \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"description":"Import conteneur 40 pieds","portDepart":"Valence","portArrivee":"Casablanca"}'
```
</details>

---

## Modèle de données

```
┌──────────────┐ 1      * ┌──────────────────────┐
│     User     │──────────│       Demande        │
├──────────────┤          ├──────────────────────┤
│ id           │          │ id                   │
│ nom          │          │ description          │
│ email        │          │ portDepart           │
│ password     │          │ portArrivee          │
│ role         │          │ etat (EtatDemande)   │
│ actif        │          │ commentaireDouane    │
└──────┬───────┘          │ dateSoumission       │
       │ 1                │ dateTraitement       │
       │                  └──────────────────────┘
       │ *
┌──────┴───────────┐      Role        : USER | DOUANE | ADMIN
│   Notification   │      EtatDemande : EN_ATTENTE | ACCEPTEE | REFUSEE
├──────────────────┤
│ id               │
│ message          │
│ lue              │
│ dateEnvoi        │
└──────────────────┘
```

---

## Sécurité

- **Authentification stateless** par JSON Web Token (validité 24 h)
- **Hachage des mots de passe** avec BCrypt
- **Contrôle d'accès par rôle** sur chaque groupe d'endpoints (`USER`, `DOUANE`, `ADMIN`)
- **Filtre JWT** personnalisé intercepté avant `UsernamePasswordAuthenticationFilter`
- **CORS** restreint à l'origine du frontend (`http://localhost:5173`)
- **Routes protégées** côté React selon le rôle stocké après connexion

---

## Pistes d'amélioration

- [ ] Externaliser la clé secrète JWT (variables d'environnement)
- [ ] Migration vers PostgreSQL / MySQL pour la production
- [ ] Documentation interactive de l'API avec Swagger / OpenAPI
- [ ] Tests unitaires et d'intégration (JUnit, MockMvc)
- [ ] Conteneurisation avec Docker et pipeline CI/CD
- [ ] Notifications en temps réel (WebSocket) et par e-mail

---

## Auteur

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/AnnasAttt">
        <img src="https://github.com/AnnasAttt.png" width="100px;" alt="Atmani Anas"/><br />
        <sub><b>Atmani Anas</b></sub>
      </a><br />
      <sub>Élève ingénieur — EMSI</sub>
    </td>
  </tr>
</table>

Projet réalisé dans le cadre du **stage de 4ᵉ année** à l'**EMSI** au sein de **PORTNET S.A.**, Casablanca.

---

<div align="center">
<sub>PortFlow — Digitaliser le traitement des demandes portuaires</sub>
</div>
