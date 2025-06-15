# Producer + consumer *Apache Kafka* template

### Project description

Basketball game event-driven aggregator. Project includes REST API and Telegram bot. Create teams, players and games, send events for score, foul and substitution via API. Subscribe to team/player events via bot and receive notifications about related games

--- 

### Tech stack
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

---

### Architecture 

**Compose project includes:**
+ Apache Kafka
+ Zookeper
+ Kafka UI
+ MySQL
+ MySQL admin panel
+ REST API
+ Telegram bot

**App scheme**

TODO

---

### Launch guide

To launch application container simply enter compose build command. Make sure that you don't running applications that use same ports as container services

```
docker compose up --build
```

Access links:

+ [MySQL admin panel](http://localhost:8081)

+ [Swagger spec](http://localhost:3000/swagger/index.html#/)

+ [Kafka UI](http://localhost:8080)

---

#### TODO

+ change time data type to "datetime" in events

+ add prometheus and grafana
