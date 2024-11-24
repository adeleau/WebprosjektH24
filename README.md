# 🌸✨ Sonny Angels Wiki ✨🌸  

Welcome to the **Sonny Angels Wiki**, a community for Sonny Angel enthusiasts! This platform lets you browse and manage your Sonny Angel collection, join discussions, and interact with the community. Administrators can even create and edit wiki pages. 🎀

---

## 💖 Table of Contents 💖  

1. 🌟 Features
2. 💻 Installation
   - Prerequisites 🌸
   - Steps 🌷
3. ✨ Usage 
4. 🧸 Testing
5. 🛠️ Development
6. 📚 Sources 

---

## Features 🌟

- **Browse Wiki**: Search and explore an organized wiki of all Sonny Angels. 🐤
- **User Profiles**: Create your own profile to manage your personal collection and wishlist. 🎁
- **Editing and Versioning**: Admins can create and edit wiki pages, with a history of all changes. ✏️
- **Comments and Likes**: Share your thoughts by commenting on pages. 💬
- **Community Discussions**: Join the discussion space to connect with fellow enthusiasts. 🌸
- **Tags**: Our answer of using tags are Series. All Angels are underlying of a Series, you can order and search by them!

---

##  Installation 💻

Follow these steps to set up the project locally:


### Steps 🌷 

1. Clone the repository:
   ```bash
   git clone https://github.com/adeleau/WebprosjektH24.git 
   cd WebprosjektH24

### Install dependencies:

1. ```bash
   cd client
   npm install

2. ```bash
   cd server
   npm install


### Create a config.ts  file in the root directory and set the following variables:

process.env.MYSQL_HOST = 'hostname';

process.env.MYSQL_USER = 'username';

process.env.MYSQL_PASSWORD = 'password';

process.env.MYSQL_DATABASE = 'database-name';


### Add following tables into your database: 

Look at the database-setup.txt file to create all tables. There are a few test varibles added here - including one admin user.


### Start the development server:

1. ```bash
   cd client
   npm start
   
2. ```bash
   cd server
   npm start

## Usage ✨
Open your browser and navigate to http://localhost:3000.
Register or log in to explore features like the wiki, collections, and community discussions.

## Testing 🧸 
Run the following command to execute tests:

1. ```bash
   npm test 

### Sources 📚
Sonny Angel Official Site

In this project, we have used the following AI tools to support our work:

ChatGPT by OpenAI and GitHub Copilot by GitHub for 
- Syntax correction.
- To refine and correct code snippets, ensuring proper syntax.
- Error trouble shooting.
- Suggestions for improvement to enhance the readability, structure, and technical accuracy of both code and textual explanations.
- Optimizing code: To suggest more efficient solutions for existing code


### Front-End

We have implemented cookied due to its simple nature of storing data in a web browser. It saves the user data upon login in a cookie, and deletes the cookie when user logs out. 

- Set up
We have followed the setup/structure of our project files as done in the mandatory assignments. We implemented a service setup that uses a service for each table in our database. 

### Back-end

- For back-end we have used the JavaScript Date toISOString()-method, wich is used to convert the given data object's contents into a string in ISO format. We chose to use this because it is more compatible with React. Sources we used are (ref src 3)


### Sources 📚

Sonny Angel Official Site for images and info about the products.

In this project, we have used the following AI tools to support our work:

ChatGPT by OpenAI and GitHub Copilot by GitHub for 
- Syntax correction.
- To refine and correct code snippets, ensuring proper syntax.
- Error trouble shooting.
- Suggestions for improvement to enhance the readability, structure, and technical accuracy of both code and textual explanations.
- Optimizing code: To suggest more efficient solutions for existing code

1.   Okanume,S.C(14.08.23), How to Implement User Registration and Email Verification in React: https://dev.to/sammychris/how-to-implement-user-registration-and-email-verification-in-react-1map

2.  Oraro,P(23.09.23), Building A Simple React Login Form: A Step By Step Guide, DEV, https://dev.to/paulineoraro/building-a-simple-react-login-form-a-step-by-step-guide-17g1

3.   ukjent,(09.10.24),JavaScript Date toISOString() Method, GeekForGeeks; https://www.geeksforgeeks.org/javascript-date-toisostring-method/ 

4.  ukjent (11.19.2024), Create a system-versioned temporal table, Microsoft Ignite: https://learn.microsoft.com/en-us/sql/relational-databases/tables/creating-a-system-versioned-temporal-table?view=sql-server-ver16

5. Joshi,G.(03.2023), Building a System for User Registration and Login using TypeScript (Part 2 ), Building by learning: https://gauravjoshi.hashnode.dev/building-a-system-for-user-registration-and-login-using-typescript-part-2

6. Djirdeh, H (24.10.23), React Basics: How to Use Cookies in React, KendoReact: https://www.telerik.com/blogs/react-basics-how-to-use-cookies 

7.   Chikari, M (14.04.23), Setting and Using Cookies in React, Clerk: https://clerk.com/blog/setting-and-using-cookies-in-react

8. Pantoja, E (29.05.23), React Registration Form, Medium, https://medium.com/@ericapantojacs/react-registration-form-d298b3b7e75d


9. Lama Dev.(2023, 22.02), React Node.js Fiverr App Full Tutorial | MERN Stack Freelance Service App w/ Stripe[video], https://youtu.be/csUM7yfiaMw?si=RyIhWvcitbGfMrJr

10. Telmo Sampio.(2021, 15.03), React Typescript Tutorial - Todo list project - Part 1[video], https://youtu.be/XQDp4Btvkh8?si=85BC7KO9JPVgtYCB

11. Telmo Sampio.(2019.17.01), React.js Project - Search Menu Part 1[video], https://youtu.be/py6sUc3yq-w?si=2dZXpq-FOqDEi08P

12. Lama Dev.(2022.26.09), React Node.js MySQL Full Stack Blog App Tutorial[video], https://youtu.be/0aPLk2e2Z3g?si=0Xf0QZNiNvimVPlC

13. Code Bootcamp.(2024.18.03), Every React Concept Explained in 12 Minutes[video],
https://youtu.be/wIyHSOugGGw?si=EviloZtlwGMUmZGH

14. Code Bootcamp.(2024.04.04),ALL React Hooks Explained in 12 Minutes[video],
https://youtu.be/LOH1l-MP_9k?si=SS6Pt5iV2fBvtY-a

15. Lama Dev.(2023.22.02), React Node.js Fiverr App Full Tutorial | MERN Stack Freelance Service App w/ Stripe[video],https://youtu.be/csUM7yfiaMw?si=fw-lA43fNXGYEnV0
