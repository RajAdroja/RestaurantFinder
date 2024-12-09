[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ecKK6Yb3)

# Project Overview

This document outlines the key discussions and decisions made regarding the project's architecture, technology stack, and features. The aim is to ensure clarity and alignment among team members as we proceed with development.

## Technology Stack

- **Backend**: Java Springboot
- **Frontend**: React
- **Database**: PostgreSQL
- **Cloud**: AWS
- **Containerization and Orchestration**: Docker and Kubernetes

## Folder structure

my-monorepo/
├── src/                     # Backend code
│   ├── main/
│   │   ├── java/            # Java source code for the backend
│   │   ├── resources/       # Backend resource files (e.g., application.properties)
│   │   └── ...              # Other backend files
│   └── test/                # Unit and integration tests for the backend
├── frontend/                # React frontend code
│   ├── public/              # Public files (e.g., index.html, static assets)
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page-specific components
│   │   ├── App.js           # Main React app component
│   │   └── index.js         # Entry point for the React app
│   ├── package.json         # Frontend dependencies and scripts
│   ├── yarn.lock / package-lock.json
│   └── ...                  # Other frontend files
├── pom.xml                  # Maven configuration for backend
├── Dockerfile               # Backend Dockerfile
├── README.md                # Project documentation
├── .gitignore               # Git ignore file
└── ...                      # Additional configuration files

## Key Considerations

- **Horizontal Skill Development**: Emphasis on broadening the skill set of each team member to ensure versatility and adaptability.
- **Knowledge Gathering**:
  - Understanding of microservices architecture.
  - Database design, including schema creation, tables, and fields.

## Architecture Components

- **Service Registry**: Essential for managing instances to handle varying loads efficiently.
- **API Gateway**: Acts as a single entry point for managing API requests.
- **Load Balancer**: Ensures the distribution of incoming traffic across multiple service instances to prevent crashes during high traffic.

## Resilience and Error Handling

- **Circuit Breaker Pattern**: Implemented to prevent system overload by stopping further requests when failures are detected, thus saving costs.
- **Error Handling**: Define a proper structure for responses to ensure consistent error management.

## Customer Requirements

- **Features**:
  - Search functionality
  - Review ratings system

## Microservices Architecture

- **Number of Microservices Required**: To be determined based on feature complexity and scalability needs.
- **Endpoints Required**: Detailed endpoint specifications will be developed based on functional requirements.


## Class Diagram

![Class Diagram](https://github.com/user-attachments/assets/370212c1-9983-4c1c-be77-d7b8a88de192)


## Database 

- Primary Database **PostgreSQL**
1.	Structured Data with Relationships
2.	Complex Queries
3.	Geospatial Data
4.	Role-Based Access Control
- Search/Indexing **Elasticsearch**
•	Elasticsearch can be used alongside PostgreSQL to provide advanced search functionality for restaurants by name, category, location, and ratings.

Relationship Between Tables:

•	**Users** (General, Business Owners, Admins) will interact with:
  o	Restaurants: Users submit reviews and ratings, Business Owners can manage listings.
  o	Reviews: Users can leave reviews for restaurants, and view others’ reviews.
  o	Categories: Restaurants are classified into categories.
  o	Restaurant Photos: Business Owners upload photos for their restaurant listings.
  o	Login Sessions: To manage user login and session tracking.
  
•	**Admins** will interact with:
  o	Restaurants: They can remove listings (closed businesses) or manage duplicates.
  o	Duplicates: Admins can check and flag duplicate entries.



Final Overview of Tables
1.	**Users**: Manage all user roles (General, Business Owner, Admin).
2.	**Restaurants**: Store restaurant data.
3.	**Reviews**: User-submitted reviews and ratings for restaurants.
4.	**Categories**: Predefined types of restaurants (e.g., cuisine types).
5.	**Restaurant Photos**: Photos associated with restaurants.
6.	**Restaurant Owners**: Relationship table linking business owners to restaurants.

Additional:
1.	**Login Sessions**: Store login sessions for users.
2.	**Duplicates**: Track duplicate restaurant listings flagged by admins.

The link for database schema:
  https://dbdiagram.io/d/66ecdb8ca0828f8aa67346f7



# Flow Chart

![image](https://github.com/user-attachments/assets/f1df3759-1beb-44fc-a997-09e596edb973)

## User Role

- **Actions:**
  - **Register and Login:** Users can create an account and log in.
  - **Search Restaurant:** Users can search for restaurants by various criteria:
    - By price
    - By category
    - By name
    - By zipcode
  - **View Restaurant Details and Ratings:** Users can view detailed information and ratings of restaurants.
  - **Submit Reviews:** Users can provide feedback on restaurants.

## Business Owner Role

- **Actions:**
  - **Register and Login:** Business owners can register and log in to manage their listings.
  - **Add New Listing:** They can create new restaurant listings by adding descriptions and photos.
  - **Update Listing:** They can modify existing listings, including:
    - Updating name, address, contact info, hours
    - Updating description and photos
  - **View Listing:** Allows viewing of their own listings.

## Admin Role

- **Actions:**
  - **Login:** Admins can log into the system to manage listings.
  - **Check Duplicate Entries:** They ensure there are no duplicate restaurant entries.
  - **Remove Entries:** Admins can delete restaurant listings if necessary.

## System Flow

- The process begins with a "Start" point where users choose their role.
- Each role has specific actions they can perform within the system.
- The process ends with a "Logout" leading to an "End" point.

This diagram effectively outlines the interactions each user role has with the system, ensuring a structured approach to managing restaurant information.

## Summary of all Endpoints
![image](https://github.com/user-attachments/assets/1f7f9657-7ed0-4abe-be3d-76a153f7d0a3)


The UI Wireframe for the project can be found in the following location
  - https://www.figma.com/design/B3WqdyVcu6sSrW5qrgVKzc/MunchMap?node-id=0-1&t=cllh28uv7B2KPd6B-1
---

This README serves as a foundational guide for our project development. Further details will be added as the project progresses and more decisions are finalized. These are subject to change based on project requirements.
