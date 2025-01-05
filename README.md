# Project Name: RestaurantFinder

### Author: Raj Dineshbhai Adroja

---

## Project Overview

This document outlines the key decisions and implementation details of the RestaurantFinder project, which was developed entirely by me, Raj Dineshbhai Adroja. The goal of this project is to provide a comprehensive platform for users, business owners, and administrators to interact with restaurant listings, reviews, and management features. The document serves as a guide for the project's architecture, technology stack, and functionality.

---

## Technology Stack

- **Backend**: Java Spring Boot
- **Frontend**: React
- **Database**: PostgreSQL
- **Search/Indexing**: Elasticsearch
- **Cloud**: AWS

---

## Key Considerations

### Horizontal Skill Development
- Emphasis on broadening my skill set to ensure versatility and adaptability during the project lifecycle.

### Knowledge Gathering
- Gained an in-depth understanding of:
  - Microservices architecture.
  - Database design, including schema creation, table relationships, and fields.

---

## Database Design

### Primary Database: PostgreSQL
- Structured data with relationships.
- Complex queries for seamless search and retrieval.
- Role-based access control (RBAC).
- Geospatial data support.

### Search/Indexing: Elasticsearch
- Used for advanced search functionality, such as searching restaurants by name, category, location, and ratings.

### Relationship Between Tables
- **Users**: Interact with restaurants and reviews.
- **Admins**: Manage restaurant entries and duplicates.
- **Categories**: Classify restaurants.
- **Restaurant Photos**: Associate photos with listings.
- **Login Sessions**: Track user sessions.
- **Duplicates**: Monitor and remove duplicate entries.

### Tables Overview
1. **Users**: Manage user roles (General, Business Owner, Admin).
2. **Restaurants**: Store restaurant details.
3. **Reviews**: User-submitted reviews and ratings.
4. **Categories**: Predefined types of restaurants.
5. **Restaurant Photos**: Photos linked to restaurants.
6. **Restaurant Owners**: Link business owners to their restaurants.
7. **Login Sessions**: Manage user sessions.
8. **Duplicates**: Track flagged duplicates.

[Database Schema Link](https://dbdiagram.io/d/66ecdb8ca0828f8aa67346f7)

---

## Application Flow

### User Role
- **Actions:**
  - Register and log in.
  - Search restaurants by price, category, name, or zipcode.
  - View detailed restaurant information and ratings.
  - Submit reviews for restaurants.

### Business Owner Role
- **Actions:**
  - Register and log in to manage listings.
  - Add, update, or view restaurant listings.

### Admin Role
- **Actions:**
  - Log in to manage the platform.
  - Review and remove duplicate entries.
  - Remove closed or inappropriate restaurant listings.

---

## Development Timeline

### Sprint 1: Foundation and Planning
- Finalized the technology stack and gathered requirements.
- Designed database schema, workflows, and UML class diagrams.
- Tasks:
  - Finalized Technology Stack.
  - Designed Database Schema.
  - Created UML Class Diagram.
  - Defined API Endpoints.

### Sprint 2: Backend Core Development
- Built core backend services, including RBAC and location-based search.
- Tasks:
  - Implemented RBAC.
  - Enabled geospatial search.
  - Optimized database queries.
  - Developed APIs for user registration and restaurant search.

### Sprint 3: Frontend Development and API Integration
- Developed a functional web UI and integrated backend APIs.
- Tasks:
  - Built a user-friendly React-based frontend.
  - Integrated APIs for restaurant search, reviews, and management.
  - Added functionality for submitting reviews and managing listings.

### Sprint 4: Deployment and Testing
- Deployed the application to AWS with auto-scaling and load balancing.
- Performed rigorous testing and bug fixes.
- Tasks:
  - Deployed backend services.
  - Resolved UI/UX bugs.
  - Documented the product and created a final project report.

### Sprint 5: Post-Deployment and Monitoring
- Monitored the application’s performance and implemented enhancements.
- Tasks:
  - Optimized performance metrics.
  - Implemented optional features like real-time notifications and analytics.

### Sprint 6: Final Refinements and Handover
- Conducted final bug fixes and prepared documentation for project handover.
- Tasks:
  - Finalized UI/UX refinements.
  - Completed all project documentation.

---

## Deployment Details

- **Backend**: Deployed on AWS EC2 with auto-scaling and load balancing.
- **Frontend**: Hosted on AWS S3.
- **Database**: PostgreSQL managed on AWS RDS.
- **Search/Indexing**: Elasticsearch cluster deployed on AWS.

---

## Extreme Programming (XP) Core Values

### Communication
- Regularly documented progress and challenges through project journals.
- Maintained clarity by outlining workflows and tasks explicitly.

### Feedback
- Iterative development with self-review to improve functionality and usability.
- Adapted based on testing and performance results.

### Respect
- Followed a disciplined approach to ensure quality and maintain high coding standards throughout the project lifecycle.

---

## Links and Resources

1. [Minutes of Meeting](https://docs.google.com/document/d/1OCMgi85Gl6sJlU5XLjM7FTbDz14B1f5gNZQiktlIyfk/edit?usp=sharing)
2. [Project Requirement Discussion](https://docs.google.com/document/d/10xFBil3N1A1b4_aF3F1NoUknf6BS5BDpCK06FSU8tTI/edit?usp=sharing)
3. [Database Schema](https://dbdiagram.io/d/66ecdb8ca0828f8aa67346f7)

---

## Conclusion

This project showcases my ability to independently conceptualize, develop, and deploy a comprehensive application using a modern tech stack. It demonstrates a strong grasp of backend development, database design, and frontend integration, along with cloud deployment expertise.

